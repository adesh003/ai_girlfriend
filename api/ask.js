export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API_KEY environment variable" });
    }

    const { question } = req.body || {};
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question cannot be empty." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
      contents: [{ role: "user", parts: [{ text: question }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
    });

    const reply = result.response.text();
    return res.status(200).json({ answer: reply });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return res.status(500).json({ error: "Sorry, mujhe abhi reply banane me problem aa rahi hai." });
  }
}
