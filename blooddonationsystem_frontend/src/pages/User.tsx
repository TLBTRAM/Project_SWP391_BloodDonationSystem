import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './components/User.css';

import dinoyRajKImg from './images/User/DinoyRajK.png';
import logoBlood from './images/Logo/logo_blood.png';
import calendarIcon from './images/User/Calendar.png';

interface UserData  {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  bloodGroup: string;
  address: string;
  lastDonationDate: string;
}

const User = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null); 
  const userInfoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userInfoRef.current && !userInfoRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <Link to="/" className="logo-area">
          <img src={logoBlood} alt="Logo" />
        </Link>
        <nav className="nav-links">
          <Link to="/">Trang chủ</Link>
          <a href="#findblood">Tra cứu máu</a>
          <a href="#support">Hỗ trợ</a>
          <Link to="/team">Nhân viên y tế</Link>
        </nav>
        <div className="user-menu" ref={userInfoRef} onClick={toggleDropdown}>
          <img src={dinoyRajKImg} alt="Avatar" className="avatar" />
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={() => navigate('/user')}>Tài khoản</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content">
        <div className="left-panel">
          <div className="user-card">
            <img src={dinoyRajKImg} alt="User" />
            <h2>{user?.fullName || "Tên người dùng"}</h2>
            <div className="user-actions">
              <span className="user-role">Người dùng</span>
              <button className="edit-profile-btn" onClick={() => navigate('/edit')}>
                ✏️ Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>

          <div className="user-info">
            <h3>Thông tin cá nhân</h3>
            <table>
              <tbody>
                <tr><td>Họ tên:</td><td>{user?.fullName}</td></tr>
                <tr><td>Email:</td><td>{user?.email}</td></tr>
                <tr><td>Điện thoại:</td><td>{user?.phone}</td></tr>
                <tr><td>Tuổi:</td><td>{user?.age}</td></tr>
                <tr><td>Nhóm máu:</td><td>{user?.bloodGroup}</td></tr>
                <tr><td>Địa chỉ:</td><td>{user?.address}</td></tr>
                <tr><td>Ngày hiến gần nhất:</td><td>{user?.lastDonationDate}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-panel">
          <div className="donation-history">
            <h4>Lịch sử hiến máu</h4>
            <table>
              <thead>
                <tr><th>Ngày</th><th>Lượng máu (ml)</th></tr>
              </thead>
              <tbody>
                <tr><td>13 Dec 2020</td><td>120</td></tr>
                <tr><td>28 Nov 2020</td><td>20</td></tr>
                <tr><td>04 Nov 2020</td><td>40</td></tr>
                <tr><td>15 Oct 2020</td><td>310</td></tr>
              </tbody>
            </table>
          </div>

          <div className="calendar-booking">
            <Calendar />
          </div>

        </div>
        <div className="booking-section">
          <div className="booking-content">
            <img src={calendarIcon} alt="Đặt lịch" className="calendar-icon" />
            <div className="text-area">
              <h4>Đăng ký lịch khám</h4>
              <p>Hãy đặt lịch trước để được phục vụ nhanh và thuận tiện hơn.</p>
              <button onClick={() => navigate('/booking')}>📅 Đặt lịch ngay</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;
