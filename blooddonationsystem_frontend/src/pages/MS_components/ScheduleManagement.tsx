import React, { useState, useEffect, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import "./ScheduleManagement.css";

registerLocale("vi", vi);

type Appointment = {
  date: string;
  time: string;
  donor: string;
  status: string;
};

// ✅ Custom input để hiển thị ngày theo định dạng "Thứ Năm, 26/06/2025"
const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <button className="custom-date-input" onClick={onClick} ref={ref}>
    {value || "Lọc theo ngày"}
  </button>
));

const ScheduleManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Cập nhật trạng thái
  const updateStatus = (index: number, newStatus: string) => {
    const updated = [...appointments];
    updated[index].status = newStatus;
    setAppointments(updated);
  };

  // Dữ liệu mẫu ban đầu
  useEffect(() => {
    const sampleData: Appointment[] = [
      {
        date: "2025-06-27",
        time: "08:00",
        donor: "Nguyễn Văn A",
        status: "Chờ khám",
      },
      {
        date: "2025-06-27",
        time: "09:30",
        donor: "Trần Thị B",
        status: "Đã khám",
      },
      {
        date: "2025-06-28",
        time: "10:00",
        donor: "Lê Văn C",
        status: "Chờ khám",
      },
    ];
    setAppointments(sampleData);
  }, []);

  // Lọc danh sách
  const filteredAppointments = appointments.filter((appt) => {
    const matchName = appt.donor
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDate =
      !filterDate || appt.date === format(filterDate, "yyyy-MM-dd");

    return matchName && matchDate;
  });

  return (
    <div className="schedule-container">
      <h2>Quản lý lịch khám</h2>

      <div className="form-section">
        <ReactDatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          placeholderText="Lọc theo ngày"
          dateFormat="EEEE, dd/MM/yyyy" // ⬅ định dạng đầy đủ với thứ
          locale="vi"
          isClearable
          customInput={<CustomDateInput />}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người hiến..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="appointment-list">
        {filteredAppointments.length === 0 ? (
          <li className="appointment-item">Không có lịch phù hợp.</li>
        ) : (
          filteredAppointments.map((appt, idx) => (
            <li key={idx} className="appointment-item">
              <span>
                {appt.date} - {appt.time} - {appt.donor}
              </span>
              <select
                value={appt.status}
                onChange={(e) => updateStatus(idx, e.target.value)}
                className={`status-select status-${appt.status
                  .replace(/\s/g, "")
                  .toLowerCase()}`}
              >
                <option value="Chờ khám">Chờ khám</option>
                <option value="Đã khám">Đã khám</option>
                <option value="Hủy khám">Hủy khám</option>
              </select>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ScheduleManagement;
