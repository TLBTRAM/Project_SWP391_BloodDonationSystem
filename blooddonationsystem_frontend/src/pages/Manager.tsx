// ========== Import thư viện & thành phần cần thiết ==========
import React, { useState, useEffect } from "react";
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

// Định nghĩa kiểu dữ liệu cho yêu cầu nhận máu
interface BloodRequest {
  id: number;
  requestDate: string;
  patientName: string;
  bloodType: string;
  requiredVolume: number;
  status: string;
  hospitalName: string;
  phone: string;
  gender: string;
  medicalCondition: string;
  address: string;
  createdAt?: string; // Thêm trường createdAt
  fullName?: string; // Thêm trường fullName
  rhType?: string; // Thêm trường rhType
}

// Định nghĩa kiểu dữ liệu cho yêu cầu nhận máu thành phần
interface ComponentBloodRequest {
  id: number;
  requestDate: string;
  patientName: string;
  bloodType: string;
  redCellQuantity: number;
  plasmaQuantity: number;
  plateletQuantity: number;
  status: string;
  hospitalName: string;
  phone: string;
  gender: string;
  medicalCondition: string;
  address: string;
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
  const [view, setView] = useState<"dashboard" | "add" | "stats" | "requests" | "componentRequests" | "componentStock">(
    "dashboard"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // KHỞI TẠO LÀ MẢNG RỖNG, KHÔNG DÙNG SAMPLE DATA
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestTab, setRequestTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // KHỞI TẠO LÀ MẢNG RỖNG, KHÔNG DÙNG SAMPLE DATA
  const [componentRequests, setComponentRequests] = useState<ComponentBloodRequest[]>([]);
  const [loadingComponentRequests, setLoadingComponentRequests] = useState(false);
  const [componentRequestTab, setComponentRequestTab] = useState("ALL");
  const [componentPage, setComponentPage] = useState(1);
  const COMPONENT_PAGE_SIZE = 5;
  const [showComponentDetail, setShowComponentDetail] = useState(false);
  const [selectedComponentRequest, setSelectedComponentRequest] = useState<ComponentBloodRequest | null>(null);

  // Thêm state cho popup lỗi
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");

  // Các biến phân trang và filter cho component requests (đặt ngoài JSX)
  const filteredComponentRequests = componentRequestTab === "ALL" ? componentRequests : componentRequests.filter(r => r.status === componentRequestTab);
  const pagedComponentRequests = filteredComponentRequests.slice((componentPage-1)*COMPONENT_PAGE_SIZE, componentPage*COMPONENT_PAGE_SIZE);
  const totalComponentPages = Math.ceil(filteredComponentRequests.length / COMPONENT_PAGE_SIZE);

  // Thêm state cho tab kho máu
  const [bloodUnitTab, setBloodUnitTab] = useState("ALL");

  // Tab trạng thái kho máu
  const bloodUnitTabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "COLLECTED", label: "Đã thu thập" },
    { key: "SEPARATED", label: "Đã tách" },
    { key: "USED", label: "Đã sử dụng" },
    { key: "EXPIRED", label: "Hết hạn" }
  ];

  // Thêm state lưu id túi máu được chọn (nếu cần)
  const [selectedBloodUnitId, setSelectedBloodUnitId] = useState<number | null>(null);

  // Thêm hàm kiểm tra định dạng ngày dd/mm/yyyy
  function isValidDate(dateStr: string): boolean {
    // Kiểm tra đúng định dạng dd/mm/yyyy
    if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dateStr)) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    // Kiểm tra ngày thực tế
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  // Thêm hàm kiểm tra máu gần hết hạn
  function isNearlyExpired(expiryDate: string) {
    if (!expiryDate) return false;
    // Đảm bảo expiryDate là yyyy-MM-dd
    const parts = expiryDate.split("-");
    if (parts.length !== 3) return false;
    const exp = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const diff = (exp.getTime() - todayUTC.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 3;
  }

  // State cho popup phân tách máu
  const [showSeparateForm, setShowSeparateForm] = useState(false);
  const [separateFormId, setSeparateFormId] = useState<number | null>(null);
  const [separateForm, setSeparateForm] = useState({ redCellVolume: '', plasmaVolume: '', plateletVolume: '' });
  const [separateError, setSeparateError] = useState('');

  const openSeparateForm = (id: number) => {
    setSeparateFormId(id);
    setSeparateForm({ redCellVolume: '', plasmaVolume: '', plateletVolume: '' });
    setSeparateError('');
    setShowSeparateForm(true);
  };
  const closeSeparateForm = () => {
    setShowSeparateForm(false);
    setSeparateFormId(null);
    setSeparateError('');
  };

  const handleSeparateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeparateForm({ ...separateForm, [e.target.name]: e.target.value });
  };

  const handleSeparateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const redCellVolume = Number(separateForm.redCellVolume);
    const plasmaVolume = Number(separateForm.plasmaVolume);
    const plateletVolume = Number(separateForm.plateletVolume);
    if (
      isNaN(redCellVolume) || isNaN(plasmaVolume) || isNaN(plateletVolume) ||
      redCellVolume < 0 || plasmaVolume < 0 || plateletVolume < 0
    ) {
      setSeparateError('Vui lòng nhập số hợp lệ!');
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood/separate/${separateFormId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ redCellVolume, plasmaVolume, plateletVolume })
      });
      if (!res.ok) throw new Error("Lỗi phân tách máu");
      alert("Phân tách thành công!");
      await fetchBloodUnits();
      closeSeparateForm();
    } catch (err) {
      setSeparateError('Phân tách thất bại!');
    }
  };

  // Hàm phân tách máu
  const separateBloodUnit = async (id: number) => {
    // Hỏi người dùng nhập số ml cho từng thành phần
    const redCellVolume = Number(prompt("Nhập thể tích Hồng cầu (ml):", "0"));
    const plasmaVolume = Number(prompt("Nhập thể tích Huyết tương (ml):", "0"));
    const plateletVolume = Number(prompt("Nhập thể tích Tiểu cầu (ml):", "0"));
    if (
      isNaN(redCellVolume) || isNaN(plasmaVolume) || isNaN(plateletVolume)
      || redCellVolume < 0 || plasmaVolume < 0 || plateletVolume < 0
    ) {
      alert("Vui lòng nhập số hợp lệ!");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood/separate/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          redCellVolume,
          plasmaVolume,
          plateletVolume
        })
      });
      if (!res.ok) throw new Error("Lỗi phân tách máu");
      alert("Phân tách thành công!");
      await fetchBloodUnits();
    } catch (err) {
      alert("Phân tách thất bại!");
    }
  };

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
        group: item.bloodType + (item.rhType === "POSITIVE" ? "+" : item.rhType === "NEGATIVE" ? "-" : ""),
        quantity: item.totalVolume,
        entryDate: item.collectedDate,
        expiryDate: item.expirationDate,
        status: item.status // lấy status từ backend
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
    // Kiểm tra định dạng ngày
    if (!isValidDate(formData.entryDate) || !isValidDate(formData.expiryDate)) {
      alert("Ngày nhập hoặc hạn sử dụng không hợp lệ. Định dạng phải là dd/mm/yyyy.");
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
      expirationDate: toISO(formData.expiryDate)
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
      // Giữ nguyên tab Thêm máu, không chuyển về dashboard
      // setView("dashboard"); // XÓA DÒNG NÀY
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
      const res = await fetch(`http://localhost:8080/api/blood/units/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
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
    READY: "Đã duyệt"
  };
  const statusOptions = [
    { value: "COLLECTED", label: "Còn hạn" },
    { value: "SEPARATED", label: "Đã tách" },
    { value: "USED", label: "Đã sử dụng" },
    { value: "EXPIRED", label: "Hết hạn" },
    { value: "NEARLY_EXPIRED", label: "Gần hết hạn" },
    { value: "READY", label: "Đã duyệt" }
  ];

  const sortFunction = (a: BloodUnit, b: BloodUnit) => {
    const dateA = sortBy === "entry" ? a.entryDate : a.expiryDate;
    const dateB = sortBy === "entry" ? b.entryDate : b.expiryDate;
    const d1 = parseDate(dateA);
    const d2 = parseDate(dateB);
    return d1.getTime() - d2.getTime();
  };

  const filteredUnits = bloodUnits
    .filter((unit) => (unit.group || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((unit) => (filterGroup ? unit.group === filterGroup : true))
    .filter((unit) => (filterStatus ? statusMap[unit.status || 'COLLECTED'] === filterStatus : true))
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

  // Tab filter cho 4 trạng thái + tất cả
  const requestTabs = [
    { key: "PENDING", label: "Chờ duyệt" },
    { key: "READY", label: "Đã duyệt" },
    { key: "REJECTED", label: "Đã từ chối" },
    { key: "COMPLETED", label: "Đã hoàn tất" },
    { key: "ALL", label: "Tất cả" }
  ];

  // Lọc và phân trang
  const filteredRequests = requestTab === "ALL" ? bloodRequests : bloodRequests.filter(r => r.status === requestTab);
  const pagedRequests = filteredRequests.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE);

  // FETCH DỮ LIỆU YÊU CẦU MÁU TOÀN PHẦN TỪ BACKEND KHI VÀO TAB 'requests'
  useEffect(() => {
    if (view === "requests") {
      setLoadingRequests(true);
      const token = localStorage.getItem("token");
      fetch("http://localhost:8080/api/blood-requests/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Map dữ liệu từ API về đúng format FE
          const mapped = data.map((item: any) => ({
            id: item.id,
            requestDate: item.requestDate || (item.createdAt ? item.createdAt.split('T')[0] : ""),
            patientName: item.patientName || (item.pendingPatientRequest ? item.pendingPatientRequest.fullName : ""),
            bloodType: item.bloodType, // chỉ lấy string gốc
            rhType: item.rhType,       // chỉ lấy string gốc
            requiredVolume: item.requiredVolume || 0,
            status: item.status,
            hospitalName: item.hospitalName || "",
            phone: item.phone || (item.pendingPatientRequest ? item.pendingPatientRequest.phone : ""),
            gender: item.gender || (item.pendingPatientRequest ? item.pendingPatientRequest.gender : ""),
            medicalCondition: item.medicalCondition || "",
            address: item.address || (item.pendingPatientRequest ? item.pendingPatientRequest.address : ""),
            createdAt: item.createdAt || "",
            fullName: item.fullName || (item.pendingPatientRequest ? item.pendingPatientRequest.fullName : "")
          }));
          setBloodRequests(mapped);
          setLoadingRequests(false);
        })
        .catch(() => setLoadingRequests(false));
    }
    // eslint-disable-next-line
  }, [view]);

  // FETCH DỮ LIỆU YÊU CẦU MÁU THÀNH PHẦN TỪ BACKEND KHI VÀO TAB 'componentRequests'
  useEffect(() => {
    if (view === "componentRequests") {
      setLoadingComponentRequests(true);
      const token = localStorage.getItem("token");
      fetch("http://localhost:8080/api/blood-requests/component/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // Map dữ liệu từ API về đúng format FE
          const mapped = data.map((item: any) => ({
            id: item.id,
            requestDate: item.requestDate || (item.createdAt ? item.createdAt.split('T')[0] : ""),
            patientName: item.patientName || (item.pendingPatientRequest ? item.pendingPatientRequest.fullName : ""),
            bloodType: item.bloodType + (item.rhType === "POSITIVE" ? "+" : item.rhType === "NEGATIVE" ? "-" : ""),
            redCellQuantity: item.redCellQuantity || 0,
            plasmaQuantity: item.plasmaQuantity || 0,
            plateletQuantity: item.plateletQuantity || 0,
            status: item.status,
            hospitalName: item.hospitalName || "",
            phone: item.phone || (item.pendingPatientRequest ? item.pendingPatientRequest.phone : ""),
            gender: item.gender || (item.pendingPatientRequest ? item.pendingPatientRequest.gender : ""),
            medicalCondition: item.medicalCondition || "",
            address: item.address || (item.pendingPatientRequest ? item.pendingPatientRequest.address : "")
          }));
          setComponentRequests(mapped);
          setLoadingComponentRequests(false);
        })
        .catch(() => setLoadingComponentRequests(false));
    }
    // eslint-disable-next-line
  }, [view]);

  // ====== API thao tác yêu cầu whole blood ======
  const approveWholeRequest = async (id: number) => {
    const token = localStorage.getItem("token");
    // Tìm thông tin nhóm máu của yêu cầu này
    const req = bloodRequests.find(r => r.id === id);
    const bloodGroupLabel = req ? `${req.bloodType}${req.rhType === 'POSITIVE' ? '+' : req.rhType === 'NEGATIVE' ? '-' : ''}` : '';
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 400) {
          // Lấy message chi tiết nếu có
          let msg = '';
          try { msg = (await res.json()).message; } catch {}
          if (msg && (msg.includes('không đủ') || msg.includes('Không tìm thấy đơn vị máu phù hợp'))) {
            setErrorPopupMessage(`Nhóm máu ${bloodGroupLabel} trong kho không đủ để hiến.`);
          } else {
            setErrorPopupMessage(msg || `Nhóm máu ${bloodGroupLabel} trong kho không đủ để hiến.`);
          }
          setShowErrorPopup(true);
          setTimeout(() => setShowErrorPopup(false), 3000);
        } else {
          setErrorPopupMessage("Duyệt thất bại!");
          setShowErrorPopup(true);
          setTimeout(() => setShowErrorPopup(false), 3000);
        }
        return;
      }
      setErrorPopupMessage("");
      setShowErrorPopup(false);
      alert("Duyệt thành công!");
      setLoadingRequests(true);
      await fetchBloodUnits();
      // Gọi lại fetch blood requests
      const res2 = await fetch("http://localhost:8080/api/blood-requests/all", { headers: { Authorization: `Bearer ${token}` } });
      setBloodRequests(await res2.json());
      setLoadingRequests(false);
    } catch (err) {
      setErrorPopupMessage("Duyệt thất bại!");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };
  const rejectWholeRequest = async (id: number) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/whole-requests/${id}/reject?reason=${encodeURIComponent(reason)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Lỗi từ chối yêu cầu");
      alert("Từ chối thành công!");
      setLoadingRequests(true);
      await fetchBloodUnits();
      setLoadingRequests(false);
    } catch (err) {
      alert("Từ chối thất bại!");
    }
  };
  const completeWholeRequest = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/whole-requests/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Lỗi hoàn tất yêu cầu");
      alert("Hoàn tất thành công!");
      setLoadingRequests(true);
      await fetchBloodUnits();
      setLoadingRequests(false);
    } catch (err) {
      alert("Hoàn tất thất bại!");
    }
  };

  // ====== API thao tác yêu cầu máu thành phần ======
  const approveComponentRequest = async (id: number) => {
    console.log("Approve component request id:", id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/component/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        let msg = "Duyệt thất bại!";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }
      alert("Duyệt thành công!");
      setLoadingComponentRequests(true);
      // reload
      const res2 = await fetch("http://localhost:8080/api/blood-requests/component/all", { headers: { Authorization: `Bearer ${token}` } });
      setComponentRequests(await res2.json());
      setLoadingComponentRequests(false);
    } catch (err) {
      alert("Duyệt thất bại!");
    }
  };
  const rejectComponentRequest = async (id: number) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/component/${id}/reject?reason=${encodeURIComponent(reason)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Lỗi từ chối yêu cầu thành phần");
      alert("Từ chối thành công!");
      setLoadingComponentRequests(true);
      const res2 = await fetch("http://localhost:8080/api/blood-requests/component/all", { headers: { Authorization: `Bearer ${token}` } });
      setComponentRequests(await res2.json());
      setLoadingComponentRequests(false);
    } catch (err) {
      alert("Từ chối thất bại!");
    }
  };
  const completeComponentRequest = async (id: number) => {
    console.log("Complete component request id:", id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/blood-requests/component/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        let msg = "Hoàn tất thất bại!";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }
      alert("Hoàn tất thành công!");
      setLoadingComponentRequests(true);
      const res2 = await fetch("http://localhost:8080/api/blood-requests/component/all", { headers: { Authorization: `Bearer ${token}` } });
      setComponentRequests(await res2.json());
      setLoadingComponentRequests(false);
    } catch (err) {
      alert("Hoàn tất thất bại!");
    }
  };

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
      const res = await fetch(`http://localhost:8080/api/blood/units/${selectedUnitId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await fetch(`http://localhost:8080/api/blood/units/${selectedUnitId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật trạng thái túi máu");
      await fetchBloodUnits();
      setShowEditModal(false);
      setSelectedUnitId(null);
      setSelectedStatus("");
      setFilterStatus(""); // Reset filterStatus để luôn hiển thị lại danh sách máu mới nhất
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
      setShowEditModal(false);
      setSelectedUnitId(null);
      setSelectedStatus("");
    }
  };

  // State cho kho máu phân tích
  const [componentView, setComponentView] = useState<'list'>('list');
  const [bloodComponents, setBloodComponents] = useState<any[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [componentTab, setComponentTab] = useState('ALL');
  const [componentSearch, setComponentSearch] = useState('');
  const [componentTypeFilter, setComponentTypeFilter] = useState('');
  const [componentStatusFilter, setComponentStatusFilter] = useState('');
  const [componentStockPage, setComponentStockPage] = useState(1);
  const COMPONENT_STOCK_PAGE_SIZE = 10;

  const componentTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'RED_CELL', label: 'Hồng cầu' },
    { key: 'PLASMA', label: 'Huyết tương' },
    { key: 'PLATELET', label: 'Tiểu cầu' }
  ];
  const componentStatusTabs = [
    { key: '', label: 'Tất cả trạng thái' },
    { key: 'AVAILABLE', label: 'Còn hạn' },
    { key: 'USED', label: 'Đã sử dụng' },
    { key: 'EXPIRED', label: 'Hết hạn' }
  ];

  // Fetch máu phân tích khi vào tab
  React.useEffect(() => {
    if (view === 'componentStock') {
      setLoadingComponents(true);
      const token = localStorage.getItem('token');
      fetch('http://localhost:8080/api/blood/components', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setBloodComponents(data);
          setLoadingComponents(false);
        })
        .catch(() => setLoadingComponents(false));
    }
  }, [view]);

  // State phân trang cho kho máu
  const [bloodPage, setBloodPage] = useState(1);
  const BLOOD_PAGE_SIZE = 5;

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
            <li className={view === "componentStock" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("componentStock")}>Kho máu phân tách</button>
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
              <button className="menu-item" onClick={() => setView("requests")}>Yêu cầu giao nhận máu toàn phần</button>
            </li>
            <li className={view === "componentRequests" ? "active" : ""}>
              <button className="menu-item" onClick={() => setView("componentRequests")}>Yêu cầu giao nhận máu thành phần</button>
            </li>
          </ul>
        </div>

        {/* === Nội dung chính theo từng chế độ xem === */}
        <div className="manager-container">
          {/* --- Trang danh sách máu --- */}
          {view === "dashboard" && (
            <>
              <h2>Quản lý kho máu</h2>
              {/* Tab phân loại trạng thái kho máu */}
              <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:18}}>
                {bloodUnitTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={bloodUnitTab === tab.key ? "tab-btn active" : "tab-btn"}
                    onClick={()=>{setBloodUnitTab(tab.key);}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
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
                  <option value="COLLECTED">Đã thu thập</option>
                  <option value="SEPARATED">Đã tách</option>
                  <option value="USED">Đã sử dụng</option>
                  <option value="EXPIRED">Hết hạn</option>
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
              <table className="registration-table">
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
                  {/* Lọc kho máu theo tab trạng thái */}
                  {(() => {
                    const filtered = bloodUnitTab === "ALL" ? filteredUnits : filteredUnits.filter(unit => (unit.status || "COLLECTED") === bloodUnitTab);
                    const paged = filtered.slice((bloodPage-1)*BLOOD_PAGE_SIZE, bloodPage*BLOOD_PAGE_SIZE);
                    if (paged.length === 0) return <tr><td colSpan={7}>Không có dữ liệu</td></tr>;
                    return paged.map((unit, index) => (
                      <tr key={unit.id} className={getRowClass(unit.expiryDate)}>
                        <td>{unit.id}</td>
                        <td>{unit.group}</td>
                        <td>{unit.quantity}</td>
                        <td>{unit.entryDate}</td>
                        <td>{unit.expiryDate}</td>
                        <td>
                          <span
                            className={`status-badge status-${(unit.status || 'collected').toLowerCase()} ${statusClassMap[statusMap[unit.status || 'COLLECTED']]}`}
                            style={{ cursor: bloodUnitTab === 'COLLECTED' ? 'pointer' : undefined, border: selectedBloodUnitId === unit.id ? '2px solid #1976d2' : undefined }}
                            onClick={() => {
                              if (bloodUnitTab === 'COLLECTED') setSelectedBloodUnitId(unit.id);
                            }}
                          >
                            {statusMap[unit.status || 'COLLECTED']}
                            {bloodUnitTab === 'COLLECTED' && unit.status === 'COLLECTED' && isNearlyExpired(unit.expiryDate) && (
                              <span style={{
                                background: "#ff9800",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "2px 8px",
                                marginLeft: 8,
                                fontSize: 12,
                                fontWeight: 600
                              }}>Gần hết hạn</span>
                            )}
                          </span>
                          {bloodUnitTab === 'COLLECTED' && unit.status === 'COLLECTED' && (
                            <button
                              style={{
                                marginLeft: 10,
                                background: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 13
                              }}
                              onClick={() => openSeparateForm(unit.id)}
                            >
                              Phân tách
                            </button>
                          )}
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
                    ));
                  })()}
                </tbody>
              </table>
              {/* Phân trang cho kho máu */}
              {(() => {
                const filtered = bloodUnitTab === "ALL" ? filteredUnits : filteredUnits.filter(unit => (unit.status || "COLLECTED") === bloodUnitTab);
                const totalPages = Math.ceil(filtered.length / BLOOD_PAGE_SIZE);
                if (totalPages <= 1) return null;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                    <button onClick={() => setBloodPage(bloodPage - 1)} disabled={bloodPage === 1} style={{ marginRight: 8 }}>&lt;</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setBloodPage(p)} className={p === bloodPage ? 'tab-btn active' : 'tab-btn'} style={{ margin: '0 2px', minWidth: 36 }}>{p}</button>
                    ))}
                    <button onClick={() => setBloodPage(bloodPage + 1)} disabled={bloodPage === totalPages} style={{ marginLeft: 8 }}>&gt;</button>
                  </div>
                );
              })()}
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

          {/* --- Trang yêu cầu cần máu toàn phần --- */}
          {view === "requests" && (
            <>
              <h2>Yêu cầu giao nhận máu toàn phần</h2>
              <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:18}}>
                {requestTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={requestTab === tab.key ? "tab-btn active" : "tab-btn"}
                    onClick={()=>{setRequestTab(tab.key); setPage(1);}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {loadingRequests ? (
                <div style={{textAlign:'center', margin:'32px 0'}}>Đang tải dữ liệu...</div>
              ) : (
                <>
                  <table className="registration-table">
                    <thead>
                      <tr>
                        <th>Ngày yêu cầu</th>
                        <th>Bệnh nhân</th>
                        <th>Nhóm máu</th>
                        <th>Thể tích (ml)</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRequests.length === 0 ? (
                        <tr><td colSpan={6}>Không có dữ liệu</td></tr>
                      ) : (
                        pagedRequests.map((req) => (
                          <tr key={req.id}>
                            <td>{req.requestDate || req.createdAt || ""}</td>
                            <td>{req.patientName || req.fullName || ""}</td>
                            <td>{req.bloodType}{req.rhType === 'POSITIVE' ? '+' : req.rhType === 'NEGATIVE' ? '-' : ''}</td>
                            <td>{req.requiredVolume}</td>
                            <td>
                              {req.status === 'PENDING' && <span className="status-pending">CHỜ DUYỆT</span>}
                              {req.status === 'READY' && <span className="status-approved">ĐÃ DUYỆT</span>}
                              {req.status === 'REJECTED' && <span style={{color:'#b22b2b', fontWeight:'bold'}}>ĐÃ TỪ CHỐI</span>}
                              {req.status === 'COMPLETED' && <span style={{color:'#43a047', fontWeight:'bold'}}>ĐÃ HOÀN TẤT</span>}
                            </td>
                            <td className="table-action-cell" style={{display:'flex', justifyContent:'flex-end', alignItems:'center', gap:6}}>
                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'PENDING' ? 'inline-block' : 'none',
                                  width:110,
                                  padding:'6px 0',
                                  flexShrink:0,
                                  background:'#43a047', // xanh lá cây
                                  color:'#fff',
                                  border:'none',
                                  borderRadius:6,
                                  fontWeight:600,
                                  cursor:'pointer',
                                  transition:'background 0.2s'
                                }}
                                onClick={() => approveWholeRequest(req.id)}
                              >Duyệt</button>
                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'PENDING' ? 'inline-block' : 'none',
                                  width:110,
                                  padding:'6px 0',
                                  flexShrink:0,
                                  background:'#e53935', // đỏ
                                  color:'#fff',
                                  border:'none',
                                  borderRadius:6,
                                  fontWeight:600,
                                  cursor:'pointer',
                                  transition:'background 0.2s'
                                }}
                                onClick={() => rejectWholeRequest(req.id)}
                              >Từ chối</button>
                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'READY' ? 'inline-block' : 'none',
                                  width:110,
                                  padding:'6px 0',
                                  flexShrink:0,
                                  background:'#43a047',
                                  color:'#fff',
                                  border:'none',
                                  borderRadius:6,
                                  fontWeight:600,
                                  cursor:'pointer',
                                  transition:'background 0.2s'
                                }}
                                onClick={() => completeWholeRequest(req.id)}
                              >Hoàn tất</button>
                              <button
                                className="cancel-button"
                                style={{
                                  fontWeight:500,
                                  padding:'6px 18px',
                                  flex:'0 0 auto',
                                  background:'#1976d2', // xanh dương
                                  color:'#fff',
                                  border:'none',
                                  borderRadius:6,
                                  cursor:'pointer',
                                  transition:'background 0.2s'
                                }}
                                onClick={()=>{setSelectedRequest(req); setShowDetail(true);}}
                              >Xem chi tiết</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Phân trang */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                      <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ marginRight: 8 }}>&lt;</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} className={p === page ? 'tab-btn active' : 'tab-btn'} style={{ margin: '0 2px', minWidth: 36 }}>{p}</button>
                      ))}
                      <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ marginLeft: 8 }}>&gt;</button>
                    </div>
                  )}
                </>
              )}
              {/* Popup chi tiết */}
              {showDetail && selectedRequest && (
                <div className="popup-overlay">
                  <div className="popup-content" style={{maxWidth:500}}>
                    <h3>Chi tiết yêu cầu nhận máu</h3>
                    <div style={{marginBottom:10}}><b>Ngày yêu cầu:</b> {selectedRequest.requestDate || selectedRequest.createdAt || ""}</div>
                    <div style={{marginBottom:10}}><b>Bệnh nhân:</b> {selectedRequest.patientName || selectedRequest.fullName || ""}</div>
                    <div style={{marginBottom:10}}><b>Nhóm máu:</b> {selectedRequest.bloodType}{selectedRequest.rhType === 'POSITIVE' ? '+' : selectedRequest.rhType === 'NEGATIVE' ? '-' : ''}</div>
                    <div style={{marginBottom:10}}><b>Thể tích:</b> {selectedRequest.requiredVolume} ml</div>
                    <div style={{marginBottom:10}}><b>Trạng thái:</b> {
                      selectedRequest.status === 'PENDING' ? 'Chờ duyệt' :
                      selectedRequest.status === 'READY' ? 'Đã duyệt' :
                      selectedRequest.status === 'REJECTED' ? 'Đã từ chối' :
                      'Đã hoàn tất'
                    }</div>
                    <div style={{marginBottom:10}}><b>Bệnh viện:</b> {selectedRequest.hospitalName}</div>
                    <div style={{marginBottom:10}}><b>Số điện thoại:</b> {selectedRequest.phone}</div>
                    <div style={{marginBottom:10}}><b>Giới tính:</b> {selectedRequest.gender === 'MALE' ? 'Nam' : selectedRequest.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
                    <div style={{marginBottom:10}}><b>Tình trạng bệnh:</b> {selectedRequest.medicalCondition}</div>
                    <div style={{marginBottom:10}}><b>Địa chỉ:</b> {selectedRequest.address}</div>
                    <div style={{display:'flex', justifyContent:'flex-end', marginTop:18}}>
                      <button onClick={()=>setShowDetail(false)} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#eee', color:'#333', cursor:'pointer'}}>Đóng</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* --- Trang yêu cầu cần máu thành phần --- */}
          {view === "componentRequests" && (
            <>
              <h2>Yêu cầu giao nhận máu thành phần</h2>
              <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:18}}>
                {requestTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={componentRequestTab === tab.key ? "tab-btn active" : "tab-btn"}
                    onClick={()=>{setComponentRequestTab(tab.key); setComponentPage(1);}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {loadingComponentRequests ? (
                <div style={{textAlign:'center', margin:'32px 0'}}>Đang tải dữ liệu...</div>
              ) : (
                <>
                  <table className="registration-table">
                    <thead>
                      <tr>
                        <th>Ngày yêu cầu</th>
                        <th>Bệnh nhân</th>
                        <th>Nhóm máu</th>
                        <th>Hồng cầu (ml)</th>
                        <th>Huyết tương (ml)</th>
                        <th>Tiểu cầu (ml)</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedComponentRequests.length === 0 ? (
                        <tr><td colSpan={8}>Không có dữ liệu</td></tr>
                      ) : (
                        pagedComponentRequests.map((req) => (
                          <tr key={req.id}>
                            <td>{req.requestDate}</td>
                            <td>{req.patientName}</td>
                            <td>{req.bloodType}</td>
                            <td>{req.redCellQuantity}</td>
                            <td>{req.plasmaQuantity}</td>
                            <td>{req.plateletQuantity}</td>
                            <td>
                              {req.status === 'PENDING' && <span className="status-pending">CHỜ DUYỆT</span>}
                              {req.status === 'APPROVED' && <span className="status-approved">ĐÃ DUYỆT</span>}
                              {req.status === 'REJECTED' && <span style={{color:'#b22b2b', fontWeight:'bold'}}>ĐÃ TỪ CHỐI</span>}
                              {req.status === 'COMPLETED' && <span style={{color:'#43a047', fontWeight:'bold'}}>ĐÃ HOÀN TẤT</span>}
                              {req.status === 'READY' && <span className="status-ready">SẴN SÀNG</span>}
                            </td>
                            <td className="table-action-cell" style={{display:'flex', justifyContent:'flex-end', alignItems:'center', gap:6}}>
                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'PENDING' ? 'inline-block' : 'none',
                                  width: 110,
                                  padding: '6px 0',
                                  flexShrink: 0,
                                  background: '#43a047', // xanh lá cây
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onClick={() => approveComponentRequest(req.id)}
                              >
                                Duyệt
                              </button>

                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'PENDING' ? 'inline-block' : 'none',
                                  width: 110,
                                  padding: '6px 0',
                                  flexShrink: 0,
                                  background: '#e53935', // đỏ
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onClick={() => rejectComponentRequest(req.id)}
                              >
                                Từ chối
                              </button>

                              <button
                                className="action-button"
                                style={{
                                  display: req.status === 'READY' ? 'inline-block' : 'none',
                                  width: 110,
                                  padding: '6px 0',
                                  flexShrink: 0,
                                  background: '#43a047', // xanh lá cây
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onClick={() => completeComponentRequest(req.id)}
                              >
                                Hoàn tất
                              </button>

                              <button
                                className="cancel-button"
                                style={{
                                  fontWeight: 500,
                                  padding: '6px 18px',
                                  flex: '0 0 auto',
                                  background: '#1976d2', // xanh dương
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onClick={() => {
                                  setSelectedComponentRequest(req);
                                  setShowComponentDetail(true);
                                }}
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Phân trang */}
                  {totalComponentPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                      <button onClick={() => setComponentPage(componentPage - 1)} disabled={componentPage === 1} style={{ marginRight: 8 }}>&lt;</button>
                      {Array.from({ length: totalComponentPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setComponentPage(p)} className={p === componentPage ? 'tab-btn active' : 'tab-btn'} style={{ margin: '0 2px', minWidth: 36 }}>{p}</button>
                      ))}
                      <button onClick={() => setComponentPage(componentPage + 1)} disabled={componentPage === totalComponentPages} style={{ marginLeft: 8 }}>&gt;</button>
                    </div>
                  )}
                </>
              )}
              {/* Popup chi tiết */}
              {showComponentDetail && selectedComponentRequest && (
                <div className="popup-overlay">
                  <div className="popup-content" style={{maxWidth:500}}>
                    <h3>Chi tiết yêu cầu nhận máu thành phần</h3>
                    <div style={{marginBottom:10}}><b>Ngày yêu cầu:</b> {selectedComponentRequest.requestDate}</div>
                    <div style={{marginBottom:10}}><b>Bệnh nhân:</b> {selectedComponentRequest.patientName}</div>
                    <div style={{marginBottom:10}}><b>Nhóm máu:</b> {selectedComponentRequest.bloodType}</div>
                    <div style={{marginBottom:10}}><b>Hồng cầu:</b> {selectedComponentRequest.redCellQuantity} ml</div>
                    <div style={{marginBottom:10}}><b>Huyết tương:</b> {selectedComponentRequest.plasmaQuantity} ml</div>
                    <div style={{marginBottom:10}}><b>Tiểu cầu:</b> {selectedComponentRequest.plateletQuantity} ml</div>
                    <div style={{marginBottom:10}}><b>Trạng thái:</b> {selectedComponentRequest.status === 'PENDING' ? 'Chờ duyệt' : selectedComponentRequest.status === 'APPROVED' ? 'Đã duyệt' : selectedComponentRequest.status === 'REJECTED' ? 'Đã từ chối' : 'Đã hoàn tất'}</div>
                    <div style={{marginBottom:10}}><b>Bệnh viện:</b> {selectedComponentRequest.hospitalName}</div>
                    <div style={{marginBottom:10}}><b>Số điện thoại:</b> {selectedComponentRequest.phone}</div>
                    <div style={{marginBottom:10}}><b>Giới tính:</b> {selectedComponentRequest.gender === 'MALE' ? 'Nam' : selectedComponentRequest.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
                    <div style={{marginBottom:10}}><b>Tình trạng bệnh:</b> {selectedComponentRequest.medicalCondition}</div>
                    <div style={{marginBottom:10}}><b>Địa chỉ:</b> {selectedComponentRequest.address}</div>
                    <div style={{display:'flex', justifyContent:'flex-end', marginTop:18}}>
                      <button onClick={()=>setShowComponentDetail(false)} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#eee', color:'#333', cursor:'pointer'}}>Đóng</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {view === 'componentStock' && (
            <>
              <h2>Kho máu phân tách</h2>
              <div style={{display:'flex', justifyContent:'center', gap:12, marginBottom:18}}>
                {componentTabs.map(tab => (
                  <button
                    key={tab.key}
                    className={componentTab === tab.key ? "tab-btn active" : "tab-btn"}
                    onClick={()=>{setComponentTab(tab.key); setComponentStockPage(1);}}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="filter-container">
                <input
                  type="text"
                  placeholder="Tìm nhóm máu..."
                  value={componentSearch}
                  onChange={e => setComponentSearch(e.target.value)}
                />
                <select value={componentTypeFilter} onChange={e => setComponentTypeFilter(e.target.value)}>
                  <option value="">Tất cả thành phần</option>
                  <option value="RED_CELL">Hồng cầu</option>
                  <option value="PLASMA">Huyết tương</option>
                  <option value="PLATELET">Tiểu cầu</option>
                </select>
                <select value={componentStatusFilter} onChange={e => setComponentStatusFilter(e.target.value)}>
                  {componentStatusTabs.map(tab => (
                    <option key={tab.key} value={tab.key}>{tab.label}</option>
                  ))}
                </select>
              </div>
              <table className="registration-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Thành phần</th>
                    <th>Nhóm máu</th>
                    <th>Thể tích (ml)</th>
                    <th>Ngày nhập</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let filtered = bloodComponents;
                    if (componentTab !== 'ALL') filtered = filtered.filter(c => c.componentType === componentTab);
                    if (componentTypeFilter) filtered = filtered.filter(c => c.componentType === componentTypeFilter);
                    if (componentStatusFilter) filtered = filtered.filter(c => c.status === componentStatusFilter);
                    if (componentSearch) filtered = filtered.filter(c => (c.bloodType + (c.rhType === 'POSITIVE' ? '+' : c.rhType === 'NEGATIVE' ? '-' : '')).toLowerCase().includes(componentSearch.toLowerCase()));
                    const paged = filtered.slice((componentStockPage-1)*COMPONENT_STOCK_PAGE_SIZE, componentStockPage*COMPONENT_STOCK_PAGE_SIZE);
                    if (paged.length === 0) return <tr><td colSpan={7}>Không có dữ liệu</td></tr>;
                    return paged.map((c, idx) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.componentType === 'RED_CELL' ? 'Hồng cầu' : c.componentType === 'PLASMA' ? 'Huyết tương' : 'Tiểu cầu'}</td>
                        <td>{c.bloodType}{c.rhType === 'POSITIVE' ? '+' : c.rhType === 'NEGATIVE' ? '-' : ''}</td>
                        <td>{c.volume}</td>
                        <td>{c.collectedDate}</td>
                        <td>{c.expirationDate}</td>
                        <td>{c.status === 'AVAILABLE' ? 'Còn hạn' : c.status === 'USED' ? 'Đã sử dụng' : 'Hết hạn'}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
              {/* Phân trang */}
              {(() => {
                let filtered = bloodComponents;
                if (componentTab !== 'ALL') filtered = filtered.filter(c => c.componentType === componentTab);
                if (componentTypeFilter) filtered = filtered.filter(c => c.componentType === componentTypeFilter);
                if (componentStatusFilter) filtered = filtered.filter(c => c.status === componentStatusFilter);
                if (componentSearch) filtered = filtered.filter(c => (c.bloodType + (c.rhType === 'POSITIVE' ? '+' : c.rhType === 'NEGATIVE' ? '-' : '')).toLowerCase().includes(componentSearch.toLowerCase()));
                const totalPages = Math.ceil(filtered.length / COMPONENT_STOCK_PAGE_SIZE);
                if (totalPages <= 1) return null;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                    <button onClick={() => setComponentStockPage(componentStockPage - 1)} disabled={componentStockPage === 1} style={{ marginRight: 8 }}>&lt;</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setComponentStockPage(p)} className={p === componentStockPage ? 'tab-btn active' : 'tab-btn'} style={{ margin: '0 2px', minWidth: 36 }}>{p}</button>
                    ))}
                    <button onClick={() => setComponentStockPage(componentStockPage + 1)} disabled={componentStockPage === totalPages} style={{ marginLeft: 8 }}>&gt;</button>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa túi máu</h3>
            {(() => {
              const unit = bloodUnits.find(u => u.id === selectedUnitId);
              return unit ? (
                <div style={{textAlign: 'left', marginBottom: 16}}>
                  <div><strong>ID:</strong> {unit.id}</div>
                  <div><strong>Nhóm máu:</strong> {unit.group}</div>
                  <div><strong>Ngày nhập:</strong> {unit.entryDate}</div>
                  <div><strong>Hạn sử dụng:</strong> {unit.expiryDate}</div>
                  <div><strong>Trạng thái hiện tại:</strong> {statusMap[unit.status || 'COLLECTED']}</div>
                </div>
              ) : null;
            })()}
            <p>Bạn có chắc chắn muốn <span style={{color:'#FF204E', fontWeight:'bold'}}>xóa</span> túi máu này không?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="modal-confirm">Xóa</button>
              <button onClick={() => setShowDeleteModal(false)} className="modal-cancel">Hủy</button>
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
              const unit = bloodUnits.find(u => u.id === selectedUnitId);
              return unit ? (
                <div style={{textAlign: 'left', marginBottom: 16}}>
                  <div><strong>ID:</strong> {unit.id}</div>
                  <div><strong>Nhóm máu:</strong> {unit.group}</div>
                  <div><strong>Ngày nhập:</strong> {unit.entryDate}</div>
                  <div><strong>Hạn sử dụng:</strong> {unit.expiryDate}</div>
                  <div><strong>Trạng thái hiện tại:</strong> {statusMap[unit.status || 'COLLECTED']}</div>
                </div>
              ) : null;
            })()}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="">-- Chọn trạng thái mới --</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {selectedStatus && (
              <p style={{marginTop: 10}}>
                Bạn có chắc chắn muốn chuyển trạng thái túi máu <strong>{selectedUnitId}</strong> sang <strong>{statusMap[selectedStatus]}</strong> không?
              </p>
            )}
            <div className="modal-actions">
              <button onClick={confirmEdit} className="modal-confirm" disabled={!selectedStatus}>Cập nhật</button>
              <button onClick={() => setShowEditModal(false)} className="modal-cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}
      {/* Popup báo lỗi */}
      {showErrorPopup && (
        <div style={{
          position: 'fixed',
          top: 40,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: '#fff',
            color: '#222', // chữ đen
            border: '1.5px solid #ffa726', // cam nhạt
            borderRadius: 10,
            padding: '16px 32px',
            fontSize: 17,
            fontWeight: 500,
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            minWidth: 320,
            maxWidth: '90%',
            textAlign: 'center',
            justifyContent: 'center',
          }}>
            <span style={{flex:1}}>{errorPopupMessage}</span>
            <button style={{marginLeft: 16, background: '#ffa726', color: '#222', border: 'none', borderRadius: 5, padding: '7px 18px', cursor: 'pointer', fontWeight: 500}} onClick={()=>setShowErrorPopup(false)}>Đóng</button>
          </div>
        </div>
      )}
      {/* Popup form phân tách máu */}
      {showSeparateForm && (
        <div className="popup-overlay">
          <div className="popup-content" style={{maxWidth:400}}>
            <h3>Phân tách máu</h3>
            <form onSubmit={handleSeparateSubmit} className="blood-form">
              <label>Hồng cầu (ml)</label>
              <input
                type="number"
                name="redCellVolume"
                min="0"
                value={separateForm.redCellVolume}
                onChange={handleSeparateInput}
                placeholder="Nhập số ml hồng cầu"
              />
              <label>Huyết tương (ml)</label>
              <input
                type="number"
                name="plasmaVolume"
                min="0"
                value={separateForm.plasmaVolume}
                onChange={handleSeparateInput}
                placeholder="Nhập số ml huyết tương"
              />
              <label>Tiểu cầu (ml)</label>
              <input
                type="number"
                name="plateletVolume"
                min="0"
                value={separateForm.plateletVolume}
                onChange={handleSeparateInput}
                placeholder="Nhập số ml tiểu cầu"
              />
              {separateError && <div style={{color:'red', marginTop:8}}>{separateError}</div>}
              <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:18}}>
                <button type="button" onClick={closeSeparateForm} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#eee', color:'#333', cursor:'pointer'}}>Đóng</button>
                <button type="submit" style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#1976d2', color:'#fff', fontWeight:600, cursor:'pointer'}}>Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
