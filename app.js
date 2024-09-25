const express = require("express");
const path = require("path");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Serve static files (like CSS and JS)
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
	res.send("Hey");
});

// Initialize GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat", async (req, res) => {
	const userMessage = req.body.message;

	if (!userMessage) {
		return res.status(400).json({ error: "No message provided" });
	}

	try {
		const result = await model.generateContent(userMessage);
		// console.log("Generated response:", result); // Log the response for debugging

		// Ensure the response has a text field and send it
		const responseText = (await result.response.text()) || "No response text available";
		res.json({ response: responseText });
	} catch (error) {
		console.error("Error handling chat:", error);
		res.status(500).json({ error: "Failed to get response from AI" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
