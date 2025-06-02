import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

import "./components/Register.css";
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const RegisterForm: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  // Tính tuổi mỗi khi birthDate thay đổi
  useEffect(() => {
    if (!birthDate) {
      setAge('');
      setError('');
      return;
    }

    const today = new Date();
    if (birthDate > today) {
      setAge('');
      setError('Ngày sinh không được lớn hơn ngày hiện tại.');
      return;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setError('');
    setAge(calculatedAge.toString());
  }, [birthDate]);

  return (
    <>
      <Header />
      <section className="form-container">
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <h2 id="register-title">Đăng kí</h2>

          <div className="form-row-group">
            <label className="form-label">Họ và Tên</label>
            <div className="form-row">
              <input type="text" placeholder="Họ" className="input-text" />
              <input type="text" placeholder="Tên" className="input-text" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <DatePicker
                selected={birthDate}
                onChange={(date: Date | null) => setBirthDate(date)}
                dateFormat="dd/MM/yyyy"
                className="input-text"
                placeholderText="dd/mm/yyyy"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onKeyDown={(e) => {
                  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', '/'];
                  const isNumber = e.key >= '0' && e.key <= '9';
                  if (!isNumber && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Tuổi</label>
              <input type="number" className="input-text" value={age} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select className="input-text" defaultValue="">
              <option disabled value="">Nam/Nữ</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="input-text" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="input-text" />
          </div>

          <div className="form-row-group">
            <label className="form-label">Địa chỉ</label>
            <div className="form-row address-age-gender-row">
              <div className="form-group address-group">
                <textarea className="input-text" rows={4}></textarea>
              </div>
            </div>
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
