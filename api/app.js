const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Initialize GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/", async (req, res) => {
	const userMessage = req.body.message;

	if (!userMessage) {
		return res.status(400).json({ error: "No message provided" });
	}

	try {
		const result = await model.generateContent(userMessage);
		const responseText = (await result.response.text()) || "No response text available";
		res.json({ response: responseText });
	} catch (error) {
		console.error("Error handling chat:", error);
		res.status(500).json({ error: "Failed to get response from AI" });
	}
});

// Export the Express app as a Vercel serverless function
module.exports = app;
