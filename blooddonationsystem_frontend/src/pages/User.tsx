import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import './components/User.css';
import Header from '../layouts/header-footer/Header';
import avatarImg from './images/User/Avatar.png';
import calendarIcon from './images/User/calendar.png';
import notificationIcon from './images/User/notifications.png';
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
      const res = await fetch("http://localhost:8080/api/blood-requests/blood-requests/component", {
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

  // Khi mở form, nếu có dữ liệu cũ thì set lại các combo box
  useEffect(() => {
    if (showBloodRequestForm) {
      setSelectedProvince(form.patientAddress.provinceId || "");
      setSelectedDistrict(form.patientAddress.districtId || "");
      setSelectedWard(form.patientAddress.wardId || "");
    }
    // eslint-disable-next-line
  }, [showBloodRequestForm]);

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
                        <td>{new Date(item.donationDate).toLocaleDateString("vi-VN")}</td>
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

            {/* Nút yêu cầu nhận máu */}
            <div className="booking-item">
              <div className="booking-text">
                <h4>Yêu cầu nhận máu</h4>
                <p>Gửi yêu cầu nhận máu cho bệnh nhân cần truyền máu.</p>
                <img src={orderIcon} alt="Yêu cầu nhận máu" />
                <button onClick={() => setShowBloodRequestForm(true)}>Yêu cầu nhận máu</button>
                <button style={{marginLeft:8}} onClick={() => setShowComponentRequestForm(true)}>Yêu cầu nhận máu thành phần</button>
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
                <p>   Không có thông báo nào.</p>
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

      {/* Form yêu cầu nhận máu */}
      {showBloodRequestForm && (
        <div className="popup-overlay">
          <div className="popup-content" style={{maxWidth: 600, minWidth: 340, padding: 24}}>
            <h2 style={{textAlign:'center', marginBottom: 12, color:'#b22b2b', fontSize: '1.3rem'}}>Yêu cầu nhận máu</h2>
            <form onSubmit={handleSubmit} style={{display:'flex', flexWrap:'wrap', gap:12}}>
              <div style={{flex:1, minWidth:120}}>
                <h4 style={{marginBottom:6, color:'#b22b2b', fontSize:'1rem'}}>Thông tin bệnh nhân</h4>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Họ tên</label>
                  <input name="fullName" value={form.fullName} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Ngày sinh</label>
                  <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Số điện thoại</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Giới tính</label>
                  <select name="gender" value={form.gender} onChange={handleFormChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Tỉnh/TP)</label>
                  <select name="address-provinceId" value={selectedProvince} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn tỉnh/thành</option>
                    {pcVN.getProvinces().map((province: any) => (
                      <option key={province.code} value={province.code}>{province.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Quận/Huyện)</label>
                  <select name="address-districtId" value={selectedDistrict} onChange={handleFormChange} required disabled={!selectedProvince} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn quận/huyện</option>
                    {pcVN.getDistrictsByProvinceCode(selectedProvince).map((district: any) => (
                      <option key={district.code} value={district.code}>{district.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Phường/Xã)</label>
                  <select name="address-wardId" value={selectedWard} onChange={handleFormChange} required disabled={!selectedDistrict} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn phường/xã</option>
                    {pcVN.getWardsByDistrictCode(selectedDistrict).map((ward: any) => (
                      <option key={ward.code} value={ward.code}>{ward.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Số nhà, tên đường)</label>
                  <input name="address-street" value={form.patientAddress.street} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
              </div>
              <div style={{flex:1, minWidth:120}}>
                <h4 style={{marginBottom:6, color:'#b22b2b', fontSize:'1rem'}}>Thông tin yêu cầu</h4>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Nhóm máu</label>
                  <select name="bloodType" value={form.bloodType} onChange={handleFormChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Rh</label>
                  <select name="rhType" value={form.rhType} onChange={handleFormChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="POSITIVE">Positive (+)</option>
                    <option value="NEGATIVE">Negative (-)</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Thể tích cần (ml)</label>
                  <input name="requiredVolume" type="number" value={form.requiredVolume} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Tên bệnh viện</label>
                  <input name="hospitalName" value={form.hospitalName} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Tình trạng bệnh</label>
                  <input name="medicalCondition" value={form.medicalCondition} onChange={handleFormChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                {successMsg && <div style={{color:'green', margin:'8px 0', fontSize:'0.97rem'}}>{successMsg}</div>}
                {errorMsg && <div style={{color:'red', margin:'8px 0', fontSize:'0.97rem'}}>{errorMsg}</div>}
                <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10}}>
                  <button type="submit" className="submit-btn" disabled={loading} style={{minWidth:90, fontWeight:600, fontSize:15}}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                  <button type="button" onClick={()=>{setShowBloodRequestForm(false); setSuccessMsg(""); setErrorMsg("");}} style={{padding:'8px 12px', borderRadius:5, border:'none', background:'#eee', color:'#333', cursor:'pointer', minWidth:60, fontSize:'15px'}}>Đóng</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showComponentRequestForm && (
        <div className="popup-overlay">
          <div className="popup-content" style={{maxWidth: 600, minWidth: 340, padding: 24}}>
            <h2 style={{textAlign:'center', marginBottom: 12, color:'#b22b2b', fontSize: '1.3rem'}}>Yêu cầu nhận máu</h2>
            <form onSubmit={handleComponentSubmit} style={{display:'flex', flexWrap:'wrap', gap:12}}>
              <div style={{flex:1, minWidth:120}}>
                <h4 style={{marginBottom:6, color:'#b22b2b', fontSize:'1rem'}}>Thông tin bệnh nhân</h4>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Họ tên</label>
                  <input name="fullName" value={componentForm.fullName} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Ngày sinh</label>
                  <input name="dateOfBirth" type="date" value={componentForm.dateOfBirth} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Số điện thoại</label>
                  <input name="phone" value={componentForm.phone} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Giới tính</label>
                  <select name="gender" value={componentForm.gender} onChange={handleComponentChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Tỉnh/TP)</label>
                  <select name="address-provinceId" value={componentProvince} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn tỉnh/thành</option>
                    {pcVN.getProvinces().map((province: any) => (
                      <option key={province.code} value={province.code}>{province.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Quận/Huyện)</label>
                  <select name="address-districtId" value={componentDistrict} onChange={handleComponentChange} required disabled={!componentProvince} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn quận/huyện</option>
                    {pcVN.getDistrictsByProvinceCode(componentProvince).map((district: any) => (
                      <option key={district.code} value={district.code}>{district.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Phường/Xã)</label>
                  <select name="address-wardId" value={componentWard} onChange={handleComponentChange} required disabled={!componentDistrict} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="">Chọn phường/xã</option>
                    {pcVN.getWardsByDistrictCode(componentDistrict).map((ward: any) => (
                      <option key={ward.code} value={ward.code}>{ward.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Địa chỉ (Số nhà, tên đường)</label>
                  <input name="address-street" value={componentForm.patientAddress.street} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
              </div>
              <div style={{flex:1, minWidth:120}}>
                <h4 style={{marginBottom:6, color:'#b22b2b', fontSize:'1rem'}}>Thông tin yêu cầu</h4>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Nhóm máu</label>
                  <select name="bloodType" value={componentForm.bloodType} onChange={handleComponentChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Rh</label>
                  <select name="rhType" value={componentForm.rhType} onChange={handleComponentChange} style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}}>
                    <option value="POSITIVE">Positive (+)</option>
                    <option value="NEGATIVE">Negative (-)</option>
                  </select>
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Tên bệnh viện</label>
                  <input name="hospitalName" value={componentForm.hospitalName} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Tình trạng bệnh</label>
                  <input name="medicalCondition" value={componentForm.medicalCondition} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Số lượng Hồng cầu (ml)</label>
                  <input name="redCellQuantity" type="number" value={componentForm.redCellQuantity} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Số lượng Huyết tương (ml)</label>
                  <input name="plasmaQuantity" type="number" value={componentForm.plasmaQuantity} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                <div style={{marginBottom:8}}>
                  <label style={{fontWeight:500, fontSize:'0.97rem'}}>Số lượng Tiểu cầu (ml)</label>
                  <input name="plateletQuantity" type="number" value={componentForm.plateletQuantity} onChange={handleComponentChange} required style={{width:'100%',padding:5,borderRadius:5,border:'1px solid #ccc',marginTop:2, fontSize:'0.97rem'}} />
                </div>
                {componentSuccess && <div style={{color:'green', margin:'8px 0', fontSize:'0.97rem'}}>{componentSuccess}</div>}
                {componentError && <div style={{color:'red', margin:'8px 0', fontSize:'0.97rem'}}>{componentError}</div>}
                <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10}}>
                  <button type="submit" className="submit-btn" disabled={componentLoading} style={{minWidth:90, fontWeight:600, fontSize:15}}>{componentLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                  <button type="button" onClick={()=>{setShowComponentRequestForm(false); setComponentSuccess(""); setComponentError("");}} style={{padding:'8px 12px', borderRadius:5, border:'none', background:'#eee', color:'#333', cursor:'pointer', minWidth:60, fontSize:'15px'}}>Đóng</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
