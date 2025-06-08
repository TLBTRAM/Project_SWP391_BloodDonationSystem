import React, { useState } from "react"; 
import "./components/Login.css";
import loginImage from "./images/Banner/login_img.jpeg";

import { Link, useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // State để lưu giá trị input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Giả sử check đăng nhập đơn giản (bạn thay bằng api thật)
    if (username === 'admin' && password === '123') {
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', username);

      // Điều hướng về trang tài khoản hoặc trang chủ
      navigate('/admin'); // bạn đổi đường dẫn phù hợp
    } else if (username === 'user' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', username);
      navigate('/donor1'); // bạn đổi đường dẫn phù hợp
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
    
  };

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
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Email hoặc số điện thoại" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Đăng nhập</button>
            <Link to="/forgot" className="forgot">Quên mật khẩu ?</Link>
          </form>
        </div>
      </main>

      <footer id="contact">
        <Footer />
      </footer>
    </div>
  );
};

export default Login;
