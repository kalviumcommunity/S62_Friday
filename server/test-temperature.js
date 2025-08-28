const AIService = require("./services/aiService.js");

async function testTemperature() {
  console.log("Testing Temperature Control...");

  const prompt = "Write a short story about a robot";
  const temperatures = [0.2, 0.7, 0.9];

  for (let i = 0; i < temperatures.length; i++) {
    const temp = temperatures[i];
    try {
      const result = await AIService.temperatureControlledPrompt(prompt, temp);
      console.log(`\nTemperature: ${temp}`);
      console.log(`Response: ${result.substring(0, 150)}...`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with temperature ${temp}:`, error.message);
    }
  }
}

testTemperature().catch(console.error);
