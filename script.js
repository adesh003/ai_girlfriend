// Select elements
const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("questionInput");
const chatMessages = document.getElementById("chatMessages");

// Send message
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  sendMessage();
});

// Detect Enter key press
questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent new line
    sendMessage();
  }
});

async function sendMessage() {
  const message = questionInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  questionInput.value = "";

  // Thinking indicator
  addMessage("bot", "Thinking...", true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    });

    removeThinkingMessage();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong.");
    }

    const data = await response.json();
    addMessage("bot", data.answer);

  } catch (error) {
    console.error("Fetch error:", error);
    removeThinkingMessage();
    addMessage("bot", `😥 Sorry, kuch problem ho gayi. (${error.message})`);
  }
}

function addMessage(sender, text, isThinking = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

  if (isThinking) {
    messageDiv.classList.add("thinking-message");
  }

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinkingMessage() {
  const thinkingNode = document.querySelector('.thinking-message');
  if (thinkingNode) thinkingNode.remove();
}
