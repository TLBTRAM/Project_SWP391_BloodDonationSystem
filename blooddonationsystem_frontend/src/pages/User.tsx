import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './components/User.css';
import Header from '../layouts/header-footer/Header';
import avatarImg from './images/User/Avatar.png';
import calendarIcon from './images/User/calendar.png';
import notificationIcon from './images/User/notifications.png';
import blood_request_historyIcon from './images/User/blood_request_history.png';
import orderIcon from './images/User/order.png';
import pcVN from "pc-vn";

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  bloodGroup?: string;
  address?: string;
  lastDonationDate?: string;
  birthDate?: string;
}

interface DonationHistoryItem {
  id: number;
  donationDate: string;
  location: string;
  notes: string;
  volume: number;
  customer_id: number;
}

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  type: string;
  isRead: boolean;
}

interface BloodTestResult {
  result: string;
  testDate: string;
  note: string;
}

const User = () => {
  const calculateAge = (birthDateString: string): number => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [bloodTest, setBloodTest] = useState<BloodTestResult | null>(null);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>([]);
  const [showBloodRequestForm, setShowBloodRequestForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    patientAddress: { street: "", wardId: "", districtId: "", provinceId: "" },
    phone: "",
    gender: "MALE",
    bloodType: "A",
    rhType: "POSITIVE",
    requiredVolume: "",
    hospitalName: "",
    medicalCondition: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // Thêm các state cho combo box địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [showComponentRequestForm, setShowComponentRequestForm] = useState(false);

  const [componentForm, setComponentForm] = useState({
    fullName: "",
    gender: "MALE",
    dateOfBirth: "",
    phone: "",
    patientAddress: { street: "", wardId: "", districtId: "", provinceId: "" },
    bloodType: "A",
    rhType: "POSITIVE",
    hospitalName: "",
    medicalCondition: "",
    redCellQuantity: "",
    plasmaQuantity: "",
    plateletQuantity: ""
  });
  const [componentProvince, setComponentProvince] = useState("");
  const [componentDistrict, setComponentDistrict] = useState("");
  const [componentWard, setComponentWard] = useState("");
  const [componentLoading, setComponentLoading] = useState(false);
  const [componentSuccess, setComponentSuccess] = useState("");
  const [componentError, setComponentError] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const NOTI_TYPES = [
    { key: 'SYSTEM', label: 'Hệ thống' },
    { key: 'BLOOD_REQUEST', label: 'Yêu cầu máu' },
    { key: 'APPOINTMENT', label: 'Lịch hẹn' },
    { key: 'TEST_RESULT', label: 'Kết quả xét nghiệm' },
    { key: 'GENERAL', label: 'Chung' },
  ];
  const [tabIndex, setTabIndex] = useState(0);
  const activeNotiType = NOTI_TYPES[tabIndex].key;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "address-provinceId") {
      setSelectedProvince(value);
      setSelectedDistrict("");
      setSelectedWard("");
      setForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, provinceId: value, districtId: "", wardId: "" }
      }));
    } else if (name === "address-districtId") {
      setSelectedDistrict(value);
      setSelectedWard("");
      setForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, districtId: value, wardId: "" }
      }));
    } else if (name === "address-wardId") {
      setSelectedWard(value);
      setForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, wardId: value }
      }));
    } else if (name === "address-street") {
      setForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, street: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const body = {
        patientId: 0, // Nếu có thể lấy id bệnh nhân thì truyền, không thì để 0
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        patientAddress: {
          street: form.patientAddress.street,
          wardId: Number(form.patientAddress.wardId),
          districtId: Number(form.patientAddress.districtId),
          provinceId: Number(form.patientAddress.provinceId)
        },
        phone: form.phone,
        gender: form.gender,
        bloodType: form.bloodType,
        rhType: form.rhType,
        requiredVolume: Number(form.requiredVolume),
        hospitalName: form.hospitalName,
        medicalCondition: form.medicalCondition
      };
      const res = await fetch("http://localhost:8080/api/blood-requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setSuccessMsg("Gửi yêu cầu nhận máu thành công!");
        setForm({
          fullName: "",
          dateOfBirth: "",
          patientAddress: { street: "", wardId: "", districtId: "", provinceId: "" },
          phone: "",
          gender: "MALE",
          bloodType: "A",
          rhType: "POSITIVE",
          requiredVolume: "",
          hospitalName: "",
          medicalCondition: ""
        });
      } else {
        setErrorMsg("Gửi yêu cầu thất bại!");
      }
    } catch (err) {
      setErrorMsg("Lỗi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "address-provinceId") {
      setComponentProvince(value);
      setComponentDistrict("");
      setComponentWard("");
      setComponentForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, provinceId: value, districtId: "", wardId: "" }
      }));
    } else if (name === "address-districtId") {
      setComponentDistrict(value);
      setComponentWard("");
      setComponentForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, districtId: value, wardId: "" }
      }));
    } else if (name === "address-wardId") {
      setComponentWard(value);
      setComponentForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, wardId: value }
      }));
    } else if (name === "address-street") {
      setComponentForm((prev) => ({
        ...prev,
        patientAddress: { ...prev.patientAddress, street: value }
      }));
    } else {
      setComponentForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleComponentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setComponentLoading(true);
    setComponentSuccess("");
    setComponentError("");
    try {
      const token = localStorage.getItem("token");
      const body = {
        fullName: componentForm.fullName,
        gender: componentForm.gender,
        dateOfBirth: componentForm.dateOfBirth,
        phone: componentForm.phone,
        patientAddress: {
          street: componentForm.patientAddress.street,
          wardId: Number(componentForm.patientAddress.wardId),
          districtId: Number(componentForm.patientAddress.districtId),
          provinceId: Number(componentForm.patientAddress.provinceId)
        },
        bloodType: componentForm.bloodType,
        rhType: componentForm.rhType,
        hospitalName: componentForm.hospitalName,
        medicalCondition: componentForm.medicalCondition,
        redCellQuantity: Number(componentForm.redCellQuantity),
        plasmaQuantity: Number(componentForm.plasmaQuantity),
        plateletQuantity: Number(componentForm.plateletQuantity)
      };
      const res = await fetch("http://localhost:8080/api/blood-requests/component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setComponentSuccess("Gửi yêu cầu nhận máu thành phần thành công!");
        setComponentForm({
          fullName: "",
          gender: "MALE",
          dateOfBirth: "",
          phone: "",
          patientAddress: { street: "", wardId: "", districtId: "", provinceId: "" },
          bloodType: "A",
          rhType: "POSITIVE",
          hospitalName: "",
          medicalCondition: "",
          redCellQuantity: "",
          plasmaQuantity: "",
          plateletQuantity: ""
        });
        setComponentProvince("");
        setComponentDistrict("");
        setComponentWard("");
      } else {
        setComponentError("Gửi yêu cầu thất bại!");
      }
    } catch (err) {
      setComponentError("Lỗi gửi yêu cầu!");
    } finally {
      setComponentLoading(false);
    }
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userInfoRef.current && !userInfoRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // useEffect lấy profile user
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token user:", token);
    if (!token) return;
    fetch("http://localhost:8080/api/user/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không lấy được thông tin người dùng");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        alert("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/user/donation-history", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy lịch sử hiến máu");
        return res.json();
      })
      .then((data: DonationHistoryItem[]) => {
        setDonationHistory(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử hiến máu:", err);
      });
  }, []);

  // useEffect fetch notification & test result khi mở popup và user đã có id
  useEffect(() => {
    const fetchNotificationAndTest = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user?.id) return;
      try {
        const notiRes = await fetch(`http://localhost:8080/api/notifications/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (notiRes.ok) {
          const notiData = await notiRes.json();
          setNotifications(notiData);
        }
        const testRes = await fetch(`http://localhost:8080/api/medical-staff/test-results?customerId=${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (testRes.ok) {
          const testData = await testRes.json();
          const latestResult = testData[0];
          if (latestResult) {
            setBloodTest({
              result: latestResult.result === "PASSED" ? "✅ ĐẠT" : "❌ KHÔNG ĐẠT",
              testDate: new Date(latestResult.testDate).toLocaleDateString("vi-VN"),
              note: latestResult.note || "Không có ghi chú.",
            });
          }
        }
      } catch (err) {
        // Có thể log lỗi nếu cần
      }
    };
    if (showNotificationPopup && user?.id) fetchNotificationAndTest();
  }, [showNotificationPopup, user]);

  // Khi mở form, nếu có dữ liệu cũ thì set lại các combo box
  useEffect(() => {
    if (showBloodRequestForm) {
      setSelectedProvince(form.patientAddress.provinceId || "");
      setSelectedDistrict(form.patientAddress.districtId || "");
      setSelectedWard(form.patientAddress.wardId || "");
    }
    // eslint-disable-next-line
  }, [showBloodRequestForm]);

