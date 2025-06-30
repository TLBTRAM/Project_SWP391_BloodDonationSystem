import React, { useState, useEffect } from "react";
import "./components/MedicalStaff.css";
import docImg from "../pages/images/User/doctor.png";
import Calendar from "./Calendar";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { format } from "date-fns";
import type { Locale } from "date-fns";

import Header from "../layouts/header-footer/Header";
import ScheduleManagement from "./MS_components/ScheduleManagement";
import DonationSchedule from "./MS_components/DonationSchedule";
import SendToStorage from "./MS_components/SendToStorage";
import RequestBlood from "./MS_components/RequestBlood";

// Đăng ký locale tiếng Việt cho ReactDatePicker
registerLocale("vi", vi as unknown as Locale);

// ========== DASHBOARD ==========
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
    <>
      <Header />
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
                Lịch khám sàng lọc
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
                <img
                  className="staff-avatar"
                  src={docImg}
                  alt="Medical Staff"
                />
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
                      Lịch khám -{" "}
                      {format(selectedDate, "dd/MM/yyyy", {
                        locale: vi as unknown as Locale,
                      })}
                    </h3>
                    <ReactDatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => {
                        if (date) setSelectedDate(date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      locale="vi"
                      placeholderText="dd/mm/yyyy"
                      className="input-text date-input"
                      calendarClassName="custom-datepicker"
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      popperPlacement="right"
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

          {view === "scheduleManagement" && <ScheduleManagement />}
          {view === "donationSchedule" && <DonationSchedule />}
          {view === "sendToStorage" && <SendToStorage />}
          {view === "requestBlood" && <RequestBlood />}
        </div>
      </div>
    </>
  );
};

export default MedicalStaff;
