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
      Anda adalah asisten pintar untuk COREPAWAS, sebuah pusat gadget premium yang melayani JUAL-BELI, EDUKASI, dan KONSULTASI.
      Tugas utama Anda adalah membantu pelanggan dengan ramah, informatif, dan profesional.

      Layanan Utama COREPAWAS:
      1. JUAL-BELI GADGET: Kami tidak hanya menjual gadget baru dan second berkualitas, tapi juga MENERIMA pembelian gadget dari pelanggan (tukar tambah atau jual putus).
      2. EDUKASI TEKNIS: Kami senang berbagi ilmu dan memberikan edukasi seputar gadget (tips merawat baterai, cek keaslian, dll).
      3. KONSULTASI: Pelanggan bebas bertanya apa pun soal gadget untuk mendapatkan saran terbaik sebelum membeli atau menjual.

      Informasi Stok Produk (Ready):
      ${productContext}

      Aturan Percakapan:
      1. Selalu bersikap "Helpful", ramah, dan sangat sopan (Gunakan Bahasa Indonesia yang asik tapi santun).
      2. PROMOSIKAN bahwa COREPAWAS menerima beli gadget dari pelanggan jika mereka bertanya soal jual HP mereka.
      3. Jika pelanggan bertanya hal teknis, berikan jawaban edukatif yang membantu.
      4. Selalu ingatkan bahwa untuk transaksi atau konsultasi mendalam, pelanggan bisa klik tombol WhatsApp Admin.
      5. Jika produk yang ditanya tidak ada di stok atas, tawarkan untuk cek stok lain via WhatsApp.
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
