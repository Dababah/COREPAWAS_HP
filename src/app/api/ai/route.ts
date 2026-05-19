import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ─── Simple Rate Limiter (in-memory, per-server instance) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20; // Expanded to 20 for interactive chat
const RATE_LIMIT_WINDOW = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ 
        error: "Terlalu banyak permintaan chat. Coba lagi dalam 1 menit.",
      }, { status: 429 });
    }

    const { prompt, history, catalog } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
      return NextResponse.json({ 
        error: "Message terlalu pendek.",
      }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: "API Key not configured",
        details: "GOOGLE_AI_API_KEY is not defined in the environment." 
      }, { status: 500 });
    }

    const systemInstruction = `
      You are COREPAWAS Neural Agent, an elite, multi-tasking conversational AI assistant for a premium second-hand gadget store called COREPAWAS.
      You are highly helpful, engaging, and professional. You must communicate in Bahasa Indonesia.

      Your goal is to parse user intents and respond matching this TypeScript schema:
      interface AgentResponse {
        reply: string; // The conversational chat message or analysis report. Write in rich, professional Indonesian. Supports standard markdown formatting.
        actions?: AgentAction[]; // List of actions to execute simultaneously (multitasking).
      }

      interface AgentAction {
        type: 'create_product' | 'update_product' | 'delete_product' | 'create_blog' | 'update_blog' | 'delete_blog' | 'update_template' | 'generate_cod_checklist';
        description: string; // Short text explaining what this specific action does, e.g. "Menghapus iPhone 11 Pro 128GB"
        payload: any; // The data required for this action
      }

      How to classify 'actions' and what 'payload' they need:
      
      [PRODUCT ACTIONS]
      1. 'create_product': If user wants to add a new phone. Payload:
         { "name": string, "brand": string, "price": number, "condition": string, "batteryHealth": number, "storage": string, "ram": string, "status": "Ready", "description": string }
      2. 'update_product': If user wants to update price/status of an existing phone. Payload:
         { "id": string (must match an existing product id), "price"?: number, "status"?: string, "condition"?: string }
      3. 'delete_product': If user wants to delete/remove a phone. Payload:
         { "id": string (must match an existing product id) }

      [BLOG ACTIONS]
      4. 'create_blog': If user wants to write a new blog post. Payload:
         { "title": string, "excerpt": string, "content": string, "category": string, "readTime": string }
      5. 'update_blog': If user wants to edit a blog post. Payload:
         { "id": string, "title"?: string, "content"?: string }
      6. 'delete_blog': If user wants to delete a blog post. Payload:
         { "id": string }

      [OTHER ACTIONS]
      7. 'update_template': If user wants to modify chat templates. Payload:
         { "id": string, "stage": string, "title": string, "message": string, "warningTitle": string, "warningText": string, "iconColor": string }
      8. 'generate_cod_checklist': If user wants to generate SOP COD. Payload:
         [ { "id": string, "order_index": number, "title": string, "description": string, "is_critical": boolean } ]

      If the user is just chatting or asking for analysis, populate 'reply' and omit 'actions'.
      If the user asks to do multiple things (e.g. "Hapus iPhone 11 dan buat artikel soal layar burn-in"), return a 'reply' confirming it and provide TWO items in 'actions' array!
      
      You MUST respond with a pure JSON object matching AgentResponse. Never output markdown block wrappers (like \`\`\`json).
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // Provide context, history, and live catalog data for analysis
    const contextPrompt = `
      Current Live Store Catalog:
      Products: ${JSON.stringify(catalog?.products || [])}
      Blog Posts: ${JSON.stringify(catalog?.blogPosts || [])}

      Chat History (Context):
      ${JSON.stringify(history || [])}

      User's Current Message:
      "${prompt}"
    `;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
