// ========== Import thư viện & thành phần cần thiết ==========
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoBlood from "./images/Logo/logo_blood.png";
import "./components/Manager.css";
import { useAuth } from "../layouts/header-footer/AuthContext";

import DeleteImg from "./images/Action/bin.png";
import EditImg from "./images/Action/pen.png";

import WholeBloodRequestList from "./Manager_components/WholeBloodRequestList";
import ComponentBloodRequestList from "./Manager_components/ComponentBloodRequestList";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";


// ========== Định nghĩa kiểu dữ liệu đơn vị máu ==========
interface BloodUnit {
  id: number;
  group: string;
  quantity: number;
  entryDate: string;
  expiryDate: string;
  status?: string; // thêm trường status để fix lỗi typescript
}

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  bloodGroup?: string;
}

// ========== Dữ liệu mẫu khởi tạo ==========
const initialData: BloodUnit[] = [
  {
    id: 1,
    group: "A+",
    quantity: 10,
    entryDate: "01/06/2025",
    expiryDate: "01/08/2025",
  },
  {
    id: 2,
    group: "B-",
    quantity: 5,
    entryDate: "05/06/2025",
    expiryDate: "05/08/2025",
  },
  {
    id: 3,
    group: "O+",
    quantity: 3,
    entryDate: "10/06/2025",
    expiryDate: "20/06/2025",
  },
  {
    id: 4,
    group: "AB-",
    quantity: 7,
    entryDate: "15/05/2025",
    expiryDate: "5/07/2025",
  },
  {
    id: 5,
    group: "A-",
    quantity: 8,
    entryDate: "02/06/2025",
    expiryDate: "02/08/2025",
  },
  {
    id: 6,
    group: "B+",
    quantity: 4,
    entryDate: "08/06/2025",
    expiryDate: "08/08/2025",
  },
  {
    id: 7,
    group: "O-",
    quantity: 6,
    entryDate: "12/06/2025",
    expiryDate: "22/06/2025",
  },
  {
    id: 8,
    group: "AB+",
    quantity: 9,
    entryDate: "20/05/2025",
    expiryDate: "15/07/2025",
  },
  {
    id: 9,
    group: "A+",
    quantity: 2,
    entryDate: "01/05/2025",
    expiryDate: "18/06/2025",
  },
  {
    id: 10,
    group: "O+",
    quantity: 11,
    entryDate: "03/06/2025",
    expiryDate: "03/08/2025",
  },
];

