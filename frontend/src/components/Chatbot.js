import React, { useState } from "react";
import API from "../api";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "You", text: input };
    let updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const res = await API.post("/chatbot", { message: input });
      const botReply = res.data.reply;
      const botMsg = { from: "Help AI", text: botReply };
      updatedMessages = [...updatedMessages, botMsg];
      setMessages(updatedMessages);
    } catch (err) {
      const botMsg = { from: "Help AI", text: "⚠️ Error connecting to server" };
      setMessages([...updatedMessages, botMsg]);
    }

    setInput("");
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "30px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>🤖 Help AI Assistant</h2>
      
      {/* Chat Window */}
      <div style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
        marginBottom: "15px",
        background: "#f9f9f9"
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              margin: "8px 0",
              textAlign: msg.from === "You" ? "right" : "left"
            }}
          >
            <div 
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "12px",
                background: msg.from === "You" ? "#87CEFA" : "#e6e6e6",
                color: "#000",
                maxWidth: "95%",
                whiteSpace: "pre-wrap"
              }}
            >
              <b>{msg.from}:</b> {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input box above Send button */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about fraud detection, dataset, sample..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px"   // space before button
          }}
        />
        <button 
          onClick={sendMessage}
          style={{
            background: "#87CEFA",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;