import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const socket = io("https://chat-app-b64m.onrender.com/"); // backend URL

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("initialMessages", (data) => setMessages(data));
    socket.on("newMessage", (data) => setMessages((prev) => [...prev, data]));

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  const sendMessage = () => {
    if (user && message) {
      socket.emit("sendMessage", { user, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat Room</h1>

      {/* Messages List */}
      <ul>
        {messages.map((m, idx) => (
          <li key={idx}>
            <strong>{m.user}:</strong> {m.message}
          </li>
        ))}
      </ul>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          placeholder="Enter Your Name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Your message Here.."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
