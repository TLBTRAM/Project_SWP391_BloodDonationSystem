import React from 'react';
import '../pages/components/Standard.css';
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

import idcardImg from './images/standard/idcard.png';
import virusImg from './images/standard/virus.png';
import weightImg from './images/standard/weight.png';
import illegalImg from './images/standard/illegal.png';
import healthImg from './images/standard/health.png';
import hbImg from './images/standard/hb.png';
import ageImg from './images/standard/age.png';
import calenderImg from './images/standard/calendar.png';
import testImg from './images/standard/test.png';

const standards = [
  {
    img: idcardImg,
    text: 'Mang theo giấy tờ tùy thân (CMND, CCCD hoặc hộ chiếu).',
  },
  {
    img: virusImg,
    text: 'Không nhiễm HIV, viêm gan B/C, và các bệnh lây truyền qua đường máu.',
  },
  {
    img: weightImg,
    text: 'Cân nặng từ 45kg trở lên đối với cả Nam và Nữ.',
  },
  {
    img: illegalImg,
    text: 'Không sử dụng rượu bia, ma túy, chất kích thích trong vòng 24 giờ.',
  },
  {
    img: healthImg,
    text: 'Sức khỏe ổn định, không mắc bệnh mãn tính về tim mạch, huyết áp, hô hấp…',
  },
  {
    img: hbImg,
    text: 'Chỉ số huyết sắc tố Hb ≥ 120g/l (≥ 125g/l nếu hiến từ 350ml).',
  },
  {
    img: ageImg,
    text: 'Tuổi từ 18 đến 60, đủ điều kiện theo quy định.',
  },
  {
    img: calenderImg,
    text: 'Khoảng cách tối thiểu giữa 2 lần hiến máu là 12 tuần.',
  },
  {
    img: testImg,
    text: 'Kết quả xét nghiệm nhanh âm tính với virus viêm gan B.',
  },
];

const Standard: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="timeline-container">
        <h2 className="timeline-title">Tiêu chuẩn tham gia hiến máu</h2>
        <div className="timeline">
          {standards.map((item, index) => (
            <div className="timeline-step" key={index}>
              <div className="timeline-marker">
                <img src={item.img} alt={`step-${index + 1}`} className="timeline-icon" />
              </div>
              <div className="timeline-content">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Standard;
