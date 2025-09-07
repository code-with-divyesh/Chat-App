const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { Server, Socket } = require("socket.io");
const cors = require("cors");
const http = require("http");
const connectDB = require("./Config/db");
const chatRouter = require("./Routes/ChatRoute");
const ChatMessage = require("./Model/ChatMessage");
const app = express();
const captchaRouter = require("./Routes/captchaRoute");
const server = http.createServer(app); // HTTP server for Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-sigma-ten-42.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  }, // frontend URL after deployment
});

app.use(express.json());

connectDB();

app.use("/api/chat", chatRouter);
app.get("/", (req, res) => {
  res.send("Server running🫡👌");
});

//socket-io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  ChatMessage.find()
    .then((message) => socket.emit("initialMessages", message))
    .catch((err) => console.log(err));

  //for listen new message
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new ChatMessage({
        user: data.user,
        message: data.message,
      });
      await newMessage.save();

      // Broadcast to all connected clients
      io.emit("newMessage", newMessage);
    } catch (err) {
      console.error(err);
    }
  });
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});
app.use("/", captchaRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
