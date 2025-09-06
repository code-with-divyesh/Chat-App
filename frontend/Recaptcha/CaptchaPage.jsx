import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function CaptchaPage({ onVerified }) {
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptcha = (value) => {
    setCaptchaValue(value);
  };

  const verifyUser = async () => {
    if (!captchaValue) {
      alert("❌ Please verify you are human!");
      return;
    }

    // Send token to backend for verification
    const res = await fetch(
      "https://chat-app-b64m.onrender.com/verify-captcha",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaValue }),
      }
    );
    const data = await res.json();

    if (data.success) {
      onVerified(); // allow entry
    } else {
      alert("❌ Bot detected! Access denied.");
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {" "}
      <h2>Verify You Are Human 🤖</h2>
      <ReCAPTCHA
        sitekey="6LdDjcArAAAAAKPMcEFDc1Yvg4c5lBTIRxcsXdXR"
        onChange={handleCaptcha}
      />
      <br />
      <button onClick={verifyUser}>Continue</button>{" "}
    </div>
  );
}
