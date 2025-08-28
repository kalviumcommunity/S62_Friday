// import AIService from "../services/aiService.js";
// import VectorDB from "../services/vectorDB.js";

// // Process a message with AI
// router.post("/message", authenticateToken, async (req, res) => {
//   try {
//     const { message, conversationId, userId } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // Store in vector DB for future context
//     await VectorDB.addItem(message, { userId, conversationId });

//     // Get similar past messages for context
//     const similarMessages = await VectorDB.searchSimilar(message, 3);

//     // Create context from similar messages
//     let context = "";
//     if (similarMessages.length > 0) {
//       context = "Previous similar conversations:\n";
//       similarMessages.forEach((msg, index) => {
//         context += `${index + 1}. ${msg.item.text}\n`;
//       });
//     }

//     // Use dynamic prompting with context
//     const response = await AIService.dynamicPrompt(message, context);

//     // Also store the response in vector DB
//     await VectorDB.addItem(response, {
//       userId,
//       conversationId,
//       isResponse: true,
//     });

//     res.json({
//       response,
//       conversationId,
//       similarContext: similarMessages.map((m) => m.item.text),
//     });
//   } catch (error) {
//     console.error("Error processing message:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
