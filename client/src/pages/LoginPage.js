import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 格式驗證邏輯
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email 格式不正確";
    if (password.length < 6) return "密碼長度需至少 6 位";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    // 呼叫登入成功邏輯
    onLogin({ email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-2xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">使用者登入</h2>
        
        {error && <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">{error}</div>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">電子信箱</label>
          <input 
            type="email" 
            className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="example@tku.edu.tw"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">密碼</label>
          <input 
            type="password" 
            className="mt-1 w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
          登入系統
        </button>
      </form>
    </div>
  );
};

export default LoginPage;