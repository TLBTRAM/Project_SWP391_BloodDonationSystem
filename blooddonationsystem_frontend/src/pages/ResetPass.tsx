import React, { useState, useEffect } from "react";
import './components/ResetPass.css';
import { useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';
const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOTP");

    if (!email || !otp) {
      alert("Thông tin không hợp lệ. Vui lòng thử lại từ đầu.");
      navigate("/forgot");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOTP");

    if (!email || !otp) {
      alert("Thông tin không hợp lệ. Vui lòng thử lại từ đầu.");
      navigate("/forgot");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ GỌI API TRỰC TIẾP Ở ĐÂY
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: otp,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Đặt lại mật khẩu thành công!");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOTP");
        navigate("/login");
      } else {
        alert("Lỗi: " + (result.error || "Không thể đặt lại mật khẩu"));
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      alert("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Header />

      <main>
        <div className="form-container">
          <h2>Khôi phục mật khẩu</h2>
          <p>Nhập mật khẩu mới</p>

          <div className="password-wrapper">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="password-input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <div className="password-wrapper">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              className="password-input"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <button
            className="confirm-btn-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResetPassword;
