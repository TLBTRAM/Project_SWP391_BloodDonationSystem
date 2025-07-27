import React, { useEffect, useState } from "react";
import "./components/AdminNotifications.css";
import DeleteImg from "./images/Action/bin.png";

interface Notification {
  id: number;
  title: string;
  content: string;
  created_at: string;
  type: "SYSTEM" | "BLOOD_REQUEST" | "APPOINTMENT" | "TEST_RESULT" | "GENERAL";
  receiver_id: number | null;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Hệ thống
  const [systemTitle, setSystemTitle] = useState("");
  const [systemContent, setSystemContent] = useState("");
  const [systemType, setSystemType] = useState<Notification["type"]>("SYSTEM");

  // Gửi cá nhân
  const [userTitle, setUserTitle] = useState("");
  const [userContent, setUserContent] = useState("");
  const [userType, setUserType] =
    useState<Notification["type"]>("BLOOD_REQUEST");
  const [receiverId, setReceiverId] = useState("");

  // Modal xác nhận xóa
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const sampleNotifications: Notification[] = [
    {
      id: 1,
      title: "Thông báo hệ thống",
      content: "Hệ thống sẽ bảo trì lúc 22h.",
      created_at: "2025-07-17T09:00:00",
      type: "SYSTEM",
      receiver_id: null,
    },
    {
      id: 2,
      title: "Nhắc lịch hẹn",
      content: "Bạn có lịch hẹn vào ngày mai lúc 8h sáng.",
      created_at: "2025-07-16T15:30:00",
      type: "APPOINTMENT",
      receiver_id: 5,
    },
    {
      id: 3,
      title: "Yêu cầu hiến máu",
      content: "Vui lòng đến BV Chợ Rẫy lúc 9h sáng.",
      created_at: "2025-07-15T14:00:00",
      type: "BLOOD_REQUEST",
      receiver_id: 7,
    },
  ];

  useEffect(() => {
    setNotifications(sampleNotifications);
  }, []);

  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = () => {
    if (confirmDeleteId !== null) {
      setNotifications(notifications.filter((n) => n.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const sendSystemNotification = async () => {
    if (!systemTitle || !systemContent) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/notifications/send-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: systemTitle,
          content: systemContent,
          type: systemType
        })
      });
      if (res.ok) {
        alert("Gửi thông báo hệ thống thành công!");
        setSystemTitle("");
        setSystemContent("");
        setSystemType("SYSTEM");
      } else {
        const data = await res.json();
        alert(data.message || "Gửi thông báo hệ thống thất bại!");
      }
    } catch (err) {
      alert("Lỗi gửi thông báo hệ thống!");
    }
  };

  const sendUserNotification = async () => {
    if (!userTitle || !userContent || !receiverId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverIds: [Number(receiverId)],
          title: userTitle,
          content: userContent,
          type: userType
        })
      });
      if (res.ok) {
        alert("Gửi thông báo người dùng thành công!");
        setUserTitle("");
        setUserContent("");
        setUserType("BLOOD_REQUEST");
        setReceiverId("");
      } else {
        const data = await res.json();
        alert(data.message || "Gửi thông báo người dùng thất bại!");
      }
    } catch (err) {
      alert("Lỗi gửi thông báo người dùng!");
    }
  };

  return (
    <div className="admin-notifications">
      <h1>Quản lý thông báo</h1>

      <div className="send-form-container">
        {/* Gửi thông báo cho tất cả */}
        <div className="send-form">
          <h3>Gửi thông báo hệ thống (cho tất cả)</h3>
          <input
            type="text"
            placeholder="Tiêu đề (VD: Lịch bảo trì)"
            value={systemTitle}
            onChange={(e) => setSystemTitle(e.target.value)}
          />
          <textarea
            placeholder="Nội dung chi tiết"
            value={systemContent}
            onChange={(e) => setSystemContent(e.target.value)}
          ></textarea>
          <select
            value={systemType}
            onChange={(e) =>
              setSystemType(e.target.value as Notification["type"])
            }
          >
            <option value="SYSTEM">Hệ thống</option>
            <option value="GENERAL">Chung</option>
          </select>
          <button onClick={sendSystemNotification}>
            Gửi thông báo hệ thống
          </button>
        </div>

        {/* Gửi thông báo cho user cụ thể */}
        <div className="send-form">
          <h3>Gửi thông báo cho người dùng cụ thể</h3>
          <input
            type="number"
            min={1}
            placeholder="ID người nhận (VD: 123)"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tiêu đề (VD: Lịch hiến máu)"
            value={userTitle}
            onChange={(e) => setUserTitle(e.target.value)}
          />
          <textarea
            placeholder="Nội dung gửi tới người dùng"
            value={userContent}
            onChange={(e) => setUserContent(e.target.value)}
          ></textarea>
          <select
            value={userType}
            onChange={(e) =>
              setUserType(e.target.value as Notification["type"])
            }
          >
            <option value="BLOOD_REQUEST">Yêu cầu máu</option>
            <option value="APPOINTMENT">Lịch hẹn</option>
            <option value="TEST_RESULT">Kết quả xét nghiệm</option>
            <option value="GENERAL">Chung</option>
          </select>
          <button onClick={sendUserNotification}>
            Gửi thông báo người dùng
          </button>
        </div>
      </div>

      <div className="sent-list">
        <h3>Thông báo hệ thống (gửi cho tất cả)</h3>
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Loại</th>
              <th>Ngày gửi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {notifications
              .filter((n) => n.receiver_id === null)
              .map((n) => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.content}</td>
                  <td>{n.type}</td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td>
                    <div className="table-action-buttons">
                      <button
                        className="action-button-icon"
                        onClick={() => confirmDelete(n.id)}
                      >
                        <img src={DeleteImg} alt="Xóa" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: "40px" }}>
          Thông báo gửi cho người dùng cụ thể
        </h3>
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Loại</th>
              <th>ID người nhận</th>
              <th>Ngày gửi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {notifications
              .filter((n) => n.receiver_id !== null)
              .map((n) => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.content}</td>
                  <td>{n.type}</td>
                  <td>{n.receiver_id}</td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td>
                    <div className="table-action-buttons">
                      <button
                        className="action-button-icon"
                        onClick={() => confirmDelete(n.id)}
                      >
                        <img src={DeleteImg} alt="Xóa" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc muốn xóa thông báo có ID{" "}
              <strong>{confirmDeleteId}</strong> không?
            </p>
            <div className="modal-buttons">
              <button className="save-button-2" onClick={handleDelete}>
                Xóa
              </button>
              <button
                className="cancel-button-2"
                onClick={() => setConfirmDeleteId(null)}
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

export default AdminNotifications;
