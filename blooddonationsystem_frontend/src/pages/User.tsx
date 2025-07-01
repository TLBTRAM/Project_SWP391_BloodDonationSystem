import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './components/User.css';
import Header from '../layouts/header-footer/Header';
import avatarImg from './images/User/Avatar.png';
import calendarIcon from './images/User/Calendar.png';
import notificationIcon from './images/User/notifications.png';

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  bloodGroup?: string;
  address?: string;
  lastDonationDate?: string;
  birthDate?: string;
}

const User = () => {
  const calculateAge = (birthDateString: string): number => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
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
    const token = localStorage.getItem("token");
    console.log("FE token:", token);//check có in token ko

    if (token) {
      fetch("http://localhost:8080/api/account/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Không lấy được thông tin người dùng");
          }
          return res.json();
        })
        .then((data) => {
          console.log("User info from BE:", data);
          setUser(data);
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API /me:", error);
          alert("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Header />

      <div className="user-dashboard">
        <div className="user-topbar">
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
        </div>

        <main className="dashboard-content">
          <div className="first-panel">
            <div className="user-card">
              <img src={avatarImg} alt="User" />
              <h2>{user?.fullName || "Tên người dùng"}</h2>
              <div className="user-actions">
                <span className="user-role">Người dùng</span>
                <button className="edit-profile-btn" onClick={() => navigate('/edit')}>
                  ✏️ Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>

            <div className="user-info">

              <table>
                <h3 className="info-title">Thông tin cá nhân</h3>
                <tbody>
                  <tr><td>👤 Họ tên:</td><td>{user?.fullName}</td></tr>
                  <tr><td>📧 Email:</td><td>{user?.email}</td></tr>
                  <tr><td>📱 Điện thoại:</td><td>{user?.phone}</td></tr>
                  <tr><td>🎂 Tuổi:</td><td>{user?.birthDate ? calculateAge(user.birthDate) : '---'}</td></tr>
                  <tr><td>🩸 Nhóm máu:</td><td>{user?.bloodGroup}</td></tr>
                  <tr><td>🏡 Địa chỉ:</td><td>{user?.address}</td></tr>
                  <tr><td>🕒 Ngày hiến gần nhất:</td><td>---</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="second-panel">
            <div className="donation-history">
              <h4>Lịch sử hiến máu</h4>
              <table>
                <thead>
                  <tr><th>Ngày</th><th>Lượng máu (ml)</th></tr>
                </thead>
                <tbody>
                  <tr><td>13 Tháng 12 2020</td><td>120</td></tr>
                  <tr><td>28 Tháng 11 2020</td><td>20</td></tr>
                  <tr><td>04 Tháng 11 2020</td><td>40</td></tr>
                  <tr><td>15 Tháng 11 2020</td><td>310</td></tr>
                </tbody>
              </table>
            </div>

            <div className="calendar-booking">
              <Calendar />
            </div>
          </div>
          <div className="third-panel">
            <div className="booking-item">
              <div className="booking-text">

                <h4>Đăng ký lịch khám</h4>
                <p>Hãy đặt lịch trước để được phục vụ nhanh và thuận tiện hơn.</p>
                <img src={calendarIcon} alt="Đặt lịch" />
                <button onClick={() => navigate('/booking')}>Đặt lịch ngay</button>
              </div>
            </div>
            <div className="booking-item">
              <div className="booking-text">
                <h4>Thông báo</h4>
                <p>Nhấn vào đây để xem thông báo mới về xét nghiệm, kết quả khám sàng lọc, người cần máu và các cập nhật khác.</p>
                <img src={notificationIcon} alt="Thông báo" />
                <button onClick={() => navigate('/notification')}>Xem ngay</button>
              </div>
            </div>
            <div className="booking-item">
              <div className="booking-text">
                <h4>Đang phát triển</h4>
                <p>Chức năng mới đang được cập nhật và sẽ ra mắt trong thời gian tới.</p>
              </div>
            </div>
            <div className="booking-item">
              <div className="booking-text">
                <h4>Đang phát triển</h4>
                <p>Chức năng mới đang được cập nhật và sẽ ra mắt trong thời gian tới.</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default User;
