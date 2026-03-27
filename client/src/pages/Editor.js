import React, { useState } from 'react';
import Scene3D from '../components/Scene3D';
import Inventory from '../components/Inventory';
import { COLORS } from '../styles/theme';

const Editor = ({ project, setProject, onSave }) => {
  const [form, setForm] = useState({ name: '', l: '', w: '', h: '', price: '', material: '木質' });
  const [showInventory, setShowInventory] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 確保 items 永遠是陣列
  const safeItems = Array.isArray(project.items) 
    ? project.items 
    : (typeof project.items === 'string' ? JSON.parse(project.items || '[]') : []);

  const handleProjectNameChange = (e) => {
    setProject({ ...project, name: e.target.value });
  };

  // 🛠️ 修正：處理空間維度輸入，防止出現 0400
  const handleDimensionChange = (field, value) => {
    // 如果使用者刪光內容，設為 0；否則使用 Number 轉換自動去掉前面的 0
    const numValue = value === '' ? 0 : Number(value);
    setProject({ ...project, [field]: numValue });
  };

  const handleAction = () => {
    if (!form.name || !form.l || !form.w || !form.h || !form.price) return alert("請填寫完整資訊 (含名稱、長寬高、單價)");
    
    const itemData = {
      ...form,
      l: Number(form.l),
      w: Number(form.w),
      h: Number(form.h),
      price: Number(form.price)
    };

    if (editingId) {
      const updatedItems = safeItems.map(item => 
        item.id === editingId ? { ...itemData, id: editingId, inScene: item.inScene } : item
      );
      setProject({ ...project, items: updatedItems });
      setEditingId(null);
    } else {
      setProject({ 
        ...project, 
        items: [...safeItems, { ...itemData, id: Date.now(), inScene: false }] 
      });
    }
    setForm({ name: '', l: '', w: '', h: '', price: '', material: '木質' });
  };

  const deleteFurniture = (itemId) => {
    if (window.confirm("確定要從清單中永久刪除這件家具嗎？")) {
      const updatedItems = safeItems.filter(item => item.id !== itemId);
      setProject({ ...project, items: updatedItems });
      if (editingId === itemId) setEditingId(null);
    }
  };

  const startEditing = (item) => {
    setForm({ name: item.name, l: item.l, w: item.w, h: item.h, price: item.price, material: item.material });
    setEditingId(item.id);
  };

  const toggleItemInScene = (itemId) => {
    const items = safeItems.map(i => i.id === itemId ? {...i, inScene: !i.inScene} : i);
    setProject({...project, items});
  };

  const totalBudget = safeItems
    .filter(i => i.inScene)
    .reduce((sum, i) => sum + Number(i.price || 0), 0);

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.section}>
          <h4 style={styles.title}>專案名稱</h4>
          <input style={styles.projectNameInput} value={project.name || ''} onChange={handleProjectNameChange} placeholder="輸入專案名稱..." />
        </div>

        <div style={styles.section}>
          <h4 style={styles.title}>空間維度調整</h4>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <span style={styles.label}>長 (cm)</span>
              <input 
                type="number" 
                value={project.l === 0 ? '' : project.l} 
                style={styles.input} 
                onChange={e => handleDimensionChange('l', e.target.value)} 
                placeholder="0"
              />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.label}>寬 (cm)</span>
              <input 
                type="number" 
                value={project.w === 0 ? '' : project.w} 
                style={styles.input} 
                onChange={e => handleDimensionChange('w', e.target.value)} 
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.title}>{editingId ? "修改家具尺寸" : "定義新家具"}</h4>
          <input placeholder="家具名稱" style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <div style={{...styles.row, marginTop: '10px'}}>
            <input placeholder="長" style={styles.miniInput} type="number" value={form.l} onChange={e => setForm({...form, l: e.target.value})} />
            <input placeholder="寬" style={styles.miniInput} type="number" value={form.w} onChange={e => setForm({...form, w: e.target.value})} />
            <input placeholder="高" style={styles.miniInput} type="number" value={form.h} onChange={e => setForm({...form, h: e.target.value})} />
          </div>
          <input placeholder="單價 (TWD)" style={styles.input} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <button onClick={handleAction} style={{...styles.blackBtn, marginTop: '15px', backgroundColor: editingId ? COLORS.primary : COLORS.dark}}>
            {editingId ? "確認修改尺寸" : "新增至家具清單"}
          </button>
          {editingId && <button onClick={() => {setEditingId(null); setForm({ name: '', l: '', w: '', h: '', price: '', material: '木質' });}} style={styles.cancelBtn}>取消修改</button>}
        </div>

        <div style={styles.budgetBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>預算總計:</span>
            <span style={{ fontWeight: 'bold', color: COLORS.primary }}>${totalBudget.toLocaleString()}</span>
          </div>
          <button style={styles.saveBtn} onClick={onSave}>儲存專案至雲端</button>
        </div>
      </aside>

      <main style={styles.main}>
        <Scene3D roomDimensions={{l: Number(project.l), w: Number(project.w)}} furnitureItems={safeItems} />
        <button style={styles.drawerBtn} onClick={() => setShowInventory(!showInventory)}>
          {showInventory ? '▶ 關閉家具列' : '◀ 開啟家具列'}
        </button>
        {showInventory && (
          <div style={styles.drawer}>
            <Inventory items={safeItems} onToggleScene={toggleItemInScene} onEdit={startEditing} onDelete={deleteFurniture} />
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 70px)' },
  sidebar: { width: '320px', padding: '25px', backgroundColor: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  section: { marginBottom: '25px' },
  title: { fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' },
  projectNameInput: { width: '100%', padding: '12px', fontSize: '18px', fontWeight: 'bold', borderRadius: '10px', border: `2px solid #f1f5f9`, outline: 'none' },
  row: { display: 'flex', gap: '8px', marginBottom: '10px' },
  inputGroup: { flex: 1 },
  label: { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' },
  miniInput: { width: '32%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' },
  blackBtn: { width: '100%', padding: '12px', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { width: '100%', padding: '8px', marginTop: '10px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' },
  main: { flex: 1, padding: '20px', position: 'relative', backgroundColor: '#f1f5f9' },
  drawerBtn: { position: 'absolute', top: '40px', right: '40px', padding: '10px 20px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', zIndex: 10 },
  drawer: { position: 'absolute', top: '90px', right: '40px', width: '280px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '70vh', overflowY: 'auto' },
  budgetBox: { marginTop: 'auto', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' },
  saveBtn: { width: '100%', padding: '12px', marginTop: '5px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Editor;