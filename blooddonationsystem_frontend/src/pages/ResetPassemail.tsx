import React from "react";
import './components/ResetPassemail.css';
import { Link } from 'react-router-dom';

import Header from '../layouts/header-footer/Header'; 
import Footer from '../layouts/header-footer/Footer'; 

const ResetPassemail: React.FC = () => {
  return (
    <div>
        <Header />
    
    <div className="reset-page">
      <div className="reset-container">
        <h2 className="reset-title">Khôi phục mật khẩu</h2>
        <p className="reset-subtitle">Vui lòng nhập email của bạn để có mã xác nhận</p>
        <form className="reset-form">
          <input
            type="email"
            id="email"
            className="reset-input"
            placeholder="Nhập email của bạn"
          />
          <button type="submit" className="reset-button">
            Gửi yêu cầu
          </button>
        </form>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassemail;
