const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const captchaRouter = require("./Routes/captchaRoute");
const app = express();
const server = http.createServer(app);

// Allowed origins
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
  },
});

app.use(express.json());
app.use("/", captchaRouter);
// 🟢 Temporary in-memory messages (RAM only)
let messages = [];

app.get("/", (req, res) => {
  res.send("Server running🫡👌 (RAM storage)");
});

// socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // send all existing messages (from RAM)
  socket.emit("initialMessages", messages);

  // listen for new message
  socket.on("sendMessage", (data) => {
    const newMessage = {
      user: data.user,
      message: data.message,
      time: new Date().toISOString(),
    };

    // store in RAM
    messages.push(newMessage);

    // broadcast to everyone
    io.emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
