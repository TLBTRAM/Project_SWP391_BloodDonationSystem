import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "./ScheduleSetup.css";
import axios from "axios";

const ScheduleSetup: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [openSchedules, setOpenSchedules] = useState<any[]>([]);
  const [registeredSchedules, setRegisteredSchedules] = useState<
    { accountScheduleId: number; scheduleDate: string }[]
  >([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string>("");

  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:8080";

  // Lấy danh sách schedule OPEN
  useEffect(() => {
    axios
      .get(`${baseURL}/api/schedules/open`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOpenSchedules(res.data))
      .catch(() => setOpenSchedules([]));
  }, [token]);

  // Lấy danh sách ngày đã đăng ký
  const fetchRegistered = () => {
    axios
      .get(`${baseURL}/api/schedules/medicalstaff-registered`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRegisteredSchedules(
          res.data.map((s: any) => ({
            accountScheduleId: s.accountScheduleId,
            scheduleDate: s.scheduleDate,
          }))
        );
      })
      .catch(() => setRegisteredSchedules([]));
  };
  useEffect(() => {
    fetchRegistered();
  }, [token]);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleSave = async () => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    // Tìm scheduleId theo ngày
    const schedule = openSchedules.find(
      (s) => s.scheduleDate === formattedDate
    );
    if (!schedule) {
      alert("Ngày này không có trong danh sách OPEN!");
      return;
    }
    try {
      await axios.post(
        `${baseURL}/api/schedules/register-work?scheduleId=${schedule.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToastMsg("Đăng ký lịch làm việc thành công!");
      fetchRegistered();
    } catch (error: any) {
      setToastMsg(
        "Đăng ký thất bại: " + (error.response?.data || error.message)
      );
    }
  };

  // Xóa lịch đã đăng ký (mở modal)
  const handleDelete = (accountScheduleId: number) => {
    setDeleteId(accountScheduleId);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${baseURL}/api/schedules/medicalstaff-registered/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRegistered();
      setDeleteId(null);
      setToastMsg("Xóa lịch làm việc thành công!");
    } catch (error: any) {
      setDeleteId(null);
      setToastMsg("Xóa lịch thất bại!");
    }
  };

  // Chỉ cho phép chọn ngày có trong openSchedules
  const isDayOpen = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    return openSchedules.some((s) => s.scheduleDate === d);
  };

  // Thêm: custom class cho ngày CLOSED
  const dayClassName = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    if (!openSchedules.some((s) => s.scheduleDate === d)) {
      return "closed-day"; // class cho ngày CLOSED
    }
    return "";
  };

  return (
    <div className="schedule-setup-wrapper">
      <h2 className="section-title">Thiết lập lịch làm việc cá nhân</h2>

      <div className="form-section">
        <label className="form-label">Chọn ngày làm việc:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          locale={vi}
          minDate={new Date()}
          className="date-picker"
          filterDate={isDayOpen}
          dayClassName={dayClassName}
          popperPlacement="bottom"
          popperContainer={({ children }) => (
            <div id="fixed-datepicker-container">{children}</div>
          )}
        />
      </div>

      {/* Vị trí cố định popup sẽ được render vào đây */}
      <div
        id="fixed-datepicker-container"
        className="fixed-datepicker-wrapper"
      />

      <button className="save-btn" onClick={handleSave}>
        Lưu lịch làm việc
      </button>

      <div className="schedule-preview">
        <h3>Lịch đã đăng ký</h3>
        {registeredSchedules.length === 0 ? (
          <p>Chưa có lịch nào.</p>
        ) : (
          <div className="registered-schedule-list">
            {registeredSchedules
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.scheduleDate).getTime() -
                  new Date(b.scheduleDate).getTime()
              )
              .map((item) => (
                <div
                  className="registered-schedule-item"
                  key={item.accountScheduleId}
                >
                  <span>
                    {format(new Date(item.scheduleDate), "dd/MM/yyyy")}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.accountScheduleId)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa lịch làm việc</h3>
            <p>
              Bạn có chắc chắn muốn{" "}
              <span style={{ color: "#FF204E", fontWeight: "bold" }}>xóa</span>{" "}
              lịch này không?
            </p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="modal-confirm">
                Xóa
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="modal-cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast thông báo */}
      {toastMsg && <div className="admin-toast-success">{toastMsg}</div>}
    </div>
  );
};

export default ScheduleSetup;
