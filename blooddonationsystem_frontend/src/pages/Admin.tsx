import React, { useState, useEffect } from "react";
import "./components/Admin.css";
import { Link, useNavigate } from "react-router-dom";
import logoBlood from "./images/Logo/logo_blood.png";
import DeleteImg from "./images/Action/bin.png";
import EditImg from "./images/Action/pen.png";
import { useAuth } from "../layouts/header-footer/AuthContext";

import AdminNotifications from "./AdminNotifications";

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
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Tất cả");
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [statusAccount, setStatusAccount] = useState<Account | null>(null);

  // Tự động ẩn thông báo sau 2.5 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null); // ✅ dùng để hiển thị modal xác nhận xoá

  const navigate = useNavigate();

  // Thêm state chọn tab
  const [activeTab, setActiveTab] = useState<"accounts" | "notifications">(
    "accounts"
  );

  // Thêm hàm loadAccounts để gọi API lấy danh sách tài khoản theo filterRole
  const loadAccounts = () => {
    const token = localStorage.getItem("token");
    if (token) {
      let url = "http://localhost:8080/api/admin/users";
      if (filterRole !== "Tất cả") {
        const roleMap: Record<string, string> = {
          "Người dùng": "CUSTOMER",
          "Nhân viên y tế": "MEDICALSTAFF",
          "Quản lý kho máu": "MANAGER",
          Admin: "ADMIN",
        };
        url += `?role=${roleMap[filterRole]}`;
      }
      fetch(url, {
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
            email: acc.account?.email || "",
            enabled: acc.account?.enableStatus === "ENABLE",
            role:
              acc.account?.role === "CUSTOMER"
                ? "Người dùng"
                : acc.account?.role === "MEDICALSTAFF"
                ? "Nhân viên y tế"
                : acc.account?.role === "MANAGER"
                ? "Quản lý kho máu"
                : acc.account?.role === "ADMIN"
                ? "Admin"
                : "",
          }));
          setAccounts(mappedAccounts);
        })
        .catch((err) => console.error(err));
    }
  };

  // Gọi loadAccounts khi filterRole thay đổi
  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line
  }, [filterRole]);

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
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  // Sau khi cập nhật role, xóa, hoặc kích hoạt/vô hiệu hóa, gọi lại loadAccounts
  const handleSaveRole = () => {
    if (editingAccount) {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:8080/api/admin/users/${editingAccount.id}/role?role=${selectedRole}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Không thể cập nhật vai trò");
          setMessage("Cập nhật vai trò thành công!");
          setEditingAccount(null);
          loadAccounts();
        })
        .catch((err) => alert(err.message));
    }
  };

  const toggleEnabled = (id: number) => {
    const account = accounts.find((acc) => acc.id === id);
    if (!account) return;
    const token = localStorage.getItem("token");
    fetch(
      `http://localhost:8080/api/admin/users/${id}/status?enabled=${!account.enabled}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Không thể cập nhật trạng thái");
        setMessage(
          account.enabled
            ? "Vô hiệu hóa tài khoản thành công!"
            : "Kích hoạt tài khoản thành công!"
        );
        loadAccounts();
      })
      .catch((err) => alert(err.message));
  };

  const confirmDeleteAccount = () => {
    if (deletingAccount) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:8080/api/admin/users/${deletingAccount.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể xóa tài khoản");
          setMessage("Xóa tài khoản thành công!");
          setDeletingAccount(null);
          loadAccounts();
        })
        .catch((err) => alert(err.message));
    }
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesRole = filterRole === "Tất cả" || account.role === filterRole;
    const matchesSearch = account.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Đếm số lượng tài khoản mỗi role dựa trên accounts mới nhất
  const roleCounts = {
    "Người dùng": accounts.filter((a) => a.role === "Người dùng").length,
    "Nhân viên y tế": accounts.filter((a) => a.role === "Nhân viên y tế")
      .length,
    "Quản lý kho máu": accounts.filter((a) => a.role === "Quản lý kho máu")
      .length,
    Admin: accounts.filter((a) => a.role === "Admin").length,
  };

  const roleIcons: Record<string, string> = {
    "Người dùng": "👤",
    "Nhân viên y tế": "🩺",
    "Quản lý kho máu": "🏥",
    Admin: "👨‍💻",
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
            <strong>{user?.fullName || "Admin"}</strong>
          </span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <div className="admin-container">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            className="status-btn"
            style={{
              padding: "12px 20px",
              marginRight: "30px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              color: "white",
              cursor: "pointer",
              backgroundColor: activeTab === "accounts" ? "#FF204E" : "#aad8f2",
              fontWeight: activeTab === "accounts" ? "600" : "normal",
              transform: activeTab === "accounts" ? "scale(1.05)" : "none",
            }}
            onClick={() => setActiveTab("accounts")}
          >
            Quản lý tài khoản
          </button>
          <button
            className="status-btn"
            style={{
              marginLeft: "10px",
              padding: "12px 20px",
              marginRight: "30px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              color: "white",
              cursor: "pointer",
              backgroundColor:
                activeTab === "notifications" ? "#FF204E" : "#aad8f2",
              fontWeight: activeTab === "notifications" ? "600" : "normal",
              transform: activeTab === "notifications" ? "scale(1.05)" : "none",
            }}
            onClick={() => setActiveTab("notifications")}
          >
            Quản lý thông báo
          </button>
        </div>

        {/* ✅ TAB QUẢN LÝ TÀI KHOẢN */}
        {activeTab === "accounts" && (
          <>
            <h1>Quản lý tài khoản</h1>

            {message && <div className="admin-toast-success">{message}</div>}

            <div className="role-summary">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div className="summary-box" key={role}>
                  <div className="summary-icon">{roleIcons[role] || "👤"}</div>
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
                            onClick={() => setDeletingAccount(account)}
                          >
                            <img src={DeleteImg} alt="Xóa" />
                          </button>
                          <button
                            className="status-btn"
                            onClick={() => setStatusAccount(account)}
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
                    <button
                      onClick={confirmDeleteAccount}
                      className="save-button-2"
                    >
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

            {/* ✅ MODAL KÍCH HOẠT / VÔ HIỆU HÓA */}
            {statusAccount && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>
                    Xác nhận{" "}
                    {statusAccount.enabled ? "vô hiệu hóa" : "kích hoạt"} tài
                    khoản
                  </h3>
                  <p>
                    Bạn có chắc chắn muốn{" "}
                    {statusAccount.enabled ? "vô hiệu hóa" : "kích hoạt"} tài
                    khoản <strong>{statusAccount.name}</strong> không?
                  </p>
                  <div className="modal-buttons">
                    <button
                      onClick={() => {
                        toggleEnabled(statusAccount.id);
                        setStatusAccount(null);
                      }}
                      className="save-button-2"
                    >
                      {statusAccount.enabled ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
                    <button
                      onClick={() => setStatusAccount(null)}
                      className="cancel-button-2"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ✅ TAB QUẢN LÝ THÔNG BÁO */}
        {activeTab === "notifications" && <AdminNotifications />}
      </div>
    </>
  );
};

export default Admin;
