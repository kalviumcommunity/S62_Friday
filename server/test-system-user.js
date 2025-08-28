const AIService = require("./services/aiService.js");

async function testSystemUser() {
  console.log("Testing System & User Prompts...");

  const testCases = [
    {
      query: "What is the weather like today?",
      systemRole: "friendly weather assistant",
    },
    {
      query: "Explain quantum physics",
      systemRole: "patient science teacher for beginners",
    },
    {
      query: "How do I make pasta?",
      systemRole: "experienced Italian chef",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await AIService.systemUserPrompt(
        testCase.query,
        testCase.systemRole
      );
      console.log(`\nSystem: ${testCase.systemRole}`);
      console.log(`User: ${testCase.query}`);
      console.log(`Response: ${result.substring(0, 150)}...`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error with test case:`, error.message);
    }
  }
}

testSystemUser().catch(console.error);
