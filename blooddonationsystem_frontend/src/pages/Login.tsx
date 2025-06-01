import React from "react";
import "./components/Login.css";
import loginImage from "./images/Banner/login_img.jpeg";

const Login: React.FC = () => {
  return (
    <div>
      <header className="header">
        <div className="logo">🩸</div>
        <nav className="nav-links">
          <a href="#">Trang chủ</a>
          <a href="#">Liên hệ</a>
          <a href="#">Ngân hàng máu</a>
          <a href="#">Đăng kí ngay</a>
        </nav>
        <button className="btn-login" id="loginBtn">Đăng nhập</button>
      </header>

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

      {/* Footer */}
      <footer>
        <p>© 2025 BloodHero. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
