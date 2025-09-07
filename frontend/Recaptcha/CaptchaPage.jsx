import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Captcha.css";

export default function CaptchaPage({ onVerified }) {
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptcha = (value) => setCaptchaValue(value);

  const verifyUser = async () => {
    if (!captchaValue) {
      alert("❌ Please verify you are human!");
      return;
    }

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
      onVerified();
    } else {
      alert("❌ Bot detected! Access denied.");
    }
  };

  return (
    <div className="captcha-container">
      {/* 🔥 Stylish main title */}
      <h1 className="captcha-title">Welcome to RealTime Chat 🚀</h1>
      <p className="captcha-subtitle">
        Connect instantly with strangers around the world 🌍 Please verify to
        continue 👇
      </p>

      <div className="captcha-card">
        <h2>Verify You Are Human 🤖</h2>
        <ReCAPTCHA
          sitekey="6LdDjcArAAAAAKPMcEFDc1Yvg4c5lBTIRxcsXdXR"
          onChange={handleCaptcha}
        />
        <button className="captcha-btn" onClick={verifyUser}>
          Continue →
        </button>
      </div>
    </div>
  );
}
