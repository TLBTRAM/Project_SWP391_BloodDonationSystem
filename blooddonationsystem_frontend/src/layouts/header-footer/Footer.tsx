// Footer.tsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="logo">🩸</div>
            <h4>Liên hệ</h4>
            <p>Trung tâm hiến máu</p>
            <p>Địa chỉ: Lô E2a-7, Đường D1 Khu Công nghệ cao, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh</p>
            <p>Email: blooddonationsystem_K1819@hospital.com.vn</p>
            <p>Số điện thoại: (+84) 987654321</p>
          </div>
          <div className="footer-right">
            <h4>Khác</h4>
            <p><a href="#">Trang chủ</a></p>
            <p><a href="#info">Tin tức</a></p>
            <p><a href="#aboutus">Về chúng tôi</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Điều khoản & Điều kiện &nbsp; | &nbsp; Chính sách Bảo mật</p>
          <div className="social-icons">    
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
            <a href="mailto:blooddonationsystemk1819@hospital.com.vn"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </footer>
  );
};

export default Footer;