import React from 'react';
import { COLORS } from '../styles/theme';

// 新增 onProfileClick prop
const Navbar = ({ user, onAuthClick, onLogout, setView, onGuideClick, onProfileClick }) => (
  <nav style={styles.nav}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={styles.logo} onClick={() => setView('home')}>MyFurniture VR</div>
      {/* 登入後顯示專案清單捷徑 */}
      {user && (
        <span style={styles.navLink} onClick={() => setView('projects')}>我的專案</span>
      )}
    </div>

    <div style={styles.links}>
      <span style={styles.link} onClick={onGuideClick}>新手指南</span>
      
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* 1. 動態頭像：背景色改為 user.avatarColor，且點擊可進入 Profile */}
          <div 
            style={{ 
              ...styles.userBadge, 
              backgroundColor: user.avatarColor || COLORS.dark, // 優先使用自定義顏色
              cursor: 'pointer'
            }} 
            onClick={onProfileClick}
            title="個人資料設定"
          >
            {/* 取名字的第一個字，若無名字則取 Email 第一個字 */}
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <button onClick={onLogout} style={styles.btnOutline}>登出</button>
        </div>
      ) : (
        <button onClick={onAuthClick} style={styles.btnPrimary}>登入 / 註冊</button>
      )}
    </div>
  </nav>
);

const styles = {
  nav: { 
    height: '70px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 40px', 
    backgroundColor: COLORS.white, 
    borderBottom: `1px solid ${COLORS.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: { fontSize: '22px', fontWeight: 'bold', color: COLORS.primary, cursor: 'pointer' },
  links: { display: 'flex', gap: '30px', alignItems: 'center' },
  link: { color: '#64748b', fontSize: '14px', cursor: 'pointer', transition: '0.2s' },
  navLink: { fontSize: '14px', color: COLORS.dark, cursor: 'pointer', fontWeight: '500', marginLeft: '10px' },
  btnPrimary: { padding: '8px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnOutline: { background: 'none', border: `1px solid ${COLORS.border}`, padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' },
  userBadge: { 
    width: '35px', 
    height: '35px', 
    color: 'white', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 'bold', 
    fontSize: '14px',
    transition: '0.3s' 
  }
};

export default Navbar;