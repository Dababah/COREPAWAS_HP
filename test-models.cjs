const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function listModels() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const apiKeyMatch = envContent.match(/GOOGLE_AI_API_KEY=(AIza[^\s\n\r]+)/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

    if (!apiKey) {
      console.error("API Key tidak ditemukan di .env.local");
      return;
    }

    console.log("Mengecek ketersediaan model untuk API Key Anda...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("hi");
        console.log(`✅ Model [${m}] TERSEDIA.`);
      } catch (e) {
        console.log(`❌ Model [${m}] TIDAK tersedia.`);
      }
    }
  } catch (err) {
    console.error("Gagal membaca file .env.local:", err.message);
  }
}

listModels();
