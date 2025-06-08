import React, { useState, useEffect } from 'react';
import './components/Dashboarddonor1.css';
import Calendar from './Calendar';
import { Link, useNavigate } from 'react-router-dom';
import dinoyRajKImg from './images/User/DinoyRajK.png';
import Header from '../layouts/header-footer/Header';

const Dashboarddonor1: React.FC = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotificationClick = () => {
    alert('Bạn có 3 thông báo mới'); // hoặc điều hướng trang thông báo
  };

  const handleProfileClick = () => {
    navigate('/account'); // chuyển tới trang tài khoản
  };

  return (
    <div>
      <Header />

      {/* Profile Container */}
      <div className="container">
        <div className="profile-card">
          {/* Left Section */}
          <div className="information">
            <div className="left-section">
              <img className="profile-img" src={dinoyRajKImg} alt="User" />
              <div className="name-role-edit">
                <h2>Dinoy Raj K</h2>
                <div className="right-actions">
                  <span className="user-role-badge">Người dùng</span>
                  <button className="edit-btn" onClick={() => navigate("/edit")} >Edit Profile</button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <h3>About</h3>
              <table>
                <tbody>
                  <tr><td>Full Name</td><td>Dinoy Raj K</td></tr>
                  <tr><td>Email</td><td>dinoykraj@gmail.com</td></tr>
                  <tr><td>District</td><td>Kozhikode</td></tr>
                  <tr><td>Phone Number</td><td>7306185390</td></tr>
                  <tr><td>Pincode</td><td>673014</td></tr>
                  <tr><td>Age</td><td>21</td></tr>
                  <tr><td>Blood Group</td><td>O+ve</td></tr>
                  <tr><td>Address</td><td>Karuvally Reenugeetham House...</td></tr>
                  <tr><td>Last Donation Date</td><td>11-10-2021</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Right Section */}
          <div className="right-section">
            {/* Donation History */}
            <div className="donation-history">
              <h4>Donation History</h4>
              <table>
                <thead>
                  <tr><th>Date</th><th>Blood Units</th></tr>
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
            <div className="calendar">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboarddonor1;
