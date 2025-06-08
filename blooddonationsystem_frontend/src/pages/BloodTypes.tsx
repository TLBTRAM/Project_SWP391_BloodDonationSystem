import React from 'react';
import './components/BloodTypes.css';
import bloodImage from '../pages/images/BloodType/BloodType.png';
import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const BloodTypes = () => {
  return (
    <div>
      <Header />
      <div className="blood-types-container">
        <h2 className="blood-types-title">Bảng tương thích máu</h2>

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
      <Footer />
    </div>
  );
};

export default BloodTypes;