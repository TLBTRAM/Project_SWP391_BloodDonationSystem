import React from 'react';
import './components/News.css';
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const articles = [
    {
        title: "KHỞI ĐỘNG THÁNG NHÂN ĐẠO NĂM 2025: HÀNH TRÌNH...",
        image: "/images/news1.jpg",
        description: "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ phát động Tháng Nhân đạo...",
    },
    {
        title: "NGÀY TOÀN DÂN HIẾN MÁU 7/4/2025",
        image: "/images/news2.jpg",
        description: "Ngày 7/4, chúng ta cùng nhau hướng về một ngày ý nghĩa – Ngày Toàn dân hiến máu tình nguyện.",
    },
    {
        title: "ÁP DỤNG CÔNG NGHỆ SỐ TRONG HOẠT ĐỘNG HIẾN...",
        image: "/images/news3.jpg",
        description: "Ngày 04/3, tại Trung tâm Hiến máu nhân đạo, Hội Chữ thập đỏ Thành phố phối hợp Hội Tin học TP triển khai...",
    },
    {
        title: "HƠN 1.000 ĐƠN VỊ MÁU ĐƯỢC HIẾN",
        image: "/images/news4.jpg",
        description: "Người dân tích cực tham gia hiến máu trong chương trình Hành trình Đỏ, góp phần cứu người kịp thời.",
    },
    {
        title: "HỘI NGHỊ TỔNG KẾT CÔNG TÁC HIẾN MÁU",
        image: "/images/news5.jpg",
        description: "Tổng kết năm 2024 và triển khai kế hoạch vận động hiến máu năm 2025 trên toàn quốc.",
    },
    {
        title: "KỶ NIỆM 25 NĂM THÀNH LẬP TRUNG TÂM",
        image: "/images/news6.jpg",
        description: "Trung tâm Hiến máu nhân đạo tổ chức lễ kỷ niệm 25 năm thành lập và phát triển (1999–2024).",
    },
];

const News = () => {
    return (
        <div>
            <Header />

            <div className="news-container">
                {articles.map((item, index) => (
                    <div className="news-card" key={index}>
                        <img src={item.image} alt={item.title} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default News;
