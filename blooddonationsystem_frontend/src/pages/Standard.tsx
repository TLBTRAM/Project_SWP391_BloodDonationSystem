import React from 'react';
import '../pages/components/Standard.css';

const standards = [
  'Mang theo giấy tờ tùy thân (CMND, CCCD hoặc hộ chiếu).',
  'Không nhiễm HIV, viêm gan B/C, và các bệnh lây truyền qua đường máu.',
  'Cân nặng từ 45kg trở lên đối với cả Nam và Nữ.',
  'Không sử dụng rượu bia, ma túy, chất kích thích trong vòng 24 giờ.',
  'Sức khỏe ổn định, không mắc bệnh mãn tính về tim mạch, huyết áp, hô hấp…',
  'Chỉ số huyết sắc tố Hb ≥ 120g/l (≥ 125g/l nếu hiến từ 350ml).',
  'Tuổi từ 18 đến 60, đủ điều kiện theo quy định.',
  'Khoảng cách tối thiểu giữa 2 lần hiến máu là 12 tuần.',
  'Kết quả xét nghiệm nhanh âm tính với virus viêm gan B.',
];

const Standard: React.FC = () => {
  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Hành Trình Sẵn Sàng Hiến Máu</h2>
      <div className="timeline">
        {standards.map((item, index) => (
          <div className="timeline-step" key={index}>
            <div className="timeline-marker">
              <div className="circle">{index + 1}</div>
              {index < standards.length - 1 && <div className="line" />}
            </div>
            <div className="timeline-content">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Standard;