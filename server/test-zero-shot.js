const AIService = require("./services/aiService.js");
require("dotenv").config();

async function testZeroShot() {
  console.log("Testing Zero-Shot Prompting with Gemini...");

  const testCases = [
    "What is the capital of France?",
    "Explain quantum computing in simple terms",
    "What are the benefits of renewable energy?",
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await AIService.zeroShotPrompt(testCase);
      console.log(`\nQ: ${testCase}`);
      console.log(`A: ${result.substring(0, 100)}...`);
      console.log("---");

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with test case "${testCase}":`, error.message);
    }
  }
}

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

testZeroShot().catch(console.error);
