import React, { useState } from 'react';
import './components/Booking.css';

const timeSlots = [
  '07:30 - 08:30',
  '08:30 - 09:30',
  '09:30 - 10:30',
  '13:30 - 14:30',
  '14:30 - 15:30',
  '15:30 - 16:30'
];

const GeneralCheckupBooking: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert('Vui lòng chọn ngày và khung giờ khám!');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="booking-container">
      <h2>Đặt Lịch Khám Sàng Lọc</h2>
      {!submitted ? (
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>Chọn ngày khám:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Chọn khung giờ:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">-- Chọn khung giờ --</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <label>Ghi chú (nếu có):</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Dị ứng thuốc, đã từng phẫu thuật..."
          ></textarea>

          <button type="submit">Đặt lịch</button>
        </form>
      ) : (
        <div className="confirmation">
          <h3>✔️ Lịch khám đã được đặt!</h3>
          <p><strong>Ngày:</strong> {date}</p>
          <p><strong>Khung giờ:</strong> {time}</p>
          {note && <p><strong>Ghi chú:</strong> {note}</p>}
          <button onClick={() => setSubmitted(false)}>Đặt lịch mới</button>
        </div>
      )}
    </div>
  );
};

export default GeneralCheckupBooking;
