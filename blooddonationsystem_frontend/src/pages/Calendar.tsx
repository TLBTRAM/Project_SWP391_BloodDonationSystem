import React from 'react';
import './components/Calendar.css';

const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const Calendar: React.FC = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const currentDate = today.getDate();

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // Adjust so Monday = 0

  const totalDays = new Date(year, month + 1, 0).getDate();

  const rows: React.ReactNode[] = [];
  let day = 1;

  for (let week = 0; week < 6 && day <= totalDays; week++) {
    const cols: React.ReactNode[] = [];
    for (let i = 0; i < 7; i++) {
      if ((week === 0 && i < startDay) || day > totalDays) {
        cols.push(<td key={`empty-${week}-${i}`}></td>);
      } else {
        const isToday =
          day === currentDate &&
          today.getMonth() === month &&
          today.getFullYear() === year;

        cols.push(
          <td key={`day-${day}`} className={isToday ? 'active' : ''}>
            {day}
          </td>
        );
        day++;
      }
    }
    rows.push(<tr key={`week-${week}`}>{cols}</tr>);
  }

  const monthName = today.toLocaleString('vi-VN', { month: 'long' });

  return (
    <div className="calendar">
      <h4>{`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`}</h4>
      <table>
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
