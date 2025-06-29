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
  started?: boolean;
  symptom?: string;
};

const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <button className="custom-date-input" onClick={onClick} ref={ref}>
    {value || "Lọc theo ngày"}
  </button>
));

const ScheduleManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [selectedAppointmentIndex, setSelectedAppointmentIndex] = useState<number | null>(null);

  useEffect(() => {
    const sampleData: Appointment[] = [
      { date: "2025-06-27", time: "08:00", donor: "Nguyễn Văn A", status: "Chờ khám" },
      { date: "2025-06-27", time: "09:30", donor: "Trần Thị B", status: "Đã khám" },
      { date: "2025-06-28", time: "10:00", donor: "Lê Văn C", status: "Chờ khám" },
    ];
    setAppointments(sampleData);
  }, []);

  const updateStatus = (index: number, newStatus: string) => {
    const updated = [...appointments];
    updated[index].status = newStatus;
    updated[index].started = newStatus === "Đang khám";
    setAppointments(updated);
  };

  const startScreening = (index: number) => {
    updateStatus(index, "Đang khám");
    setSelectedAppointmentIndex(index);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchName = appt.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || appt.date === format(filterDate, "yyyy-MM-dd");
    return matchName && matchDate;
  });

  return (
    <div className="schedule-container">
      <h2>Quản lý lịch khám</h2>

      <div className="form-section">
        <ReactDatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          dateFormat="EEEE, dd/MM/yyyy"
          locale="vi"
          placeholderText="Lọc theo ngày"
          calendarClassName="custom-datepicker"
          customInput={<CustomDateInput />}
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
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
              <div className="appointment-info">
                <div className="appointment-left">
                  <span>{format(new Date(appt.date), "dd/MM/yyyy")} - {appt.time}</span>
                  <span>{appt.donor}</span>
                </div>
                <div className="appointment-right">
                  <span className={`status-label status-${appt.status.replace(/\s/g, "").toLowerCase()}`}>
                    {appt.status}
                  </span>
                  <div className="detail-box">
                    <button>Chi tiết</button>
                  </div>
                  {appt.status === "Chờ khám" && (
                    <button className="start-btn" onClick={() => startScreening(idx)}>
                      Bắt đầu khám
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {selectedAppointmentIndex !== null && (
        <div className="modal-overlay">
          <div className="screening-detail">
            <button
              className="screening-close-btn"
              onClick={() => setSelectedAppointmentIndex(null)}
            >
              ×
            </button>

            <h3>Khám sàng lọc</h3>
            <p><strong>Người hiến:</strong> {appointments[selectedAppointmentIndex].donor}</p>
            <p><strong>Thời gian:</strong> {appointments[selectedAppointmentIndex].date} - {appointments[selectedAppointmentIndex].time}</p>

            <textarea
              placeholder="Nhập triệu chứng..."
              value={appointments[selectedAppointmentIndex].symptom || ""}
              onChange={(e) => {
                const updated = [...appointments];
                updated[selectedAppointmentIndex].symptom = e.target.value;
                setAppointments(updated);
              }}
            />

            <input type="text" placeholder="Mạch (lần/phút)" className="screening-input" />
            <input type="text" placeholder="Huyết áp (mmHg)" className="screening-input" />
            <input type="text" placeholder="Cân nặng (kg)" className="screening-input" />

            <div className="screening-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  updateStatus(selectedAppointmentIndex, "Đã khám");
                  setSelectedAppointmentIndex(null);
                }}
              >
                Đủ điều kiện hiến máu
              </button>
              <button
                className="deny-btn"
                onClick={() => {
                  updateStatus(selectedAppointmentIndex, "Không đủ điều kiện");
                  setSelectedAppointmentIndex(null);
                }}
              >
                Không đủ điều kiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
