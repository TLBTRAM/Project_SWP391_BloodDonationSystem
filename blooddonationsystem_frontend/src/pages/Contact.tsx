import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-wrapper">
      <div className="contact-hero">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình hiến máu</p>
      </div>

      <div className="contact-container">
        {/* Thông tin liên hệ */}
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <ul>
            <li><strong>🏢 Địa chỉ:</strong> 123 Đường Hiến Máu, P.Bình Thạnh, TP.HCM</li>
            <li><strong>📞 Điện thoại:</strong> (028) 1234 5678</li>
            <li><strong>✉️ Email:</strong> lienhe@hienmau.vn</li>
            <li><strong>🕑 Giờ làm việc:</strong> Thứ 2 - Thứ 6, 8:00 - 17:00</li>
          </ul>
        </div>

        {/* Bản đồ */}
        <div className="contact-map">
          <h2>Vị trí của chúng tôi</h2>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.377958674352!2d106.70042431533485!3d10.776897362180554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b6a8f91ef%3A0x1f9a7d8305a5cb13!2zMTIzIMSQ4bqhaSDEkMOsbmggSGnhu4FuIE3DoWksIELDrG5oIFRow6BuaCwgVGjDoG5oIHBo4buRIFTDom0gSG9jaGltLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1611111111111!5m2!1sen!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Biểu mẫu liên hệ */}
      <div className="contact-form-section">
        <h2>Gửi tin nhắn cho chúng tôi</h2>
        <form className="contact-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" placeholder="Nhập họ tên của bạn" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Nhập email của bạn" />
          </div>
          <div className="form-group">
            <label>Chủ đề</label>
            <input type="text" placeholder="Tiêu đề tin nhắn" />
          </div>
          <div className="form-group">
            <label>Nội dung</label>
            <textarea rows={5} placeholder="Viết nội dung tin nhắn..."></textarea>
          </div>
          <button type="button" className="btn-submit">Gửi tin nhắn</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
