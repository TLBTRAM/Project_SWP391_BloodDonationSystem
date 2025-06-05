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
      <Link to="/" className="logo">
        <img src={logoBlood} alt="Logo" className="logo-img" />
      </Link>
      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <a href="#contact">Liên hệ</a>
        <a href="#info">Thông tin</a>
        <Link to="/doingu">Đội ngũ nhân viên y tế</Link>
        <Link to="/register">Đăng kí ngay</Link>
      </nav>
      <button className="btn-login" id="loginBtn" onClick={handleLoginClick}>
        Đăng nhập
      </button>
    </header>
  );
};
export default Header;

