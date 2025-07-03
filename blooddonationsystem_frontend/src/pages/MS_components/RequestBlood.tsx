import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RequestBlood.css";

type BloodRequest = {
  type: string;
  quantity: string;
  receiver: string;
  reason: string;
  status: string;
};

const RequestBlood: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [type, setType] = useState("A+");
  const [quantity, setQuantity] = useState("");
  const [receiver, setReceiver] = useState("");
  const [reason, setReason] = useState("");

  // Mẫu dữ liệu thử (chỉ chạy 1 lần)
  useEffect(() => {
    setRequests([
      {
        type: "B+",
        quantity: "2",
        receiver: "Khoa Hồi sức tích cực",
        reason: "Bệnh nhân chấn thương nặng",
        status: "Đang xử lý",
      },
    ]);
  }, []);

  const submit = async () => {
    if (!quantity || !receiver || !reason) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newRequest: BloodRequest = {
      type,
      quantity,
      receiver,
      reason,
      status: "Đang xử lý",
    };

    try {
      const res = await axios.post("/blood-requests", newRequest);
      if (res.status === 200 || res.status === 201) {
        alert("✅ Gửi yêu cầu thành công!");
        setRequests([...requests, newRequest]);
        setQuantity("");
        setReceiver("");
        setReason("");
      } else {
        alert("❌ Gửi yêu cầu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("❌ Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  return (
    <div className="request-container">
      <h2>Tạo yêu cầu nhận máu</h2>

      <div className="form-section">
        <div>
          <label>Nhóm máu:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Số lượng (đơn vị):</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ví dụ: 5"
          />
        </div>

        <div>
          <label>Đơn vị tiếp nhận:</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Tên bệnh viện, khoa, ..."
          />
        </div>

        <div>
          <label>Lý do cần máu:</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Cấp cứu, phẫu thuật, ..."
          />
        </div>

        <button className="submit-btn" onClick={submit}>
          Gửi yêu cầu
        </button>
      </div>

      <h3 className="sub-title">Danh sách yêu cầu đã gửi</h3>
      <ul className="request-list">
        {requests.map((r, i) => (
          <li key={i} className="request-item">
            <strong>{r.quantity} đơn vị</strong> nhóm máu <strong>{r.type}</strong> gửi đến{" "}
            <em>{r.receiver}</em> – <span className="status">{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestBlood;
