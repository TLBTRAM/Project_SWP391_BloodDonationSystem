import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../layouts/header-footer/AuthContext';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded: GoogleUser = jwtDecode(credentialResponse.credential);
        
        console.log('Google user data:', decoded);

        // Gửi thông tin Google user đến backend để xác thực
        const response = await fetch('http://localhost:8080/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: decoded.email,
            fullName: decoded.name,
            googleId: decoded.sub,
            picture: decoded.picture
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Lưu token vào localStorage
          localStorage.setItem('token', data.token);
          
          // Cập nhật context
          login({
            fullName: decoded.name,
            email: decoded.email,
            role: data.role || 'CUSTOMER'
          });

          // Chuyển hướng dựa trên role
          switch (data.role) {
            case 'ADMIN':
              navigate('/admin');
              break;
            case 'MANAGER':
              navigate('/manager');
              break;
            case 'MEDICALSTAFF':
              navigate('/med');
              break;
            default:
              navigate('/user');
          }
        } else {
          console.error('Google login failed');
          alert('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Có lỗi xảy ra khi đăng nhập bằng Google.');
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    alert('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        locale="vi"
      />
    </div>
  );
};

export default GoogleLoginButton;
