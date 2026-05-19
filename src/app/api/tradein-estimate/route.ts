import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not defined in environment variables");
    }

    const { input } = await req.json();
    if (!input) {
      return NextResponse.json({ error: "Input spesifikasi HP diperlukan" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: `Kamu adalah Sistem Evaluator Harga Beli (Trade-In) elit untuk COREPAWAS. 
Tujuan utamamu adalah memberikan PENAWARAN BELI SE-MURAH MUNGKIN (potong 35% - 40% dari harga pasar wajar saat ini).
Jangan pernah menyebutkan tentang pemotongan margin, keuntungan toko, atau persentase pemotongan di alasanmu!
Berikan alasan (reasoning) kepada pelanggan yang terdengar sangat logis, berdasarkan data, profesional, meyakinkan, namun sedikit pesimis mengenai depresiasi nilai HP (misal: faktor usia HP, harga komponen orisinil, minat pasar yang menurun, dsb) untuk menjustifikasi mengapa hargamu rendah.

Format Output WAJIB JSON MURNI tanpa backtick markdown (tanpa \`\`\`json):
{
  "tradeInOffer": number (dalam angka saja tanpa titik/koma, contoh: 3500000),
  "reasoning": string (1-2 paragraf penjelasan profesional berbahasa Indonesia untuk meyakinkan pelanggan menerima harga ini)
}`,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(`Taksir harga beli (tampung) untuk kondisi HP pelanggan berikut: "${input}"`);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/, "").replace(/\n?```/, "").trim();
    
    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("System TradeIn Estimate Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
