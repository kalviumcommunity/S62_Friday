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

  // One-shot prompting
  async oneShotPrompt(userQuery, example) {
    const prompt = `Example: ${example.query}\nResponse: ${example.response}\n\nUser: ${userQuery}\nAssistant:`;
    return this.zeroShotPrompt(prompt);
  }

  // Multi-shot prompting
  async multiShotPrompt(userQuery, examples) {
    let prompt = "Here are some examples:\n\n";
    examples.forEach((ex, index) => {
      prompt += `Example ${index + 1}:\nQuery: ${ex.query}\nResponse: ${
        ex.response
      }\n\n`;
    });
    prompt += `Now respond to this query: ${userQuery}`;

    return this.zeroShotPrompt(prompt);
  }

  // Chain of thought prompting
  async chainOfThoughtPrompt(problem) {
    const prompt = `Let's think step by step to solve this problem: ${problem}\nFirst, I need to understand what's being asked...`;
    return this.zeroShotPrompt(prompt);
  }

  // Dynamic prompting
  async dynamicPrompt(userQuery, context) {
    const prompt = `Context: ${context}\nBased on the above context, please respond to: ${userQuery}`;
    return this.zeroShotPrompt(prompt);
  }

  // Temperature control (simulated for Gemini)
  async temperatureControlledPrompt(prompt, temperature = 0.7) {
    const creativityLevel =
      temperature > 0.7
        ? "Be creative and imaginative."
        : temperature > 0.4
        ? "Be balanced in your response."
        : "Be precise and factual.";

    const modifiedPrompt = `${creativityLevel} ${prompt}`;
    return this.zeroShotPrompt(modifiedPrompt);
  }

  // Top-P sampling (simulated for Gemini)
  async topPPrompt(prompt, topP = 0.9) {
    const diversityLevel =
      topP > 0.8
        ? "Provide diverse perspectives."
        : "Focus on the most relevant information.";

    const modifiedPrompt = `${diversityLevel} ${prompt}`;
    return this.zeroShotPrompt(modifiedPrompt);
  }

  // Stop sequences
  async stopSequencePrompt(prompt, stopSequence) {
    const result = await this.model.generateContent(prompt);
    let text = (await result.response).text();

    // Manually implement stop sequence
    if (stopSequence && text.includes(stopSequence)) {
      text = text.split(stopSequence)[0];
    }

    return text;
  }
}

module.exports = new AIService();
