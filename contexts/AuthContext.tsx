'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  userId: string;
  userName: string;
  email: string;
  role: string;
  role_id?: number;
  roleId?: number;
  token: string;
  avatarUrl?: string;
}

interface AuthContextType {
  userData: UserData | null;
  isLoading: boolean;
  login: (data: UserData) => void;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data từ localStorage khi app khởi động
  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        console.log('📌 userData từ localStorage:', parsedData);
        
        // Xử lý role
        if (parsedData.role_id === 1 || parsedData.roleId === 1) {
          parsedData.role = 'ADMIN';
        } else if (parsedData.role_id === 2 || parsedData.roleId === 2) {
          parsedData.role = 'MANAGER';
        }
        
        console.log('✅ userData sau khi xử lý:', parsedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('❌ Error parsing userData:', error);
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  // Hàm login - lưu data và cập nhật state
  const login = (data: UserData) => {
    // Xử lý role
    if (data.role_id === 1 || data.roleId === 1) {
      data.role = 'ADMIN';
    } else if (data.role_id === 2 || data.roleId === 2) {
      data.role = 'MANAGER';
    }
    
    localStorage.setItem('userData', JSON.stringify(data));
    setUserData(data);
    console.log('✅ User logged in:', data);
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    router.push('/');
    console.log('✅ User logged out');
  };

  // Hàm update user data (dùng khi cập nhật profile)
  const updateUser = (data: Partial<UserData>) => {
    if (!userData) return;
    
    const updatedData = { ...userData, ...data };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setUserData(updatedData);
    console.log('✅ User data updated:', updatedData);
  };

  return (
    <AuthContext.Provider value={{ userData, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
