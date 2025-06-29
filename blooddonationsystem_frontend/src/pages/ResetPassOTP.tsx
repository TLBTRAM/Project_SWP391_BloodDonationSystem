import React, { useState, useRef, useEffect } from "react";
import "./components/ResetPassOTP.css";
import { useNavigate } from "react-router-dom";

import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length !== otp.length || otpString.includes("")) {
      alert("Vui lòng nhập đầy đủ mã xác nhận.");
      return;
    }

    localStorage.setItem("resetOTP", otpString);
    navigate("/forgot3");
  };

  const handleResendClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!canResend) return;

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      alert("Không tìm thấy email. Vui lòng quay lại trang nhập email.");
      navigate("/forgot");
      return;
    }

    try {
      // TODO: Thay bằng API thật để gửi lại mã OTP
      alert("Mã xác nhận đã được gửi lại!");
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      alert("Không thể gửi lại mã xác nhận. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="form-container">
          <h2>Khôi phục mật khẩu</h2>
          <p>Mã xác nhận đã được gửi vào email của bạn.</p>
          <div className="code-inputs">
            {otp.map((value, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => {
                  if (el) inputRefs.current[i] = el;
                }}
              />
            ))}
          </div>
          <a
            href="#"
            className={`resend ${canResend ? "" : "disabled"}`}
            onClick={handleResendClick}
          >
            {canResend ? "Gửi lại mã" : `Gửi lại mã (${timer}s)`}
          </a>
          <button className="confirm-btn" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResetPassword;
