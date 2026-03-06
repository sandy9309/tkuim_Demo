import React, { useState } from 'react';
import { COLORS, SHADOWS } from '../styles/theme';

const AuthModal = ({ onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleSubmit = () => {
    const { email, password, confirmPassword } = formData;

    // 1. 基礎非空驗證
    if (!email || !password) {
      alert("請填寫所有欄位！");
      return;
    }

    // 2. 嚴格電子郵件格式驗證 (Regex)
    // 確保格式為：帳號@域名.後綴 (例如 user@gmail.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("請輸入有效的電子郵件格式！\n(例如：example@mail.com)");
      return;
    }

    // 3. 註冊特有驗證：兩次密碼一致性
    if (isRegister && password !== confirmPassword) {
      alert("兩次密碼輸入不一致！");
      return;
    }

    // 通過驗證，執行登入/註冊邏輯
    onLogin(email);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.tabHeader}>
          <button 
            style={{...styles.tab, backgroundColor: !isRegister ? COLORS.tabActive : 'transparent'}}
            onClick={() => setIsRegister(false)}
          >登入</button>
          <button 
            style={{...styles.tab, backgroundColor: isRegister ? COLORS.tabActive : 'transparent'}}
            onClick={() => setIsRegister(true)}
          >註冊</button>
        </div>

        <div style={styles.formBody}>
          <div style={styles.inputGroup}>
            <input 
              placeholder="電子郵件" 
              style={styles.input} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="密碼" 
              style={styles.input} 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {/* 預留高度容器：避免切換註冊時卡片高度抖動 */}
            <div style={{ 
              height: isRegister ? '60px' : '0px', 
              overflow: 'hidden', 
              transition: '0.3s ease' 
            }}>
              <input 
                type="password" 
                placeholder="確認密碼" 
                style={styles.input} 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>
          
          <button style={styles.submitBtn} onClick={handleSubmit}>
            {isRegister ? '立即註冊' : '登入系統'}
          </button>
          <button onClick={onClose} style={styles.cancelLink}>取消</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  card: { 
    width: '400px', 
    height: '400px', // 👈 稍微調高以容納至中後的視覺比例
    backgroundColor: COLORS.modalBg, 
    borderRadius: '40px', 
    overflow: 'hidden', 
    boxShadow: SHADOWS.modal, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  tabHeader: { display: 'flex', justifyContent: 'center', gap: '15px', padding: '45px 0 10px 0' },
  tab: { padding: '8px 35px', border: 'none', borderRadius: '20px', fontSize: '18px', cursor: 'pointer', transition: '0.3s' },
  formBody: { 
    padding: '0 65px', // 👈 增加左右縮排，讓輸入框更短更精緻
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', // 👈 垂直至中
    alignItems: 'center' 
  },
  inputGroup: { width: '100%', marginBottom: '10px' },
  input: { 
    width: '100%', 
    padding: '14px', 
    marginBottom: '15px', 
    borderRadius: '15px', 
    border: 'none', 
    outline: 'none', 
    boxSizing: 'border-box', 
    textAlign: 'center',
    fontSize: '15px'
  },
  submitBtn: { 
    width: '100%', 
    padding: '15px', 
    backgroundColor: COLORS.dark, 
    color: 'white', 
    border: 'none', 
    borderRadius: '15px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '16px',
    marginTop: '5px'
  },
  cancelLink: { display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }
};

export default AuthModal;