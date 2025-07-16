import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './components/User.css';
import Header from '../layouts/header-footer/Header';
import avatarImg from './images/User/Avatar.png';
import calendarIcon from './images/User/Calendar.png';
import notificationIcon from './images/User/notifications.png';
import orderIcon from './images/User/order.png';

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
  donation_date: string;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("FE token:", token);

    if (token) {
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
          console.log("User info from BE:", data);
          setUser(data);
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API /me:", error);
          alert("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
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

  useEffect(() => {
    const fetchNotificationAndTest = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      try {
        const notiRes = await fetch(`http://localhost:8080/api/notifications/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (notiRes.ok) {
          const notiData: NotificationItem[] = await notiRes.json();
          setNotifications(notiData);
        }

        const testRes = await fetch(`http://localhost:8080/api/medical-staff/test-results?customerId=${userId}`, {
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
        console.error("Lỗi khi lấy thông báo hoặc xét nghiệm:", err);
      }
    };

    if (showNotificationPopup) fetchNotificationAndTest();
  }, [showNotificationPopup]);

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
                <button className="edit-profile-btn" onClick={() => navigate('/edit')}>
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
                  <tr><td>🕒 Ngày hiến gần nhất:</td><td>---</td></tr>
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
                    donationHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td>{new Date(item.donation_date).toLocaleDateString("vi-VN")}</td>
                        <td>{item.volume}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2}>Không có lịch sử hiến máu.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="calendar-booking">
              <Calendar />
            </div>
          </div>

          <div className="third-panel">
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
                <img src={orderIcon} alt="Xem đơn đã gửi" />
                <button onClick={() => navigate('/my-registrations')}>Xem ngay</button>
              </div>
            </div>

            <div className="booking-item">
              <div className="booking-text">
                <h4>Thông báo</h4>
                <p>Nhấn vào đây để xem thông báo mới về xét nghiệm, kết quả khám sàng lọc, người cần máu và các cập nhật khác.</p>
                <img src={notificationIcon} alt="Thông báo" />
                <button onClick={() => setShowNotificationPopup(true)}>Xem ngay</button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {showNotificationPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>🔔 Tất cả thông báo 🔔</h2>
            <div className="noti-grid noti-list-scroll">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div key={noti.id} className="noti-card">
                    <h3>{noti.title}</h3>
                    <p><strong>Nội dung:</strong> {noti.content}</p>
                    <p><strong>Loại:</strong> {noti.type}</p>
                    <p><strong>Ngày:</strong> {new Date(noti.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                ))
              ) : (
                <p>📭 Không có thông báo nào.</p>
              )}
              <div className="noti-card">
                <h3>🧪 Kết quả xét nghiệm máu</h3>
                {bloodTest ? (
                  <>
                    <p><strong>Kết quả:</strong> {bloodTest.result}</p>
                    <p><strong>Ngày xét nghiệm:</strong> {bloodTest.testDate}</p>
                    <p><strong>Ghi chú:</strong> {bloodTest.note}</p>
                  </>
                ) : (
                  <p>📭 Không có kết quả xét nghiệm máu.</p>
                )}
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowNotificationPopup(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
