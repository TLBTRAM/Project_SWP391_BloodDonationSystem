import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import "./components/Register.css";
import registerBackground from "./images/Banner/Register_img.png";

import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

import pcVN from "pc-vn";

// Type declarations to fix TypeScript errors
type Province = { code: string; name: string };
type District = { code: string; name: string };
type Ward = { code: string; name: string };

registerLocale("vi", vi);

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [street, setStreet] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!password || password.length < 6)
      newErrors.password = "Mật khẩu phải từ 6 ký tự.";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const userData = {
      fullName,
      birthDate: birthDate?.toISOString().split("T")[0],
      gender,
      phone,
      email,
      password,
      address: {
        street,

        wardId: selectedWard,
        districtId: selectedDistrict,
        provinceId: selectedProvince,

      },
    };

    try {
      console.log("Thông tin gửi đi:", userData);
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(
          "Đăng ký thất bại: " + (errorData.message || "Lỗi không xác định")
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      {showSuccess && (
        <div className="success-toast">
          Đăng ký thành công! Đang chuyển đến trang đăng nhập...
        </div>
      )}
      <div
        className="register-bg"
        style={{
          backgroundImage: `url(${registerBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
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
                    locale="vi"
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
              {errors.gender && (
                <div className="error-text">{errors.gender}</div>
              )}
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

            <div className="form-row-2">
              <div className="form-group location-group">
                <label className="form-label">Tỉnh/Thành phố</label>
                <select
                  className="input-text"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict("");
                    setSelectedWard("");
                  }}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {pcVN.getProvinces().map((province: Province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group location-group">
                <label className="form-label">Quận/Huyện</label>
                <select
                  className="input-text"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedWard("");
                  }}
                  disabled={!selectedProvince}
                >
                  <option value="">Chọn quận/huyện</option>
                  {pcVN
                    .getDistrictsByProvinceCode(selectedProvince)
                    .map((district: District) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group location-group">
                <label className="form-label">Phường/Xã</label>
                <select
                  className="input-text"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  disabled={!selectedDistrict}
                >
                  <option value="">Chọn phường/xã</option>
                  {pcVN
                    .getWardsByDistrictCode(selectedDistrict)
                    .map((ward: Ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group location-group">
                <label className="form-label">Số nhà, tên đường</label>
                <input
                  type="text"
                  className="input-text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Nhập số nhà, tên đường"
                />
              </div>
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
            <div className="form-group">
              <label className="form-label">Xác nhận lại mật khẩu</label>
              <input
                type="password"
                className="input-text"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <div className="error-text">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || showSuccess}
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
              </button>
              <Link to="/login" className="login-text">
                Bạn đã có tài khoản ?
              </Link>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Register;
