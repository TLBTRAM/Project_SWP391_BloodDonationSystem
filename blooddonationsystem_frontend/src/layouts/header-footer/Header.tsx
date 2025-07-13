import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import avatarImg from './Avatar.png';
import logoBlood from "./logo_blood.png";
import { useAuth } from "./AuthContext";
interface UserData {
  fullName: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth() as { user: UserData | null, logout: () => void };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logoBlood} alt="Logo" className="logo-img" />
      </Link>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <a href="#contact">Liên hệ</a>
        <a href="#info">Thông tin</a>
        <Link to="/team">Đội ngũ nhân viên y tế</Link>
        {!user && (
          <Link to="/register" className="register-link">
            Đăng kí ngay
          </Link>
        )}
      </nav>

      {!user ? (
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      ) : (
        <div className="user-avatar-status" ref={userInfoRef} onClick={toggleDropdown}>
          <img src={avatarImg} alt="Avatar" className="avatar" />
          <span className="user-fullname">
            {user?.fullName || "Tên người dùng"}
          </span>
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={() => navigate('/user')}>👤 Hồ sơ cá nhân</button>
              <button onClick={() => navigate('/settings')}>⚙️ Cài đặt</button>
              <button onClick={() => navigate('/booking-list')}>📅 Lịch hẹn đã đặt</button>
              <button onClick={handleLogout}>🚪 Đăng xuất</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
