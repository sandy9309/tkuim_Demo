import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage'; 
import GuideModal from './components/GuideModal';
import Editor from './pages/Editor';
import UserProfile from './pages/UserProfile'; 
import { COLORS } from './styles/theme';
import { projectService } from './api/projectService';

export default function App() {
  const [view, setView] = useState('home');
  const [showGuide, setShowGuide] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mf_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) { return null; }
  });

  const loadRemoteData = async () => {
    const currentUserId = user?.user_id || user?.id;
    if (!currentUserId) return;
    try {
      const data = await projectService.getAllProjects(currentUserId);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("讀取資料庫失敗:", err);
    }
  };

  useEffect(() => {
    if (view === 'projects') loadRemoteData();
  }, [view]);

  useEffect(() => {
    if (user) localStorage.setItem('mf_user', JSON.stringify(user));
    else localStorage.removeItem('mf_user');
  }, [user]);

  const filteredProjects = projects?.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleLogin = (userData) => {
    const accountStr = userData?.username || userData?.email || '';
    const userName = accountStr.includes('@') ? accountStr.split('@')[0] : (accountStr || '設計師');
    setUser({
      ...(typeof userData === 'object' ? userData : {}),
      email: accountStr,
      name: userName,
      avatarColor: COLORS.primary
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

  // ✨ 修正儲存邏輯
  const handleSaveProject = async () => {
    if (!currentProject) return;
    const currentUserId = user?.user_id || user?.id;
    if (!currentUserId) return alert("請重新登入！");

    try {
      const projectToSave = {
        ...currentProject,
        user_id: currentUserId,
        l: Number(currentProject.l),
        w: Number(currentProject.w)
      };

      // 只要有 ID 就帶入，確保執行更新
      if (currentProject.id) {
        projectToSave.id = currentProject.id;
      }

      await projectService.saveProject(projectToSave);
      alert(`專案「${currentProject.name}」已儲存！`);
      await loadRemoteData(); // 儲存後立即刷新列表
      setView('projects');
    } catch (err) {
      console.error("儲存失敗：", err);
      alert("儲存失敗，請檢查網路連線");
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("確定要永久刪除嗎？")) return;
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert("刪除失敗"); }
  };

  const createNewProject = () => {
    const customName = window.prompt("請輸入新專案名稱：", `新空間 ${projects.length + 1}`);
    if (!customName) return;
    setCurrentProject({
      id: null, // 新專案設為 null
      name: customName.trim(),
      l: 500, w: 400, items: []
    });
    setView('editor');
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh' }}>
      <Navbar user={user} setView={setView} onAuthClick={() => setView('login')} onGuideClick={() => setShowGuide(true)} onProfileClick={() => setView('profile')} onLogout={handleLogout} />
      <main>
        {view === 'home' && (
          <div style={styles.hero}>
            <h1>MyFurniture VR</h1>
            <button style={styles.heroBtn} onClick={() => setView(user ? 'projects' : 'login')}>立即開始設計</button>
          </div>
        )}
        {view === 'login' && <LoginPage onLogin={handleLogin} />}
        {view === 'projects' && (
          <div style={{ padding: '50px' }}>
            <div style={styles.projectHeader}>
              <h2>雲端專案檔案 ({projects.length})</h2>
              <button style={styles.heroBtnSmall} onClick={createNewProject}>+ 建立新專案</button>
            </div>
            <div style={styles.grid}>
              {filteredProjects.map(p => (
                <div key={p.id || Math.random()} style={styles.card} onClick={() => { setCurrentProject(p); setView('editor'); }}>
                  <button onClick={(e) => deleteProject(p.id, e)} style={styles.deleteCardBtn}>🗑️</button>
                  <div style={{ fontSize: '2.5rem' }}>🏠</div>
                  <h3>{p.name}</h3>
                  <p>尺寸: {p.l} x {p.w} cm</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === 'editor' && currentProject && <Editor project={currentProject} setProject={setCurrentProject} onSave={handleSaveProject} />}
      </main>
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}

const styles = {
  hero: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  heroBtn: { padding: '15px 40px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' },
  heroBtnSmall: { padding: '10px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { padding: '35px 25px', backgroundColor: 'white', borderRadius: '25px', cursor: 'pointer', textAlign: 'center', position: 'relative' },
  deleteCardBtn: { position: 'absolute', top: '15px', right: '15px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};