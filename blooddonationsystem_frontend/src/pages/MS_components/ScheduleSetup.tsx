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
  const [scheduledData, setScheduledData] = useState<
    Record<string, { name: string; area: string; times: string[] }>
  >({});
  const [formData, setFormData] = useState({
    name: "",
    area: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const existingData = scheduledData[formattedDate];

    if (existingData) {
      setSlots(
        defaultTimeSlots.map((slot) => ({
          timeRange: slot.timeRange,
          isSelected: existingData.times.includes(slot.timeRange),
        }))
      );
      setFormData({
        name: existingData.name,
        area: existingData.area,
      });
      setIsEditing(true);
    } else {
      setSlots(
        defaultTimeSlots.map((slot) => ({ ...slot, isSelected: false }))
      );
      setFormData({ name: "", area: "" });
      setIsEditing(false);
    }
  }, [selectedDate]);

  const toggleSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, isSelected: !slot.isSelected } : slot
      )
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const { name, area } = formData;

    if (!name.trim() || !area.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và chọn khu vực phụ trách.");
      return;
    }

    const selectedTimeRanges = slots
      .filter((slot) => slot.isSelected)
      .map((slot) => slot.timeRange);

    if (selectedTimeRanges.length === 0) {
      alert("Vui lòng chọn ít nhất một khung giờ làm việc.");
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    setScheduledData((prev) => ({
      ...prev,
      [formattedDate]: {
        name: name.trim(),
        area: area.trim(),
        times: selectedTimeRanges,
      },
    }));

    alert(
      isEditing
        ? "Lịch làm việc đã được cập nhật!"
        : "Đăng ký lịch làm việc thành công!"
    );
  };

  return (
    <div className="schedule-setup-wrapper">
      <h2 className="section-title">Thiết lập lịch làm việc cá nhân</h2>

      <div className="form-section">
        <label className="form-label">Họ và tên nhân viên *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="text-input"
          placeholder="Nhập họ và tên"
        />

        <label className="form-label">Khu vực phụ trách *</label>
        <select
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          className="text-input"
        >
          <option value="">-- Chọn khu vực --</option>
          <option value="Phòng khám sàng lọc">Phòng khám sàng lọc</option>
          <option value="Phòng hiến máu">Phòng hiến máu</option>
        </select>
      </div>

      <div className="form-section">
        <label className="form-label">Ngày làm việc:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          locale={vi}
          minDate={new Date()}
          className="date-picker"
          calendarClassName="custom-datepicker"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          popperPlacement="left"
          placeholderText="dd/mm/yyyy"
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
        {isEditing && (
          <p className="warning-text">
            ⚠️ Ngày này đã có lịch. Bạn đang chỉnh sửa lại.
          </p>
        )}
      </div>

      <div className="form-section">
        <label className="form-label">Khung giờ làm việc:</label>
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

      <div style={{ textAlign: "center" }}>
        <button className="save-btn" onClick={handleSave}>
          {isEditing ? "Cập nhật lịch làm việc" : "Lưu lịch làm việc"}
        </button>
      </div>

      <div className="schedule-preview">
        <h3>Lịch đã đăng ký</h3>
        {Object.keys(scheduledData).length === 0 ? (
          <p>Chưa có lịch nào.</p>
        ) : (
          Object.entries(scheduledData).map(([date, data]) => (
            <div key={date} className="schedule-entry">
              <strong>{format(new Date(date), "dd/MM/yyyy")}:</strong>
              <ul>
                <li>
                  <strong>👨‍⚕️ Nhân viên:</strong> {data.name}
                </li>
                <li>
                  <strong>📍 Khu vực:</strong> {data.area}
                </li>
                <li>
                  <strong>🕒 Khung giờ:</strong> {data.times.join(", ")}
                </li>
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleSetup;
