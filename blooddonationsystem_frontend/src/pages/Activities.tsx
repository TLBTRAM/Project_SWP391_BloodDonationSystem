import React, { useEffect, useRef } from 'react';
import '../pages/components/Activities.css';

// thêm các ảnh
import actdhbkImg from './images/Activities/ActivityDHBK.png';
import actq1Img from './images/Activities/ActivityQ1.png';
import redsummerImg from './images/Activities/redsummer.png';
import nvhsvImg from './images/Activities/nvhsv.png';
import vincomcenterImg from './images/Activities/vincom.png';
import acthosImg from './images/Activities/Acthos.png';
import actsvImg from './images/Activities/Actsv.png';
import donorImg from './images/Activities/volunteer.png';
import connectbloodImg from './images/Activities/actconnectblood.png';
import womenImg from './images/Activities/actwomen.png';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

interface picture {
    image: string;
    title: string;
    description: string;
}

const active: picture[] = [
    {
        image: actdhbkImg,
        title: 'Hiến máu tại Đại học Bách Khoa',
        description: 'Ngày hội hiến máu do Hội Sinh viên Trường ĐH Bách khoa kết hợp với Trung tâm Truyền máu huyết học – Bệnh viện Chợ Rẫy tổ chức, thu hút hơn 500 sinh viên tham gia.'
    },
    {
        image: actq1Img,
        title: 'Giọt máu nghĩa tình tại Quận 1',
        description: 'Sự kiện tổ chức ở Nhà Văn hóa Thanh Niên với sự hỗ trợ của bệnh viện Truyền Máu Huyết Học.'
    },
    {
        image: redsummerImg,
        title: 'Chương trình Hè đỏ 2025',
        description: 'Chiến dịch lớn diễn ra toàn quốc từ tháng 6 đến 8 với hàng ngàn người tham gia hiến máu.'
    },
    {
        image: nvhsvImg,
        title: 'Ngày hội Giọt hồng tri ân',
        description: 'Tổ chức tại Nhà Văn hóa Sinh viên TP.HCM, nhằm tri ân những người hiến máu thường xuyên và phát động phong trào mới.'
    },
    {
        image: vincomcenterImg,
        title: 'Hiến máu nhân đạo tại Vincom Center',
        description: 'Sự kiện kết hợp giữa khối doanh nghiệp và Hội Chữ Thập Đỏ, nâng cao nhận thức cộng đồng về hiến máu cứu người.'
    },
    {
        image: acthosImg,
        title: 'Ngày hội “Chia sẻ yêu thương”',
        description: 'Tổ chức bởi nhóm thiện nguyện trẻ, chương trình kêu gọi hiến máu cho bệnh nhi đang điều trị tại các bệnh viện tuyến trung ương.'
    },
    {
        image: actsvImg,
        title: 'Giọt máu hồng sinh viên 2025',
        description: 'Được tổ chức tại nhiều trường đại học khắp TP.HCM, chương trình thu hút đông đảo sinh viên tình nguyện.'
    },
    {
        image: donorImg,
        title: 'Hiến máu dịp Tết Nguyên Đán',
        description: 'Chiến dịch đặc biệt vào dịp Tết nhằm đảm bảo lượng máu dự trữ cho các ca cấp cứu khẩn cấp trong kỳ nghỉ lễ.'
    },
    {
        image: connectbloodImg,
        title: 'Ngày hội máu “Kết nối trái tim”',
        description: 'Được tổ chức tại Quận Tân Bình, với sự góp mặt của các CLB tình nguyện và bệnh viện Nhân Dân 115.'
    },
    {
        image: womenImg,
        title: 'Chương trình “Máu đào trao sự sống”',
        description: 'Chương trình do Hội Liên hiệp Phụ nữ phát động, đặc biệt hướng đến các khu dân cư và cán bộ công chức tham gia hiến máu.'
    }
];

const Activities: React.FC = () => {
    return (
        <div>
            <Header />
            <div className="anh-carousel-container">
                <h2 className="anh-carousel-title">Hoạt động hiến máu tiêu biểu</h2>
                <div className="anh-carousel">
                    <div className="anh-carousel-content">
                        {active.concat(active).map((item, index) => (
                            <div className="anh-slide" key={index}>
                                <img src={item.image} alt={item.title} className="anh-image" />
                                <div className="anh-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Activities;
