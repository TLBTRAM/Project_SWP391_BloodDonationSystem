import React, { useState } from "react";
import "./components/Booking.css";

import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

interface BookingFormData {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  note: string;
}

const Booking = () => {
  // Giả định các thông tin lấy từ tài khoản đăng nhập
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "Nguyễn Văn A",
    dob: "1995-06-01",
    gender: "Nam",
    phone: "0901234567",
    email: "vana@example.com",
    date: "",
    time: "",
    note: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Gửi dữ liệu về server
    console.log("Dữ liệu khám sàng lọc:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <div className="booking-container">
        <h2 id="register-title">Đăng ký khám sàng lọc</h2>

        {submitted ? (
          <div className="success-message">
            ✅ Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ để xác nhận lịch
            khám.
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                className="input-text"
                type="text"
                name="fullName"
                value={formData.fullName}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                className="input-text"
                type="date"
                name="dob"
                value={formData.dob}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <input
                className="input-text"
                type="text"
                name="gender"
                value={formData.gender}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                className="input-text"
                type="text"
                name="phone"
                value={formData.phone}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="input-text"
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Chọn ngày khám</label>
              <input
                className="input-text"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Chọn khung giờ</label>
              <select
                className="input-text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn giờ --</option>
                <option value="07:30 - 08:30">07:30 - 08:30</option>
                <option value="08:30 - 09:30">08:30 - 09:30</option>
                <option value="09:30 - 10:30">09:30 - 10:30</option>
                <option value="13:30 - 14:30">13:30 - 14:30</option>
                <option value="14:30 - 15:30">14:30 - 15:30</option>
                <option value="15:30 - 16:30">15:30 - 16:30</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ghi chú thêm (nếu có)</label>
              <textarea
                className="input-text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                placeholder="Ví dụ: Có tiền sử dị ứng, bệnh nền..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Đăng ký khám
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Booking;