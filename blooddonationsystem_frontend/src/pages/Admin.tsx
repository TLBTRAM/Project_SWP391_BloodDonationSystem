import React, { useState, useEffect } from 'react';
import './components/Admin.css';
import { Link, useNavigate } from 'react-router-dom';
import logoBlood from './images/Logo/logo_blood.png';

interface Account {

  id: number;
  name: string;
  email: string;
  enabled: boolean;
  role: 'Người dùng' | 'Nhân viên y tế' | 'Quản lý kho máu';
}

interface UserData {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

const Admin: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<UserData | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('Tất cả');
  const navigate = useNavigate();
  
  const toggleEnabled = (id: number) => {
  setAccounts(prev =>
    prev.map(acc =>
      acc.id === id ? { ...acc, enabled: !acc.enabled } : acc
    )
  );
};

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8080/api/admin/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Không thể lấy thông tin admin");
          return res.json();
        })
        .then(data => {
          console.log("Dữ liệu admin:", data);
          setAdminInfo(data);
        })
        .catch(err => {
          console.error("Lỗi khi gọi API:", err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8080/api/admin/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
          return res.json();
        })
        .then(data => {
          const mappedAccounts = data.map((acc: any) => ({
            id: acc.id,
            name: acc.fullName,
            email: acc.email,
            role:
              acc.role === "CUSTOMER"
                ? "Người dùng"
                : acc.role === "MEDICALSTAFF"
                  ? "Nhân viên y tế"
                  : acc.role === "MANAGER"
                    ? "Quản lý kho máu"
                    : "Admin"
          }));
          setAccounts(mappedAccounts);
        })
        .catch(err => {
          console.error("Lỗi khi tải danh sách tài khoản:", err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      setAccounts((accounts as Account[]).filter(account => account.id !== id));
      // Bạn có thể gọi API xóa thực sự ở đây nếu cần:
      /*
      fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        setAccounts(accounts.filter(account => account.id !== id));
      });
      */
    }
  };

  const filteredAccounts = (accounts as Account[]).filter(account => {
    const matchesRole = filterRole === 'Tất cả' || account.role === filterRole;
    const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleCounts = {
    'Người dùng': (accounts as Account[]).filter(a => a.role === 'Người dùng').length,
    'Nhân viên y tế': (accounts as Account[]).filter(a => a.role === 'Nhân viên y tế').length,
    'Quản lý kho máu': (accounts as Account[]).filter(a => a.role === 'Quản lý kho máu').length,
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
          Xin chào, <span className="admin-name"><strong>{adminInfo?.fullName || "Admin"}</strong></span>
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
                    <button
                      className="status-btn"
                      onClick={() => toggleEnabled(account.id)}
                    >
                      {account.enabled ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
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
