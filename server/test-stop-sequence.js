const AIService = require("./services/aiService.js");

async function testStopSequence() {
  console.log("Testing Stop Sequences...");

  const testCases = [
    {
      prompt: "List the planets in our solar system:",
      stopSequence: "Mars",
    },
    {
      prompt: "Count from 1 to 10:",
      stopSequence: "5",
    },
    {
      prompt: "Name the primary colors:",
      stopSequence: "Blue",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await AIService.stopSequencePrompt(
        testCase.prompt,
        testCase.stopSequence
      );
      console.log(`\nPrompt: ${testCase.prompt}`);
      console.log(`Stop sequence: ${testCase.stopSequence}`);
      console.log(`Result: ${result}`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with test case:`, error.message);
    }
  }
}

testStopSequence().catch(console.error);
