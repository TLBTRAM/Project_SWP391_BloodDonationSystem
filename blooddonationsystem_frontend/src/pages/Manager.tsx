// src/pages/Manager.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoBlood from "./images/Logo/logo_blood.png";
import "./components/Manager.css";

interface BloodUnit {
  id: number;
  group: string;
  quantity: number;
  entryDate: string;
  expiryDate: string;
}

const initialData: BloodUnit[] = [
  { id: 1, group: "A", quantity: 10, entryDate: "01-06-2025", expiryDate: "01-08-2025" },
  { id: 2, group: "B", quantity: 5, entryDate: "05-06-2025", expiryDate: "05-08-2025" },
  { id: 3, group: "O", quantity: 3, entryDate: "10-06-2025", expiryDate: "20-06-2025" },
  { id: 4, group: "AB", quantity: 7, entryDate: "15-05-2025", expiryDate: "10-06-2025" },
];

const Manager: React.FC = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [formData, setFormData] = useState({
    group: "",
    quantity: "",
    entryDate: "",
    expiryDate: "",
  });
  const [view, setView] = useState<"dashboard" | "add" | "stats" | "requests">("dashboard");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "entryDate" || name === "expiryDate") {
      let formatted = value.replace(/\D/g, "").slice(0, 8);
      if (formatted.length >= 5) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(2, 4)}-${formatted.slice(4, 8)}`;
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
    if (!formData.group || isNaN(quantity) || !formData.entryDate || !formData.expiryDate) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const newUnit: BloodUnit = {
      id: Date.now(),
      group: formData.group.toUpperCase(),
      quantity,
      entryDate: formData.entryDate,
      expiryDate: formData.expiryDate,
    };
    setBloodUnits([...bloodUnits, newUnit]);
    setFormData({ group: "", quantity: "", entryDate: "", expiryDate: "" });
    setView("dashboard");
  };

  const deleteUnit = (id: number) => {
    setBloodUnits(bloodUnits.filter((unit) => unit.id !== id));
  };

  const getStatusLabel = (expiryDate: string): "Hết hạn" | "Gần hết hạn" | "Còn hạn" => {
    const [day, month, year] = expiryDate.split("-").map(Number);
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "Hết hạn";
    if (diff <= 7) return "Gần hết hạn";
    return "Còn hạn";
  };

  const getRowClass = (expiryDate: string) => {
    const status = getStatusLabel(expiryDate);
    if (status === "Hết hạn") return "expired";
    if (status === "Gần hết hạn") return "nearly-expired";
    return "";
  };

  const statusClassMap: Record<string, string> = {
    "Còn hạn": "status-ok",
    "Gần hết hạn": "status-warning",
    "Hết hạn": "status-expired",
  };

  const sortFunction = (a: BloodUnit, b: BloodUnit) => {
    const dateA = sortBy === "entry" ? a.entryDate : a.expiryDate;
    const dateB = sortBy === "entry" ? b.entryDate : b.expiryDate;
    const [da, ma, ya] = dateA.split("-").map(Number);
    const [db, mb, yb] = dateB.split("-").map(Number);
    const d1 = new Date(ya, ma - 1, da);
    const d2 = new Date(yb, mb - 1, db);
    return d1.getTime() - d2.getTime();
  };

  const filteredUnits = bloodUnits
    .filter((unit) => unit.group.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((unit) => (filterGroup ? unit.group === filterGroup : true))
    .filter((unit) => {
      const status = getStatusLabel(unit.expiryDate);
      return filterStatus ? status === filterStatus : true;
    })
    .sort(sortBy ? sortFunction : undefined);

  return (
    <div>
      <header className="manager-header">
        <div className="manager-logo">
          <Link to="/">
            <img src={logoBlood} alt="Logo" className="logo-img" />
          </Link>
        </div>
        <div className="manager-greeting">
          Xin chào, <span className="manager-name">Quản lí kho máu</span>
        </div>
        <button className="manager-logout-btn" onClick={() => alert("Đăng xuất thành công!")}>
          Đăng xuất
        </button>
      </header>

      <div className="manager-layout">
        <div className="sidebar">
          <div className="sidebar-title">Quản lý hệ thống</div>
          <ul className="sidebar-menu">
            <li className={view === "dashboard" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("dashboard")}>Kho máu</button>
            </li>
            <li className={view === "add" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("add")}>Thêm máu</button>
            </li>
            <li className={view === "stats" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("stats")}>Thống kê kho máu</button>
            </li>
            <li className={view === "requests" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("requests")}>Quản lí yêu cầu cần máu</button>
            </li>
          </ul>
        </div>

        <div className="manager-container">
          {view === "dashboard" && (
            <>
              <h2>Quản lý kho máu</h2>
              <div className="filter-container">
                <input
                  type="text"
                  className="search-box"
                  placeholder="Tìm nhóm máu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
                  <option value="">Tất cả nhóm máu</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Tất cả trạng thái</option>
                  <option value="Còn hạn">Còn hạn</option>
                  <option value="Gần hết hạn">Gần hết hạn</option>
                  <option value="Hết hạn">Hết hạn</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Không sắp xếp</option>
                  <option value="entry">Ngày nhập</option>
                  <option value="expiry">Hạn sử dụng</option>
                </select>
              </div>

              <table className="blood-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Nhóm máu</th>
                    <th>Số lượng</th>
                    <th>Ngày nhập</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.length === 0 ? (
                    <tr><td colSpan={7}>Không có dữ liệu</td></tr>
                  ) : (
                    filteredUnits.map((unit, index) => {
                      const status = getStatusLabel(unit.expiryDate);
                      return (
                        <tr key={unit.id} className={getRowClass(unit.expiryDate)}>
                          <td>{index + 1}</td>
                          <td>{unit.group}</td>
                          <td>{unit.quantity}</td>
                          <td>{unit.entryDate}</td>
                          <td>{unit.expiryDate}</td>
                          <td>
                            <span className={`status-badge ${statusClassMap[status]}`}>{status}</span>
                          </td>
                          <td>
                            <button onClick={() => deleteUnit(unit.id)}>Xoá</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </>
          )}

          {view === "add" && (
            <>
              <h2>Thêm đơn vị máu mới</h2>
              <input type="text" name="group" placeholder="Nhóm máu (A, B, AB, O)" value={formData.group} onChange={handleInputChange} />
              <input type="number" name="quantity" placeholder="Số lượng (đơn vị)" value={formData.quantity} onChange={handleInputChange} />
              <input type="text" name="entryDate" placeholder="Ngày nhập (dd-mm-yyyy)" value={formData.entryDate} onChange={handleInputChange} />
              <input type="text" name="expiryDate" placeholder="Hạn sử dụng (dd-mm-yyyy)" value={formData.expiryDate} onChange={handleInputChange} />
              <button onClick={addBloodUnit}>Thêm</button>
            </>
          )}

          {view === "stats" && (
            <>
              <h2>Thống kê kho máu</h2>
              <p>Chức năng này đang được phát triển...</p>
            </>
          )}

          {view === "requests" && (
            <>
              <h2>Quản lý yêu cầu cần máu</h2>
              <p>Chức năng này đang được phát triển...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manager;
