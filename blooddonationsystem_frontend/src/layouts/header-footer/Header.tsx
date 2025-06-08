import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoBlood from './logo_blood.png';
import { useAuth } from './AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <Link to="/doingu">Đội ngũ nhân viên y tế</Link>
        {!user && <Link to="/register">Đăng kí ngay</Link>}
      </nav>

      {!user ? (
        <button className="btn-login" onClick={() => navigate('/login')}>
          Đăng nhập
        </button>
      ) : (
        <div className="user-info" onClick={toggleDropdown}>
          <img
            src={user.avatarUrl || '/default-avatar.png'}
            alt={user.name || 'User'}
            className="avatar"
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => navigate('/account')}>Tài khoản</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
