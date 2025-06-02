import React from "react";
import './components/ResetPass.css';

import Header from '../layouts/header-footer/Header'; 
import Footer from '../layouts/header-footer/Footer'; 

const ResetPassword: React.FC = () => {
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
              placeholder="Password"
              className="password-input"
              id="password"
            />

          </div>

          <button className="confirm-btn-1">Xác nhận</button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResetPassword;
