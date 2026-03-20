const API_URL = "https://refulgently-unavailing-mathilda.ngrok-free.dev/api/furnitures";

export const projectService = {
  // 1. 從 MySQL 讀取所有專案
  getAllProjects: async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          // ✨ 重要：這行可以跳過 ngrok 的警告頁面，直接拿資料
          "ngrok-skip-browser-warning": "true"
        }
      });
      
      if (!response.ok) throw new Error("網路回應不正常");
      const data = await response.json();
      
      // 如果回傳的是陣列，處理 JSON 解析
      return Array.isArray(data) ? data.map(p => ({
        ...p,
        items: typeof p.items === 'string' ? JSON.parse(p.items) : (p.items || [])
      })) : [];
    } catch (error) {
      console.error("讀取資料庫失敗:", error);
      throw error;
    }
  },

  // 2. 將專案儲存到 MySQL
  saveProject: async (projectData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" // ✨ 同樣要加這行
        },
        body: JSON.stringify({
          id: projectData.id,
          name: projectData.name,
          l: projectData.l,
          w: projectData.w,
          // 確保轉成字串存入 MySQL JSON 欄位
          items: JSON.stringify(projectData.items)
        }),
      });
      
      if (!response.ok) throw new Error("儲存至資料庫失敗");
      return await response.json();
    } catch (error) {
      console.error("儲存失敗:", error);
      throw error;
    }
  }
};