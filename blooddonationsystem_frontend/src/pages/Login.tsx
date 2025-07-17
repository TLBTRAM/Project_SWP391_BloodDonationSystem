import React, { useState } from "react";

import "./components/Login.css";

import "./components/Register.css"; // Import toast style

import loginImage from "./images/Banner/login_img.jpeg";
import { useAuth } from "../layouts/header-footer/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false); // Toast state
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const { login, refetchUser } = useAuth();
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Lỗi đăng nhập:", errorText);
        setError("Sai tài khoản hoặc mật khẩu!");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setShowSuccess(true); // Show toast
      localStorage.setItem("token", data.token);
      login(data);
      await refetchUser(); // Cập nhật lại user cho context
      setTimeout(() => {
        // Điều hướng theo role
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
            setError("Không xác định được vai trò người dùng");
        }
      }, 1500); // Delay for toast
    } catch (error) {
      console.error("Lỗi kết nối tới server:", error);
      setError("Không thể kết nối tới server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="login-container">
        <div className="poster">
          <img src={loginImage} alt="Every Blood Donor is a Hero" />
        </div>
        <div className="login-form">
          <h2>Đăng nhập</h2>
          {showSuccess && (
            <div className="login-success-inline">Đăng nhập thành công! Đang chuyển hướng...</div>
          )}
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={isLoading || showSuccess}>{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
            {error && (
              <div className="login-error-inline">{error}</div>
            )}
          </form>
          <Link to="/forgot" className="forgot">Quên mật khẩu ?</Link>
        </div>
      </main>
      <footer id="contact">
        <Footer />
      </footer>
    </div>
  );
}

export default Login;
