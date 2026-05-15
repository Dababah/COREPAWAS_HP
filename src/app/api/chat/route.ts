import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // Fetch products for context
    const { data: products } = await supabase
      .from('products')
      .select('name, price, brand, condition, status, battery_health, storage')
      .eq('status', 'Ready');

    const productContext = products && products.length > 0 
      ? products.map(p => `- ${p.brand} ${p.name} (${p.storage}): Rp ${p.price.toLocaleString('id-ID')}, Kondisi: ${p.condition}, BH: ${p.battery_health}%`).join('\n')
      : "Saat ini stok sedang kosong.";

    const systemInstruction = `
      Anda adalah asisten belanja pintar untuk COREPAWAS, sebuah toko gadget premium.
      Tugas Anda adalah membantu pelanggan menemukan gadget yang tepat, memberikan informasi stok, dan menjawab pertanyaan seputar produk.

      Informasi Stok Produk (Ready):
      ${productContext}

      Aturan:
      1. Bersikaplah sangat sopan, ramah, dan profesional.
      2. Jika pelanggan bertanya tentang stok, gunakan informasi di atas.
      3. Jika produk tidak ada di daftar, katakan dengan sopan bahwa stok tersebut sedang kosong atau sarankan model lain yang mirip.
      4. Selalu sarankan pelanggan untuk menghubungi WhatsApp Admin (melalui tombol WA di pojok layar) untuk transaksi atau pertanyaan lebih lanjut.
      5. Jawab dalam Bahasa Indonesia yang santai tapi sopan.
      6. Jangan memberikan informasi harga atau stok di luar daftar yang diberikan.
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite", 
      systemInstruction: systemInstruction,
    });

    // Format history for Gemini
    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    // Gemini memerlukan pesan pertama dari 'user'
    const firstUserIndex = formattedHistory.findIndex((h: any) => h.role === 'user');
    const validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    console.log(`[Chat API] Memulai chat menggunakan model terbaru: Gemini 3.1 Flash-Lite.`);

    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(message);
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    // Log detail error ke terminal untuk debugging
    console.error("=== CHAT API ERROR ===");
    console.error("Message:", error.message);
    if (error.status) console.error("Status:", error.status);
    console.error("=======================");
    
    return NextResponse.json({ 
      error: error.message,
      details: "Cek terminal server untuk detail lengkap."
    }, { status: 500 });
  }
}
