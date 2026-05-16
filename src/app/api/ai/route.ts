import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ─── Simple Rate Limiter (in-memory, per-server instance) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per 1 minute

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

// ─── Data Validation ───
function validateProductData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validBrands = ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Other'];
  const validConditions = ['Like New', 'Very Good', 'Good'];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Nama produk wajib diisi (minimal 2 karakter)');
  }
  if (typeof data.price !== 'number' || data.price <= 0) {
    errors.push('Harga harus lebih dari 0');
  }
  if (data.brand && !validBrands.includes(data.brand)) {
    errors.push(`Brand "${data.brand}" tidak valid. Pilihan: ${validBrands.join(', ')}`);
  }
  if (data.condition && !validConditions.includes(data.condition)) {
    errors.push(`Kondisi "${data.condition}" tidak valid. Pilihan: ${validConditions.join(', ')}`);
  }
  if (data.batteryHealth !== undefined) {
    if (typeof data.batteryHealth !== 'number' || data.batteryHealth < 0 || data.batteryHealth > 100) {
      errors.push('Battery health harus antara 0-100');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

function validateBlogData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validCategories = ['Tips & Tricks', 'Edukasi Teknis', 'Panduan', 'Berita'];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Judul artikel wajib diisi (minimal 3 karakter)');
  }
  if (!data.excerpt || typeof data.excerpt !== 'string') {
    errors.push('Ringkasan (excerpt) wajib diisi');
  }
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Kategori "${data.category}" tidak valid`);
  }
  
  return { valid: errors.length === 0, errors };
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ 
        error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit.",
      }, { status: 429 });
    }

    const { prompt, type } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json({ 
        error: "Prompt terlalu pendek. Minimal 5 karakter.",
      }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error("AI API Key is missing from environment variables.");
      return NextResponse.json({ 
        error: "API Key not configured",
        details: "GOOGLE_AI_API_KEY is not defined in the environment." 
      }, { status: 500 });
    }

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean markdown code blocks if present
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
    
    const parsedData = JSON.parse(text);

    // Validate the parsed data
    const validation = type === 'product' 
      ? validateProductData(parsedData) 
      : validateBlogData(parsedData);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        ...parsedData,
        _warnings: validation.errors 
      });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
