import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage'; 
import GuideModal from './components/GuideModal';
import Editor from './pages/Editor';
import UserProfile from './pages/UserProfile'; 
import { COLORS } from './styles/theme';

export default function App() {
  const [view, setView] = useState('home');
  const [showGuide, setShowGuide] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mf_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('mf_projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem('mf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mf_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mf_projects', JSON.stringify(projects));
  }, [projects]);

  const handleLogin = (userData) => {
    const email = typeof userData === 'object' ? userData.email : userData;
    setUser({
      email: email,
      name: email.split('@')[0],
      avatarColor: COLORS.primary,
      bio: "尚未填寫自我介紹"
    });
    setView('projects');
  };

  const handleLogout = () => {
    if (window.confirm("確定要登出嗎？資料將保存在此瀏覽器中。")) {
      setUser(null);
      setView('home');
      setCurrentProject(null);
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handleSaveProject = () => {
    if (currentProject) {
      const now = new Date().toLocaleString();
      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? { ...currentProject, updatedAt: now } : p
      );
      setProjects(updatedProjects);
      alert(`專案「${currentProject.name}」已儲存！`);
      setView('projects');
    }
  };

  const deleteProject = (id, e) => {
    e.stopPropagation();
    if (window.confirm("確定要永久刪除這個專案嗎？")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // --- 重點修改：加入命名邏輯 ---
  const createNewProject = () => {
    // 使用 prompt 詢問名稱
    const customName = window.prompt("請輸入新專案的名稱：", `新空間 ${projects.length + 1}`);
    
    // 如果使用者點擊「取消」，則不建立專案
    if (customName === null) return;

    const now = new Date().toLocaleString();
    const newProj = {
      id: Date.now(),
      name: customName.trim() || `新空間 ${projects.length + 1}`, // 避免空格
      l: 500,
      w: 400,
      items: [],
      updatedAt: now
    };
    setProjects([...projects, newProj]);
    setCurrentProject(newProj);
    setView('editor');
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar 
        user={user} 
        setView={setView} 
        onAuthClick={() => setView('login')} 
        onGuideClick={() => setShowGuide(true)} 
        onProfileClick={() => setView('profile')}
        onLogout={handleLogout} 
      />
      
      <main>
        {view === 'home' && (
          <div style={styles.hero}>
            <h1 style={{ fontSize: '3.5rem', color: COLORS.dark }}>MyFurniture VR</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', margin: '20px 0 40px' }}>
              跨裝置室內空間模擬與預算管理系統
            </p>
            <button style={styles.heroBtn} onClick={() => setView(user ? 'projects' : 'login')}>
              {user ? '繼續我的設計' : '立即開始設計'}
            </button>
          </div>
        )}

        {view === 'login' && <LoginPage onLogin={handleLogin} />}

        {view === 'profile' && user && (
          <UserProfile 
            user={user} 
            onUpdate={handleUpdateUser} 
            onBack={() => setView('projects')}
          />
        )}

        {view === 'projects' && (
          <div style={{ padding: '50px' }}>
            <div style={styles.projectHeader}>
              <div>
                <h2 style={{ color: COLORS.dark }}>我的專案檔案 ({projects.length})</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>管理您的室內設計空間</p>
              </div>
              
              <div style={styles.actionGroup}>
                <div style={styles.searchWrapper}>
                  <span style={{ fontSize: '14px' }}>🔍</span>
                  <input 
                    placeholder="搜尋專案..." 
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button style={styles.heroBtnSmall} onClick={createNewProject}>+ 建立新專案</button>
              </div>
            </div>
            
            <div style={styles.grid}>
              {filteredProjects.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={{ color: '#94a3b8' }}>
                    {searchTerm ? `找不到與 "${searchTerm}" 相關的專案` : "您目前還沒有任何專案。"}
                  </p>
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>清除搜尋</button>
                  )}
                </div>
              ) : (
                filteredProjects.map(p => (
                  <div key={p.id} style={styles.card} onClick={() => { setCurrentProject(p); setView('editor'); }}>
                    <button 
                      onClick={(e) => deleteProject(p.id, e)} 
                      style={styles.deleteCardBtn}
                      title="刪除專案"
                    >
                      🗑️
                    </button>

                    <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏠</div>
                    <h3 style={{ marginBottom: '8px' }}>{p.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>尺寸: {p.l} x {p.w} cm</p>
                    
                    <div style={styles.timeTag}>
                      最後更新: {p.updatedAt || '尚未紀錄'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'editor' && currentProject && (
          <Editor 
            project={currentProject} 
            setProject={setCurrentProject}
            onSave={handleSaveProject}
          />
        )}
      </main>

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}

// 樣式部分保持不變...
const styles = {
  hero: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  heroBtn: { padding: '15px 40px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' },
  heroBtnSmall: { padding: '10px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  actionGroup: { display: 'flex', gap: '15px', alignItems: 'center' },
  searchWrapper: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    backgroundColor: 'white', 
    padding: '10px 15px', 
    borderRadius: '12px', 
    border: `1px solid #e2e8f0`,
    width: '200px'
  },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { 
    padding: '35px 25px', 
    backgroundColor: 'white', 
    borderRadius: '25px', 
    border: '1px solid #f1f5f9', 
    cursor: 'pointer', 
    transition: '0.3s', 
    textAlign: 'center', 
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  deleteCardBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#fee2e2',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '14px',
    zIndex: 2,
  },
  timeTag: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '11px',
    color: '#94a3b8'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px',
    backgroundColor: '#f8fafc',
    borderRadius: '20px',
    border: '2px dashed #e2e8f0'
  },
  clearBtn: {
    marginTop: '10px',
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    textDecoration: 'underline',
    cursor: 'pointer'
  }
};