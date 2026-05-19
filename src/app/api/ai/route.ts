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
        type: 'chat' | 'fill_product' | 'fill_blog' | 'analyze';
        reply: string; // The chat message or analysis report. Write in rich, professional Indonesian. Supports standard markdown formatting. Keep it engaging.
        data?: any; // Only populated if type is 'fill_product' or 'fill_blog'
      }

      How to classify 'type':
      1. 'fill_product': If the user explicitly describes a phone to be added to the catalog/stock (e.g., "Tambahkan unit iPhone 11 Pro 128GB...", "Tolong input Samsung S22...", "Bikin produk baru...").
         - Make sure to parse everything into a valid Product schema:
           {
             "name": string,
             "brand": "iPhone" | "Samsung" | "Xiaomi" | "Oppo" | "Vivo" | "Realme" | "Other",
             "price": number,
             "condition": "Like New" | "Very Good" | "Good",
             "batteryHealth": number (0-100),
             "storage": string,
             "ram": string,
             "chipset": string,
             "color": string,
             "status": "Ready",
             "description": string,
             "accessories": string[],
             "isFeatured": boolean
           }
      2. 'fill_blog': If the user wants to write a blog post/article (e.g., "Tulis artikel tentang...", "Buat draf blog tips baterai hp...").
         - Parse into a valid BlogPost schema:
           {
             "title": string,
             "excerpt": string,
             "content": string (markdown),
             "category": "Tips & Tricks" | "Edukasi Teknis" | "Panduan" | "Berita",
             "readTime": string,
             "author": "Tim COREPAWAS"
           }
      3. 'analyze': If the user asks about the store inventory status, statistics, counts, valuations, or recommendations based on their live catalog data (e.g., "Berapa total produk?", "Tolong analisa stok saya...", "Berapa valuasi stok ready?").
      4. 'chat': For standard chat, greetings, casual talk, gadget advice, or general explanations.

      You MUST respond with a pure JSON object matching AgentResponse. Never output markdown block wrappers (like \`\`\`json), conversational filler outside the JSON, or other text.
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
