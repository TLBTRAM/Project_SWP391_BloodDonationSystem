import React, { useState, forwardRef } from "react";
import "./BloodRequest.css";
import ReactDatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

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

interface WholeBloodRequest {
  id: number;
  blood_type: "A" | "B" | "AB" | "O";
  rh_type: "POSITIVE" | "NEGATIVE";
  hospital_name: string;
  medical_condition: string;
  request_date: string; // dạng YYYY-MM-DD
  required_volume: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "READY"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";
  patient_id: number;
  requester_id: number;
}

const WholeBloodRequestList: React.FC = () => {
  const [requests, setRequests] = useState<WholeBloodRequest[]>([
    {
      id: 1,
      blood_type: "O",
      rh_type: "POSITIVE",
      hospital_name: "BV Chợ Rẫy",
      medical_condition: "Xuất huyết tiêu hóa",
      request_date: "2025-07-17",
      required_volume: 500,
      status: "PENDING",
      patient_id: 101,
      requester_id: 201,
    },
    {
      id: 2,
      blood_type: "A",
      rh_type: "NEGATIVE",
      hospital_name: "BV 115",
      medical_condition: "Phẫu thuật tim",
      request_date: "2025-07-16",
      required_volume: 350,
      status: "PENDING",
      patient_id: 102,
      requester_id: 202,
    },
  ]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const handleAction = (id: number, newStatus: "APPROVED" | "REJECTED") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    console.log(`Updated request ${id} to ${newStatus}`);
  };

  const statusToVietnamese = (status: WholeBloodRequest["status"]) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ duyệt";
      case "APPROVED":
        return "Đã phê duyệt";
      case "READY":
        return "Sẵn sàng";
      case "REJECTED":
        return "Bị từ chối";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredRequests = requests.filter((req) => {
    const matchesKeyword = req.hospital_name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    const matchesStatus = filterStatus === "" || req.status === filterStatus;

    const matchesDate =
      !filterDate ||
      req.request_date === filterDate.toISOString().split("T")[0]; // so sánh yyyy-MM-dd

    return matchesKeyword && matchesStatus && matchesDate;
  });

  return (
    <div className="blood-request-container">
      <h2>Yêu cầu máu toàn phần</h2>

      {/* Bộ lọc */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh viện"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">-- Trạng thái --</option>
          <option value="PENDING">Đang chờ duyệt</option>
          <option value="APPROVED">Đã phê duyệt</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>
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
      </div>

      <table className="blood-request-table">
        <thead>
          <tr>
            <th>Bệnh viện</th>
            <th>Tình trạng bệnh</th>
            <th>Nhóm máu</th>
            <th>Ngày yêu cầu</th>
            <th>Thể tích (mL)</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.hospital_name}</td>
                <td>{req.medical_condition}</td>
                <td>
                  {`${req.blood_type}${req.rh_type === "POSITIVE" ? "+" : "-"}`}
                </td>
                <td>{formatDate(req.request_date)}</td>
                <td>{req.required_volume}</td>
                <td className={`request-status-${req.status.toLowerCase()}`}>
                  {statusToVietnamese(req.status)}
                </td>
                <td>
                  {req.status === "PENDING" ? (
                    <>
                      <button
                        className="btn-approve-manager"
                        onClick={() => handleAction(req.id, "APPROVED")}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className="btn-reject-manager"
                        onClick={() => handleAction(req.id, "REJECTED")}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className="request-action-processed">Đã xử lý</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Không có yêu cầu phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WholeBloodRequestList;
