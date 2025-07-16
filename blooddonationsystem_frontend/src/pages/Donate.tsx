import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";
import "./components/Donate.css"; // File CSS giao diện

interface Schedule {
  id: number;
  scheduleDate: string;
}

interface Slot {
  id: number;
  label: string;
}

const Donate = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    note: "",
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Lấy danh sách schedule
  useEffect(() => {
    fetch("/api/schedules")
      .then(res => res.json())
      .then(data => setSchedules(data))
      .catch(err => console.error("Lỗi lấy lịch:", err));
  }, []);

  // Lấy slot theo schedule đã chọn
  useEffect(() => {
    if (selectedScheduleId) {
      fetch(`/api/slot?scheduleId=${selectedScheduleId}`)
        .then(res => res.json())
        .then(data => setSlots(data))
        .catch(err => console.error("Lỗi lấy slot:", err));
    }
  }, [selectedScheduleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedScheduleId || !selectedSlotId) {
      setMessage("❌ Vui lòng chọn ngày và khung giờ hiến máu.");
      return;
    }

    try {
      const res = await fetch("/api/registers/createRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          note: formData.note,
          scheduleId: selectedScheduleId,
          slotId: selectedSlotId,
        }),
      });

      if (res.ok) {
        setMessage("✅ Đăng ký hiến máu thành công!");
      } else {
        const text = await res.text();
        console.error("Lỗi:", text);
        setMessage("❌ Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setMessage("❌ Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  return (
    <>
      <Header />
      <div className="donate-container">
        <h2>Đăng ký hiến máu</h2>
        <form className="donate-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Chọn ngày hiến máu</label>
            <select
              value={selectedScheduleId ?? ""}
              onChange={e => setSelectedScheduleId(Number(e.target.value))}
              required
            >
              <option value="">-- Chọn ngày --</option>
              {schedules.map(s => (
                <option key={s.id} value={s.id}>
                  {s.scheduleDate}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chọn khung giờ</label>
            <select
              value={selectedSlotId ?? ""}
              onChange={e => setSelectedSlotId(Number(e.target.value))}
              required
            >
              <option value="">-- Chọn giờ --</option>
              {slots.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="note"
              rows={3}
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">Đăng ký</button>
        </form>

        {message && <div className="response-message">{message}</div>}
      </div>
      <Footer />
    </>
  );
};

export default Donate;
