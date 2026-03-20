import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage'; 
import GuideModal from './components/GuideModal';
import Editor from './pages/Editor';
import UserProfile from './pages/UserProfile'; 
import { COLORS } from './styles/theme';
// --- 匯入 API 工具 ---
import { projectService } from './api/projectService';

export default function App() {
  const [view, setView] = useState('home');
  const [showGuide, setShowGuide] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. 初始化改為空陣列，資料由 API 取得
  const [projects, setProjects] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mf_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. 【讀取】從遠端 MySQL 抓取專案的函式
  const loadRemoteData = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      console.log("資料庫讀取成功");
    } catch (err) {
      console.error("讀取資料庫失敗:", err);
    }
  };

  // 3. 【副作用】當使用者進入專案列表時，自動抓取最新資料
  useEffect(() => {
    if (view === 'projects') {
      loadRemoteData();
    }
  }, [view]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mf_user');
    }
  }, [user]);

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (window.confirm("確定要登出嗎？")) {
      setUser(null);
      setView('home');
      setCurrentProject(null);
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  // 4. 【儲存】改為發送到 MySQL API
  const handleSaveProject = async () => {
    if (currentProject) {
      try {
        // 格式化時間以符合 MySQL
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const projectToSave = { ...currentProject, updatedAt: now };
        
        await projectService.saveProject(projectToSave);
        
        alert(`專案「${currentProject.name}」已成功存入 MySQL 資料庫！`);
        await loadRemoteData(); // 儲存完畢重新整理列表
        setView('projects');
      } catch (err) {
        alert("儲存至資料庫失敗，請檢查 ngrok 連線或欄位設定");
      }
    }
  };

  // 5. 【刪除】(若後端有寫刪除 API，可在此處補上)
  const deleteProject = (id, e) => {
    e.stopPropagation();
    if (window.confirm("確定要永久刪除這個專案嗎？")) {
      // 這裡暫時只在畫面過濾，建議請朋友補上 DELETE API
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const createNewProject = () => {
    const customName = window.prompt("請輸入新專案的名稱：", `新空間 ${projects.length + 1}`);
    if (customName === null) return;

    const newProj = {
      id: String(Date.now()), // 轉成字串避免 MySQL 判斷出錯
      name: customName.trim() || `新空間 ${projects.length + 1}`,
      l: 500,
      w: 400,
      items: [],
      updatedAt: new Date().toISOString()
    };
    
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
                <h2 style={{ color: COLORS.dark }}>雲端專案檔案 ({projects.length})</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>資料同步：MySQL 資料庫 (ngrok)</p>
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
                    {searchTerm ? `找不到與 "${searchTerm}" 相關的專案` : "目前資料庫沒有任何專案。"}
                  </p>
                </div>
              ) : (
                filteredProjects.map(p => (
                  <div key={p.id} style={styles.card} onClick={() => { setCurrentProject(p); setView('editor'); }}>
                    <button 
                      onClick={(e) => deleteProject(p.id, e)} 
                      style={styles.deleteCardBtn}
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

// 樣式保持不變
const styles = {
  hero: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  heroBtn: { padding: '15px 40px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' },
  heroBtnSmall: { padding: '10px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  actionGroup: { display: 'flex', gap: '15px', alignItems: 'center' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '10px 15px', borderRadius: '12px', border: `1px solid #e2e8f0`, width: '200px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { padding: '35px 25px', backgroundColor: 'white', borderRadius: '25px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.3s', textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', position: 'relative', overflow: 'hidden' },
  deleteCardBtn: { position: 'absolute', top: '15px', right: '15px', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px', zIndex: 2 },
  timeTag: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }
};