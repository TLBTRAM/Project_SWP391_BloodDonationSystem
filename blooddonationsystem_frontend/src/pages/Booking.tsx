
import React, { useEffect, useState } from "react";
import "./components/Booking.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { addDays, startOfWeek, format as formatDate, isSameDay, isBefore, addWeeks, subWeeks } from "date-fns";
registerLocale("vi", vi);

interface Schedule {
  id: number;
  scheduleDate: string;
  status: string;
  userId: number;
}
interface Slot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  delete: boolean;
}

const Booking = () => {
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Booking component mounted ✅");

    // Lấy thông tin user
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      console.log("Token slot:", token);
      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data;
        setUserInfo({
          fullName: user.fullName || "",
          dob: user.dob || "",
          gender: user.gender || "",
          phone: user.phone || "",
          email: user.email || ""
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    };

    // Lấy danh sách schedule với trạng thái OPEN
    const fetchSchedules = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8080/api/schedules?status=OPEN", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ API trả lỗi:", res.status, res.statusText);
          const errText = await res.text();
          console.error("📥 Nội dung lỗi:", errText);
          return;
        }

        const data = await res.json();
        setAvailableSchedules(data);
      } catch (err) {
        console.error("💥 Lỗi fetch schedules:", err);
      }
    };

    fetchUserInfo();
    fetchSchedules();
  }, []);

  // Thay đổi: khi chọn ngày trên DatePicker, tự động chọn scheduleId tương ứng
  useEffect(() => {
    if (selectedDate && availableSchedules.length > 0) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const found = availableSchedules.find(sch => sch.scheduleDate.startsWith(dateStr));
      setSelectedScheduleId(found ? found.id : null);
      setSelectedSlotId(null);
    }
  }, [selectedDate, availableSchedules]);

  // Fetch slot mỗi khi selectedScheduleId thay đổi
  useEffect(() => {
    if (!selectedScheduleId) {
      setAvailableSlots([]);
      return;
    }
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/slot/getSlot", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Lỗi lấy slot");
        const data = await res.json();
        setAvailableSlots(data);
      } catch (err) {
        setAvailableSlots([]);
        console.error("Lỗi fetch slot:", err);
      }
    };
    fetchSlots();
  }, [selectedScheduleId]);


  const handleScheduleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedScheduleId(id);
    setSelectedSlotId(null);
  };

  // Gửi đăng ký khám
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlotId) {
      alert("Vui lòng chọn ngày và giờ khám.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const date = selectedDate.toISOString().split("T")[0];
      const response = await fetch("http://localhost:8080/api/registers/donationRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          slotId: selectedSlotId,
          note,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Gửi thất bại");
        alert("Có lỗi khi đăng ký. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi gửi:", error);
    }
  };

  // Khi chọn ngày, chỉ cho phép chọn slot nếu đã chọn ngày hợp lệ
  const slotsForSelectedDate = selectedScheduleId ? availableSlots : [];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Hàm lấy mảng 7 ngày của tuần hiện tại
  function getWeekDates(startDate: Date) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(startDate, i);
      return {
        iso: d.toISOString().split("T")[0],
        day: d.getDay() === 0 ? 6 : d.getDay() - 1, // 0: CN -> 6
        dayNum: d.getDate(),
        monthShort: d.toLocaleString("vi-VN", { month: "short" }),
        dateObj: d
      };
    });
  }

  const weekDates = getWeekDates(weekStart);

  return (
    <>
      <Header />
      <div className="booking-container">
        <h2 id="register-title">Đăng ký lịch hiến máu</h2>
        {submitted ? (
          <div className="success-message">
            ✅ Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ để xác nhận lịch khám.
            <div style={{marginTop: 24, textAlign: 'center'}}>
              <button
                style={{
                  background: '#b22b2b', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8
                }}
                onClick={() => navigate('/user')}
              >
                Trở về trang cá nhân
              </button>
            </div>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input className="input-text" type="text" value={userInfo.fullName} disabled />
            </div>

            <div className="form-group">
              <label>Chọn ngày khám</label>
              <div className="week-row">
                <button type="button" className="week-arrow" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>&lt;</button>
                {weekDates.map(dateObj => {
                  const sch = availableSchedules.find(s => s.scheduleDate.startsWith(dateObj.iso));
                  const isPast = isBefore(dateObj.dateObj, new Date(new Date().toDateString()));
                  const isClosed = sch && sch.status === "CLOSED";
                  const isOpen = sch && sch.status === "OPEN" && !isPast;
                  let dayClass = "day-btn";
                  if (isPast) dayClass += " past";
                  else if (isClosed) dayClass += " closed";
                  else if (isOpen) dayClass += " open";
                  if (selectedDate && isSameDay(dateObj.dateObj, selectedDate)) dayClass += " selected";
                  return (
                    <button
                      type="button"
                      key={dateObj.iso}
                      className={dayClass}
                      disabled={!isOpen}
                      onClick={() => {
                        setSelectedDate(dateObj.dateObj);
                        setSelectedScheduleId(sch ? sch.id : null);
                        setSelectedSlotId(null);
                      }}
                    >
                      <div>{weekDays[dateObj.day]}</div>
                      <div style={{ fontWeight: 600 }}>{dateObj.dayNum}</div>
                      <div style={{ fontSize: 12 }}>{dateObj.monthShort}</div>
                    </button>
                  );
                })}
                <button type="button" className="week-arrow" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>&gt;</button>
              </div>
            </div>

            <div className="form-group">
              <label>Chọn khung giờ</label>
              <div className="slot-row">
                {selectedScheduleId && availableSlots.length > 0 ? (
                  availableSlots.map(slot => (
                    <button
                      type="button"
                      key={slot.id}
                      className={`slot-btn${selectedSlotId === slot.id ? " selected" : ""}`}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      {slot.label}
                    </button>
                  ))
                ) : (
                  <span style={{ color: '#888', fontSize: 14 }}>Chọn ngày để xem khung giờ</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú thêm (nếu có)</label>
              <textarea
                className="input-text"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Có tiền sử dị ứng, bệnh nền..."
              />
            </div>

            <button type="submit" className="submit-btn">Đăng ký khám</button>
            <Link to="/user" className="back">Quay trở lại</Link>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Booking;
