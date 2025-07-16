import React, { useEffect, useState } from "react";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";
import "./components/MyRegistrations.css";
import { useNavigate } from "react-router-dom";
interface Registration {
    id: number;
    type: "MEDICAL" | "DONATION";
    status: string;
    createdAt: string;
    scheduleDate: string;
    slot: string;
    note: string;
}

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [selected, setSelected] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        // fetchRegistrations();
        // Tạm thời gán 1 đơn đăng ký giả định:
        const fakeData: Registration[] = [
            {
                id: 1,
                type: "MEDICAL",
                status: "Đã đăng ký",
                createdAt: "2025-07-15T10:00:00Z",
                scheduleDate: "2025-07-20",
                slot: "08:00 - 09:00",
                note: "Khám định kỳ",
            },
            {
                id: 1,
                type: "MEDICAL",
                status: "Đã đăng ký",
                createdAt: "2025-07-15T10:00:00Z",
                scheduleDate: "2025-07-20",
                slot: "08:00 - 09:00",
                note: "Khám định kỳ",
            },
            {
                id: 1,
                type: "MEDICAL",
                status: "Đã đăng ký",
                createdAt: "2025-07-15T10:00:00Z",
                scheduleDate: "2025-07-20",
                slot: "08:00 - 09:00",
                note: "Khám định kỳ",
            },
            {
                id: 1,
                type: "MEDICAL",
                status: "Đã đăng ký",
                createdAt: "2025-07-15T10:00:00Z",
                scheduleDate: "2025-07-20",
                slot: "08:00 - 09:00",
                note: "Khám định kỳ",
            },
            {
                id: 1,
                type: "MEDICAL",
                status: "Đã đăng ký",
                createdAt: "2025-07-15T10:00:00Z",
                scheduleDate: "2025-07-20",
                slot: "08:00 - 09:00",
                note: "Khám định kỳ",
            },

        ];
        setRegistrations(fakeData);
        setLoading(false);
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/registers/my", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Lỗi khi lấy danh sách đơn");
            }

            const data = await res.json();
            setRegistrations(data);
        } catch (err) {
            console.error("Lỗi:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        const confirmCancel = window.confirm("Bạn có chắc muốn hủy đơn này?");
        if (!confirmCancel) return;

        try {
            const res = await fetch(`/api/registers/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Hủy đơn thất bại");
            }

            alert("Đơn đã được hủy");
            fetchRegistrations();
        } catch (err) {
            console.error("Lỗi khi hủy:", err);
            alert("Không thể hủy đơn. Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <Header />
            <div className="registration-wrapper">
                <button className="back-button" onClick={() => navigate("/user")}>← Quay lại</button>
                <h2>Danh sách đơn đã đăng ký</h2>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : registrations.length === 0 ? (
                    <p>Không có đơn nào được đăng ký.</p>
                ) : (
                    <ul className="registration-list">
                        {registrations.map((reg) => (
                            <li key={reg.id} className="registration-item">
                                <div>
                                    <strong>Loại:</strong> {reg.type === "MEDICAL" ? "Khám sàng lọc" : "Hiến máu"}<br />
                                    <strong>Ngày:</strong> {reg.scheduleDate}<br />
                                    <strong>Khung giờ:</strong> {reg.slot}<br />
                                    <strong>Trạng thái:</strong> {reg.status}<br />
                                    <strong>Ghi chú:</strong> {reg.note || "Không có"}
                                </div>
                                <div className="button-group">
                                    <button onClick={() => setSelected(reg)}>Xem chi tiết</button>
                                    <button onClick={() => handleCancel(reg.id)} className="cancel-button">
                                        Hủy đơn
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {selected && (
                    <div className="popup-overlay" onClick={() => setSelected(null)}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Chi tiết đơn đăng ký</h3>
                            <p><strong>ID:</strong> {selected.id}</p>
                            <p><strong>Loại:</strong> {selected.type === "MEDICAL" ? "Khám sàng lọc" : "Hiến máu"}</p>
                            <p><strong>Ngày:</strong> {selected.scheduleDate}</p>
                            <p><strong>Khung giờ:</strong> {selected.slot}</p>
                            <p><strong>Trạng thái:</strong> {selected.status}</p>
                            <p><strong>Ngày tạo:</strong> {selected.createdAt}</p>
                            <p><strong>Ghi chú:</strong> {selected.note || "Không có"}</p>
                            <button onClick={() => setSelected(null)}>Đóng</button>
                        </div>
                    </div>
                )}
                <button className="back-button" onClick={() => navigate("/user")}>← Quay lại</button>
            </div>
            <Footer />
        </div>
    );
};

export default MyRegistrations;
