import React, { useEffect } from 'react';

import './components/Home.css';
import bannerImg from './images/Banner/Banner1.png';
import { useNavigate } from 'react-router-dom';

import aaravImg from './images/User/Aarav.png';
import dinoyRajKImg from './images/User/DinoyRajK.png';
import rohanImg from './images/User/Rohan.png';

import calendarImg from './images/procedure/Calendar.png';
import healthCheckImg from './images/procedure/Health_check.png';
import donationImg from './images/procedure/Donation.png';
import afterDonationImg from './images/procedure/After_donation.png';

import newImg from './images/info/new_icon.png';
import askImg from './images/info/ask_icon.png';
import attentionImg from './images/info/attention_icon.png';
import bloodTypesImg from './images/info/bloodTypes_icon.png';
import joinImg from './images/info/join_icon.png';
import advisedImg from './images/info/advise_icon.png';
import bloodBankImg from './images/info/bloodBank_icon.png';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <section className="banner-section">
        <img src={bannerImg} alt="Hiến máu" className="banner-img" />
        <div className="banner-overlay" />
        <div className="banner-content">
          <h3>HIẾN MÁU</h3>
          <h1>VÌ CỘNG ĐỒNG</h1>
          <button className="book-btn" onClick={() => navigate("/register")}>KHÁM SÀNG LỌC</button>
        </div>
      </section>

      <section className="section">
        <div id="aboutus" className="mission">
          <h2>Trách nhiệm của chúng tôi</h2>
          <p>Chúng tôi cam kết xây dựng một cầu nối vững chắc giữa người hiến máu và những người đang cần máu gấp, góp phần cứu sống hàng nghìn sinh mạng mỗi ngày.</p>
          <p>Sứ mệnh của chúng tôi là tạo ra một nền tảng minh bạch, thuận tiện và an toàn, thúc đẩy hiến máu tự nguyện, hỗ trợ các trường hợp khẩn cấp và đảm bảo nguồn cung máu ổn định cho cộng đồng.</p>
          <p>Cùng với cộng đồng và các chuyên gia y tế, chúng tôi nỗ lực xây dựng một xã hội giàu lòng nhân ái, nơi mỗi giọt máu sẻ chia sẽ mang đến hy vọng và sự chữa lành.</p>
        </div>

        <h2>Blog</h2>
        <div className="blog-grid">
          {[
            {
              name: 'Aarav',
              image: aaravImg,
              avatar: aaravImg,
              title: 'Hiến máu – Điều nhỏ, nghĩa lớn',
              likes: 57,
              comments: 6,
              views: 138,
            },
            {
              name: 'Dinoy Raj K',
              image: dinoyRajKImg,
              avatar: dinoyRajKImg,
              title: 'Lần đầu đi hiến máu: Cảm xúc và trải nghiệm',
              likes: 72,
              comments: 4,
              views: 190,
            },
            {
              name: 'Rohan',
              image: rohanImg,
              avatar: rohanImg,
              title: 'Giọt máu cứu người – Hành trình nhân ái',
              likes: 102,
              comments: 12,
              views: 320,
            },
          ].map((blog, index) => (
            <div className="blog-card" key={index}>
              <img className="blog-img" src={blog.image} alt={blog.name} />
              <div className="avatar-container">
                <img className="avatar" src={blog.avatar} alt={blog.name} />
              </div>
              <div className="blog-body">
                <h4 className="blog-title">{blog.title}</h4>
                <div className="blog-footer">
                  <span>❤️ {blog.likes}</span>
                  <span>💬 {blog.comments}</span>
                  <span>👁️ {blog.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2>Quy trình</h2>
        <div className="process-steps">
          {[
            { img: calendarImg, label: 'Đăng ký tư vấn' },
            { img: healthCheckImg, label: 'Kiểm tra sức khỏe' },
            { img: donationImg, label: 'Hiến máu' },
            { img: afterDonationImg, label: 'Theo dõi sức khỏe' },
          ].map((step, index) => (
            <div className="process-item" key={index}>
              <div className="icon-circle">
                <img src={step.img} alt={step.label} />
              </div>
              <p>{step.label}</p>
            </div>
          ))}
        </div>

        <br />

        <h2 id="info">Thông tin</h2>
        <div className="blood-section">
          <div className="left-column">
            <div className="info-box" onClick={() => navigate("/news")}>
              <img src={newImg} alt="Tin tức" className="icon" />
              Tin tức
            </div>
            <div className="info-box" onClick={() => navigate("/faqs")}>
              <img src={askImg} alt="Hỏi đáp" className="icon" />
              Hỏi đáp
            </div>
            <div className="info-box" onClick={() => navigate("/act")}>
              <img src={attentionImg} alt="Lưu ý khi hiến máu" className="icon" />
              Các hoạt động hiến máu nhân đạo
            </div>
            <div className="info-box" onClick={() => navigate("/bloodtype")}>
              <img src={bloodTypesImg} alt="Nhóm máu" className="icon" />
              Nhóm máu
            </div>
          </div>
          <div className="right-column">
            <div className="info-box" onClick={() => navigate("/standard")}>
              <img src={joinImg} alt="Tiêu chuẩn" className="icon" />
              Tiêu chuẩn tham gia hiến máu
            </div>
            <div className="info-box" onClick={() => navigate("/advise")}>
              <img src={advisedImg} alt="advised" className="icon" />
              Những lời khuyên trước và sau khi hiến máu
            </div>
            <div className="info-box">
              <img src={bloodBankImg} alt="Ngân hàng máu" className="icon" />
              Ngân hàng máu
            </div>
          </div>
        </div>
      </section>
      
      <footer id="contact">
        {<Footer />}
      </footer>
    </div>
  );
}

export default Home;