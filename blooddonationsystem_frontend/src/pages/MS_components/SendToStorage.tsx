import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SendToStorage.css";
import { format } from "date-fns";

type BloodUnit = {
  id: string;
  bloodType: string;
  volume: number;
  collectionDate: string;
  donorName: string;
  status: string;
};

const SendToStorage: React.FC = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<BloodUnit[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [sendDate, setSendDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [senderName, setSenderName] = useState("");
  const [note, setNote] = useState("");
  const [filters, setFilters] = useState({
    bloodType: "",
    donorName: "",
    collectionDate: "",
  });

  const fetchBloodUnits = async () => {
    try {
      const res = await axios.get("/blood-units?status=Đã xét nghiệm");
      setBloodUnits(res.data);
      setFilteredUnits(res.data);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu đơn vị máu.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBloodUnits();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedUnits((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedUnits.length === 0 || !senderName) {
      alert("Vui lòng chọn đơn vị máu và nhập tên người gửi.");
      return;
    }

    try {
      await axios.post("/send-to-storage", {
        unitIds: selectedUnits,
        sendDate,
        senderName,
        note,
      });

      alert("✅ Đã gửi máu vào kho thành công!");
      setSelectedUnits([]);
      setSenderName("");
      setNote("");
      fetchBloodUnits();
    } catch (err) {
      alert("❌ Gửi vào kho thất bại. Vui lòng thử lại.");
      console.error(err);
    }
  };

  const handleFilter = () => {
    const filtered = bloodUnits.filter((unit) => {
      const matchesBloodType = filters.bloodType
        ? unit.bloodType.includes(filters.bloodType)
        : true;
      const matchesDonor = filters.donorName
        ? unit.donorName.toLowerCase().includes(filters.donorName.toLowerCase())
        : true;
      const matchesDate = filters.collectionDate
        ? unit.collectionDate === filters.collectionDate
        : true;
      return matchesBloodType && matchesDonor && matchesDate;
    });
    setFilteredUnits(filtered);
  };

  return (
    <div className="send-container">
      <h2>Gửi Đơn Vị Máu Vào Kho</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Nhóm máu (A, B, O, AB...)"
          value={filters.bloodType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bloodType: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Tên người hiến"
          value={filters.donorName}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, donorName: e.target.value }))
          }
        />
        <input
          type="date"
          value={filters.collectionDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, collectionDate: e.target.value }))
          }
        />
        <button onClick={handleFilter}>Lọc</button>
      </div>

      <table className="blood-table">
        <thead>
          <tr>
            <th>Chọn</th>
            <th>Mã</th>
            <th>Nhóm máu</th>
            <th>Thể tích (ml)</th>
            <th>Ngày thu</th>
            <th>Người hiến</th>
          </tr>
        </thead>
        <tbody>
          {filteredUnits.length > 0 ? (
            filteredUnits.map((unit) => (
              <tr key={unit.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(unit.id)}
                    onChange={() => toggleSelection(unit.id)}
                  />
                </td>
                <td>{unit.id}</td>
                <td>{unit.bloodType}</td>
                <td>{unit.volume}</td>
                <td>{unit.collectionDate}</td>
                <td>{unit.donorName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có đơn vị máu phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="form-section-send">
        <label>Ngày gửi:</label>
        <input
          type="date"
          value={sendDate}
          onChange={(e) => setSendDate(e.target.value)}
        />

        <label>Người gửi:</label>
        <input
          type="text"
          placeholder="Nhập tên người gửi"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
        />

        <label>Ghi chú:</label>
        <textarea
          placeholder="Ghi chú (nếu có)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={handleSend}>Gửi vào kho</button>
      </div>
    </div>
  );
};

export default SendToStorage;
