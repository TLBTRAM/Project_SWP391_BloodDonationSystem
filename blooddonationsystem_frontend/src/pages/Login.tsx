import React, { useState } from "react";

import "./components/Login.css";
import loginImage from "./images/Banner/login_img.jpeg";
import { useAuth } from "../layouts/header-footer/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Đọc message nếu có
        const errorText = await res.text(); // Không dùng res.json() ở đây
        console.error("Lỗi đăng nhập:", errorText);
        alert("Thông tin đăng nhập không chính xác");
        return;
      }

      const data = await res.json(); // ✅ nếu ok thì mới đọc JSON
      console.log("Đăng nhập thành công:", data);
      alert("Đăng nhập thành công");

      const role = data.role?.toUpperCase(); // chuẩn hóa về in hoa
      console.log("Role đã chuẩn hóa:", role);
      localStorage.setItem("token", data.token);
      login(data);

      // 🚀 Điều hướng theo role
      switch (data.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        case "MEDICALSTAFF":
          navigate("/med");
          break;
        case "CUSTOMER":
          navigate("/user");
          break;
        default:
          alert("Không xác định được vai trò người dùng");
      }
    } catch (error) {
      console.error("Lỗi kết nối tới server:", error);
      alert("Không thể kết nối tới server");
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
