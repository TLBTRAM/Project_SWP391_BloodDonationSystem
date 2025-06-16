import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Thêm Link
import "./components/Manager.css";
import logoBlood from "./images/Logo/logo_blood.png";

interface BloodUnit {
  id: number;
  group: string;
  quantity: number;
  entryDate: string;
  expiryDate: string;
}

const initialData: BloodUnit[] = [
  {
    id: 1,
    group: "A",
    quantity: 10,
    entryDate: "01-06-2025",
    expiryDate: "10-06-2025",
  },
  {
    id: 2,
    group: "B",
    quantity: 5,
    entryDate: "08-06-2025",
    expiryDate: "18-06-2025",
  },
  {
    id: 3,
    group: "O",
    quantity: 8,
    entryDate: "01-06-2025",
    expiryDate: "30-06-2025",
  },
];

const Manager: React.FC = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    group: "",
    quantity: "",
    entryDate: "",
    expiryDate: "",
  });

  const managerName = "Quản lí của kho máu"; // ✅ Tạm thay thế biến tên
  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    // Thêm logic đăng xuất nếu có
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "entryDate" || name === "expiryDate") {
      let formatted = value.replace(/\D/g, "").slice(0, 8);
      if (formatted.length >= 5) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(
          2,
          4
        )}-${formatted.slice(4, 8)}`;
      } else if (formatted.length >= 3) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(2, 4)}`;
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addBloodUnit = () => {
    const quantity = parseInt(formData.quantity);
    if (
      !formData.group ||
      isNaN(quantity) ||
      !formData.entryDate ||
      !formData.expiryDate
    )
      return;
    const newUnit: BloodUnit = {
      id: Date.now(),
      group: formData.group.toUpperCase(),
      quantity,
      entryDate: formData.entryDate,
      expiryDate: formData.expiryDate,
    };
    setBloodUnits([...bloodUnits, newUnit]);
    setFormData({ group: "", quantity: "", entryDate: "", expiryDate: "" });
  };

  const deleteUnit = (id: number) => {
    setBloodUnits(bloodUnits.filter((unit) => unit.id !== id));
  };

  const getRowClass = (expiryDate: string) => {
    const [day, month, year] = expiryDate.split("-").map(Number);
    if (!day || !month || !year) return "";
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "expired";
    if (diffDays <= 7) return "nearly-expired";
    return "";
  };

  const getExpiryLabel = (expiryDate: string) => {
    const [day, month, year] = expiryDate.split("-").map(Number);
    if (!day || !month || !year) return "";
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "❌ Đã hết hạn";
    if (diffDays <= 7) return "⚠ Sắp hết hạn";
    return "";
  };

  const filteredUnits = bloodUnits.filter((unit) =>
    unit.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <header className="manager-header">
        <div className="manager-logo">
          <Link to="/">
            <img src={logoBlood} alt="Logo" className="logo-img" />
          </Link>
        </div>
        <div className="manager-greeting">
          Xin chào, <span className="manager-name">{managerName}</span>
        </div>
        <button className="manager-logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      {/* Layout */}
      <div className="manager-layout">
        <div className="sidebar">
          <div>
            <div className="sidebar-title">Quản lý hệ thống</div>
            <ul className="sidebar-menu">
              <li>
                <a href="#" className="menu-item">
                  <span className="menu-icon">🏠</span>
                  <span>Trang chủ</span>
                </a>
              </li>
              <li>
                <a href="#" className="menu-item">
                  <span className="menu-icon">🩸</span>
                  <span>Kho máu</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="manager-container">
          <h2>Quản lý kho máu</h2>

          <input
            type="text"
            className="search-box"
            placeholder="Tìm nhóm máu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="blood-form">
            <h3>Thêm đơn vị máu mới</h3>
            <input
              type="text"
              name="group"
              placeholder="Nhóm máu (A, B, AB, O)"
              value={formData.group}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng (đơn vị)"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="entryDate"
              placeholder="Ngày nhập (dd-mm-yyyy)"
              value={formData.entryDate}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="expiryDate"
              placeholder="Hạn sử dụng (dd-mm-yyyy)"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
            <button onClick={addBloodUnit}>Thêm</button>
          </div>

          <table className="blood-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Nhóm máu</th>
                <th>Số lượng</th>
                <th>Ngày nhập</th>
                <th>Hạn sử dụng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={6}>Không có dữ liệu</td>
                </tr>
              ) : (
                filteredUnits.map((unit, index) => (
                  <tr key={unit.id} className={getRowClass(unit.expiryDate)}>
                    <td>{index + 1}</td>
                    <td>{unit.group}</td>
                    <td>{unit.quantity}</td>
                    <td>{unit.entryDate}</td>
                    <td>
                      {unit.expiryDate}
                      {getExpiryLabel(unit.expiryDate) && (
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            marginTop: "4px",
                            color:
                              getRowClass(unit.expiryDate) === "expired"
                                ? "#b30000"
                                : "#665c00",
                          }}
                        >
                          {getExpiryLabel(unit.expiryDate)}
                        </div>
                      )}
                    </td>
                    <td>
                      <button onClick={() => deleteUnit(unit.id)}>Xoá</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manager;
