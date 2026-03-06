import React from 'react';

const Inventory = ({ items, onToggleScene, onEdit, onDelete }) => {
  return (
    <div>
      <h4 style={{ marginBottom: '15px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
        我的家具清單
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>{items.length} 件</span>
      </h4>
      
      {items.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>尚未新增家具</p>
      ) : (
        items.map(item => (
          <div key={item.id} style={styles.itemCard}>
            {/* 左側：家具資訊 */}
            <div style={styles.infoCol}>
              <span style={styles.name}>{item.name}</span>
              <span style={styles.specs}>
                {item.l} x {item.w} x {item.h} cm
              </span>
              <span style={styles.price}>${item.price}</span>
            </div>
            
            {/* 右側：動作按鈕群組 */}
            <div style={styles.actionCol}>
              <div style={styles.buttonRow}>
                {/* 編輯按鈕 */}
                <button 
                  onClick={() => onEdit(item)} 
                  style={styles.iconBtn}
                  title="編輯尺寸"
                >
                  📝
                </button>
                
                {/* 刪除按鈕 */}
                <button 
                  onClick={() => onDelete(item.id)} 
                  style={styles.deleteBtn}
                  title="刪除家具"
                >
                  🗑️
                </button>
              </div>

              {/* 擺放/移除按鈕 */}
              <button 
                onClick={() => onToggleScene(item.id)} 
                style={{ 
                  ...styles.statusBtn,
                  backgroundColor: item.inScene ? '#ef4444' : '#10b981',
                }}
              >
                {item.inScene ? '移除' : '擺放'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  itemCard: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '12px 0', 
    borderBottom: '1px solid #f1f5f9' 
  },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '2px' },
  name: { fontSize: '14px', fontWeight: 'bold', color: '#1e293b' },
  specs: { fontSize: '11px', color: '#64748b' },
  price: { fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' },
  actionCol: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  buttonRow: { display: 'flex', gap: '4px' },
  iconBtn: { 
    background: '#f1f5f9', 
    border: 'none', 
    borderRadius: '4px', 
    padding: '4px 6px', 
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteBtn: { 
    background: '#fff1f2', // 淺紅色背景
    border: 'none', 
    borderRadius: '4px', 
    padding: '4px 6px', 
    cursor: 'pointer',
    fontSize: '12px'
  },
  statusBtn: { 
    padding: '4px 10px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    fontSize: '11px', 
    cursor: 'pointer',
    transition: '0.2s',
    minWidth: '65px'
  }
};

export default Inventory;