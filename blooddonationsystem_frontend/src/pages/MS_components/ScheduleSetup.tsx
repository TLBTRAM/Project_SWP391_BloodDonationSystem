import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "./ScheduleSetup.css";
import axios from "axios";

const ScheduleSetup: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [registeredDates, setRegisteredDates] = useState<string[]>([]);

  const handleSave = async () => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const token = localStorage.getItem("token");

    try {
      const baseURL = "http://localhost:8080";

      // 1. Tạo schedule (ngày làm việc)
      const scheduleRes = await axios.post(
        `${baseURL}/api/schedules`,
        { scheduleDate: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const scheduleId = scheduleRes.data.id;

      // 2. Đăng ký medical staff cho toàn bộ slot của ngày đó
      await axios.post(
        `${baseURL}/api/slot/register`,
        { scheduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRegisteredDates(prev => [...prev, formattedDate]);
      alert("Đăng ký lịch làm việc thành công!");
    } catch (error: any) {
      console.error("Lỗi tạo lịch:", error.response?.data || error.message);
      alert("Đã xảy ra lỗi khi tạo lịch. Vui lòng thử lại.");
    }
  };

  return (
    <div className="schedule-setup-wrapper">
      <h2 className="section-title">Thiết lập lịch làm việc cá nhân</h2>

      <div className="form-section">
        <label className="form-label">Chọn ngày làm việc:</label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          locale={vi}
          minDate={new Date()}
          className="date-picker"
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        ✅ Lưu lịch làm việc
      </button>

      <div className="schedule-preview">
        <h3>Lịch đã đăng ký</h3>
        {registeredDates.length === 0 ? (
          <p>Chưa có lịch nào.</p>
        ) : (
          <ul>
            {registeredDates.map((date, i) => (
              <li key={i}>{format(new Date(date), "dd/MM/yyyy")}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScheduleSetup;
