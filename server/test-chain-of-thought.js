const AIService = require("./services/aiService.js");

async function testChainOfThought() {
  console.log("Testing Chain of Thought Prompting...");

  const testCases = [
    "If a store has 120 apples and sells 45, then gets a delivery of 60 more, how many apples do they have?",
    "Sarah is twice as old as John. 10 years ago, Sarah was 4 times as old as John. How old are they now?",
    "A train leaves station A at 60 mph. Two hours later, another train leaves station A at 80 mph going the same direction. How long will it take for the second train to catch up?",
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await AIService.chainOfThoughtPrompt(testCase);
      console.log(`\nProblem: ${testCase}`);
      console.log(`Step-by-step reasoning:\n${result}`);
      console.log("---");

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`Error with test case:`, error.message);
    }
  }
}

testChainOfThought().catch(console.error);
