import React from "react";
import "./components/News.css";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";

import New1 from "./images/News/News_1.png";
import New2 from "./images/News/News_2.jpg";
import New3 from "./images/News/News_3.jpg";
import New4 from "./images/News/News_4.jpg";
import New5 from "./images/News/News_5.jpg";
import New6 from "./images/News/News_6.jpg";
import New7 from "./images/News/News_7.jpg";
import New8 from "./images/News/News_8.jpg";

const articles = [
  {
    title: "KHỞI ĐỘNG THÁNG NHÂN ĐẠO NĂM 2025: HÀNH TRÌNH...",
    image: New1,
    description:
      "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ phát động Tháng Nhân đạo...",
  },
  {
    title: "NGÀY TOÀN DÂN HIẾN MÁU 7/4/2025",
    image: New2,
    description:
      "Ngày 7/4, chúng ta cùng nhau hướng về một ngày ý nghĩa – Ngày Toàn dân hiến máu tình nguyện.",
  },
  {
    title: "ÁP DỤNG CÔNG NGHỆ SỐ TRONG HOẠT ĐỘNG HIẾN...",
    image: New3,
    description:
      "Ngày 04/3, tại Trung tâm Hiến máu nhân đạo, Hội Chữ thập đỏ Thành phố phối hợp Hội Tin học TP triển khai...",
  },
  {
    title: "HƠN 1.000 ĐƠN VỊ MÁU ĐƯỢC HIẾN",
    image: New4,
    description:
      "Người dân tích cực tham gia hiến máu trong chương trình Hành trình Đỏ, góp phần cứu người kịp thời.",
  },
  {
    title: "HỘI NGHỊ TỔNG KẾT CÔNG TÁC HIẾN MÁU",
    image: New5,
    description:
      "Tổng kết năm 2024 và triển khai kế hoạch vận động hiến máu năm 2025 trên toàn quốc.",
  },
  {
    title: "KỶ NIỆM 25 NĂM THÀNH LẬP TRUNG TÂM",
    image: New6,
    description:
      "Trung tâm Hiến máu nhân đạo tổ chức lễ kỷ niệm 25 năm thành lập và phát triển (1999–2024).",
  },
  {
    title: "CHƯƠNG TRÌNH 'GIỌT MÁU NGHĨA TÌNH' LAN TỎA TOÀN QUỐC",
    image: New7,
    description:
      "Hàng nghìn người dân trên cả nước đã tham gia chương trình hiến máu 'Giọt máu nghĩa tình', lan tỏa tinh thần nhân ái sâu rộng.",
  },
  {
    title: "ĐÀO TẠO TÌNH NGUYỆN VIÊN HIẾN MÁU NĂM 2025",
    image: New8,
    description:
      "Khóa tập huấn cho lực lượng tình nguyện viên hiến máu được tổ chức nhằm nâng cao kỹ năng tuyên truyền và hỗ trợ người hiến.",
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
