import React, { useState } from 'react';
import './components/Edit.css';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Edit: React.FC = () => {

  const navigate = useNavigate();

  // Giả sử lấy dữ liệu user từ API hoặc context, mình hardcode tạm
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Dinoy Raj K',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0909123456',
    email: 'dinoy@example.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gửi data lên API hoặc xử lý lưu info người dùng
    alert('Thông tin đã được lưu thành công!');
    // Ví dụ: gọi API ở đây
  };

  return (
    <div className="edit-container">
      <h2>Chỉnh sửa thông tin người dùng</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Tên:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="address">Địa chỉ:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={userInfo.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Số điện thoại:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10,12}"
          title="Số điện thoại phải gồm 10-12 chữ số"
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          required
        />

        <button type="submit" className="save-btn">Lưu thay đổi</button>
        <button type="button" className="back-btn" onClick={() => navigate('/user')}>Quay trở lại</button>
      </form>
    </div>
  );
};

export default Edit;
