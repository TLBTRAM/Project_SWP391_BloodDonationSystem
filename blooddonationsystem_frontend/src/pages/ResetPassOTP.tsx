import React, { useEffect, useRef, useState } from "react";
import "./components/ResetPassOTP.css";
import { Link } from "react-router-dom";

import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

const ResetPassword: React.FC = () => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const inputs = inputRefs.current;

    const inputHandlers: EventListener[] = [];
    const keydownHandlers: EventListener[] = [];

    inputs.forEach((input, index) => {
      if (!input) return;

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = target.value.replace(/[^0-9]/g, "");
        target.value = value;

        if (value && index < inputs.length - 1) {
          inputs[index + 1]?.focus();
        }
      };

      const handleKeyDown = (e: Event) => {
        const event = e as KeyboardEvent;
        if (event.key === "Backspace" && input && !input.value && index > 0) {
          inputs[index - 1]?.focus();
        }
      };

      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);

      inputHandlers.push(handleInput);
      keydownHandlers.push(handleKeyDown);
    });

    return () => {
      inputs.forEach((input, index) => {
        if (input) {
          input.removeEventListener("input", inputHandlers[index]);
          input.removeEventListener("keydown", keydownHandlers[index]);
        }
      });
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!canResend) return;

    // TODO: Thực hiện gửi lại mã xác nhận (gọi API hoặc logic khác)
    alert("Mã xác nhận đã được gửi lại!");

    setTimer(30);
    setCanResend(false);
  };

  return (
    <>
      <Header />

      <main>
        <div className="form-container">
          <h2>Khôi phục mật khẩu</h2>
          <p>Mã xác nhận đã được gửi vào mail bạn</p>
          <div className="code-inputs">
            {[0, 1, 2, 3, 4, 5].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
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

          <button className="confirm-btn">Xác nhận</button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResetPassword;
