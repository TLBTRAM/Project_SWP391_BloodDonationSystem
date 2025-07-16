import React, { useState, useEffect } from "react";
import "./components/MedicalStaff.css";
import avatarImg from './images/User/Avatar.png';
import Calendar from "./Calendar";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { Locale , format } from "date-fns";


import Header from "../layouts/header-footer/Header";
import ScheduleSetup from "./MS_components/ScheduleSetup";
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
    | "scheduleSetup"
    | "scheduleManagement"
    | "screening"
    | "donationSchedule"
    | "sendToStorage"
    | "requestBlood"
    | "collectBlood"
    | "collectHistory"
  >("medicalDashboard");

  const [staff, setStaff] = useState<any | null>(null); // ⬅️ thêm: state lưu thông tin nhân viên
  const [testResult, setTestResult] = useState({
    result: "",
    passed: true,
    bloodType: "A",
    rhType: "POSITIVE",
    bloodPressure: "",
    heartRate: ""
  });

  const [donationList, setDonationList] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [formLocked, setFormLocked] = useState(false);

  // Khi chọn user khác, nếu đã có kết quả thì khóa form
  useEffect(() => {
    setFormLocked(selectedDonation?.passed !== undefined);
  }, [selectedDonation]);

  useEffect(() => {
    const fakeAppointments = [
      { date: "2025-06-26", time: "09:00", donor: "Nguyễn Võ Sỹ Khim" },
      { date: "2025-06-26", time: "14:30", donor: "Tester" },
      { date: "2025-06-26", time: "10:15", donor: "Nguyễn Võ Sỹ Khim" },
    ];
    setAppointments(fakeAppointments);
  }, []);

  useEffect(() => {
    // ⬅️ thêm: gọi API lấy thông tin nhân viên
    const token = localStorage.getItem("token");
    console.log("FE token (staff):", token);

    if (token) {
      fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không lấy được thông tin nhân viên");
          return res.json();
        })
        .then((data) => {
          console.log("Staff info from BE:", data);
          setStaff(data);
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API /me:", error);
          alert("Không thể tải thông tin nhân viên. Vui lòng đăng nhập lại.");
        });
    }
  }, []);

  useEffect(() => {
    if (view === "donationSchedule") {
      const fetchDonations = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:8080/api/registers/approved", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error("Không thể tải danh sách lịch hiến máu");
          let data = await res.json();
          // Xóa trường passed khỏi từng item
          data = data.map((item: any) => {
            const { passed, ...rest } = item;
            return rest;
          });
          setDonationList(data);
          if (data.length > 0) setSelectedDonation(data[0]);
        } catch (err) {
          setDonationList([]);
          setSelectedDonation(null);
        }
      };
      fetchDonations();
    }
  }, [view]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const filteredAppointments = appointments.filter(
    (a) => a.date === formatDate(selectedDate)
  );

  // Helper để lấy nhóm máu và Rh từ item
  const getBloodTypeAndRh = (item: any) => {
    let bloodType = item.bloodType || (item.slot && item.slot.bloodType) || "O";
    let rhType = item.rhType || "POSITIVE";
    // Nếu bloodType có ký tự + hoặc - ở cuối, tách ra
    if (typeof bloodType === 'string') {
      if (bloodType.endsWith("-")) {
        bloodType = bloodType.replace("-", "");
        rhType = "NEGATIVE";
      } else if (bloodType.endsWith("+")) {
        bloodType = bloodType.replace("+", "");
        rhType = "POSITIVE";
      }
    }
    return { bloodType, rhType };
  };

  // Component hiển thị danh sách blood test đã hoàn thành
  const CollectBlood = () => {
    const [completedTests, setCompletedTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [volumeMap, setVolumeMap] = useState<{[id: number]: string}>({});
    const [collectingId, setCollectingId] = useState<number | null>(null);
    const [collectMsg, setCollectMsg] = useState<string>("");

    useEffect(() => {
      const fetchCompleted = async () => {
        setLoading(true);
        setError("");
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:8080/api/blood-test/completed", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error("Không thể tải danh sách xét nghiệm đã hoàn thành");
          const data = await res.json();
          setCompletedTests(data);
        } catch (err) {
          setError("Không thể tải dữ liệu");
          setCompletedTests([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCompleted();
    }, []);

    const handleVolumeChange = (id: number, value: string) => {
      setVolumeMap(prev => ({ ...prev, [id]: value.replace(/[^0-9]/g, "") }));
    };

    const handleCollect = async (testId: number, bloodType: string, rhType: string) => {
      const totalVolume = volumeMap[testId];
      if (!totalVolume || isNaN(Number(totalVolume)) || Number(totalVolume) <= 0) {
        setCollectMsg("Vui lòng nhập thể tích hợp lệ.");
        return;
      }
      setCollectingId(testId);
      setCollectMsg("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/blood/collect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ testId, bloodType, rhType, totalVolume: Number(totalVolume) })
        });
        if (!res.ok) throw new Error("Lấy máu thất bại!");
        setCollectMsg("Lấy máu thành công!");
        // Xóa khỏi danh sách sau khi lấy máu thành công
        setCompletedTests(list => list.filter(item => item.id !== testId));
        setVolumeMap(prev => { const copy = { ...prev }; delete copy[testId]; return copy; });
      } catch (err) {
        setCollectMsg("Lấy máu thất bại!");
      } finally {
        setCollectingId(null);
      }
    };

    return (
      <div style={{padding:32}}>
        <h2 style={{color:'#ED232B', marginBottom:24}}>Lấy máu</h2>
        {loading ? <div>Đang tải dữ liệu...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (
          <ul style={{listStyle:'none', padding:0}}>
            {completedTests.length === 0 ? (
              <li>Không có xét nghiệm nào đã hoàn thành.</li>
            ) : (
              completedTests.map((item, idx) => (
                <li key={item.id || idx} style={{marginBottom:16, border:'1px solid #e5e7eb', borderRadius:10, padding:16, background:'#fff'}}>
                  <div><b>Người hiến:</b> {item.customerName || '---'}</div>
                  <div><b>Ngày xét nghiệm:</b> {item.testDate || '---'}</div>
                  <div><b>Kết quả:</b> {item.result || '---'}</div>
                  <div><b>Nhóm máu:</b> {item.bloodType || '---'} {item.rhType || ''}</div>
                  <div style={{marginTop:8}}>
                    <label><b>Thể tích (ml):</b> </label>
                    <input
                      type="text"
                      value={volumeMap[item.id] || ""}
                      onChange={e => handleVolumeChange(item.id, e.target.value)}
                      style={{width:100, marginRight:12, padding:4, borderRadius:6, border:'1px solid #ccc'}}
                      placeholder="Nhập ml"
                    />
                    <button
                      style={{background:'#16a34a', color:'#fff', border:'none', borderRadius:6, padding:'6px 16px', fontWeight:600, cursor:'pointer'}}
                      onClick={() => handleCollect(item.id, item.bloodType, item.rhType)}
                      disabled={collectingId === item.id}
                    >
                      Hoàn thành
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
        {collectMsg && <div style={{marginTop:16, color: collectMsg.includes('thành công') ? '#16a34a' : '#dc2626', fontWeight:600}}>{collectMsg}</div>}
      </div>
    );
  };

  // Component hiển thị lịch sử lấy máu
  const CollectBloodHistory = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:8080/api/blood/collect/completed", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error("Không thể tải lịch sử lấy máu");
          const data = await res.json();
          setHistory(data);
        } catch (err) {
          setError("Không thể tải dữ liệu");
          setHistory([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }, []);

    return (
      <div style={{padding:32}}>
        <h2 style={{color:'#ED232B', marginBottom:24}}>Lịch sử lấy máu</h2>
        {loading ? <div>Đang tải dữ liệu...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (
          <ul style={{listStyle:'none', padding:0}}>
            {history.length === 0 ? (
              <li>Không có dữ liệu.</li>
            ) : (
              history.map((item, idx) => (
                <li key={item.id || idx} style={{marginBottom:16, border:'1px solid #e5e7eb', borderRadius:10, padding:16, background:'#fff'}}>
                  <div><b>Người hiến:</b> {item.customerName || '---'}</div>
                  <div><b>Ngày lấy máu:</b> {item.collectedDate || '---'}</div>
                  <div><b>Nhóm máu:</b> {item.bloodType || '---'} {item.rhType || ''}</div>
                  <div><b>Thể tích:</b> {item.totalVolume || '---'} ml</div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  };

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
            <li className={view === "scheduleSetup" ? "active" : ""}>
              <button
                className="menu-item"
                onClick={() => setView("scheduleSetup")}
              >
                Đăng kí lịch làm việc
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
                Khám sàng lọc
              </button>
            </li>
            <li className={view === "collectBlood" ? "active" : ""}>
              <button
                className="menu-item"
                onClick={() => setView("collectBlood")}
              >
                Lấy máu
              </button>
            </li>
            <li className={view === "collectHistory" ? "active" : ""}>
              <button
                className="menu-item"
                onClick={() => setView("collectHistory")}
              >
                Lịch sử lấy máu
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
                  src={avatarImg}
                  alt="Medical Staff"
                />
                <div>
                  <div className="name-role">
                    <h2>{staff?.fullName || "Tên nhân viên"}</h2> 
                    <span className="role-tag">Nhân viên y tế</span>
                  </div>
                  <p>Email: {staff?.email || "---"}</p> 
                  <p>Số điện thoại: {staff?.phone || "---"}</p> 
                  <p>Đơn vị: {staff?.address || "Trung tâm hiến máu"}</p> 
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
                      popperPlacement="bottom"
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


          {view === "scheduleSetup" && <ScheduleSetup />}
          {view === "scheduleManagement" && <ScheduleManagement />}
          {view === "donationSchedule" && (
            <div style={{display:'flex', gap:40, alignItems:'flex-start'}}>
              {/* Danh sách lịch hiến máu bên trái */}
              <div style={{flex:1, minWidth:280}}>
                <h2 style={{color:'#ED232B', marginBottom:24}}>Khám sàng lọc</h2>
                <ul style={{listStyle:'none', padding:0, margin:0}}>
                  {donationList.length === 0 ? (
                    <li>Không có lịch hiến máu nào đã được duyệt.</li>
                  ) : (
                    donationList.map((item, idx) => (
                      <li key={item.id || idx} style={{marginBottom:16}}>
                        <button
                          style={{
                            width:'100%',
                            textAlign:'left',
                            padding:'14px 18px',
                            borderRadius:10,
                            border: selectedDonation === item ? (item.passed === true ? '2px solid #16a34a' : item.passed === false ? '2px solid #dc2626' : '2px solid #ED232B') : '1.5px solid #e5e7eb',
                            background: selectedDonation === item ? '#fff0f3' : '#fff',
                            fontWeight:600,
                            color:'#222',
                            cursor:'pointer',
                            boxShadow:'0 2px 8px rgba(237,35,43,0.07)'
                          }}
                          onClick={() => setSelectedDonation(item)}
                        >
                          <div><b>{item.fullName || '---'}</b></div>
                          <div style={{fontSize:14, color:'#ED232B'}}>Ngày: {item.registerDate}</div>
                          {/* Badge điều kiện hiến máu */}
                          {item.passed === true && (
                            <div style={{marginTop:6, color:'#16a34a', fontWeight:600, fontSize:14}}>Đủ điều kiện hiến máu</div>
                          )}
                          {item.passed === false && (
                            <div style={{marginTop:6, color:'#dc2626', fontWeight:600, fontSize:14}}>Không đủ điều kiện hiến máu</div>
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              {/* Form nhập kết quả bên phải */}
              <div style={{flex:1.2, maxWidth:500, background:'#fff', borderRadius:16, boxShadow:'0 2px 12px 0 rgba(237,35,43,0.06)', padding:32, border: selectedDonation?.passed === true ? '2px solid #16a34a' : selectedDonation?.passed === false ? '2px solid #dc2626' : 'none'}}>
                <h3 style={{marginBottom:24}}>Nhập kết quả xét nghiệm</h3>
                {selectedDonation ? (
                  <form style={{display:'flex', flexDirection:'column', gap:16}} onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedDonation.id) {
                      setToastMsg("Không xác định được ID của lịch hiến máu.");
                      return;
                    }
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`http://localhost:8080/api/blood-test/${selectedDonation.id}/complete`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          donationRegisterId: selectedDonation.id,
                          result: testResult.result,
                          passed: testResult.passed,
                          bloodType: testResult.bloodType,
                          rhType: testResult.rhType,
                          bloodPressure: testResult.bloodPressure,
                          heartRate: testResult.heartRate
                        })
                      });
                      if (!res.ok) throw new Error("Lưu kết quả thất bại!");
                      const data = await res.json(); // BloodTestResponse
                      setToastMsg("Lưu kết quả thành công!");

                      // Cập nhật danh sách và loại bỏ đơn đã xử lý
                      setDonationList(list => list.filter(item => item.id !== selectedDonation.id));

                      // Ẩn đơn đã xử lý khỏi form
                      setTimeout(() => {
                        setSelectedDonation(null);
                      }, 500); // delay nhẹ để người dùng thấy toast thành công

                      setFormLocked(true);
                    } catch (err) {
                      setToastMsg("Lưu kết quả thất bại!");
                    }
                  }}>
                    <div style={{fontWeight:600, marginBottom:8}}>
                      <span>Người hiến: {selectedDonation.fullName || '---'}</span><br/>
                      <span>Ngày: {selectedDonation.registerDate}</span>
                      {/* Badge điều kiện hiến máu trong form */}
                      {selectedDonation?.passed === true && (
                        <div style={{marginTop:6, color:'#16a34a', fontWeight:600, fontSize:15}}>Đủ điều kiện hiến máu</div>
                      )}
                      {selectedDonation?.passed === false && (
                        <div style={{marginTop:6, color:'#dc2626', fontWeight:600, fontSize:15}}>Không đủ điều kiện hiến máu</div>
                      )}
                    </div>
                    <label>
                      Kết quả:
                      <input
                        type="text"
                        value={testResult.result}
                        onChange={e => setTestResult({...testResult, result: e.target.value})}
                        placeholder="Nhập kết quả xét nghiệm"
                        disabled={formLocked}
                      />
                    </label>
                    <label>
                      Đạt yêu cầu:
                      <select
                        value={testResult.passed ? "true" : "false"}
                        onChange={e => setTestResult({...testResult, passed: e.target.value === "true"})}
                        disabled={formLocked}
                      >
                        <option value="true">Đạt</option>
                        <option value="false">Không đạt</option>
                      </select>
                    </label>
                    <label>
                      Nhóm máu:
                      <select
                        value={testResult.bloodType}
                        onChange={e => setTestResult({...testResult, bloodType: e.target.value})}
                        disabled={formLocked}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </label>
                    <label>
                      Rh:
                      <select
                        value={testResult.rhType}
                        onChange={e => setTestResult({...testResult, rhType: e.target.value})}
                        disabled={formLocked}
                      >
                        <option value="POSITIVE">POSITIVE</option>
                        <option value="NEGATIVE">NEGATIVE</option>
                      </select>
                    </label>
                    <label>
                      Huyết áp:
                      <input
                        type="text"
                        value={testResult.bloodPressure}
                        onChange={e => setTestResult({...testResult, bloodPressure: e.target.value})}
                        placeholder="Nhập huyết áp"
                        disabled={formLocked}
                      />
                    </label>
                    <label>
                      Nhịp tim:
                      <input
                        type="text"
                        value={testResult.heartRate}
                        onChange={e => setTestResult({...testResult, heartRate: e.target.value})}
                        placeholder="Nhập nhịp tim"
                        disabled={formLocked}
                      />
                    </label>
                    <button type="submit" style={{marginTop:12, background:'#ED232B', color:'#fff', border:'none', borderRadius:8, padding:'10px 0', fontWeight:600, fontSize:16}} disabled={formLocked}>
                      Lưu kết quả
                    </button>
                    {toastMsg && (
                      <div style={{marginTop:8, color: toastMsg.includes('thành công') ? '#16a34a' : '#dc2626', fontWeight:600}}>{toastMsg}</div>
                    )}
                  </form>
                ) : (
                  <div>Chọn một lịch để nhập kết quả.</div>
                )}
              </div>
            </div>
          )}
          {view === "sendToStorage" && <SendToStorage />}
          {view === "requestBlood" && <RequestBlood />}
          {view === "collectBlood" && <CollectBlood />}
          {view === "collectHistory" && <CollectBloodHistory />}
        </div>
      </div>
    </>
  );
};

export default MedicalStaff;