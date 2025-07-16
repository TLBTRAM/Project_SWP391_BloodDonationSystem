import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  fullName: string;
  email?: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'MEDICALSTAFF'; 
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Hàm lấy user từ backend
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data); // gán dữ liệu từ BE
      console.log('✅ User fetched from API:', response.data);
    } catch (error) {
      console.error('❌ Lỗi khi fetch user:', error);
      setUser(null);
    }
  };

  // ✅ Gọi tự động khi load lần đầu
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData); // chỉ dùng nếu login xong không gọi lại API
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};