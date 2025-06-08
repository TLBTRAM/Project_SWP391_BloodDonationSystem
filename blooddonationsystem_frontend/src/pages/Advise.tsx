import React from 'react';
import '../pages/components/Advise.css';
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const Advise: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="advise-container">
        <h2 className="advise-title">Những lời khuyên trước và sau khi hiến máu</h2>
        <div className="advise-grid">

          <div className="advise-box advise-green">
            <div className="advise-icon">✔</div>
            <h3>Nên:</h3>
            <ul>
              <li>- Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.</li>
              <li>- Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ bằng keo cá nhân trong 4-6 giờ.</li>
              <li>- Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu.</li>
              <li>- Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.</li>
              <li>- Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.</li>
            </ul>
          </div>

          <div className="advise-box advise-red">
            <div className="advise-icon">✘</div>
            <h3>Không nên:</h3>
            <ul>
              <li>- Uống sữa, rượu bia trước khi hiến máu.</li>
              <li>- Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức trong ngày lấy máu.</li>
            </ul>
          </div>

          <div className="advise-box advise-orange">
            <div className="advise-icon">!</div>
            <h3>Lưu ý:</h3>
            <ul>
              <li>- Nếu phát hiện chảy máu tại chỗ chích:<br />Giơ tay cao.</li>
              <li>- Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.</li>
              <li>- Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.</li>
            </ul>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Advise;
