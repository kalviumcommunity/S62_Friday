const AIService = require("./services/aiService.js");

async function testFewShot() {
  console.log("Testing One-Shot & Multi-Shot Prompting...");

  // One-shot test
  console.log("\n1. One-Shot Prompting:");
  const oneShotExample = {
    query: "Translate 'hello' to Spanish",
    response: "hola",
  };

  try {
    const oneShotResult = await AIService.oneShotPrompt(
      "Translate 'goodbye' to Spanish",
      oneShotExample
    );
    console.log(`Query: Translate 'goodbye' to Spanish`);
    console.log(`Response: ${oneShotResult}`);
    console.log("---");
  } catch (error) {
    console.error("Error in one-shot test:", error.message);
  }
}

testFewShot().catch(console.error);
