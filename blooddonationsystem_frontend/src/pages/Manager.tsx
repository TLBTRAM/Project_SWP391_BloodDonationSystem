import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './components/Manager.css';
import logoBlood from './images/Logo/logo_blood.png';

interface BloodUnit {
  id: number;
  group: string;
  quantity: number;
  entryDate: string;
  expiryDate: string;
}

const initialData: BloodUnit[] = [
  { id: 1, group: 'A', quantity: 10, entryDate: '01-06-2025', expiryDate: '01-07-2025' },
  { id: 2, group: 'O', quantity: 5, entryDate: '10-06-2025', expiryDate: '10-07-2025' },
];

const Manager = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialData);
  const [search, setSearch] = useState('');
  const [newUnit, setNewUnit] = useState({ group: '', quantity: 0, entryDate: '', expiryDate: '' });
  const managerName = 'Quản lý';

  const handleLogout = () => {
    alert('Đăng xuất');
  };

  const autoFormatDate = (value: string): string => {
    const raw = value.replace(/[^\d]/g, '');
    let result = '';

    for (let i = 0; i < raw.length && i < 8; i++) {
      result += raw[i];
      if ((i === 1 || i === 3) && i < raw.length - 1) {
        result += '-';
      }
    }

    return result;
  };

  const isValidDate = (value: string): boolean => {
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return false;
    const [_, dd, mm, yyyy] = match;
    const year = Number(yyyy);
    const date = new Date(year, Number(mm) - 1, Number(dd));
    return (
      date.getFullYear() === year &&
      date.getMonth() === Number(mm) - 1 &&
      date.getDate() === Number(dd)
    );
  };

  const parseDate = (value: string): Date => {
    const [dd, mm, yyyy] = value.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
  };

  const isExpired = (expiryDate: string): boolean => {
    return parseDate(expiryDate) < new Date();
  };

  const filteredUnits = bloodUnits.filter(unit =>
    unit.group.toUpperCase().includes(search.toUpperCase()) ||
    unit.entryDate.includes(search) ||
    unit.expiryDate.includes(search)
  );

  const handleAddUnit = () => {
    if (!isValidDate(newUnit.entryDate) || !isValidDate(newUnit.expiryDate)) {
      alert('Vui lòng nhập đúng định dạng dd-mm-yyyy');
      return;
    }

    const newEntry: BloodUnit = {
      id: Date.now(),
      group: newUnit.group.toUpperCase(),
      quantity: Number(newUnit.quantity),
      entryDate: newUnit.entryDate,
      expiryDate: newUnit.expiryDate,
    };

    setBloodUnits([...bloodUnits, newEntry]);
    setNewUnit({ group: '', quantity: 0, entryDate: '', expiryDate: '' });
  };

  const updateQuantity = (id: number, delta: number) => {
    setBloodUnits(prev =>
      prev.map(unit =>
        unit.id === id ? { ...unit, quantity: Math.max(0, unit.quantity + delta) } : unit
      )
    );
  };

  return (
    <>
      <header className="manager-header">
        <div className="manager-logo">
          <Link to="/">
            <img src={logoBlood} alt="Logo" className="logo-img" />
          </Link>
        </div>
        <div className="manager-greeting">
          Xin chào, <span className="manager-name">{managerName}</span>
        </div>
        <button className="manager-logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <div className="manager-container">
        <h2>Quản lý kho máu</h2>

        <input
          type="text"
          placeholder="Tìm kiếm theo nhóm máu, ngày..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <div className="blood-form">
          <h3>Nhập đơn vị máu mới</h3>
          <input
            type="text"
            placeholder="Nhóm máu (A/B/AB/O)"
            value={newUnit.group}
            onChange={(e) => setNewUnit({ ...newUnit, group: e.target.value })}
          />
          <input
            type="number"
            placeholder="Số lượng"
            value={newUnit.quantity}
            onChange={(e) => setNewUnit({ ...newUnit, quantity: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Ngày nhập (dd-mm-yyyy)"
            value={newUnit.entryDate}
            onChange={(e) => setNewUnit({ ...newUnit, entryDate: autoFormatDate(e.target.value) })}
            inputMode="numeric"
          />
          <input
            type="text"
            placeholder="Hạn sử dụng (dd-mm-yyyy)"
            value={newUnit.expiryDate}
            onChange={(e) => setNewUnit({ ...newUnit, expiryDate: autoFormatDate(e.target.value) })}
            inputMode="numeric"
          />
          <button onClick={handleAddUnit}>Thêm đơn vị máu</button>
        </div>

        <table className="blood-table">
          <thead>
            <tr>
              <th>Nhóm máu</th>
              <th>Số lượng</th>
              <th>Ngày nhập</th>
              <th>Hạn sử dụng</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map(unit => (
              <tr key={unit.id} className={isExpired(unit.expiryDate) ? 'expired' : ''}>
                <td>{unit.group}</td>
                <td>{unit.quantity}</td>
                <td>{unit.entryDate}</td>
                <td>{unit.expiryDate}</td>
                <td>
                  <button onClick={() => updateQuantity(unit.id, 1)}>+</button>
                  <button onClick={() => updateQuantity(unit.id, -1)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Manager;
