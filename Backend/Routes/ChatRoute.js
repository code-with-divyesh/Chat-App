const express = require("express");
const { getMessage, saveData } = require("../Controller/ChatController");

const chatRouter = express.Router();

chatRouter.get("/message", getMessage);

chatRouter.post("/message", saveData);

module.exports = chatRouter;
