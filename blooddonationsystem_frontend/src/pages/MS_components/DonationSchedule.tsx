import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import "./DonationSchedule.css";

registerLocale("vi", vi);

const BLOOD_TYPES = ["A", "B", "AB", "O"];
const RH_TYPES = ["POSITIVE", "NEGATIVE"];
const DONATION_STATUS = {
  PENDING: "Chờ hiến máu",
  COMPLETED: "Đã hiến"
};

const DonationSchedule = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/registers/approved", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mapped = res.data.map((item: any) => {
          let bloodType = item.slot?.bloodType || "O";
          let rhType = "POSITIVE";
          if (bloodType.endsWith("-")) {
            bloodType = bloodType.replace("-", "");
            rhType = "NEGATIVE";
          } else if (bloodType.endsWith("+")) {
            bloodType = bloodType.replace("+", "");
            rhType = "POSITIVE";
          }
          if (!BLOOD_TYPES.includes(bloodType)) bloodType = "O";
          return {
            name: item.fullName || "(Không rõ tên)",
            bloodType,
            rhType,
            date: item.registerDate,
            status: "PENDING", // PENDING hoặc COMPLETED
            selectedBloodType: bloodType,
            selectedRhType: rhType,
            totalVolume: ""
          };
        });
        setDonations(mapped);
      } catch (err) {
        setError("Không thể tải dữ liệu lịch hiến máu.");
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const confirmDonation = (index: number) => {
    // TODO: Gán API xác nhận đã hiến máu tại đây
    const updated = [...donations];
    updated[index].status = "COMPLETED";
    setDonations(updated);
  };

  const handleBloodTypeChange = (index: number, value: string) => {
    const updated = [...donations];
    updated[index].selectedBloodType = value;
    setDonations(updated);
  };

  const handleRhTypeChange = (index: number, value: string) => {
    const updated = [...donations];
    updated[index].selectedRhType = value;
    setDonations(updated);
  };

  const handleVolumeChange = (index: number, value: string) => {
    const updated = [...donations];
    updated[index].totalVolume = value.replace(/[^0-9]/g, "");
    setDonations(updated);
  };

  // Lọc theo ngày
  const filteredDonations = filterDate
    ? donations.filter((item) => {
        const itemDate = item.date ? format(new Date(item.date), "yyyy-MM-dd") : "";
        const filterDateStr = format(filterDate, "yyyy-MM-dd");
        return itemDate === filterDateStr;
      })
    : donations;

  return (
    <div className="donation-schedule-container">
      <h2 className="donation-schedule-title">🩸 Lịch hiến máu</h2>
      <div className="donation-filter-row">
        <ReactDatePicker
          selected={filterDate}
          onChange={setFilterDate}
          isClearable
          dateFormat="EEEE, dd/MM/yyyy"
          locale="vi"
          placeholderText="Lọc theo ngày"
          calendarClassName="custom-datepicker"
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          popperPlacement="bottom"
        />
      </div>
      {loading ? (
        <div className="donation-schedule-loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="donation-schedule-error">{error}</div>
      ) : (
        <ul className="donation-schedule-list">
          {filteredDonations.length === 0 ? (
            <li className="donation-schedule-empty">Không có lịch hiến máu nào đã được duyệt.</li>
          ) : (
            filteredDonations.map((item, i) => (
              <li key={i} className="donation-schedule-card">
                <div className="donation-schedule-info">
                  <span className="donor-name">{item.name}</span>
                  <div className="donation-schedule-fields">
                    <div className="donation-field-group">
                      <label className="donation-label">Nhóm máu</label>
                      <select
                        className="donation-select"
                        value={item.selectedBloodType}
                        onChange={e => handleBloodTypeChange(i, e.target.value)}
                      >
                        {BLOOD_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="donation-field-group">
                      <label className="donation-label">Rh</label>
                      <select
                        className="donation-select"
                        value={item.selectedRhType}
                        onChange={e => handleRhTypeChange(i, e.target.value)}
                      >
                        {RH_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="donation-field-group">
                      <label className="donation-label">Thể tích (ml)</label>
                      <input
                        className="donation-input"
                        type="text"
                        value={item.totalVolume}
                        onChange={e => handleVolumeChange(i, e.target.value)}
                        placeholder="Nhập số ml"
                      />
                    </div>
                    <span className="donation-date">Ngày: <b>{item.date}</b></span>
                  </div>
                </div>
                <div className="donation-schedule-actions">
                  {/* Badge trạng thái luôn hiển thị */}
                  <span className={`donation-status ${item.status === "COMPLETED" ? "donated" : "pending"}`}>{DONATION_STATUS[item.status as keyof typeof DONATION_STATUS]}</span>
                  {/* Ô xác nhận chỉ hiển thị khi trạng thái là PENDING */}
                  {item.status === "PENDING" && (
                    <div className="donation-confirm-box">
                      <button className="donation-btn confirm" onClick={() => confirmDonation(i)}>
                        Xác nhận đã hiến máu
                      </button>
                      {/* TODO: Gán API xác nhận vào đây */}
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default DonationSchedule;
