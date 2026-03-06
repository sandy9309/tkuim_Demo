import React, { useState } from 'react';
import { COLORS } from '../styles/theme';

const UserProfile = ({ user, onUpdate, onBack }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    alert("資料更新成功！");
    onBack();
  };

  return (
    <div style={profileStyles.container}>
      <div style={profileStyles.card}>
        <button onClick={onBack} style={profileStyles.backBtn}>← 返回專案</button>
        <h2 style={{ marginBottom: '20px' }}>個人資料設定</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={profileStyles.field}>
            <label>使用者名稱</label>
            <input 
              style={profileStyles.input}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={profileStyles.field}>
            <label>電子郵件 (不可修改)</label>
            <input 
              style={{...profileStyles.input, backgroundColor: '#f1f5f9'}}
              value={formData.email}
              disabled
            />
          </div>

          <div style={profileStyles.field}>
            <label>頭像顏色</label>
            <input 
              type="color"
              style={profileStyles.colorInput}
              value={formData.avatarColor}
              onChange={e => setFormData({...formData, avatarColor: e.target.value})}
            />
          </div>

          <button type="submit" style={profileStyles.saveBtn}>儲存更新</button>
        </form>
      </div>
    </div>
  );
};

const profileStyles = {
  container: { padding: '50px', display: 'flex', justifyContent: 'center' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '25px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  field: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  colorInput: { width: '100%', height: '40px', border: 'none', cursor: 'pointer' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  backBtn: { background: 'none', border: 'none', color: COLORS.primary, cursor: 'pointer', marginBottom: '20px', padding: 0 }
};

export default UserProfile;