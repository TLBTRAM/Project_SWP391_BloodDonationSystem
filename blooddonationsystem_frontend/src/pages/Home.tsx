import React, { useEffect } from 'react';

import './components/Home.css';
import bannerImg from './images/Banner/Banner.png';

import aaravImg from './images/User/Aarav.png';
import dinoyRajKImg from './images/User/DinoyRajK.png';
import rohanImg from './images/User/Rohan.png';

import calendarImg from './images/procedure/Calendar.png';
import healthCheckImg from './images/procedure/Health_check.png';
import donationImg from './images/procedure/Donation.png';
import afterDonationImg from './images/procedure/after_donation.png';

import bloodTypeImg from './images/BloodType/BloodType.png';

function Home() {
  useEffect(() => {
    const loginBtn = document.getElementById('loginBtn');
    const testBtn = document.getElementById('testBtn');
    const newsletterSubmit = document.getElementById('newsletterSubmit');

    loginBtn?.addEventListener('click', () => {
      alert('Redirecting to login page...');
    });

    testBtn?.addEventListener('click', () => {
      alert('Redirecting to registration form...');
    });

    newsletterSubmit?.addEventListener('click', () => {
      const emailInput = document.getElementById('newsletterEmail') as HTMLInputElement;
      const email = emailInput?.value;
      if (!email.trim()) {
        alert('Please enter your email.');
      } else {
        alert(`Subscribed successfully with email: ${email}`);
      }
    });

    // Cleanup để tránh memory leaks
    return () => {
      loginBtn?.removeEventListener('click', () => { });
      testBtn?.removeEventListener('click', () => { });
      newsletterSubmit?.removeEventListener('click', () => { });
    };
  }, []);

  return (
    <div>
      <header className="header">
        <div className="logo">🩸</div>
        <nav className="nav-links">
          <a href="#">Trang chủ</a>
          <a href="#">Liên hệ</a>
          <a href="#">Ngân hàng máu</a>
          <a href="#">Đăng kí ngay</a>
        </nav>
        <button className="btn-login" id="loginBtn">Đăng nhập</button>
      </header>

      <br />
      <div className="hero">
        <div className="hero-content">
          <h1>Hiến máu vì<br />cộng đồng</h1>
          <button className="btn" id="testBtn">Khám sàng lọc</button>
        </div>
        <img src={bannerImg} alt="Donate Blood" />
      </div>

      <section className="section">
        <div className="mission">
          <h2>Trách nhiệm của chúng tôi</h2>
          <p>Chúng tôi cam kết xây dựng một cầu nối vững chắc giữa người hiến máu và những người đang cần máu gấp...</p>
          <p>Sứ mệnh của chúng tôi là tạo ra một nền tảng minh bạch, thuận tiện và an toàn...</p>
          <p>Cùng với cộng đồng và các chuyên gia y tế, chúng tôi nỗ lực xây dựng một xã hội nhân ái...</p>
        </div>

        <h2>Blog</h2>
        <div className="blog">
          {[
            { name: 'Aarav', image: aaravImg },
            { name: 'Dinoy Raj K', image: dinoyRajKImg },
            { name: 'Rohan', image: rohanImg },
          ].map((person, index) => (
            <div className="card" key={index}>
              <img src={person.image} alt={person.name} />
              <h4>{person.name}</h4>
              <p>Mình là một người chưa biết gì về hoạt động hiến máu cả</p>
            </div>
          ))}
        </div>
        <h2>Quy trình</h2>
        <div className="process-steps">
          {[
            { img: calendarImg, label: 'Đăng ký tư vấn' },
            { img: healthCheckImg, label: 'Kiểm tra sức khỏe' },
            { img: donationImg, label: 'Hiến máu' },
            { img: afterDonationImg, label: 'Theo dõi sức khỏe' },
          ].map((step, index) => (
            <div className="process-item" key={index}>
              <div className="icon-circle">
                <img src={step.img} alt={step.label} />
              </div>
              <p>{step.label}</p>
            </div>
          ))}
        </div>

        <br />
        <h2>Nhóm máu</h2>
        <div className="blood-table-container">
          <img src={bloodTypeImg} alt="Blood Types" />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="logo">🩸</div>
            <h4>Liên hệ</h4>
            <p>Địa chỉ: Lô E2a-7, Đường D1 Khu Công nghệ cao...</p>
            <p>Email: blooddonationsystemk1819@hospital.com.vn</p>
            <p>Số điện thoại: 0938787570</p>
          </div>
          <div className="footer-right">
            <h4>Khác</h4>
            <p><a href="#">Trang chủ</a></p>
            <p><a href="#">Tin tức</a></p>
            <p><a href="#">Về chúng tôi</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Terms & Conditions &nbsp; | &nbsp; Privacy Policy</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
