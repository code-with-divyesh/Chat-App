const express = require("express");
const { verifyCaptcha } = require("../Controllers/captchaController");

const router = express.Router();

router.post("/verify-captcha", verifyCaptcha);

module.exports = router;
