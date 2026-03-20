const BASE_URL = "https://refulgently-unavailing-mathilda.ngrok-free.dev";

export const authService = {
  // 註冊功能 (已測試成功)
  register: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "註冊失敗");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 登入功能 (現在可以加上去了)
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "登入失敗，請檢查帳密");
      }
      return await response.json(); // 成功會回傳使用者資料
    } catch (error) {
      throw error;
    }
  }
};