// ========== Component chính ==========
const Manager: React.FC = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    group: "",
    quantity: "",
    entryDate: "",
    expiryDate: "",
  });
  const [view, setView] = useState<
    | "dashboard"
    | "add"
    | "stats"
    | "wholeBloodRequestList"
    | "componentBloodRequestList"
  >("dashboard");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Khi vào dashboard, tự động fetch dữ liệu kho máu từ API
  React.useEffect(() => {
    if (view === "dashboard") {
      fetchBloodUnits();
    }
  }, [view]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("FE token:", token); // debug

    if (token) {
      fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi khi gọi API");
          return res.json();
        })
        .then((data) => {
          console.log("Manager info from BE:", data);
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin:", err);
          alert("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  // ====== API: Lấy danh sách túi máu từ backend ======
  const fetchBloodUnits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/blood/units", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách túi máu");
      const data = await res.json();
      // Map dữ liệu từ API về đúng format FE, bao gồm cả status
      const mapped = data.map((item: any) => ({
        id: item.id,
        group:
          item.bloodType +
          (item.rhType === "POSITIVE"
            ? "+"
            : item.rhType === "NEGATIVE"
            ? "-"
            : ""),
        quantity: item.totalVolume,
        entryDate: item.collectedDate,
        expiryDate: item.expirationDate,
        status: item.status, // lấy status từ backend
      }));
      setBloodUnits(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  // ====== API: Thêm túi máu mới (POST) ======
  const addBloodUnitAPI = async (unit: {
    testId: number;
    bloodType: string;
    rhType: string;
    totalVolume: number;
  }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/blood/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unit),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm túi máu mới");
      const data = await res.json();
      // Sau khi thêm thành công, có thể gọi fetchBloodUnits() để cập nhật danh sách
      return data;
    } catch (err) {
      console.error(err);
      // Có thể hiển thị thông báo lỗi nếu muốn
      throw err;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "entryDate" || name === "expiryDate") {
      let formatted = value.replace(/\D/g, "").slice(0, 8);
      if (formatted.length >= 5) {
        formatted = `${formatted.slice(0, 2)}/${formatted.slice(
          2,
          4
        )}/${formatted.slice(4, 8)}`;
      } else if (formatted.length >= 3) {
        formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Thay thế hàm addBloodUnit
  const addBloodUnit = async () => {
    const quantity = parseInt(formData.quantity);
    if (
      !formData.group ||
      isNaN(quantity) ||
      !formData.entryDate ||
      !formData.expiryDate
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    // Mapping group sang bloodType và rhType
    const match = formData.group.match(/^(A|B|AB|O)([+-])$/);
    if (!match) {
      alert("Nhóm máu không hợp lệ!");
      return;
    }
    const bloodType = match[1];
    const rhType = match[2] === "+" ? "POSITIVE" : "NEGATIVE";
    // Chuyển ngày sang yyyy-mm-dd
    const toISO = (d: string) => {
      const [day, month, year] = d.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    const body = {
      bloodType,
      rhType,
      totalVolume: quantity,
      collectedDate: toISO(formData.entryDate),
      expirationDate: toISO(formData.expiryDate),
    };
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/blood/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm túi máu mới");
      await fetchBloodUnits();
      setFormData({ group: "", quantity: "", entryDate: "", expiryDate: "" });
      setView("dashboard");
      alert("Thêm đơn vị máu thành công!");
    } catch (err) {
      alert("Thêm đơn vị máu thất bại!");
      console.error(err);
    }
  };

  // Thay thế hàm deleteUnit
  const deleteUnit = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa túi máu này?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood/units/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi xóa túi máu");
      fetchBloodUnits();
    } catch (err) {
      alert("Xóa túi máu thất bại!");
      console.error(err);
    }
  };

  // Thay thế hàm editUnit: Cho phép chọn trạng thái mới và gọi API PUT
  const editUnit = async (id: number) => {
    const newStatus = window.prompt(
      "Nhập trạng thái mới cho túi máu (COLLECTED, SEPARATED, USED, EXPIRED):"
    );
    if (!newStatus) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/blood/units/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Lỗi khi cập nhật trạng thái túi máu");
      fetchBloodUnits();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
      console.error(err);
    }
  };

  const getStatusLabel = (
    expiryDate: string
  ): "Hết hạn" | "Gần hết hạn" | "Còn hạn" => {
    const [day, month, year] = expiryDate.split("/").map(Number);
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

  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    } else if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return new Date(dateStr);
  };

  // Mapping trạng thái backend sang frontend
  const statusMap: Record<string, string> = {
    COLLECTED: "Còn hạn",
    SEPARATED: "Đã tách",
    USED: "Đã sử dụng",
    EXPIRED: "Hết hạn",
    NEARLY_EXPIRED: "Gần hết hạn",
  };
  const statusOptions = [
    { value: "COLLECTED", label: "Còn hạn" },
    { value: "SEPARATED", label: "Đã tách" },
    { value: "USED", label: "Đã sử dụng" },
    { value: "EXPIRED", label: "Hết hạn" },
    { value: "NEARLY_EXPIRED", label: "Gần hết hạn" },
  ];

  const sortFunction = (a: BloodUnit, b: BloodUnit) => {
    const dateA = sortBy === "entry" ? a.entryDate : a.expiryDate;
    const dateB = sortBy === "entry" ? b.entryDate : b.expiryDate;
    const d1 = parseDate(dateA);
    const d2 = parseDate(dateB);
    return d1.getTime() - d2.getTime();
  };

  const filteredUnits = bloodUnits
    .filter((unit) =>
      (unit.group || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((unit) => (filterGroup ? unit.group === filterGroup : true))
    .filter((unit) =>
      filterStatus
        ? statusMap[unit.status || "COLLECTED"] === filterStatus
        : true
    )
    .sort(sortBy ? sortFunction : undefined);

  const bloodGroupStats = bloodUnits.reduce<Record<string, number>>(
    (acc, unit) => {
      acc[unit.group] = (acc[unit.group] || 0) + unit.quantity;
      return acc;
    },
    {}
  );

  const bloodOrder = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
  const chartData = Object.entries(bloodGroupStats)
    .map(([group, quantity]) => ({ group, quantity }))
    .sort((a, b) => bloodOrder.indexOf(a.group) - bloodOrder.indexOf(b.group));

  const statusStats = bloodUnits.reduce<Record<string, number>>((acc, unit) => {
    const status = getStatusLabel(unit.expiryDate);
    acc[status] = (acc[status] || 0) + unit.quantity;
    return acc;
  }, {});

  const chartDataByStatus = Object.entries(statusStats).map(
    ([status, quantity]) => ({ status, quantity })
  );

  // Mở modal xác nhận xóa
  const handleDeleteClick = (id: number) => {
    setSelectedUnitId(id);
    setShowDeleteModal(true);
  };
  // Mở modal xác nhận cập nhật
  const handleEditClick = (id: number) => {
    setSelectedUnitId(id);
    setShowEditModal(true);
    setSelectedStatus("");
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!selectedUnitId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/blood/units/${selectedUnitId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Lỗi khi xóa túi máu");
      fetchBloodUnits();
      setShowDeleteModal(false);
      setSelectedUnitId(null);
    } catch (err) {
      alert("Xóa túi máu thất bại!");
      setShowDeleteModal(false);
      setSelectedUnitId(null);
    }
  };

  // Xác nhận cập nhật trạng thái
  const confirmEdit = async () => {
    if (!selectedUnitId || !selectedStatus) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/blood/units/${selectedUnitId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );
      if (!res.ok) throw new Error("Lỗi khi cập nhật trạng thái túi máu");
      fetchBloodUnits();
      setShowEditModal(false);
      setSelectedUnitId(null);
      setSelectedStatus("");
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
      setShowEditModal(false);
      setSelectedUnitId(null);
      setSelectedStatus("");
    }
  };

  // ========== Giao diện chính ==========
  return (
    <div>
      {/* ========== Header ========= */}
      <header className="manager-header">
        <div className="manager-logo">
          <Link to="/">
            <img src={logoBlood} alt="Logo" className="logo-img" />
          </Link>
        </div>
        <div className="manager-greeting">
          Xin chào,{" "}
          <span className="manager-name">
            {user?.fullName || "Quản lí kho máu"}
          </span>
        </div>
        <button
          className="manager-logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Đăng xuất
        </button>
      </header>

      {/* ========== Layout có sidebar và nội dung ========= */}
      <div className="manager-layout">
        <div className="sidebar">
          <div className="sidebar-title">Quản lý hệ thống</div>
          <ul className="sidebar-menu">
            <li className={view === "dashboard" ? "active" : ""}>
              <button
                className="menu-item"
                onClick={() => setView("dashboard")}
              >
                Kho máu
              </button>
            </li>
            <li className={view === "add" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("add")}>
                Thêm máu
              </button>
            </li>
            <li className={view === "stats" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("stats")}>
                Thống kê kho máu
              </button>
            </li>
            <li className={view === "wholeBloodRequestList" ? "active" : ""}>
              <button
                className="menu-item"
                onClick={() => setView("wholeBloodRequestList")}
              >
                Yêu cầu máu toàn phần
              </button>
            </li>
            <li
              className={view === "componentBloodRequestList" ? "active" : ""}
            >
              <button
                className="menu-item"
                onClick={() => setView("componentBloodRequestList")}
              >
                Yêu cầu máu thành phần
              </button>
            </li>
          </ul>
        </div>

        {/* === Nội dung chính theo từng chế độ xem === */}
        <div className="manager-container">
          {/* --- Trang danh sách máu --- */}
          {view === "dashboard" && (
            <>
              <h2>Quản lý kho máu</h2>
              <div className="filter-container">
                <input
                  type="text"
                  placeholder="Tìm nhóm máu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                >
                  <option value="">Tất cả nhóm máu</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Còn hạn">Còn hạn</option>
                  <option value="Gần hết hạn">Gần hết hạn</option>
                  <option value="Hết hạn">Hết hạn</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sắp xếp theo</option>
                  <option value="entry">Ngày nhập</option>
                  <option value="expiry">Hạn sử dụng</option>
                </select>
              </div>

              <table className="blood-table">
                <thead>
                  <tr>
                    <th>ID</th>
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
                    <tr>
                      <td colSpan={7}>Không có dữ liệu</td>
                    </tr>
                  ) : (
                    filteredUnits.map((unit, index) => {
                      const status = getStatusLabel(unit.expiryDate);
                      return (
                        <tr
                          key={unit.id}
                          className={getRowClass(unit.expiryDate)}
                        >
                          <td>{index + 1}</td>
                          <td>{unit.group}</td>
                          <td>{unit.quantity}</td>
                          <td>{unit.entryDate}</td>
                          <td>{unit.expiryDate}</td>
                          <td>
                            <span
                              className={`status-badge status-${(
                                unit.status || "collected"
                              ).toLowerCase()} ${
                                statusClassMap[
                                  statusMap[unit.status || "COLLECTED"]
                                ]
                              }`}
                            >
                              {statusMap[unit.status || "COLLECTED"]}
                            </span>
                          </td>
                          <td className="table-action-cell">
                            <div className="table-action-buttons">
                              {/* Nút sửa */}
                              <button
                                className="action-button-icon"
                                onClick={() => handleEditClick(unit.id)}
                              >
                                <img src={EditImg} alt="Sửa" />
                              </button>

                              {/* Nút xoá */}
                              <button
                                className="action-button-icon"
                                onClick={() => handleDeleteClick(unit.id)}
                              >
                                <img src={DeleteImg} alt="Xóa" />
                              </button>
                            </div>
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
              <h2 className="form-page-title">Thêm đơn vị máu mới</h2>
              <div className="blood-form">
                <label>Nhóm máu</label>
                <div>
                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn nhóm máu --</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <label>Số lượng (đơn vị)</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Nhập số lượng"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />

                <label>Ngày nhập (dd/mm/yyyy)</label>
                <input
                  type="text"
                  name="entryDate"
                  placeholder="VD: 12/06/2025"
                  value={formData.entryDate}
                  onChange={handleInputChange}
                />

                <label>Hạn sử dụng (dd/mm/yyyy)</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="VD: 20/06/2025"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />

                <button onClick={addBloodUnit}>Thêm đơn vị máu</button>
              </div>
            </>
          )}

          {view === "stats" && (
            <>
              <h2>Thống kê kho máu</h2>

              {/* Biểu đồ theo nhóm máu */}
              <div style={{ width: "100%", height: 400, marginBottom: 150 }}>
                <h3>Số lượng theo nhóm máu</h3>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="quantity"
                      fill="#4caf50"
                      name="Số lượng"
                      barSize={70}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Biểu đồ theo trạng thái */}
              <div style={{ width: "100%", height: 400 }}>
                <h3>Số lượng theo trạng thái</h3>
                <ResponsiveContainer>
                  <BarChart data={chartDataByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="quantity"
                      name="Số lượng"
                      barSize={100} // 👈 Kích thước cột
                    >
                      {chartDataByStatus.map((entry, index) => {
                        let fillColor = "#ccc";
                        if (entry.status === "Còn hạn") fillColor = "#4caf50";
                        else if (entry.status === "Gần hết hạn")
                          fillColor = "#ff9800";
                        else if (entry.status === "Hết hạn")
                          fillColor = "#f44336";
                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {view === "wholeBloodRequestList" && <WholeBloodRequestList />}
          {view === "componentBloodRequestList" && (
            <ComponentBloodRequestList />
          )}
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa túi máu</h3>
            {(() => {
              const unit = bloodUnits.find((u) => u.id === selectedUnitId);
              return unit ? (
                <div style={{ textAlign: "left", marginBottom: 16 }}>
                  <div>
                    <strong>ID:</strong> {unit.id}
                  </div>
                  <div>
                    <strong>Nhóm máu:</strong> {unit.group}
                  </div>
                  <div>
                    <strong>Ngày nhập:</strong> {unit.entryDate}
                  </div>
                  <div>
                    <strong>Hạn sử dụng:</strong> {unit.expiryDate}
                  </div>
                  <div>
                    <strong>Trạng thái hiện tại:</strong>{" "}
                    {statusMap[unit.status || "COLLECTED"]}
                  </div>
                </div>
              ) : null;
            })()}
            <p>
              Bạn có chắc chắn muốn{" "}
              <span style={{ color: "#FF204E", fontWeight: "bold" }}>xóa</span>{" "}
              túi máu này không?
            </p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="modal-confirm">
                Xóa
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận cập nhật trạng thái */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cập nhật trạng thái túi máu</h3>
            {(() => {
              const unit = bloodUnits.find((u) => u.id === selectedUnitId);
              return unit ? (
                <div style={{ textAlign: "left", marginBottom: 16 }}>
                  <div>
                    <strong>ID:</strong> {unit.id}
                  </div>
                  <div>
                    <strong>Nhóm máu:</strong> {unit.group}
                  </div>
                  <div>
                    <strong>Ngày nhập:</strong> {unit.entryDate}
                  </div>
                  <div>
                    <strong>Hạn sử dụng:</strong> {unit.expiryDate}
                  </div>
                  <div>
                    <strong>Trạng thái hiện tại:</strong>{" "}
                    {statusMap[unit.status || "COLLECTED"]}
                  </div>
                </div>
              ) : null;
            })()}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">-- Chọn trạng thái mới --</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedStatus && (
              <p style={{ marginTop: 10 }}>
                Bạn có chắc chắn muốn chuyển trạng thái túi máu{" "}
                <strong>{selectedUnitId}</strong> sang{" "}
                <strong>{statusMap[selectedStatus]}</strong> không?
              </p>
            )}
            <div className="modal-actions">
              <button
                onClick={confirmEdit}
                className="modal-confirm"
                disabled={!selectedStatus}
              >
                Cập nhật
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
