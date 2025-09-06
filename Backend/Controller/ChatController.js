const ChatMessage = require("../Model/ChatMessage"); // path sahi karo (Models with capital M)

const getMessage = async (req, res) => {
  try {
    const message = await ChatMessage.find();
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveData = async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    // Option 1: using 'new' + save()
    const chatMessage = new ChatMessage({ user, message });
    await chatMessage.save();

    // Option 2: shortcut (direct create)
    // const chatMessage = await ChatMessage.create({ user, message });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getMessage, saveData };
