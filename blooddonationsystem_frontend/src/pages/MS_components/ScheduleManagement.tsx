import React, { useState, useEffect, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import "./ScheduleManagement.css";
import axios from "axios";
import avatarImg from "../images/User/Avatar.png";

registerLocale("vi", vi);

type Appointment = {
  date: string;
  time: string;
  donor: string;
  status: string;
  started?: boolean;
  symptom?: string;
  note?: string;
  avatar?: string;
  id?: string; // Added id for approval/reject
};

const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <button
    className="custom-date-input"
    onClick={onClick}
    ref={ref}
    style={{
      padding: "10px 14px",
      borderRadius: 8,
      border: "1px solid #d1d5db",
      background: "#fff",
      fontSize: 14,
      minWidth: 180,
      maxWidth: 180,
      width: 180,
      height: 42,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      transition: "none",
    }}
  >
    {value || "Lọc theo ngày"}
  </button>
));

const ScheduleManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");
  const [selectedAppointmentIndex, setSelectedAppointmentIndex] = useState<
    number | null
  >(null);
  // Thêm state cho popup xác nhận phê duyệt
  const [approveConfirmIdx, setApproveConfirmIdx] = useState<number | null>(
    null
  );
  // Thêm state cho popup xác nhận từ chối và lý do
  const [rejectConfirmIdx, setRejectConfirmIdx] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  // Đưa fetchRegisters ra ngoài useEffect để có thể gọi lại sau khi phê duyệt/từ chối
  const fetchRegisters = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/registers/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Mapping dữ liệu API sang Appointment[]
      const data = res.data;
      const mapped: Appointment[] = data.map((reg: any) => ({
        id: reg.id,
        date: reg.registerDate,
        time: reg.slot?.startTime ? reg.slot.startTime.substring(0, 5) : "",
        donor: reg.fullName || "(Không rõ tên)",
        status:
          reg.status === "PENDING"
            ? "Chờ khám"
            : reg.status === "APPROVED"
            ? "Đã phê duyệt"
            : reg.status === "REJECTED"
            ? "Từ chối"
            : "Khác",
        note: reg.note || "",
        avatar: avatarImg,
      }));
      
      setAppointments(mapped);
    } catch (err) {
      setAppointments([]);
    }
  };
  useEffect(() => {
    fetchRegisters();
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

  // Sửa lại handleApprove: chỉ thực hiện khi xác nhận
  const handleApprove = async (registerIdx: number) => {
    const token = localStorage.getItem("token");
    const regId = appointments[registerIdx].id;
    try {
      await axios.put(`http://localhost:8080/api/registers/${regId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Xóa khỏi danh sách appointments thay vì fetch lại toàn bộ
      setAppointments(prev => prev.filter((_, idx) => idx !== registerIdx));
      setApproveConfirmIdx(null); // Đóng popup nếu có
    } catch (err) {
      alert("Phê duyệt thất bại!");
    }
  };

  // Sửa lại handleReject: chỉ thực hiện khi xác nhận và có lý do
  const handleReject = async (registerIdx: number) => {
    const token = localStorage.getItem("token");
    const regId = appointments[registerIdx].id;
    try {
      await axios.post(`http://localhost:8080/api/registers/${regId}/reject`, { reason: rejectReason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Xóa khỏi danh sách appointments thay vì fetch lại toàn bộ
      setAppointments(prev => prev.filter((_, idx) => idx !== registerIdx));
      setRejectConfirmIdx(null); // Đóng popup nếu có
      setRejectReason("");
    } catch (err) {
      alert("Từ chối thất bại!");
    }
  };

  // Sửa lại filter: so sánh ngày bất kể định dạng, thêm filter theo trạng thái
  const filteredAppointments = appointments.filter((appt) => {
    const matchName = appt.donor
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    let matchDate = true;
    if (filterDate) {
      // Chuyển cả hai về yyyy-MM-dd để so sánh
      const apptDate = appt.date
        ? format(new Date(appt.date), "yyyy-MM-dd")
        : "";
      const filterDateStr = format(filterDate, "yyyy-MM-dd");
      matchDate = apptDate === filterDateStr;
    }
    let matchStatus = true;
    if (filterStatus !== "Tất cả") {
      matchStatus = appt.status === filterStatus;
    }
    return matchName && matchDate && matchStatus;
  });

  return (
    <div className="schedule-container">
      <h2>Quản lý lịch khám sàng lọc</h2>

      <div className="form-section">
        <div className="filter-row">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
              fontSize: 14,
              minWidth: 120,
              maxWidth: 160,
              marginBottom: 0,
            }}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chờ khám">Chờ khám</option>
            <option value="Đã phê duyệt">Đã phê duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 220, maxWidth: 300, marginBottom: 0 }}
          />
        </div>
        <ReactDatePicker
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          isClearable
          dateFormat="EEEE, dd/MM/yyyy"
          locale={vi}
          placeholderText="Lọc theo ngày"
          calendarClassName="custom-datepicker"
          customInput={<CustomDateInput />}
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          popperPlacement="bottom"
          popperContainer={({ children }) => (
            <div id="fixed-datepicker-container">{children}</div>
          )}
        />

        {/* Cố định vị trí popup của DatePicker này */}
        <div
          id="fixed-datepicker-container"
          className="fixed-datepicker-wrapper"
        />
      </div>

      <ul className="appointment-list">
        {filteredAppointments.length === 0 ? (
          <li className="appointment-item">Không có lịch phù hợp.</li>
        ) : (
          filteredAppointments.map((appt, idx) => (
            <li key={idx} className="card-container">
              <div
                className="user-info"
                style={{
                  background:
                    appt.status === "Chờ khám"
                      ? "#fffbe6"
                      : appt.status === "Đã phê duyệt"
                      ? "#e6fbe6"
                      : appt.status === "Từ chối"
                      ? "#ffeaea"
                      : "#fff",
                  borderRadius: "12px",
                  padding: "16px 28px 16px 20px",
                  minWidth: "340px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="user-avatar"
                  style={{ width: "56px", height: "56px", marginRight: "18px" }}
                >
                  <img
                    src={appt.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="user-details">
                  <div className="name">{appt.donor}</div>
                  <div
                    className="status-label-inline"
                    style={{
                      color:
                        appt.status === "Chờ khám"
                          ? "#b45309"
                          : appt.status === "Đã phê duyệt"
                          ? "#16a34a"
                          : appt.status === "Từ chối"
                          ? "#dc2626"
                          : "#333",
                      fontWeight: 600,
                      margin: "2px 0 4px 0",
                      fontSize: "15px",
                    }}
                  >
                    {appt.status}
                  </div>
                  <div className="reason">
                    Ghi chú: {appt.note || "(Không có)"}
                  </div>
                </div>
              </div>
              <div className="button-group">
                {appt.status === "Chờ khám" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => setApproveConfirmIdx(idx)}
                    >
                      Phê duyệt
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => setRejectConfirmIdx(idx)}
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
      {/* Popup xác nhận phê duyệt */}
      {approveConfirmIdx !== null && (
        <div className="modal-overlay">
          <div className="screening-detail">
            <button
              className="screening-close-btn"
              onClick={() => setApproveConfirmIdx(null)}
            >
              ×
            </button>
            <h3>Xác nhận phê duyệt</h3>
            <p>
              Bạn có chắc chắn muốn <b>phê duyệt</b> đơn đăng ký của{" "}
              <b>{appointments[approveConfirmIdx].donor}</b> vào lúc{" "}
              <b>
                {appointments[approveConfirmIdx].date} -{" "}
                {appointments[approveConfirmIdx].time}
              </b>
              ?
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 24,
                justifyContent: "center",
              }}
            >
              <button
                className="btn-approve"
                onClick={() => handleApprove(approveConfirmIdx!)}
              >
                Xác nhận
              </button>
              <button
                style={{
                  borderRadius: 8,
                  padding: "10px 18px",
                  background: "#fee2e2", // đỏ nhạt
                  border: "1.5px solid #fecaca", // viền đỏ nhạt
                  color: "#dc2626", // chữ đỏ
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#fecaca")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#fee2e2")
                }
                onClick={() => setApproveConfirmIdx(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup xác nhận từ chối với ô nhập lý do */}
      {rejectConfirmIdx !== null && (
        <div className="modal-overlay">
          <div className="screening-detail">
            <button
              className="screening-close-btn"
              onClick={() => {
                setRejectConfirmIdx(null);
                setRejectReason("");
              }}
            >
              ×
            </button>
            <h3>Xác nhận từ chối</h3>
            <p>
              Bạn có chắc chắn muốn <b>từ chối</b> đơn đăng ký của{" "}
              <b>{appointments[rejectConfirmIdx].donor}</b> vào lúc{" "}
              <b>
                {appointments[rejectConfirmIdx].date} -{" "}
                {appointments[rejectConfirmIdx].time}
              </b>
              ?
            </p>
            <textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{
                width: "100%",
                minHeight: 60,
                marginTop: 16,
                borderRadius: 8,
                border: "1.5px solid #d1d5db",
                padding: 10,
                fontSize: 15,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 24,
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  borderRadius: 8,
                  padding: "10px 18px",
                  background: "#ffcccc", // nền đỏ nhạt
                  border: "none",
                  color: "#b71c1c", // chữ đỏ đậm
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: rejectReason.trim() ? "pointer" : "not-allowed",
                  opacity: rejectReason.trim() ? 1 : 0.6,
                  transition: "background 0.2s",
                }}
                disabled={!rejectReason.trim()}
                onClick={() => handleReject(rejectConfirmIdx!)}
              >
                Xác nhận từ chối
              </button>
              <button
                style={{
                  borderRadius: 8,
                  padding: "10px 18px",
                  background: "#f5f5f5", // nền xám nhạt
                  border: "none",
                  color: "#616161", // chữ xám đậm
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => {
                  setRejectConfirmIdx(null);
                  setRejectReason("");
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

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
            <p>
              <strong>Người hiến:</strong>{" "}
              {appointments[selectedAppointmentIndex].donor}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {appointments[selectedAppointmentIndex].date} -{" "}
              {appointments[selectedAppointmentIndex].time}
            </p>

            <textarea
              placeholder="Nhập triệu chứng..."
              value={appointments[selectedAppointmentIndex].symptom || ""}
              onChange={(e) => {
                const updated = [...appointments];
                updated[selectedAppointmentIndex].symptom = e.target.value;
                setAppointments(updated);
              }}
            />

            <input
              type="text"
              placeholder="Mạch (lần/phút)"
              className="screening-input"
            />
            <input
              type="text"
              placeholder="Huyết áp (mmHg)"
              className="screening-input"
            />
            <input
              type="text"
              placeholder="Cân nặng (kg)"
              className="screening-input"
            />

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
