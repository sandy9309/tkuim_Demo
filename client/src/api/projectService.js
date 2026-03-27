// 1. 設定基礎網址 (請確保這串 ngrok 是最新的)
const BASE_URL = "https://refulgently-unavailing-mathilda.ngrok-free.dev/api";
const PROJECT_URL = `${BASE_URL}/projects`;

export const projectService = {
  // 2. 讀取功能：加入強制格式化防護
  getAllProjects: async (userId) => {
    try {
      const urlWithFilter = `${PROJECT_URL}?userId=${userId}`;
      console.log("📡 正在讀取使用者專案，網址：", urlWithFilter);

      const response = await fetch(urlWithFilter, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      
      if (!response.ok) throw new Error("讀取專案失敗");
      
      const data = await response.json();
      
      return Array.isArray(data) ? data.map(p => {
        let safeItems = [];
        try {
          // ✨ 強力防護邏輯：解決 {"ValueKind":3} 導致的 .filter 報錯
          if (typeof p.items === 'string') {
            const parsed = JSON.parse(p.items);
            // 只有解析出來確實是陣列才採用，否則給空陣列
            safeItems = Array.isArray(parsed) ? parsed : [];
          } else if (Array.isArray(p.items)) {
            safeItems = p.items;
          }
        } catch (e) {
          console.warn(`專案 ID ${p.id} 的 items 格式錯誤，已重置為空陣列`);
          safeItems = []; 
        }

        return {
          ...p,
          items: safeItems
        };
      }) : [];
    } catch (error) {
      console.error("讀取專 resonance 失敗:", error);
      return []; 
    }
  },

  // 3. 儲存功能 (新增 + 更新)：修正 JSON 傳送格式
  saveProject: async (projectData) => {
    try {
      // ✨ 確保送往後端的資料型別完全正確
      const payload = {
        user_id: Number(projectData.user_id),
        name: projectData.name || "未命名專案",
        l: Number(projectData.l) || 0,
        w: Number(projectData.w) || 0,
        // 確保 items 轉為 JSON 字串送出
        items: JSON.stringify(Array.isArray(projectData.items) ? projectData.items : []),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };

      // ✨ 如果已有 ID，帶入進行更新 (UPDATE)
      if (projectData.id) {
        payload.id = projectData.id;
      }

      console.log("🚀 準備送出儲存請求，Payload:", payload);

      const response = await fetch(PROJECT_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`儲存失敗: ${errorDetail}`);
      }
      return await response.json();
    } catch (error) {
      console.error("儲存失敗:", error);
      alert("儲存失敗！請檢查後端 CORS 設定或資料庫欄位長度。");
      throw error;
    }
  },

  // 4. 刪除功能
  deleteProject: async (projectId) => {
    try {
      const response = await fetch(`${PROJECT_URL}/${projectId}`, {
        method: "DELETE",
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!response.ok) throw new Error("刪除失敗");
      return true;
    } catch (error) {
      console.error("刪除失敗:", error);
      throw error;
    }
  }
};