// services/aiService.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing from .env");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async zeroShotPrompt(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error("Error in zeroShotPrompt:", err);
      throw err;
    }
  }

  // System and user prompts (RTFC framework)
  async systemUserPrompt(userQuery, systemRole = "helpful assistant") {
    const prompt = `You are a ${systemRole}. ${userQuery}`;
    return this.zeroShotPrompt(prompt);
  }
}

module.exports = new AIService();
