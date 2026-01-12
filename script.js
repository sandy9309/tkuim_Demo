let selectedElement = null;

/**
 * 新增家具到畫板
 * @param {string} name - 家具名稱
 * @param {string} sizeClass - Tailwind 的寬高 class (例如 w-32 h-16)
 * @param {string} color - 背景顏色
 */
function addFurniture(name, sizeClass, color) {
    const floor = document.getElementById('room-floor');
    const el = document.createElement('div');
    
    // 設定類別與初始樣式
    el.className = `furniture-object ${sizeClass} rounded-md`;
    el.style.backgroundColor = color;
    
    // 預設生成位置
    el.style.left = '150px';
    el.style.top = '150px';
    el.innerText = name;
    
    // 儲存數據於 dataset 中以便後續讀取
    el.dataset.name = name;
    el.dataset.rotate = 0;

    // 點擊事件：選取物件
    el.onclick = function(e) {
        e.stopPropagation(); // 防止觸發地板的點擊事件
        selectElement(el);
    };

    floor.appendChild(el);
    selectElement(el); // 自動選中新生成的家具
}

/**
 * 選中指定的家具物件
 */
function selectElement(el) {
    // 移除前一個選中狀態
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }

    selectedElement = el;
    selectedElement.classList.add('selected');

    // 切換右側面板顯示
    document.getElementById('no-selection-msg').classList.add('hidden');
    document.getElementById('controls').classList.remove('hidden');

    // 更新面板上的控制項數值
    document.getElementById('selected-name').innerText = el.dataset.name;
    document.getElementById('rotate-slider').value = el.dataset.rotate || 0;
    document.getElementById('opacity-slider').value = (el.style.opacity * 100) || 100;
}

/**
 * 根據面板控制項更新選中的家具
 */
function updateFurniture() {
    if (!selectedElement) return;

    const rotation = document.getElementById('rotate-slider').value;
    const opacity = document.getElementById('opacity-slider').value;

    // 更新數據
    selectedElement.dataset.rotate = rotation;
    
    // 應用視覺變化
    selectedElement.style.transform = `rotateZ(${rotation}deg)`;
    selectedElement.style.opacity = opacity / 100;
}

/**
 * 刪除當前選中的家具
 */
function deleteSelected() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        
        // 隱藏控制面板
        document.getElementById('no-selection-msg').classList.remove('hidden');
        document.getElementById('controls').classList.add('hidden');
    }
}

/**
 * 重設地板視角
 */
function resetFloor() {
    const floor = document.getElementById('room-floor');
    floor.style.transform = "rotateX(55deg) rotateZ(-15deg)";
}

/**
 * 點擊地板空白處時，取消選取
 */
document.getElementById('room-floor').onclick = function() {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        document.getElementById('no-selection-msg').classList.remove('hidden');
        document.getElementById('controls').classList.add('hidden');
    }
};