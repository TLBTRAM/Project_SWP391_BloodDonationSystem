// ========== Import thư viện & thành phần cần thiết ==========
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoBlood from "./images/Logo/logo_blood.png";
import "./components/Manager.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ========== Định nghĩa kiểu dữ liệu đơn vị máu ==========
interface BloodUnit {
  id: number;
  group: string;
  quantity: number;
  entryDate: string;
  expiryDate: string;
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
    expiryDate: "10/06/2025",
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
  // ========== Các state lưu dữ liệu ==========
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    group: "",
    quantity: "",
    entryDate: "",
    expiryDate: "",
  });
  const [view, setView] = useState<"dashboard" | "add" | "stats" | "requests">(
    "dashboard"
  );
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("FE token:", token); // debug

    if (token) {
      fetch("http://localhost:8080/api/account/me", {
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
          setUser(data);
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

  // ========== Thêm đơn vị máu mới ==========
  const addBloodUnit = () => {
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

  // ========== Xoá đơn vị máu ==========
  const deleteUnit = (id: number) => {
    setBloodUnits(bloodUnits.filter((unit) => unit.id !== id));
  };

  // ========== Tính trạng thái máu dựa theo hạn sử dụng ==========
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
  // ========== Gán class cho từng dòng bảng theo trạng thái ==========
  const getRowClass = (expiryDate: string) => {
    const status = getStatusLabel(expiryDate);
    if (status === "Hết hạn") return "expired";
    if (status === "Gần hết hạn") return "nearly-expired";
    return "";
  };
  // ========== Gán màu sắc cho trạng thái ==========
  const statusClassMap: Record<string, string> = {
    "Còn hạn": "status-ok",
    "Gần hết hạn": "status-warning",
    "Hết hạn": "status-expired",
  };

  // ========== Hàm sắp xếp ==========
  const sortFunction = (a: BloodUnit, b: BloodUnit) => {
    const dateA = sortBy === "entry" ? a.entryDate : a.expiryDate;
    const dateB = sortBy === "entry" ? b.entryDate : b.expiryDate;
    const [da, ma, ya] = dateA.split("/").map(Number);
    const [db, mb, yb] = dateB.split("/").map(Number);
    const d1 = new Date(ya, ma - 1, da);
    const d2 = new Date(yb, mb - 1, db);
    return d1.getTime() - d2.getTime();
  };
  // ========== Lọc và sắp xếp danh sách máu ==========
  const filteredUnits = bloodUnits
    .filter((unit) =>
      unit.group.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((unit) => (filterGroup ? unit.group === filterGroup : true))
    .filter((unit) => {
      const status = getStatusLabel(unit.expiryDate);
      return filterStatus ? status === filterStatus : true;
    })
    .sort(sortBy ? sortFunction : undefined);

  // ========== Dữ liệu thống kê theo nhóm máu ==========
  const bloodGroupStats = bloodUnits.reduce<Record<string, number>>(
    (acc, unit) => {
      acc[unit.group] = (acc[unit.group] || 0) + unit.quantity;
      return acc;
    },
    {}
  );

  // Thứ tự nhóm máu cần sắp xếp
  const bloodOrder = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];

  // Chuyển sang mảng và sắp xếp đúng thứ tự nhóm máu
  const chartData = Object.entries(bloodGroupStats)
    .map(([group, quantity]) => ({ group, quantity }))
    .sort((a, b) => bloodOrder.indexOf(a.group) - bloodOrder.indexOf(b.group));

  // ========== Dữ liệu thống kê theo trạng thái ==========
  const statusStats = bloodUnits.reduce<Record<string, number>>((acc, unit) => {
    const status = getStatusLabel(unit.expiryDate);
    acc[status] = (acc[status] || 0) + unit.quantity;
    return acc;
  }, {});

  const chartDataByStatus = Object.entries(statusStats).map(
    ([status, quantity]) => ({
      status,
      quantity,
    })
  );

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
          <span className="manager-name">{user?.fullName || "Quản lí kho máu"}</span>
        </div>
        <button
          className="manager-logout-btn"
          onClick={() => {
            localStorage.removeItem("token"); 
            alert("Đăng xuất thành công!");
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
            <li className={view === "requests" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("requests")}>
                Yêu cầu giao nhận máu
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
                              className={`status-badge ${statusClassMap[status]}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td>
                            <button onClick={() => deleteUnit(unit.id)}>
                              Xoá
                            </button>
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

          {/* --- Trang yêu cầu cần máu --- */}
          {view === "requests" && (
            <>
              <h2>Yêu cầu giao nhận máu</h2>
              <p>Chức năng này đang được phát triển...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manager;
