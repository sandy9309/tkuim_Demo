const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// MySQL 連線設定
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // 你的 MySQL 帳號
  password: 'password', // 你的 MySQL 密碼 (請記得改)
  database: 'tk_demo'   // 你的資料庫名稱
});

db.connect(err => {
  if (err) {
    console.error('❌ 資料庫連線失敗:', err);
    return;
  }
  console.log('✅ 已成功連線至 MySQL 資料庫');
});

// API 路由
app.get('/api/furnitures', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/furnitures', (req, res) => {
  const { id, name, l, w, items } = req.body;
  // 使用 REPLACE INTO 或 ON DUPLICATE KEY UPDATE 來處理新增或更新
  const sql = `REPLACE INTO projects (id, name, l, w, items, updated_at) VALUES (?, ?, ?, ?, ?, NOW())`;
  const values = [id, name, l, w, items];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: '儲存成功', id });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
});