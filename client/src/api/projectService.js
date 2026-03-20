// 1. 設定最新的 ngrok 網址 (Base URL + /api/furnitures)
const API_URL = "https://refulgently-unavailing-mathilda.ngrok-free.dev/api/furnitures";

export const projectService = {
  // 2. 從 MySQL 讀取所有專案 (GET)
  getAllProjects: async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          // ✨ 跳過 ngrok 的警告頁面，讓 React 直接拿到 JSON
          "ngrok-skip-browser-warning": "true"
        }
      });
      
      if (!response.ok) throw new Error("讀取資料失敗，請檢查後端是否開啟");
      
      const data = await response.json();
      
      // 自動處理 MySQL 回傳的字串資料，將其轉回 React 能用的陣列格式
      return Array.isArray(data) ? data.map(p => ({
        ...p,
        items: typeof p.items === 'string' ? JSON.parse(p.items) : (p.items || [])
      })) : [];
    } catch (error) {
      console.error("讀取資料庫失敗:", error);
      throw error;
    }
  },

  // 3. 將專案儲存到 MySQL (POST)
  saveProject: async (projectData) => {
    try {
      // 依照朋友要求：確保長寬是數字，家具清單轉為 JSON 字串
      const payload = {
        name: projectData.name,
        l: parseFloat(projectData.l) || 0, // 確保是數字
        w: parseFloat(projectData.w) || 0, // 確保是數字
        items: JSON.stringify(projectData.items), // 轉成字串存入 MySQL
      };

      // 如果不是新建立的專案 (已有資料庫 ID)，就把 ID 傳回去更新
      // 若是新專案，則不傳 ID 讓資料庫自動遞增 (Auto Increment)
      if (projectData.id && String(projectData.id).length < 10) {
        payload.id = projectData.id;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        // 如果報錯 405，代表朋友沒開 POST 權限
        if (response.status === 405) throw new Error("後端未開放 POST 存檔功能 (405)");
        throw new Error("儲存至資料庫失敗");
      }
      
      return await response.json();
    } catch (error) {
      console.error("儲存失敗:", error);
      throw error;
    }
  }
};