import React from 'react';
import './components/BloodTypes.css';
import bloodImage from '../pages/images/BloodType/BloodType.png';
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';
import { useNavigate } from 'react-router-dom';

const BloodTypes = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <h2 className="blood-types-title">BẢNG TƯƠNG THÍCH MÁU</h2>
      <div className="blood-types-container">
        <div className="blood-types-left">

          <div className="blood-types-wrapper">
            <span className="label-donor">Người cho</span>
            <span className="label-recipient">Người nhận</span>
            <img
              src={bloodImage}
              alt="Blood Type Compatibility Chart"
              className="blood-types-image"
            />
          </div>
        </div>

        <div className="blood-types-right">
          <p className="blood-desc">
            Bảng tương thích nhóm máu là tài liệu quan trọng trong ngành y tế, giúp xác định chính xác nhóm máu nào có thể truyền cho hoặc nhận từ nhóm máu nào khác.
            Điều này giúp giảm thiểu rủi ro phản ứng miễn dịch, đảm bảo an toàn tuyệt đối cho người bệnh.
          </p>

          <ul className="blood-rules">
            <li><strong>O-</strong>: Cho được tất cả các nhóm máu (O-, O+, A-, A+, B-, B+, AB-, AB+). Nhận máu chỉ từ O-.</li>
            <li><strong>O+</strong>: Cho được O+, A+, B+, AB+. Nhận máu từ O+ và O-.</li>
            <li><strong>A-</strong>: Cho được A-, A+, AB-, AB+. Nhận máu từ A- và O-.</li>
            <li><strong>A+</strong>: Cho được A+, AB+. Nhận máu từ A+, A-, O+, O-.</li>
            <li><strong>B-</strong>: Cho được B-, B+, AB-, AB+. Nhận máu từ B- và O-.</li>
            <li><strong>B+</strong>: Cho được B+, AB+. Nhận máu từ B+, B-, O+, O-.</li>
            <li><strong>AB-</strong>: Cho được AB- và AB+. Nhận máu từ AB-, A-, B-, O-.</li>
            <li><strong>AB+</strong>: Chỉ cho được AB+. Nhận máu từ tất cả các nhóm máu – là <em>người nhận máu toàn cầu</em>.</li>
          </ul>

          <div className="note">
            <strong>Lưu ý:</strong> Dù lý thuyết cho phép, việc truyền máu thực tế còn phụ thuộc vào nhiều yếu tố khác như kháng thể, hệ miễn dịch, bệnh lý nền và xét nghiệm tương thích chéo.
          </div>

          <div className="cta-buttons">
            <button>Tìm người cho máu</button>
            <button>Đăng ký hiến máu</button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default BloodTypes;