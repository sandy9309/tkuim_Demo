import React, { useState } from 'react';
import Scene3D from '../components/Scene3D';
import { COLORS } from '../styles/theme';

const Editor = ({ project, setProject, onSave }) => {
  const [form, setForm] = useState({ name: '', l: '', price: '', material: '木質' });
  const [showInventory, setShowInventory] = useState(false);

  const addFurniture = () => {
    if (!form.name || !form.price) return alert("請填寫資訊");
    setProject({ ...project, items: [...project.items, { ...form, id: Date.now(), inScene: false }] });
    setForm({ name: '', l: '', price: '', material: '木質' });
  };

  return (
    <div style={styles.container}>
      {/* 左側控制面板 (參考 image_25f682.png) */}
      <aside style={styles.sidebar}>
        <div style={styles.section}>
          <h4 style={styles.title}>空間維度調整 </h4>
          <div style={styles.row}>
            <input type="number" value={project.l} style={styles.input} onChange={e => setProject({...project, l: e.target.value})} />
            <input type="number" value={project.w} style={styles.input} onChange={e => setProject({...project, w: e.target.value})} />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.title}>定義新家具 [cite: 18]</h4>
          <input placeholder="家具名稱" style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <div style={styles.row}>
            <input placeholder="長" style={styles.input} value={form.l} onChange={e => setForm({...form, l: e.target.value})} />
            <input placeholder="單價" style={styles.input} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <button onClick={addFurniture} style={styles.blackBtn}>新增至家具清單</button>
        </div>

        <div style={styles.budgetBox}>
          <p>總預算: ${project.items.filter(i => i.inScene).reduce((s, i) => s + Number(i.price), 0)} </p>
          <button style={styles.saveBtn} onClick={onSave}>儲存專案 </button>
        </div>
      </aside>

      {/* 中間 3D 渲染區 */}
      <main style={styles.main}>
        <Scene3D roomDimensions={{l: project.l, w: project.w}} furnitureItems={project.items} />
        
        <button style={styles.drawerBtn} onClick={() => setShowInventory(!showInventory)}>
          {showInventory ? '▶ 關閉家具列' : '◀ 開啟家具列'}
        </button>

        {showInventory && (
          <div style={styles.drawer}>
            <h4>我的家具列</h4>
            {project.items.map(item => (
              <div key={item.id} style={styles.item}>
                <span>{item.name}</span>
                <button onClick={() => {
                  const items = project.items.map(i => i.id === item.id ? {...i, inScene: !i.inScene} : i);
                  setProject({...project, items});
                }} style={{backgroundColor: item.inScene ? '#ef4444' : '#10b981', color: 'white', border:'none', borderRadius:'4px'}}>
                  {item.inScene ? '移除' : '擺放'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 70px)' },
  sidebar: { width: '320px', padding: '25px', backgroundColor: 'white', borderRight: '1px solid #eee' },
  section: { marginBottom: '30px' },
  title: { fontSize: '16px', color: '#64748b', marginBottom: '15px' },
  row: { display: 'flex', gap: '10px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  blackBtn: { width: '100%', padding: '12px', backgroundColor: COLORS.dark, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' },
  main: { flex: 1, padding: '20px', position: 'relative' },
  drawerBtn: { position: 'absolute', top: '40px', right: '40px', padding: '10px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', zIndex: 10 },
  drawer: { position: 'absolute', top: '90px', right: '40px', width: '250px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
  budgetBox: { marginTop: 'auto', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' },
  saveBtn: { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px' }
};

export default Editor;