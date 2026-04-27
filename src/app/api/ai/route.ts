import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemInstruction = "";
    if (type === 'product') {
      systemInstruction = `
        You are an assistant for a gadget store called COREPAWAS. 
        Parse the following natural language into a JSON object matching this schema:
        {
          "name": string,
          "brand": "iPhone" | "Samsung" | "Xiaomi" | "Oppo" | "Vivo" | "Realme" | "Other",
          "price": number,
          "condition": "Like New" | "Very Good" | "Good",
          "batteryHealth": number (0-100),
          "storage": string (e.g. "128GB"),
          "ram": string (e.g. "8GB"),
          "chipset": string,
          "color": string,
          "status": "Ready" | "Sold",
          "description": string,
          "accessories": string[],
          "isFeatured": boolean
        }
        Return ONLY the JSON object.
      `;
    } else {
      systemInstruction = `
        You are an assistant for a gadget store called COREPAWAS. 
        Parse the following natural language into a JSON object matching this schema for a blog post:
        {
          "title": string,
          "excerpt": string,
          "content": string (markdown format),
          "category": "Tips & Tricks" | "Edukasi Teknis" | "Panduan" | "Berita",
          "readTime": string (e.g. "5 menit"),
          "author": "Tim COREPAWAS"
        }
        Return ONLY the JSON object.
      `;
    }

    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response if it has markdown blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
