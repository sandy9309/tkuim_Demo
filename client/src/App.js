import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import GuideModal from './components/GuideModal';
import Editor from './pages/Editor';
import { COLORS } from './styles/theme';

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [projects, setProjects] = useState([]); // 存儲所有專案
  const [currentProject, setCurrentProject] = useState(null);

  // 登入成功處理
  const handleLogin = (email) => {
    setUser(email);
    setShowAuth(false);
    setView('projects'); // 登入後自動跳轉到專案列表
  };

  // 登出處理
  const handleLogout = () => {
    setUser(null);
    setView('home');
    setCurrentProject(null);
  };

  // 建立新專案
  const createNewProject = () => {
    const newProj = {
      id: Date.now(),
      name: `新空間 ${projects.length + 1}`,
      l: 500,
      w: 400,
      items: []
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
        onAuthClick={() => setShowAuth(true)} 
        onGuideClick={() => setShowGuide(true)} 
        onLogout={handleLogout} 
      />
      
      {/* 1. 首頁 (未登入) */}
      {view === 'home' && (
        <div style={styles.hero}>
          <h1 style={{ fontSize: '3.5rem', color: COLORS.dark }}>MyFurniture VR</h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', margin: '20px 0 40px' }}>
            跨裝置室內空間模擬與預算管理系統
          </p>
          <button style={styles.heroBtn} onClick={() => setShowAuth(true)}>立即開始設計</button>
        </div>
      )}

      {/* 2. 專案列表頁面 (登入後) */}
      {view === 'projects' && (
        <div style={{ padding: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>我的專案檔案</h2>
            <button style={styles.heroBtn} onClick={createNewProject}>+ 建立新專案</button>
          </div>
          
          <div style={styles.grid}>
            {projects.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>您目前還沒有任何專案，請點擊右上方按鈕建立。</p>
            ) : (
              projects.map(p => (
                <div key={p.id} style={styles.card} onClick={() => { setCurrentProject(p); setView('editor'); }}>
                  <h3>{p.name}</h3>
                  <p>空間大小: {p.l} x {p.w} cm</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. 3D 編輯器頁面 */}
      {view === 'editor' && currentProject && (
        <Editor 
          project={currentProject} 
          setProject={setCurrentProject}
          onSave={() => {
            setProjects(projects.map(p => p.id === currentProject.id ? currentProject : p));
            alert("專案已儲存！");
            setView('projects');
          }}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}

const styles = {
  hero: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  heroBtn: { padding: '15px 40px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { padding: '20px', backgroundColor: 'white', borderRadius: '15px', border: '1px solid #eee', cursor: 'pointer', transition: '0.2s' }
};