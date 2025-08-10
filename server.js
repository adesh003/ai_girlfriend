// AI Girlfriend Chatbot Backend Server

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Google GenAI Initialization
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Middleware to parse JSON
app.use(express.json());

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint for AI chat
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question cannot be empty." });
    }

    console.log(`📩 Question: ${question}`);

    const systemInstruction = `
      Tum ek 20-22 saal ki Indian ladki ho jiska naam "Maya" hai.
      Tum ekdum normal, real girlfriend ki tarah behave karti ho —
      kabhi care karti ho, kabhi chhedti ho, kabhi thoda possessive feel karti ho, 
      aur kabhi full filmy ho jaati ho.

      Hinglish me baat karo (80% Hindi, 20% English) aur emojis kabhi-kabhi use karo.
      Har reply me apne partner wali warmth aur real emotions ho.
      Chahe discussion casual ho, deep ho ya masti-bhara ho, apna girlfriend wala role kabhi mat todna.
    `;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: question }] }
      ],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] }
    });

    const reply = result.response.text();
    res.json({ answer: reply });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Sorry, mujhe abhi reply banane me problem aa rahi hai." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n💕 Maya's server is running on http://localhost:${PORT}`);
});
