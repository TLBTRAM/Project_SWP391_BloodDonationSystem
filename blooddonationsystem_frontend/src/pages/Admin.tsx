import React, { useState } from 'react';
import './components/Admin.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoBlood from './images/Logo/logo_blood.png';

interface Account {
  id: number;
  name: string;
  email: string;
  role: 'Người dùng' | 'Nhân viên y tế' | 'Quản lý kho máu';
}

const initialAccounts: Account[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Người dùng' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Nhân viên y tế' },
  { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Quản lý kho máu' },
  { id: 4, name: 'Phạm Văn D', email: 'd@example.com', role: 'Người dùng' },
  { id: 5, name: 'Hoàng Thị E', email: 'e@example.com', role: 'Nhân viên y tế' },
];

const adminName = 'Admin'; // bạn có thể lấy từ props, state, hoặc context nếu cần

const handleLogout = () => {
  // Xử lý đăng xuất tại đây
  alert('Đăng xuất thành công!');
};

const Admin: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('Tất cả');

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesRole = filterRole === 'Tất cả' || account.role === filterRole;
    const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleCounts = {
    'Người dùng': accounts.filter(a => a.role === 'Người dùng').length,
    'Nhân viên y tế': accounts.filter(a => a.role === 'Nhân viên y tế').length,
    'Quản lý kho máu': accounts.filter(a => a.role === 'Quản lý kho máu').length,
  };

  return (
  <>
    <header className="admin-header">
      <div className="admin-logo">
        <Link to="/">
          <img src={logoBlood} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <div className="admin-greeting">
        Xin chào, <span className="admin-name">{adminName}</span>
      </div>
      <button className="admin-logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>
    </header>


    <div className="admin-container">
      <h1>Quản lý tài khoản</h1>

      <div className="role-summary">
        <div className="summary-box">
          <div className="summary-icon">👤</div>
          <div className="summary-role">Người dùng</div>
          <div className="summary-count">{roleCounts['Người dùng']}</div>
        </div>
        <div className="summary-box">
          <div className="summary-icon">🩺</div>
          <div className="summary-role">Nhân viên y tế</div>
          <div className="summary-count">{roleCounts['Nhân viên y tế']}</div>
        </div>
        <div className="summary-box">
          <div className="summary-icon">🩸</div>
          <div className="summary-role">Quản lý kho máu</div>
          <div className="summary-count">{roleCounts['Quản lý kho máu']}</div>
        </div>
      </div>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="Tất cả">Tất cả</option>
          <option value="Người dùng">Người dùng</option>
          <option value="Nhân viên y tế">Nhân viên y tế</option>
          <option value="Quản lý kho máu">Quản lý kho máu</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map(account => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.role}</td>
                <td>
                  <button className="edit-btn">Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(account.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Không tìm thấy tài khoản phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </>
);
};

export default Admin;
