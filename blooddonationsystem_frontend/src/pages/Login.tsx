import React, { useState } from "react";
import "./components/Login.css";
import loginImage from "./images/Banner/login_img.jpeg";

import { Link, useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Đăng nhập thành công:", data);
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
    
          <input type="text" placeholder="Username hoặc email" required value={email} onChange={(e) => setEmail(e.target.value)} />
           <input type="password" placeholder="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Đăng nhập</button>
          <Link to="/forgot" className="forgot">Quên mật khẩu ?</Link>

        </div>
      </main>

      <footer id="contact">
        <Footer />
      </footer>
    </div>
  );
};

export default Login;
