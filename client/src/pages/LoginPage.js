import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false); // 切換登入/註冊
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // 密碼強度邏輯
  const getStrength = (pwd) => {
    if (!pwd) return { label: '未輸入', color: '#ccc', width: '5%', text: '#999' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1: return { label: '弱', color: '#ff4d4f', width: '25%', text: '#ff4d4f' };
      case 2: return { label: '中', color: '#faad14', width: '50%', text: '#faad14' };
      case 3: return { label: '強', color: '#1890ff', width: '75%', text: '#1890ff' };
      case 4: return { label: '極強', color: '#52c41a', width: '100%', text: '#52c41a' };
      default: return { label: '極弱', color: '#ff4d4f', width: '10%', text: '#ff4d4f' };
    }
  };

  const strength = getStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 基礎驗證
    if (!email.includes('@')) {
      setError('❌ Email 格式不正確');
      return;
    }

    if (isRegister) {
      // 註冊專屬驗證
      if (password.length < 6) {
        setError('❌ 註冊密碼至少需 6 位');
        return;
      }
      if (password !== confirmPassword) {
        setError('❌ 兩次密碼輸入不一致');
        return;
      }
      alert('註冊成功！');
    }

    // 執行登入邏輯
    onLogin({ email });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* 頁籤切換：點擊可切換登入或註冊 */}
        <div style={styles.tabHeader}>
          <div 
            style={!isRegister ? styles.tabActive : styles.tabInactive} 
            onClick={() => { setIsRegister(false); setError(''); }}
          >登入</div>
          <div 
            style={isRegister ? styles.tabActive : styles.tabInactive} 
            onClick={() => { setIsRegister(true); setError(''); }}
          >註冊</div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorTip}>{error}</div>}

          <input 
            style={styles.input} 
            placeholder="電子郵件" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            style={styles.input} 
            placeholder="密碼" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 只有在註冊模式下才顯示密碼強度與確認密碼 */}
          {isRegister && (
            <>
              <div style={styles.strengthBox}>
                <div style={styles.strengthLabel}>
                  <span>安全性評估</span>
                  <span style={{color: strength.text, fontWeight: 'bold'}}>{strength.label}</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{...styles.progressBarFill, width: strength.width, backgroundColor: strength.color}} />
                </div>
              </div>

              <input 
                type="password" 
                style={styles.input} 
                placeholder="確認密碼" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" style={styles.submitBtn}>
            {isRegister ? '立即註冊' : '登入系統'}
          </button>
          
          <div style={styles.cancelText}>取消</div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#777' },
  card: { 
    width: '380px', 
    padding: '50px 35px', 
    backgroundColor: '#e5e5e5', 
    borderRadius: '50px', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  tabHeader: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '35px' },
  tabActive: { padding: '12px 35px', backgroundColor: '#8b7e7e', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  tabInactive: { padding: '12px 35px', borderRadius: '25px', color: '#555', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { 
    width: '100%', 
    padding: '16px 25px', 
    borderRadius: '20px', 
    border: 'none', 
    fontSize: '16px', 
    boxSizing: 'border-box',
    backgroundColor: '#fff'
  },
  strengthBox: { 
    width: '100%',
    padding: '12px', 
    backgroundColor: 'rgba(255,255,255,0.5)', 
    borderRadius: '15px',
    boxSizing: 'border-box'
  },
  strengthLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#666' },
  progressBarBg: { width: '100%', height: '8px', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', transition: 'all 0.4s ease' },
  errorTip: { color: '#ff4d4f', fontSize: '13px', fontWeight: 'bold' },
  submitBtn: { 
    width: '100%', 
    padding: '18px', 
    backgroundColor: '#0c1222', 
    color: 'white', 
    borderRadius: '18px', 
    border: 'none', 
    fontSize: '18px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    marginTop: '10px'
  },
  cancelText: { marginTop: '10px', color: '#888', cursor: 'pointer', fontSize: '14px' }
};

export default LoginPage;