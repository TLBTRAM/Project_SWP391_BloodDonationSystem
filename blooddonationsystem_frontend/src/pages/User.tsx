import React, { useState, useEffect, useRef } from 'react';
import './components/User.css';
import Calendar from './Calendar';
import { Link, useNavigate } from 'react-router-dom';
import dinoyRajKImg from './images/User/DinoyRajK.png';
import logoBlood from './images/Logo/logo_blood.png';
import calendar from './images/User/calendar.png';
const user = {
  name: 'User',
  avatarUrl: '' // hoặc link tới avatar
};

const User = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userInfoRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userInfoRef.current &&
        !userInfoRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header className="header">
        <Link to="/" className="logo">
          <img src={logoBlood} alt="Logo" className="logo-img" />
        </Link>

        <nav className="nav-links">
          <Link to="/">Trang chủ</Link>
          <a href="#findblood">Tra cứu nguồn máu sẵn có</a>
          <a href="#support">Hỗ trợ</a>
          <Link to="/team">Đội ngũ nhân viên y tế</Link>
        </nav>


        <div
          className="user-info"
          onClick={toggleDropdown}
          ref={userInfoRef}
        >
          <img src={dinoyRajKImg} alt="User" className="avatar" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  navigate('/donor1');
                  setDropdownOpen(false);
                }}
                className="dropdown-item"
              >
                Tài khoản
              </button>
              <button onClick={handleLogout} className="dropdown-item">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Container */}
      <div className="container">
        <div className="profile-card">
          {/* Left Section */}
          <div className="information">
            <div className="left-section">
              <img className="profile-img" src={dinoyRajKImg} alt="user" />
              <div className="name-role-edit">
                <h2>Dinoy Raj K</h2>
                <div className="right-actions">
                  <span className="user-role-badge">Người dùng</span>
                  <button className="edit-btn" onClick={() => navigate("/edit")}>Chỉnh sửa hồ sơ</button>

                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <h3>Thông tin cá nhân</h3>
              <table>
                <tbody>
                  <tr><td>Họ và tên</td><td>Dinoy Raj K</td></tr>
                  <tr><td>Email</td><td>dinoykraj@gmail.com</td></tr>
                  <tr><td>Số điện thoại</td><td>7306185390</td></tr>
                  <tr><td>Tuổi</td><td>21</td></tr>
                  <tr><td>Nhóm máu</td><td>O+ve</td></tr>
                  <tr><td>Địa chỉ</td><td>Karuvally Reenugeetham House...</td></tr>
                  <tr><td>Ngày hiến máu gần nhất</td><td>11-10-2021</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Right Section */}
          <div className="right-section">
            {/* Donation History */}
            <div className="donation-history">
              <h4>Lịch sử hiến máu</h4>
              <table>
                <thead>
                  <tr><th>Ngày</th><th>Số đơn vị máu / Lượng máu (ml)</th></tr>
                </thead>
                <tbody>
                  <tr><td>13 Dec 2020</td><td>120</td></tr>
                  <tr><td>28 Nov 2020</td><td>20</td></tr>
                  <tr><td>04 Nov 2020</td><td>40</td></tr>
                  <tr><td>15 Oct 2020</td><td>310</td></tr>
                </tbody>
              </table>
            </div>

            {/* Calendar */}
            <div className="calendar-registration">
              <div className="calendar">
                <Calendar />
              </div>
              <div className="register-appointment">
                <h4>Đăng ký lịch khám</h4>
                <img src={calendar} alt="Đặt lịch hiến máu" className="calendar-image"/>
                <button className="register-btn" onClick={() => navigate('/register-appointment')}>
                  Đặt lịch khám
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
