import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoBlood from './logo_blood.png';


const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoBlood} alt="Logo" className="logo-img" />
      </div>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/blood-bank">Ngân hàng máu</Link>
        <Link to="/register">Đăng kí ngay</Link>
      </nav>
      <button className="btn-login" id="loginBtn" onClick={handleLoginClick}>
        Đăng nhập
      </button>

      <button className="btn-login" id="loginBtn" onClick={handleLoginClick}>
        Đăng nhập
      </button>


    </header>
  );
};

export default Header;

