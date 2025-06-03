import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Link } from 'react-router-dom';

import "./components/Register.css";
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Tính tuổi
  useEffect(() => {
    if (!birthDate) {
      setAge('');
      setErrors(prev => ({ ...prev, birthDate: '' }));
      return;
    }

    const today = new Date();
    if (birthDate > today) {
      setAge('');
      setErrors(prev => ({ ...prev, birthDate: 'Ngày sinh không được lớn hơn hiện tại.' }));
      return;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setErrors(prev => ({ ...prev, birthDate: '' }));
    setAge(calculatedAge.toString());
  }, [birthDate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'Vui lòng nhập Họ.';
    if (!lastName.trim()) newErrors.lastName = 'Vui lòng nhập Tên.';
    if (!birthDate) newErrors.birthDate = 'Vui lòng chọn ngày sinh.';
    if (!gender) newErrors.gender = 'Vui lòng chọn giới tính.';
    if (phone.length !== 10) newErrors.phone = 'Số điện thoại phải đủ 10 chữ số.';
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ.';
    if (!address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ.';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Đăng kí thành công!');
      // Gửi dữ liệu hoặc xử lý tiếp theo
    }
  };

  return (
    <>
      <Header />
      <section className="form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 id="register-title">Đăng kí</h2>

          <div className="form-row-group">
            <label className="form-label">Họ và Tên</label>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Họ"
                  className="input-text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Tên"
                  className="input-text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
              </div>
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
              {errors.birthDate && <div className="error-text">{errors.birthDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Tuổi</label>
              <input type="number" className="input-text" value={age} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select className="input-text" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Nam/Nữ</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.gender && <div className="error-text">{errors.gender}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="input-text"
              value={phone}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, '');
                if (input.length <= 10) setPhone(input);
              }}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                const isNumber = e.key >= '0' && e.key <= '9';
                if (!isNumber && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Nhập số điện thoại (10 số)"
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row-group">
            <label className="form-label">Địa chỉ</label>
            <div className="form-row address-age-gender-row">
              <div className="form-group address-group">
                <textarea
                  className="input-text"
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
            {errors.address && <div className="error-text">{errors.address}</div>}
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">Đăng kí</button>
            <Link to="/login" className="login-text">Bạn đã có tài khoản ?</Link>
          </div>

        </form>
      </section>

      <Footer />
    </>
  );
};

export default RegisterForm;