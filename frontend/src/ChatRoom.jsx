import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const socket = io("https://chat-app-b64m.onrender.com/"); // backend URL

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("You"); // default user You
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("initialMessages", (data) => setMessages(data));
    socket.on("newMessage", (data) => setMessages((prev) => [...prev, data]));

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { user, message });
      setMessage("");
    }
  };

  const disconnectChat = () => {
    if (window.confirm("Really disconnect?")) {
      setMessages([]);
      setConnected(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setConnected(true);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        You&apos;re now chatting with a stranger. Say hi :)
      </div>

      <div className="chat-box">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.user === "You" ? "message you" : "message stranger"}
          >
            <strong>{m.user === "You" ? "You" : "Stranger"}:</strong> {m.message}
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
