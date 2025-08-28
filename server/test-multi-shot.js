const AIService = require("./services/aiService.js");

async function testFewShot() {
  console.log("Testing One-Shot & Multi-Shot Prompting...");

  // Multi-shot test
  console.log("\n2. Multi-Shot Prompting:");
  const multiShotExamples = [
    { query: "2+2", response: "4" },
    { query: "3+5", response: "8" },
    { query: "10-3", response: "7" },
  ];

  try {
    const multiShotResult = await AIService.multiShotPrompt(
      "6+7",
      multiShotExamples
    );
    console.log(`Query: 6+7`);
    console.log(`Response: ${multiShotResult}`);
    console.log("---");
  } catch (error) {
    console.error("Error in multi-shot test:", error.message);
  }

  // Additional multi-shot test
  console.log("\n3. Multi-Shot with Sentiment:");
  const sentimentExamples = [
    { query: "I love this product!", response: "Positive" },
    { query: "This is terrible.", response: "Negative" },
    { query: "It's okay, I guess.", response: "Neutral" },
  ];

  try {
    const sentimentResult = await AIService.multiShotPrompt(
      "This is absolutely amazing!",
      sentimentExamples
    );
    console.log(`Query: This is absolutely amazing!`);
    console.log(`Response: ${sentimentResult}`);
  } catch (error) {
    console.error("Error in sentiment test:", error.message);
  }
}

testFewShot().catch(console.error);
