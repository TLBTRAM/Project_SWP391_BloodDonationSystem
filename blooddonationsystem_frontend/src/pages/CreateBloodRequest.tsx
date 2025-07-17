import React, { useState } from "react";
import "./components/CreateBloodRequest.css";

const CreateBloodRequest = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    rhType: "",
    medicalCondition: "",
    hospitalName: "",
    phone: "",
    requiredVolume: "",
    street: "",
    wardId: "",
    districtId: "",
    provinceId: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: 0, // hoặc để BE tự xử lý
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      gender: formData.gender,
      bloodType: formData.bloodType,
      rhType: formData.rhType === "+" ? "POSITIVE" : "NEGATIVE",
      requiredVolume: Number(formData.requiredVolume),
      hospitalName: formData.hospitalName,
      medicalCondition: formData.medicalCondition,
      patientAddress: {
        street: formData.street,
        wardId: Number(formData.wardId),
        districtId: Number(formData.districtId),
        provinceId: Number(formData.provinceId),
      },
    };

    try {
      const response = await fetch("/api/blood-request/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("🩸 Yêu cầu máu đã được gửi thành công.");
        setFormData({
          fullName: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          rhType: "",
          medicalCondition: "",
          hospitalName: "",
          phone: "",
          requiredVolume: "",
          street: "",
          wardId: "",
          districtId: "",
          provinceId: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`❌ Lỗi: ${errorData.message || "Gửi yêu cầu thất bại."}`);
      }
    } catch (error) {
      setMessage("❌ Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  };

  return (
    <div className="blood-request-form-container">
      <h2>Yêu cầu máu toàn phần</h2>
      <form onSubmit={handleSubmit} className="blood-request-form">
        <label>Họ tên:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label>Ngày sinh:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

        <label>Số điện thoại:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Giới tính:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">--Chọn giới tính--</option>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>

        <label>Nhóm máu:</label>
        <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
          <option value="">--Chọn nhóm máu--</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="AB">AB</option>
          <option value="O">O</option>
        </select>

        <label>Yếu tố Rh:</label>
        <select name="rhType" value={formData.rhType} onChange={handleChange} required>
          <option value="">--Chọn Rh--</option>
          <option value="+">Dương tính (+)</option>
          <option value="-">Âm tính (-)</option>
        </select>

        <label>Tình trạng bệnh:</label>
        <textarea name="medicalCondition" value={formData.medicalCondition} onChange={handleChange} required />

        <label>Bệnh viện tiếp nhận:</label>
        <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />

        <label>Thể tích máu yêu cầu (ml):</label>
        <input type="number" name="requiredVolume" value={formData.requiredVolume} onChange={handleChange} required />

        <fieldset>
          <legend>Địa chỉ bệnh nhân</legend>
          <label>Số nhà, đường:</label>
          <input type="text" name="street" value={formData.street} onChange={handleChange} required />

          <label>Phường/Xã (ID):</label>
          <input type="number" name="wardId" value={formData.wardId} onChange={handleChange} required />

          <label>Quận/Huyện (ID):</label>
          <input type="number" name="districtId" value={formData.districtId} onChange={handleChange} required />

          <label>Tỉnh/Thành phố (ID):</label>
          <input type="number" name="provinceId" value={formData.provinceId} onChange={handleChange} required />
        </fieldset>

        <button type="submit">Gửi yêu cầu</button>
      </form>

      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default CreateBloodRequest;
