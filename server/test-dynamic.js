const AIService = require("./services/aiService.js");

async function testDynamic() {
  console.log("Testing Dynamic Prompting...");

  const testCases = [
    {
      query: "What should I do next?",
      context:
        "User is learning to code and just finished a basic Python tutorial",
    },
    {
      query: "How can I improve this?",
      context: "User is working on a website and the loading time is slow",
    },
    {
      query: "What's your recommendation?",
      context:
        "User is planning a trip to Japan next month and likes cultural experiences",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await AIService.dynamicPrompt(
        testCase.query,
        testCase.context
      );
      console.log(`\nContext: ${testCase.context}`);
      console.log(`Query: ${testCase.query}`);
      console.log(`Response: ${result.substring(0, 200)}...`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with test case:`, error.message);
    }
  }
}

testDynamic().catch(console.error);
