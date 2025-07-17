import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./components/BloodRequestHistory.css";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

interface BloodRequest {
  id: number;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  gender: string;
  bloodType: string;
  rhType: string;
  requiredVolume: number;
  hospitalName: string;
  medicalCondition: string;
  status: "PENDING" | "READY" | "COMPLETE" | "REJECTED";
  createdAt: string;
}

const BloodRequestHistory = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Gắn data giả lập (mock) để test nhanh
    const mockData: BloodRequest[] = [

      {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "dateOfBirth": "1980-05-12",
        "phone": "0901234567",
        "gender": "MALE",
        "bloodType": "O",
        "rhType": "POSITIVE",
        "requiredVolume": 500,
        "hospitalName": "Bệnh viện Chợ Rẫy",
        "medicalCondition": "Xuất huyết nội tạng",
        "status": "PENDING",
        "createdAt": "2025-07-14T10:30:00Z"
      },
      {
        "id": 2,
        "fullName": "Nguyễn Văn A",
        "dateOfBirth": "1980-05-12",
        "phone": "0901234567",
        "gender": "MALE",
        "bloodType": "O",
        "rhType": "POSITIVE",
        "requiredVolume": 350,
        "hospitalName": "Bệnh viện 115",
        "medicalCondition": "Chấn thương sọ não",
        "status": "READY",
        "createdAt": "2025-07-10T08:45:00Z"
      },
      {
        "id": 3,
        "fullName": "Nguyễn Văn A",
        "dateOfBirth": "1980-05-12",
        "phone": "0901234567",
        "gender": "MALE",
        "bloodType": "O",
        "rhType": "POSITIVE",
        "requiredVolume": 450,
        "hospitalName": "Bệnh viện Nhi đồng",
        "medicalCondition": "Thiếu máu mạn tính",
        "status": "COMPLETE",
        "createdAt": "2025-06-28T14:20:00Z"
      },
      {
        "id": 4,
        "fullName": "Nguyễn Văn A",
        "dateOfBirth": "1980-05-12",
        "phone": "0901234567",
        "gender": "MALE",
        "bloodType": "O",
        "rhType": "POSITIVE",
        "requiredVolume": 300,
        "hospitalName": "Bệnh viện Trung Ương Huế",
        "medicalCondition": "Thiếu máu sau phẫu thuật",
        "status": "REJECTED",
        "createdAt": "2025-07-01T16:00:00Z"
      }

    ];
    setRequests(mockData);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/blood-request/my-requests");
        if (!res.ok) throw new Error("Lỗi khi tải yêu cầu máu");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  const formatStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="status pending">Chờ duyệt</span>;
      case "READY":
        return <span className="status ready">Sẵn sàng</span>;
      case "COMPLETE":
        return <span className="status complete">Hoàn tất</span>;
      case "REJECTED":
        return <span className="status rejected">Từ chối</span>;
      default:
        return <span className="status unknown">Không rõ</span>;
    }
  };

  return (
    <>
      <Header />
      <div className="blood-request-history">
        <h2>Lịch sử yêu cầu máu</h2>

        <button className="back-btn" onClick={() => navigate("/user")}>
          ← Quay lại trang chính
        </button>
        
        {requests.length === 0 ? (
          <p>Không có yêu cầu nào.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ngày yêu cầu</th>
                <th>Bệnh nhân</th>
                <th>Nhóm máu</th>
                <th>Thể tích (ml)</th>
                <th>Bệnh viện</th>
                <th>Tình trạng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{new Date(req.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>{req.fullName}</td>
                  <td>{req.bloodType} ({req.rhType === "POSITIVE" ? "+" : "-"})</td>
                  <td>{req.requiredVolume}</td>
                  <td>{req.hospitalName}</td>
                  <td>{req.medicalCondition}</td>
                  <td>{formatStatus(req.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BloodRequestHistory;
