import React, { useState, useEffect } from "react";
import "./components/MedicalStaff.css";
import docImg from "../pages/images/User/doctor.png";
import Calendar from "./Calendar";

const MedicalStaff = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [view, setView] = useState<
    | "medicalDashboard"
    | "scheduleManagement"
    | "screening"
    | "donationSchedule"
    | "sendToStorage"
    | "requestBlood"
  >("medicalDashboard");

  useEffect(() => {
    const fakeAppointments = [
      { date: "2025-06-26", time: "09:00", donor: "Nguyễn Võ Sỹ Khim" },
      { date: "2025-06-26", time: "14:30", donor: "Tester" },
      { date: "2025-06-26", time: "10:15", donor: "Nguyễn Võ Sỹ Khim" },
    ];
    setAppointments(fakeAppointments);
  }, []);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const filteredAppointments = appointments.filter(
    (a) => a.date === formatDate(selectedDate)
  );

  return (
    <div className="medical-app">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li className={view === "medicalDashboard" ? "active" : ""}>
            <button
              className="menu-item"
              onClick={() => setView("medicalDashboard")}
            >
              Thông tin nhân viên
            </button>
          </li>
          <li className={view === "scheduleManagement" ? "active" : ""}>
            <button
              className="menu-item"
              onClick={() => setView("scheduleManagement")}
            >
              Quản lý lịch khám
            </button>
          </li>
          <li className={view === "screening" ? "active" : ""}>
            <button className="menu-item" onClick={() => setView("screening")}>
              Khám sàng lọc
            </button>
          </li>
          <li className={view === "donationSchedule" ? "active" : ""}>
            <button
              className="menu-item"
              onClick={() => setView("donationSchedule")}
            >
              Lịch hiến máu
            </button>
          </li>
          <li className={view === "sendToStorage" ? "active" : ""}>
            <button
              className="menu-item"
              onClick={() => setView("sendToStorage")}
            >
              Gửi máu cho kho máu
            </button>
          </li>
          <li className={view === "requestBlood" ? "active" : ""}>
            <button
              className="menu-item"
              onClick={() => setView("requestBlood")}
            >
              Tạo yêu cầu nhận máu
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {view === "medicalDashboard" && (

          <div className="staff-dashboard">
            <div className="staff-profile">
              <img className="staff-avatar" src={docImg} alt="Medical Staff" />
              <div>
                <div className="name-role">
                  <h2>Grace Wilson</h2>
                  <span className="role-tag">Nhân viên y tế</span>
                </div>
                <p>Email: hoclambacsi@gmail.com</p>
                <p>Phone: 0912 345 678</p>
                <p>Company: FPT Medicare</p>
              </div>
              <button className="edit-button">Chỉnh sửa hồ sơ</button>
            </div>

            <div className="staff-content">
              <div className="appointment-list">
                <div className="appointment-header">
                  <h3>
                    Lịch khám - {selectedDate.toLocaleDateString("vi-VN")}
                  </h3>
                  <input
                    type="date"
                    value={formatDate(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                </div>
                {filteredAppointments.length > 0 ? (
                  <ul>
                    {filteredAppointments.map((item, idx) => (
                      <li key={idx}>
                        {item.time} - {item.donor}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có lịch hẹn nào.</p>
                )}
              </div>

              <div className="calendar">
                <h3>Hôm nay</h3>
                <Calendar />
              </div>
            </div>
          </div>

        )}

        {view === "scheduleManagement" && (
          <p>📥 Lịch khám sàn lọc (đang phát triển)</p>
        )}
        {view === "screening" && (
          <p>🔬 Giao diện Khám sàng lọc (đang phát triển)</p>
        )}
        {view === "donationSchedule" && (
          <p>🩸 Giao diện Lịch hiến máu (đang phát triển)</p>
        )}
        {view === "sendToStorage" && (
          <p>🚚 Giao diện Gửi máu cho kho máu (đang phát triển)</p>
        )}
        {view === "requestBlood" && (
          <p>📥 Giao diện Tạo yêu cầu nhận máu (đang phát triển)</p>
        )}
      </div>
    </div>
  );
};

export default MedicalStaff;
