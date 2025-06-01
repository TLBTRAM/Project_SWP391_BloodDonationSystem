import React from "react";
import "./components/Login.css";
import loginImage from "./images/Banner/login_img.jpeg";

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const Login: React.FC = () => {
  return (
    <div>
      <Header />



      {/* Main Login Form */}
      <main className="login-container">
        <div className="poster">
          <img src={loginImage} alt="Every Blood Donor is a Hero" />
        </div>
        <div className="login-form">
          <h2>Đăng nhập</h2>
          <form>
            <input type="text" placeholder="Email hoặc số điện thoại" required />
            <input type="password" placeholder="Mật khẩu" required />
            <button type="submit">Đăng nhập</button>
            <a href="#" className="forgot">Quên mật khẩu ?</a>
          </form>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default Login;