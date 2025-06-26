// components/MedicalStaff/RequestBlood.tsx
import React, { useState } from "react";

const RequestBlood = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [type, setType] = useState("A+");
  const [quantity, setQuantity] = useState("");
  const [receiver, setReceiver] = useState("");
  const [reason, setReason] = useState("");

  const submit = () => {
    if (!quantity || !receiver || !reason) return;
    setRequests([...requests, { type, quantity, receiver, reason, status: "Đang xử lý" }]);
    setQuantity(""); setReceiver(""); setReason("");
  };

  return (
    <div>
      <h2>📥 Tạo yêu cầu nhận máu</h2>
      <div className="form-section">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <input placeholder="Số lượng (đơn vị)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input placeholder="Đơn vị tiếp nhận" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
        <input placeholder="Lý do cần máu" value={reason} onChange={(e) => setReason(e.target.value)} />
        <button onClick={submit}>Tạo yêu cầu</button>
      </div>
      <ul>
        {requests.map((r, i) => (
          <li key={i}>
            {r.quantity} đơn vị {r.type} - {r.receiver} - {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestBlood;
