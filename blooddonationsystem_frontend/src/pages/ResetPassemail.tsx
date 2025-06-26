import React, { useState } from "react";
import './components/ResetPassemail.css';
import { useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const ResetPassemail: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ GỌI API TRỰC TIẾP KHÔNG DÙNG apiService
      const response = await fetch("http://localhost:8080/api/auth/send-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Mã xác nhận đã được gửi về email của bạn!");
        localStorage.setItem("resetEmail", email);
        navigate('/forgot2');
      } else {
        alert("Lỗi: " + (result.error || "Không thể gửi mã xác nhận"));
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      alert("Không thể kết nối tới server. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Header />

      <div className="reset-page">
        <div className="reset-container">
          <h2 className="reset-title">Khôi phục mật khẩu</h2>
          <p className="reset-subtitle">Vui lòng nhập email của bạn để có mã xác nhận</p>
          <form className="reset-form" onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              className="reset-input"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="reset-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassemail;
