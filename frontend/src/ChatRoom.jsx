import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatRoom.css";

// Connect to backend
const socket = io("https://chat-app-b64m.onrender.com/");

const ChatRoom = () => {
  // Unique ID for this user
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(true);
  const messagesEndRef = useRef(null);

  // Listen to messages from server
  useEffect(() => {
    socket.on("initialMessages", (data) => setMessages(data));
    socket.on("newMessage", (data) => setMessages((prev) => [...prev, data]));

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { userId, message });
      setMessage("");
    }
  };

  // Disconnect chat (clear messages locally)
  const disconnectChat = () => {
    if (window.confirm("Really disconnect?")) {
      setMessages([]);
      setConnected(false);
    }
  };

  // Start new chat
  const newChat = () => {
    setMessages([]);
    setConnected(true);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        You&apos;re now chatting with a stranger. Say hi 🙂
      </div>

      <div className="chat-box">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.userId === userId ? "message you" : "message stranger"}
          >
            <strong>{m.userId === userId ? "You" : "Stranger"}:</strong>{" "}
            {m.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        {connected ? (
          <button onClick={disconnectChat}>Disconnect</button>
        ) : (
          <button onClick={newChat}>New</button>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
