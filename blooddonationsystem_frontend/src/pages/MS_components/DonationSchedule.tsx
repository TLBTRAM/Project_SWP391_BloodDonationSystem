import React, { useState } from "react";

const DonationSchedule = () => {
  const [donations, setDonations] = useState<any[]>([
    { name: "Nguyễn A", bloodType: "O+", date: "2025-06-28", status: "Chưa đến" },
  ]);

  const updateStatus = (index: number, newStatus: string) => {
    const updated = [...donations];
    updated[index].status = newStatus;
    setDonations(updated);
  };

  return (
    <div>
      <h2>🩸 Lịch hiến máu</h2>
      <ul>
        {donations.map((item, i) => (
          <li key={i}>
            {item.name} - Nhóm máu: {item.bloodType} - Ngày: {item.date} -{" "}
            <strong>{item.status}</strong>
            {item.status === "Chưa đến" && (
              <>
                <button onClick={() => updateStatus(i, "Đã hiến")}>Xác nhận</button>
                <button onClick={() => updateStatus(i, "Không đến")}>Không đến</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationSchedule;
