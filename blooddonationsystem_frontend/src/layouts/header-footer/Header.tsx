import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import avatarImg from './Avatar.png';
import logoBlood from "./logo_blood.png";
import { useAuth } from "./AuthContext";
interface UserData {
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'MEDICALSTAFF';
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() as { user: UserData | null, logout: () => void };
  
  const handleUserClick = () => {
    console.log("User info:", user);
    console.log("Navigating with role:", user?.role);
    switch (user?.role) {
      case 'CUSTOMER':
        navigate('/user');
        break;
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'MANAGER':
        navigate('/manager');
        break;
      case 'MEDICALSTAFF':
        navigate('/med');
        break;
      default:
        console.warn("Không xác định role:", user?.role);
        navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // chuyển về trang đăng nhập sau khi logout
  };
  
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logoBlood} alt="Logo" className="logo-img" />
      </Link>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <a href="/contact">Liên hệ</a>
        <a href="#info">Thông tin</a>
        <Link to="/team">Đội ngũ nhân viên y tế</Link>
        {!user && (
          <Link to="/register" className="register-link">
            Đăng kí ngay
          </Link>
        )}
      </nav>

      {/* Sửa logic hiển thị: nếu chưa đăng nhập thì chỉ hiện nút đăng nhập, nếu đã đăng nhập thì hiện avatar + tên + nút đăng xuất */}
      {!user ? (
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
      ) : (
        <div className="user-section">
          <div className="user-avatar-status" onClick={handleUserClick}>
            <img src={avatarImg} alt="Avatar" className="avatar" />
            <span className="user-fullname">
              {user.fullName || "Tên người dùng"}
            </span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
