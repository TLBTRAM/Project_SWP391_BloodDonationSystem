import React from 'react';
import './components/Team.css';
import Team1Img from './images/info/Team1.png';
import Header from '../layouts/header-footer/Header';
const Team = () => {
    return (
        <div>
            <Header />
            <section className="team-wrapper">
                <h2 className="team-heading">Đội Ngũ Y Tế Đồng Hành Cùng Bạn</h2>
                <p className="team-subtitle">
                    Đội ngũ bác sĩ, điều dưỡng và nhân viên y tế của chúng tôi luôn tận tâm,
                    chuyên nghiệp và sẵn sàng hỗ trợ mọi hoạt động hiến máu vì cộng đồng.
                </p>
                <div className="team-image-container">
                    <img src={Team1Img} alt="Đội ngũ y tế" className="team-image" />
                </div>
            </section>
        </div>
    );
};

export default Team;