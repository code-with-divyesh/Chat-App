import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import "./App.css";
import CaptchaPage from "../Recaptcha/CaptchaPage";
const App = () => {
  const [isVerified, setIsVerified] = useState(false);
  return (
    <div className="App">
      {!isVerified ? (
        <CaptchaPage onVerified={() => setIsVerified(true)} />
      ) : (
        <ChatRoom />
      )}
    </div>
  );
};

export default App;
