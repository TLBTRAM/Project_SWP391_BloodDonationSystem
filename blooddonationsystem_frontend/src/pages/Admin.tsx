import React, { useState, useEffect } from "react";
import "./components/Admin.css";
import { Link, useNavigate } from "react-router-dom";
import logoBlood from "./images/Logo/logo_blood.png";
import DeleteImg from "./images/Action/bin.png";
import EditImg from "./images/Action/pen.png";

interface Account {
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  role: "Người dùng" | "Nhân viên y tế" | "Quản lý kho máu" | "Admin";
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
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Tất cả");
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null); // ✅ dùng để hiển thị modal xác nhận xoá

  const navigate = useNavigate();

  const toggleEnabled = (id: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, enabled: !acc.enabled } : acc
      )
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể lấy thông tin admin");
          return res.json();
        })
        .then((data) => setAdminInfo(data))
        .catch(() => navigate("/login"));
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
          return res.json();
        })
        .then((data) => {
          const mappedAccounts = data.map((acc: any) => ({
            id: acc.id,
            name: acc.fullName,
            email: acc.email,
            enabled: acc.enabled,
            role:
              acc.role === "CUSTOMER"
                ? "Người dùng"
                : acc.role === "MEDICALSTAFF"
                ? "Nhân viên y tế"
                : acc.role === "MANAGER"
                ? "Quản lý kho máu"
                : "Admin",
          }));
          setAccounts(mappedAccounts);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (id: number) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account) {
      setEditingAccount(account);
      const backendRole =
        account.role === "Admin"
          ? "ADMIN"
          : account.role === "Quản lý kho máu"
          ? "MANAGER"
          : account.role === "Nhân viên y tế"
          ? "MEDICALSTAFF"
          : "CUSTOMER";
      setSelectedRole(backendRole);
    }
  };

  const handleSaveRole = () => {
    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                role:
                  selectedRole === "ADMIN"
                    ? "Admin"
                    : selectedRole === "MANAGER"
                    ? "Quản lý kho máu"
                    : selectedRole === "MEDICALSTAFF"
                    ? "Nhân viên y tế"
                    : "Người dùng",
              }
            : acc
        )
      );
      setEditingAccount(null);
    }
  };

  const confirmDeleteAccount = () => {
    if (deletingAccount) {
      setAccounts((prev) =>
        prev.filter((acc) => acc.id !== deletingAccount.id)
      );
      setDeletingAccount(null);
    }
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesRole = filterRole === "Tất cả" || account.role === filterRole;
    const matchesSearch = account.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleCounts = {
    "Người dùng": accounts.filter((a) => a.role === "Người dùng").length,
    "Nhân viên y tế": accounts.filter((a) => a.role === "Nhân viên y tế")
      .length,
    "Quản lý kho máu": accounts.filter((a) => a.role === "Quản lý kho máu")
      .length,
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
          Xin chào,{" "}
          <span className="admin-name">
            <strong>{adminInfo?.fullName || "Admin"}</strong>
          </span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <div className="admin-container">
        <h1>Quản lý tài khoản</h1>

        <div className="role-summary">
          {Object.entries(roleCounts).map(([role, count]) => (
            <div className="summary-box" key={role}>
              <div className="summary-icon">👤</div>
              <div className="summary-role">{role}</div>
              <div className="summary-count">{count}</div>
            </div>
          ))}
        </div>

        <div className="admin-controls">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
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
              filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td>{account.email}</td>
                  <td>{account.role}</td>
                  <td className="table-action-cell">
                    <div className="table-action-buttons">
                      <button
                        className="action-button-icon"
                        onClick={() => handleEdit(account.id)}
                      >
                        <img src={EditImg} alt="Sửa" />
                      </button>
                      <button
                        className="action-button-icon"
                        onClick={() => setDeletingAccount(account)} // ✅ mở modal xác nhận
                      >
                        <img src={DeleteImg} alt="Xóa" />
                      </button>
                      <button
                        className="status-btn"
                        onClick={() => toggleEnabled(account.id)}
                      >
                        {account.enabled ? "Vô hiệu hóa" : "Kích hoạt"}
                      </button>
                    </div>
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

        {/* ✅ MODAL CHỈNH SỬA ROLE */}
        {editingAccount && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Chỉnh sửa vai trò</h3>
              <p>
                Tài khoản: <strong>{editingAccount.name}</strong>
              </p>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="ADMIN">Quản trị viên</option>
                <option value="MANAGER">Quản lý kho máu</option>
                <option value="MEDICALSTAFF">Nhân viên y tế</option>
                <option value="CUSTOMER">Người dùng</option>
              </select>
              <div className="modal-buttons">
                <button onClick={handleSaveRole} className="save-button">
                  Lưu
                </button>
                <button
                  onClick={() => setEditingAccount(null)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MODAL XÁC NHẬN XÓA */}
        {deletingAccount && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Xác nhận xóa</h3>
              <p>
                Bạn có chắc chắn muốn xóa tài khoản{" "}
                <strong>{deletingAccount.name}</strong> không?
              </p>
              <div className="modal-buttons">
                <button onClick={confirmDeleteAccount} className="save-button-2">
                  Xóa
                </button>
                <button
                  onClick={() => setDeletingAccount(null)}
                  className="cancel-button-2"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
