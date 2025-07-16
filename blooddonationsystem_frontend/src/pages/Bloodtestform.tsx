import React, { useState, useEffect } from "react";
import "./components/Bloodtestform.css";


const BloodTestForm = () => {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  // Gọi API lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.id);
        } else {
          setMessage("Không lấy được thông tin người dùng.");
        }
      } catch (err) {
        setMessage("Lỗi khi lấy thông tin người dùng.");
      }
    };

    fetchUser();
  }, []);

  // Gửi form đăng ký khám sàng lọc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Chưa có thông tin người dùng.");
      return;
    }

    try {
      const res = await fetch(`/api/blood-test/create?customerId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          note: note,
        }),
      });

      if (res.ok) {
        setMessage("Đăng ký khám sàng lọc thành công.");
        setNote("");
      } else {
        const error = await res.json();
        setMessage("Lỗi: " + (error.message || "Đăng ký thất bại."));
      }
    } catch (err) {
      setMessage("Lỗi khi gửi yêu cầu.");
    }
  };

  return (
    <div className="bloodtest-form-wrapper">
      <h2>Đăng ký khám sàng lọc</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ghi chú (nếu có):</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: Tôi từng hiến máu trước đây..."
          />
        </div>
        <button type="submit">Gửi đăng ký</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BloodTestForm;
