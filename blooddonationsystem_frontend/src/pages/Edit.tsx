import React, { useState, useEffect } from 'react';
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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Load thông tin người dùng hiện tại từ API khi mở trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập.');
      navigate('/login');
      return;
    }

    fetch('/api/account/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Không thể lấy thông tin người dùng');
        }
        return res.json();
      })
      .then(data => {
        setUserInfo({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(err => {
        alert('Không thể tải dữ liệu người dùng.');
        console.error(err);
        navigate('/user');
      });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        alert('Thông tin đã được lưu thành công!');
        navigate('/user');
      } else {
        const errorData = await response.json();
        alert('Lỗi: ' + (errorData.message || 'Không thể cập nhật thông tin'));
      }
    } catch (error) {
      alert('Lỗi kết nối đến máy chủ!');
      console.error('Lỗi API:', error);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

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