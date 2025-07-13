import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "./ScheduleSetup.css";

type Slot = {
  timeRange: string;
  isSelected: boolean;
};

const defaultTimeSlots: Slot[] = [
  { timeRange: "08:00 - 09:00", isSelected: false },
  { timeRange: "09:00 - 10:00", isSelected: false },
  { timeRange: "10:00 - 11:00", isSelected: false },
  { timeRange: "13:00 - 14:00", isSelected: false },
  { timeRange: "14:00 - 15:00", isSelected: false },
  { timeRange: "15:00 - 16:00", isSelected: false },
];

const ScheduleSetup: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<Slot[]>([...defaultTimeSlots]);
  const [scheduledData, setScheduledData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Reset slot selection when changing date
    setSlots(defaultTimeSlots.map(slot => ({ ...slot, isSelected: false })));
  }, [selectedDate]);

  const toggleSlot = (index: number) => {
    setSlots(prev =>
      prev.map((slot, i) => (i === index ? { ...slot, isSelected: !slot.isSelected } : slot))
    );
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const selectedTimeRanges = slots
      .filter(slot => slot.isSelected)
      .map(slot => slot.timeRange);

    if (selectedTimeRanges.length === 0) {
      alert("Vui lòng chọn ít nhất một khung giờ làm việc.");
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    // Cập nhật lịch trong state (hoặc gọi API lưu xuống backend)
    setScheduledData(prev => ({
      ...prev,
      [formattedDate]: selectedTimeRanges,
    }));

    alert("Đăng ký lịch làm việc thành công!");
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

      <div className="form-section">
        <label className="form-label">Chọn khung giờ làm việc:</label>
        <div className="slot-grid">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              className={`slot-btn ${slot.isSelected ? "selected" : ""}`}
              onClick={() => toggleSlot(idx)}
            >
              {slot.timeRange}
            </button>
          ))}
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>
        ✅ Lưu lịch làm việc
      </button>

      <div className="schedule-preview">
        <h3>Lịch đã đăng ký</h3>
        {Object.keys(scheduledData).length === 0 ? (
          <p>Chưa có lịch nào.</p>
        ) : (
          Object.entries(scheduledData).map(([date, times]) => (
            <div key={date} className="schedule-entry">
              <strong>{format(new Date(date), "dd/MM/yyyy")}</strong>
              <ul>
                {times.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleSetup;
