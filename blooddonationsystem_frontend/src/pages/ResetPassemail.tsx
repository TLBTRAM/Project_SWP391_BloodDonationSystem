import React from "react";
import './components/ResetPassemail.css';
import { useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header'; 
import Footer from '../layouts/header-footer/Footer'; 

const ResetPassemail: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic kiểm tra email tại đây...
    navigate('/forgot2');
  };

  return (
    <div>
      <Header />
      <div className="reset-page">
        <div className="reset-container">
          <h2 className="reset-title">Khôi phục mật khẩu</h2>
          <p className="reset-subtitle">Nhập Email của bạn</p>
          <form className="reset-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="reset-input"
              placeholder="Nhập email của bạn"
              required
            />
            <button type="submit" className="reset-button">Gửi yêu cầu</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassemail;
