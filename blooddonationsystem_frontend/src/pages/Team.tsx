import React from 'react';
import './components/Team.css';
import Team1Img from './images/info/Team1.png';
import Team2Img from './images/info/Team2.png';
import Team3Img from './images/info/Team3.png';
import Team4Img from './images/info/Team4.png';
import Team5Img from './images/info/Team5.png';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

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

                <div className="team-grid">
                    <div className="team-card">
                        <img src={Team1Img} alt="Nhân viên Y tế" className="team-grid-image" />
                        <p className="team-caption">Bác sĩ và điều dưỡng chuyên khoa</p>
                    </div>
                    <div className="team-card">
                        <img src={Team2Img} alt="Tình nguyện viên" className="team-grid-image" />
                        <p className="team-caption">Tình nguyện viên thanh thiếu niên</p>
                    </div>
                    <div className="team-card">
                        <img src={Team3Img} alt="Chăm sóc viên" className="team-grid-image" />
                        <p className="team-caption">Nhóm chăm sóc hậu hiến máu</p>
                    </div>
                    <div className="team-card">
                        <img src={Team4Img} alt="Ban tổ chức" className="team-grid-image" />
                        <p className="team-caption">Ban tổ chức & hỗ trợ chương trình</p>
                    </div>
                    <div className="team-card">
                        <img src={Team5Img} alt="ban truyền thông" className="team-grid-image" />
                        <p className="team-caption">Ban truyền thông & điều phối sự kiện</p>
                    </div>
                </div>
            </section>

        <Footer />
        </div>
    );
};

export default Team;