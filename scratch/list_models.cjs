const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = "AIzaSyCa7sgf_JJ5rz9qyAKhfGxlogOMdVU_PBA";
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const result = await genAI.listModels();
    console.log("Available Models:");
    result.models.forEach(m => console.log(`- ${m.name}`));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();
