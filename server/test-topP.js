const AIService = require("./services/aiService.js");

async function testTopP() {
  console.log("Testing Top-P Sampling...");

  const prompt = "Describe the future of artificial intelligence";
  const topPValues = [0.5, 0.9];

  for (let i = 0; i < topPValues.length; i++) {
    const topP = topPValues[i];
    try {
      const result = await AIService.topPPrompt(prompt, topP);
      console.log(`\nTop-P: ${topP}`);
      console.log(`Response: ${result.substring(0, 150)}...`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with Top-P ${topP}:`, error.message);
    }
  }
}

testTopP().catch(console.error);
