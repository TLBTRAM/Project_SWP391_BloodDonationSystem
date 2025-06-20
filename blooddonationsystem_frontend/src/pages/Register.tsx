import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

import "./components/Register.css";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!birthDate) {
      setAge("");
      setErrors((prev) => ({ ...prev, birthDate: "" }));
      return;
    }

    const today = new Date();
    if (birthDate > today) {
      setAge("");
      setErrors((prev) => ({
        ...prev,
        birthDate: "Ngày sinh không được lớn hơn hiện tại.",
      }));
      return;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setErrors((prev) => ({ ...prev, birthDate: "" }));
    setAge(calculatedAge.toString());
  }, [birthDate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập Họ và Tên.";
    if (!birthDate) newErrors.birthDate = "Vui lòng chọn ngày sinh.";
    if (!gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (phone.length !== 10)
      newErrors.phone = "Số điện thoại phải đủ 10 chữ số.";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ.";
    if (!username.trim()) newErrors.username = "Vui lòng nhập tên người dùng.";
    if (!password || password.length < 6)
      newErrors.password = "Mật khẩu phải từ 6 ký tự.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = {
      fullName,
      birthDate: birthDate?.toISOString().split("T")[0],
      gender,
      phone,
      email,
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
      } else {
        const errorData = await response.json();
        alert(
          "Đăng ký thất bại: " + (errorData.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Header />
      <section className="form-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 id="register-title">Đăng kí</h2>

          <div className="form-group">
            <label className="form-label">Họ và Tên</label>
            <input
              type="text"
              className="input-text"
              placeholder="Nhập họ và tên đầy đủ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && (
              <div className="error-text">{errors.fullName}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group date-picker-group">
              <label className="form-label">Ngày sinh</label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={birthDate}
                  onChange={(date: Date | null) => setBirthDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="input-text date-input"
                  calendarClassName="custom-datepicker"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  popperPlacement="left"
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                      "/",
                    ];
                    const isNumber = e.key >= "0" && e.key <= "9";
                    if (!isNumber && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {errors.birthDate && (
                <div className="error-text">{errors.birthDate}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Tuổi</label>
              <input
                type="number"
                className="input-text"
                value={age}
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <select
              className="input-text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
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
                const input = e.target.value.replace(/\D/g, "");
                if (input.length <= 10) setPhone(input);
              }}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ];
                const isNumber = e.key >= "0" && e.key <= "9";
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
              placeholder="Nhập email"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              className="input-text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
            />
            {errors.username && (
              <div className="error-text">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="input-text"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">
              Đăng kí
            </button>
            <Link to="/login" className="login-text">
              Bạn đã có tài khoản ?
            </Link>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default Register;
