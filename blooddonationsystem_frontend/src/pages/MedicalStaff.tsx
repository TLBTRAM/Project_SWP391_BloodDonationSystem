import React, { useState, useEffect } from 'react';
import './components/MedicalStaff.css';
import docImg from '../pages/images/User/doctor.png';
import Calendar from './Calendar';

const MedicalStaff = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const fakeAppointments = [
            { date: '2025-06-13', time: '09:00', donor: 'Nguyễn Văn A' },
            { date: '2025-06-13', time: '14:30', donor: 'Trần Thị B' },
            { date: '2025-06-14', time: '10:15', donor: 'Phạm Văn C' }
        ];
        setAppointments(fakeAppointments);
    }, []);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const filteredAppointments = appointments.filter(
        (a) => a.date === formatDate(selectedDate)
    );

    return (
        <div className="staff-dashboard">
            <div className="staff-profile">
                <img className="staff-avatar" src={docImg} alt="Medical Staff" />
                <div>
                    <div className="name-role">
                        <h2>Grace Wilson</h2>
                        <span className="role-tag">Nhân viên y tế</span>
                    </div>
                    <p>Email: hoclambacsi@gmail.com</p>
                    <p>Phone: 0912 345 678</p>
                    <p>Company: FPT Medicare</p>
                </div>
                <button className="edit-button">Chỉnh sửa hồ sơ</button>
            </div>

            <div className="staff-content">
                <div className="appointment-list">
                    <div className="appointment-header">
                        <h3>Lịch khám - {selectedDate.toLocaleDateString('vi-VN')}</h3>
                        <input
                            type="date"
                            value={formatDate(selectedDate)}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                    {filteredAppointments.length > 0 ? (
                        <ul>
                            {filteredAppointments.map((item, idx) => (
                                <li key={idx}>
                                    {item.time} - {item.donor}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có lịch hẹn nào.</p>
                    )}
                </div>

                <div className="calendar">
                    <h3>Hôm nay</h3>
                    <Calendar />
                </div>
            </div>
        </div>
    );
};

export default MedicalStaff;