const notificationCount = notifications.filter(n => !n.isRead).length;
  // Thêm hàm đánh dấu tất cả thông báo là đã đọc

  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);
// Thêm hàm đánh dấu tất cả thông báo là đã đọc

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    for (const noti of notifications) {
      if (!noti.isRead) {
        try {
          await fetch(`http://localhost:8080/api/notifications/${noti.id}/read`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          // Có thể log lỗi nếu cần
        }
      }
    }
  };

  // Đếm số thông báo chưa đọc theo từng loại
  const unreadCountByType = NOTI_TYPES.map(typeObj =>
    notifications.filter(n => n.type === typeObj.key && !n.isRead).length
  );


  return (
    <div>
      <Header />

      <div className="user-dashboard">
        <div className="user-topbar"></div>

        <main className="dashboard-content">
          <div className="first-panel">
            <div className="user-card">
              <img src={avatarImg} alt="User" />
              <h2>{user?.fullName || "Tên người dùng"}</h2>
              <div className="user-actions">
                <span className="user-role">Người dùng</span>
                <button className="edit-profile-btn" onClick={() => navigate('/user-profile')}>
                  ✏️ Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>

            <div className="user-info">
              <table>
                <h3 className="info-title">Thông tin cá nhân</h3>
                <tbody>
                  <tr><td>👤 Họ tên:</td><td>{user?.fullName}</td></tr>
                  <tr><td>📧 Email:</td><td>{user?.email}</td></tr>
                  <tr><td>📱 Điện thoại:</td><td>{user?.phone}</td></tr>
                  <tr><td>🎂 Tuổi:</td><td>{user?.birthDate ? calculateAge(user.birthDate) : '---'}</td></tr>
                  <tr><td>🩸 Nhóm máu:</td><td>{user?.bloodGroup}</td></tr>
                  <tr><td>🏡 Địa chỉ:</td><td>{user?.address}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="second-panel">
            <div className="donation-history">
              <h4>Lịch sử hiến máu</h4>
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Lượng máu (ml)</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.length > 0 ? (
                    donationHistory
                      .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
                      .slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td>{new Date(item.donationDate).toLocaleDateString("vi-VN")}</td>
                          <td>{item.volume}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={2}>Không có lịch sử hiến máu.</td>
                    </tr>
                  )}
                  {donationHistory.length > 0 && (
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                      <td>Tổng cộng:</td>
                      <td>{donationHistory.reduce((sum, item) => sum + item.volume, 0)} ml</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {donationHistory.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    {'\u25C0'}
                  </button>
                  {Array.from({ length: Math.ceil(donationHistory.length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`pagination-btn${p === page ? ' active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === Math.ceil(donationHistory.length / PAGE_SIZE)}
                  >
                    {'\u25B6'}
                  </button>
                </div>
              )}
            </div>
            <div className="calendar-booking">
              <Calendar />
            </div>
          </div>

          <div className="third-panel">
            <div className="booking-item">
              <div className="booking-text">
                <h4>Thông báo</h4>
                <p>Nhấn vào đây để xem thông báo mới về xét nghiệm, kết quả khám sàng lọc, người cần máu và các cập nhật khác.</p>
                <div className="icon-wrapper">
                <img src={notificationIcon} alt="Thông báo" className="icon" />
                    {notificationCount > 0 && (
                      <span className="notification-badge">
                        {notificationCount > 99 ? '99+' : notificationCount + '+'}
                      </span>
                    )}
                </div>

                <button onClick={() => setShowNotificationPopup(true)}>Xem ngay</button>
              </div>
            </div>
            <div className="booking-item">
              <div className="booking-text">
                <h4>Đăng ký lịch hẹn</h4>
                <p>Chọn ngày và giờ phù hợp để được phục vụ nhanh chóng và thuận tiện hơn.</p>
                <img src={calendarIcon} alt="Đặt lịch" />
                <button onClick={() => navigate('/booking')}>Đăng ký</button>
              </div>
            </div>

            <div className="booking-item">
              <div className="booking-text">
                <h4>Xem đơn đã gửi</h4>
                <p>Chức năng mới đang được cập nhật và sẽ ra mắt trong thời gian tới.</p>
                <img src={blood_request_historyIcon} alt="Xem đơn đã gửi" />
                <button onClick={() => navigate('/my-registrations')}>Xem ngay</button>
              </div>
            </div>

            {/* Nút yêu cầu nhận máu */}
            <div className="booking-item">
              <div className="booking-text">
                <h4>Yêu cầu nhận máu</h4>
                <p>Gửi yêu cầu nhận máu cho bệnh nhân cần truyền máu.</p>
                <img src={orderIcon} alt="Yêu cầu nhận máu" />
                <button onClick={() => setShowPopup(true)}>Yêu cầu nhận máu</button>
                
              </div>
            </div>
            {showPopup && (
              <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Bạn muốn yêu cầu loại máu nào?</h3>
                  <div className="popup-buttons">
                    <button onClick={() => {
                      setShowBloodRequestForm(true);
                      setShowPopup(false);
                    }}>
                      Nhận máu toàn phần
                    </button>
                    <button onClick={() => {
                      setShowComponentRequestForm(true);
                      setShowPopup(false);
                    }}>
                      Nhận máu thành phần
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Popup tổng hợp thông báo */}
      {showNotificationPopup && (
        <div className="popup-overlay" onClick={() => { setShowNotificationPopup(false); markAllAsRead(); }}>
          <div className="popup-content" style={{
            width: 'min(700px, 95vw)',
            maxWidth: '95vw',
            minWidth: 0,
            minHeight: 600,
            maxHeight: 800,
            padding: 0,
            borderRadius: 18,
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }} onClick={e => e.stopPropagation()}>
            {/* Header + Tabs */}
            <div style={{ padding: '0 40px', flexShrink: 0 }}>
              <p style={{ fontSize: 40, fontWeight: 800,marginTop:20, marginBottom: 12, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <span role="img" aria-label="bell">🔔</span> THÔNG BÁO <span role="img" aria-label="bell">🔔</span>
              </p>
              <div className="noti-tabs">
                <button
                  className={`noti-tab-btn${tabIndex === 0 ? '' : ' inactive'}`}
                  onClick={e => { e.stopPropagation(); setTabIndex(Math.max(0, tabIndex - 1)); }}
                  disabled={tabIndex === 0}
                  style={{ cursor: tabIndex === 0 ? 'not-allowed' : 'pointer' }}
                >&#60;</button>
                <button className="noti-tab-btn" onClick={e => e.stopPropagation()}>
                  {NOTI_TYPES[tabIndex].label}
                  <span className="noti-tab-badge">
                    {unreadCountByType[tabIndex]}
                  </span>
                </button>
                <button
                  className={`noti-tab-btn${tabIndex === NOTI_TYPES.length - 1 ? ' inactive' : ''}`}
                  onClick={e => { e.stopPropagation(); setTabIndex(Math.min(NOTI_TYPES.length - 1, tabIndex + 1)); }}
                  disabled={tabIndex === NOTI_TYPES.length - 1}
                  style={{ cursor: tabIndex === NOTI_TYPES.length - 1 ? 'not-allowed' : 'pointer' }}
                >&#62;</button>
              </div>
            </div>
            {/* Danh sách thông báo cuộn dọc */}
            <div className="noti-list-scroll">
              {notifications.filter(noti => noti.type === activeNotiType).length > 0 ? (
                notifications.filter(noti => noti.type === activeNotiType).map(noti => (
                  <div
                    key={noti.id}
                    className={`noti-card-modern${!noti.isRead ? ' noti-unread' : ''}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!noti.isRead) {
                        const token = localStorage.getItem("token");
                        await fetch(`http://localhost:8080/api/notifications/${noti.id}/read`, {
                          method: "PATCH",
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setNotifications((prev) =>
                          prev.map((n) => n.id === noti.id ? { ...n, isRead: true } : n)
                        );
                      }
                      setSelectedNotification(noti);
                    }}
                  >
                    <div className="noti-icon">
                      <span role="img" aria-label="noti">🔔</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="noti-title">
                        {noti.title}
                        <span className="noti-type">{noti.type}</span>
                        {!noti.isRead && <span className="noti-dot"></span>}
                      </div>
                      <div className="noti-content">{noti.content}</div>
                      <div className="noti-time">{formatTimeAgo(noti.createdAt)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 22, marginTop: 80 }}>Không có thông báo nào.</div>
              )}
            </div>
            {/* Nút đóng ngoài cùng dưới */}
            <div style={{ textAlign: 'center', padding: 32 }}>
              <button className="noti-close-btn" onClick={e => {
                e.stopPropagation();
                setShowNotificationPopup(false); // Đóng popup ngay lập tức
                markAllAsRead(); // Đánh dấu đã đọc, không cần await
              }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup chi tiết thông báo */}
      {selectedNotification && (
        <div className="popup-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="noti-popup" onClick={e => e.stopPropagation()}>
            <button className="noti-popup-x" onClick={() => setSelectedNotification(null)}>&times;</button>
            <div className="noti-popup-title">
              <span role="img" aria-label="bell">🔔</span> {selectedNotification.title}
            </div>
            <div className="noti-popup-content">
              <b>Nội dung:</b> {selectedNotification.content}
            </div>
            <div className="noti-popup-meta">
              <b>Loại:</b> {selectedNotification.type}
            </div>
            <div className="noti-popup-meta">
              <b>Ngày:</b> {new Date(selectedNotification.createdAt).toLocaleString("vi-VN")}
            </div>
            <button className="noti-popup-close" onClick={() => setSelectedNotification(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Form yêu cầu nhận máu */}
      {showBloodRequestForm && (
        <div className="popup-overlay">
          <div className="popup-content" style={{ maxWidth: 800, minWidth: 340, padding: 24 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12, color: '#b22b2b', fontSize: '1.3rem' }}>Yêu cầu nhận máu</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 50 }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Thông tin bệnh nhân</h4>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Họ tên</label>
                  <input name="fullName" value={form.fullName} onChange={handleFormChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Ngày sinh</label>
                  <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleFormChange} required max={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số điện thoại</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Giới tính</label>
                  <select name="gender" value={form.gender} onChange={handleFormChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Địa chỉ bệnh nhân</h4>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tỉnh/TP</label>
                    <select
                      name="address-provinceId"
                      value={selectedProvince}
                      onChange={handleFormChange}
                      required
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {pcVN.getProvinces().map((province: any) => (
                        <option key={province.code} value={province.code}>{province.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Quận/Huyện</label>
                    <select
                      name="address-districtId"
                      value={selectedDistrict}
                      onChange={handleFormChange}
                      required
                      disabled={!selectedProvince}
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {pcVN.getDistrictsByProvinceCode(selectedProvince).map((district: any) => (
                        <option key={district.code} value={district.code}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Phường/Xã</label>
                    <select
                      name="address-wardId"
                      value={selectedWard}
                      onChange={handleFormChange}
                      required
                      disabled={!selectedDistrict}
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn phường/xã</option>
                      {pcVN.getWardsByDistrictCode(selectedDistrict).map((ward: any) => (
                        <option key={ward.code} value={ward.code}>{ward.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số nhà, tên đường</label>
                    <input
                      name="address-street"
                      value={form.patientAddress.street}
                      onChange={handleFormChange}
                      required
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    />
                  </div>
                </div>

              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Thông tin yêu cầu</h4>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Nhóm máu</label>
                  <select name="bloodType" value={form.bloodType} onChange={handleFormChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Rh</label>
                  <select name="rhType" value={form.rhType} onChange={handleFormChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }}>
                    <option value="POSITIVE">Positive (+)</option>
                    <option value="NEGATIVE">Negative (-)</option>
                  </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Thể tích cần (ml)</label>
                  <input name="requiredVolume" type="number" value={form.requiredVolume} onChange={handleFormChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tên bệnh viện</label>
                  <input name="hospitalName" value={form.hospitalName} onChange={handleFormChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tình trạng bệnh</label>
                  <input name="medicalCondition" value={form.medicalCondition} onChange={handleFormChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                {successMsg && <div style={{ color: 'green', margin: '8px 0', fontSize: '0.97rem' }}>{successMsg}</div>}
                {errorMsg && <div style={{ color: 'red', margin: '8px 0', fontSize: '0.97rem' }}>{errorMsg}</div>}
                <div className="form-action-buttons">
                  <button type="submit" className="submit-button-user-request" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                  <button type="button" className="back-button-user-request" onClick={() => { setShowBloodRequestForm(false); setSuccessMsg(""); setErrorMsg(""); }}>Đóng</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showComponentRequestForm && (
        <div className="popup-overlay">
          <div className="popup-content" style={{ maxWidth: 800, minWidth: 340, padding: 24 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12, color: '#b22b2b', fontSize: '1.3rem' }}>Yêu cầu nhận máu</h2>
            <form onSubmit={handleComponentSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 50 }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Thông tin bệnh nhân</h4>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Họ tên</label>
                  <input name="fullName" value={componentForm.fullName} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Ngày sinh</label>
                  <input name="dateOfBirth" type="date" value={componentForm.dateOfBirth} onChange={handleComponentChange} required max={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số điện thoại</label>
                  <input name="phone" value={componentForm.phone} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Giới tính</label>
                  <select name="gender" value={componentForm.gender} onChange={handleComponentChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Địa chỉ bệnh nhân</h4>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tỉnh/TP</label>
                    <select
                      name="address-provinceId"
                      value={componentForm.patientAddress.provinceId}
                      onChange={handleComponentChange}
                      required
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {pcVN.getProvinces().map((province: any) => (
                        <option key={province.code} value={province.code}>{province.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Quận/Huyện</label>
                    <select
                      name="address-districtId"
                      value={componentForm.patientAddress.districtId}
                      onChange={handleComponentChange}
                      required
                      disabled={!componentForm.patientAddress.provinceId}
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {pcVN.getDistrictsByProvinceCode(componentForm.patientAddress.provinceId).map((district: any) => (
                        <option key={district.code} value={district.code}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Phường/Xã</label>
                    <select
                      name="address-wardId"
                      value={componentForm.patientAddress.wardId}
                      onChange={handleComponentChange}
                      required
                      disabled={!componentForm.patientAddress.districtId}
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    >
                      <option value="">Chọn phường/xã</option>
                      {pcVN.getWardsByDistrictCode(componentForm.patientAddress.districtId).map((ward: any) => (
                        <option key={ward.code} value={ward.code}>{ward.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số nhà, tên đường</label>
                    <input
                      name="address-street"
                      value={componentForm.patientAddress.street}
                      onChange={handleComponentChange}
                      required
                      style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem' }}
                    />
                  </div>
                </div>

              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <h4 style={{ marginBottom: 6, color: '#b22b2b', fontSize: '1rem' }}>Thông tin yêu cầu</h4>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Nhóm máu</label>
                  <select name="bloodType" value={componentForm.bloodType} onChange={handleComponentChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Rh</label>
                  <select name="rhType" value={componentForm.rhType} onChange={handleComponentChange} style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }}>
                    <option value="POSITIVE">Positive (+)</option>
                    <option value="NEGATIVE">Negative (-)</option>
                  </select>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tên bệnh viện</label>
                  <input name="hospitalName" value={componentForm.hospitalName} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Tình trạng bệnh</label>
                  <input name="medicalCondition" value={componentForm.medicalCondition} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số lượng Hồng cầu (ml)</label>
                  <input name="redCellQuantity" type="number" value={componentForm.redCellQuantity} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số lượng Huyết tương (ml)</label>
                  <input name="plasmaQuantity" type="number" value={componentForm.plasmaQuantity} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontWeight: 500, fontSize: '0.97rem' }}>Số lượng Tiểu cầu (ml)</label>
                  <input name="plateletQuantity" type="number" value={componentForm.plateletQuantity} onChange={handleComponentChange} required style={{ width: '100%', padding: 5, borderRadius: 5, border: '1px solid #ccc', marginTop: 2, fontSize: '0.97rem', marginBottom:0 }} />
                </div>
                {componentSuccess && <div style={{ color: 'green', margin: '8px 0', fontSize: '0.97rem' }}>{componentSuccess}</div>}
                {componentError && <div style={{ color: 'red', margin: '8px 0', fontSize: '0.97rem' }}>{componentError}</div>}
                <div className="form-action-buttons" style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="submit-button-user-request" disabled={componentLoading}>{componentLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                  <button type="button" className="back-button-user-request" onClick={() => { setShowComponentRequestForm(false); setComponentSuccess(""); setComponentError(""); }}>Đóng</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Hàm format thời gian kiểu "x phút trước"
function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

export default User;
