import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoBlood from './logo_blood.png';
import { useAuth } from './AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <Link to="/doingu">Đội ngũ nhân viên y tế</Link>
        {!user && <Link to="/register">Đăng kí ngay</Link>}
      </nav>

      {!user ? (
        <button className="btn-login" id="loginBtn" onClick={handleLoginClick}>
          Đăng nhập
        </button>
      ) : (
        <div className="user-info">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="avatar"
            onClick={handleLogout}
            title="Đăng xuất"
          />
        </div>
      )}
    </header>
  );
};

export default Header;