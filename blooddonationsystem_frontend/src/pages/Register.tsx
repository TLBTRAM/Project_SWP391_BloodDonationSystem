import React from 'react';
import "./components/Register.css";

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const RegisterForm: React.FC = () => {
  return (
    <>
      <Header />
      <section className="form-container">
        <h2 className="form-title">Đăng kí</h2> {/* Moved inside here */}

        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row-group">
            <label className="form-label">Họ và Tên</label>
            <div className="form-row">
              <input type="text" placeholder="Họ" className="input-text" />
              <input type="text" placeholder="Tên" className="input-text" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" placeholder="xxxxxxxxxx" className="input-text" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" placeholder="member@gmail.com" className="input-text" />
          </div>

          <div className="form-row-group">
            <label className="form-label">Địa chỉ</label>
            <div className="form-row address-age-gender-row">
              <div className="form-group address-group">
                <textarea className="input-text" rows={4} placeholder="Type Here"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Tuổi</label>
                <input type="number" className="input-text small" />
              </div>
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select className="input-text small" defaultValue="">
                  <option disabled value="">
                    Nam/Nữ
                  </option>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">
              Tôi đảm bảo những thông tin tôi đưa là đúng sự thật
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Đăng kí <i className="fas fa-check"></i>
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default RegisterForm;
