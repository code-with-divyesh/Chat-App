const fetch = require("node-fetch");

const verifyCaptcha = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    if (data.success) {
      return res.json({ success: true, message: "Human verified ✅" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Captcha failed ❌" });
    }
  } catch (error) {
    console.error("Captcha verification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { verifyCaptcha };
