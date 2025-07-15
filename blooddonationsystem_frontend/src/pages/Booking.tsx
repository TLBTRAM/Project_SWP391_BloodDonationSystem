import React, { useEffect, useState } from "react";
import "./components/Booking.css";
import { Link } from "react-router-dom";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";
import axios from "axios";

interface Schedule {
  id: number;
  scheduleDate: string;
  status: string;
  userId: number;
}

interface Slot {
  id: number;
  label: string;
}

const Booking = () => {
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    console.log("Booking component mounted ✅");

    // Lấy thông tin user
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      console.log("Token slot:", token);
      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data;
        setUserInfo({
          fullName: user.fullName || "",
          dob: user.dob || "",
          gender: user.gender || "",
          phone: user.phone || "",
          email: user.email || ""
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    // Lấy danh sách schedule với trạng thái OPEN
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8080/api/schedules?status=OPEN", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ API trả lỗi:", res.status, res.statusText);
          const errText = await res.text();
          console.error("📥 Nội dung lỗi:", errText);
          return;
        }

        const data = await res.json();
        setAvailableSchedules(data);
      } catch (err) {
        console.error("💥 Lỗi fetch schedules:", err);
      }
    };

    fetchUserInfo();
    fetchSchedules();
  }, []);

  // Khi user chọn lịch khám (schedule), lấy list slot chung (do backend chưa có lọc theo scheduleId)
  const handleScheduleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedScheduleId(id);
    setSelectedSlotId(null);

    try {
      const token = localStorage.getItem("token");

      // Gọi API lấy slot chung
      const res = await fetch("http://localhost:8080/api/slot/getSlot", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi lấy slot");

      const data = await res.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error("Lỗi fetch slot:", err);
    }
  };

  // Gửi đăng ký khám
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedScheduleId || !selectedSlotId) {
      alert("Vui lòng chọn ngày và giờ khám.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/registers/createRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scheduleId: selectedScheduleId,
          slotId: selectedSlotId,
          note,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Gửi thất bại");
        alert("Có lỗi khi đăng ký. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi gửi:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="booking-container">
        <h2 id="register-title">Đăng ký khám sàng lọc</h2>

        {submitted ? (
          <div className="success-message">
            ✅ Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ để xác nhận lịch khám.
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input className="input-text" type="text" value={userInfo.fullName} disabled />
            </div>

            <div className="form-group">
              <label>Chọn ngày khám</label>
              <select value={selectedScheduleId ?? ""} onChange={handleScheduleChange} required>
                <option value="">-- Chọn ngày --</option>
                {availableSchedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {new Date(schedule.scheduleDate).toLocaleDateString("vi-VN")}
                  </option>
                ))}
              </select>
              {availableSchedules.length === 0 && (
                <p style={{ color: "red" }}>❌ Không tìm thấy lịch khám phù hợp.</p>
              )}
            </div>

            <div className="form-group">
              <label>Chọn khung giờ</label>
              <select
                className="input-text"
                value={selectedSlotId ?? ""}
                onChange={e => setSelectedSlotId(parseInt(e.target.value))}
                required
              >
                <option value="">-- Chọn giờ --</option>
                {availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ghi chú thêm (nếu có)</label>
              <textarea
                className="input-text"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Có tiền sử dị ứng, bệnh nền..."
              />
            </div>

            <button type="submit" className="submit-btn">Đăng ký khám</button>
            <Link to="/user" className="back">Quay trở lại</Link>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Booking;
