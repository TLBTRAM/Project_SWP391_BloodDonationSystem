// components/MedicalStaff/SendToStorage.tsx
import React, { useState } from "react";

const SendToStorage = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [type, setType] = useState("O+");
  const [volume, setVolume] = useState("");
  const [expiry, setExpiry] = useState("");
  const [code, setCode] = useState("");

  const submit = () => {
    if (!volume || !expiry || !code) return;
    setUnits([...units, { type, volume, expiry, code }]);
    setVolume(""); setExpiry(""); setCode("");
  };

  return (
    <div>
      <h2>🚚 Gửi máu cho kho</h2>
      <div className="form-section">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <input placeholder="Thể tích (ml)" value={volume} onChange={(e) => setVolume(e.target.value)} />
        <input placeholder="Hạn sử dụng (yyyy-mm-dd)" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <input placeholder="Mã đơn vị máu" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={submit}>Gửi</button>
      </div>
      <ul>
        {units.map((u, i) => (
          <li key={i}>
            {u.code} - {u.type} - {u.volume}ml - HSD: {u.expiry}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SendToStorage;
