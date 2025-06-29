import React, { useState } from "react";

const Screening = () => {
  const [results, setResults] = useState<any[]>([]);
  const [donor, setDonor] = useState("");
  const [bp, setBp] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("Đạt");

  const submit = () => {
    if (!donor || !bp || !weight) return;
    setResults([...results, { donor, bp, weight, status }]);
    setDonor(""); setBp(""); setWeight(""); setStatus("Đạt");
  };

  return (
    <div>
      <h2>🔬 Khám sàng lọc</h2>
      <div className="form-section">
        <input placeholder="Tên người hiến" value={donor} onChange={(e) => setDonor(e.target.value)} />
        <input placeholder="Huyết áp" value={bp} onChange={(e) => setBp(e.target.value)} />
        <input placeholder="Cân nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Đạt</option>
          <option>Không đạt</option>
        </select>
        <button onClick={submit}>Lưu kết quả</button>
      </div>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.donor} - {r.bp} - {r.weight}kg - {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Screening;
