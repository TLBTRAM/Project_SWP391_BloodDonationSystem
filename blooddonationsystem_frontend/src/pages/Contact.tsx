import React from "react";
import "./components/Contact.css";

import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="contact-wrapper">
        <div className="contact-hero">
          <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình hiến máu</p>
        </div>

        <div className="contact-container">
          {/* Thông tin liên hệ */}
          <div className="contact-info">
            <h2>Thông tin liên hệ</h2>
            <ul>
              <li>
                <strong>🏢 Địa chỉ:</strong> 123 Đường Hiến Máu, TP.HCM
              </li>
              <li>
                <strong>📞 Điện thoại:</strong> (+84) 987654321
              </li>
              <li>
                <strong>✉️ Email:</strong> lienhe@hienmau.vn
              </li>
              <li>
                <strong>🕑 Giờ làm việc:</strong> Thứ 2 - CN, 8:00 - 17:00
              </li>
            </ul>

            <div className="contact-socials">
              <h3>Kết nối với chúng tôi</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  🌐 Facebook
                </a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer">
                  💬 Zalo
                </a>
                <a href="mailto:lienhe@hienmau.vn">📧 Email</a>
              </div>
            </div>
          </div>

          {/* Bản đồ */}
          {/* Bản đồ */}
          <div className="contact-map">
            <h2>Vị trí của chúng tôi</h2>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2329.7505583845664!2d106.79840064185572!3d10.875601034012236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sVNUHCM%20Student%20Cultural%20House!5e0!3m2!1sen!2s!4v1753165892087!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
