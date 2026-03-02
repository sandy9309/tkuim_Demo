import React, { useState } from 'react';
import { COLORS, SHADOWS } from '../styles/theme';

const GUIDE_STEPS = [
  {
    title: "🏠 歡迎來到 MyFurniture VR",
    content: "本系統能幫助您在虛擬空間中模擬家具擺放並精確控管預算 [cite: 9]。讓我們花 30 秒了解如何操作！",
    image: "👋"
  },
  {
    title: "📏 第一步：測量房間",
    content: "請先使用捲尺測量您房間的長、寬、高 [cite: 17]。在編輯器的左側輸入這些數值，系統會即時生成 3D 空間 [cite: 17]。",
    image: "📐"
  },
  {
    title: "🖱️ 第二步：操作 3D 視窗",
    content: "使用滑鼠左鍵旋轉視角，右鍵平移，滾輪縮放。您可以從不同角度觀察家具擺放後的擁擠度 [cite: 7]。",
    image: "🎮"
  },
  {
    title: "💰 第三步：預算控管",
    content: "新增家具到清單後，點擊「擺放」按鈕。系統會自動根據公式計算總金額，防止預算失控 [cite: 8, 19]！",
    image: "💵"
  }
];

const GuideModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.icon}>{GUIDE_STEPS[currentStep].image}</div>
        <h2 style={styles.title}>{GUIDE_STEPS[currentStep].title}</h2>
        <p style={styles.content}>{GUIDE_STEPS[currentStep].content}</p>
        
        <div style={styles.footer}>
          <div style={styles.dotContainer}>
            {GUIDE_STEPS.map((_, i) => (
              <div key={i} style={{...styles.dot, backgroundColor: i === currentStep ? COLORS.primary : '#ccc'}} />
            ))}
          </div>
          <button onClick={nextStep} style={styles.nextBtn}>
            {currentStep === GUIDE_STEPS.length - 1 ? "開始體驗" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  card: { width: '450px', backgroundColor: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: SHADOWS.modal },
  icon: { fontSize: '60px', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: COLORS.dark },
  content: { fontSize: '16px', lineHeight: '1.6', color: '#64748b', marginBottom: '30px', minHeight: '80px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dotContainer: { display: 'flex', gap: '8px' },
  dot: { width: '100px', height: '4px', borderRadius: '2px', transition: '0.3s' },
  nextBtn: { padding: '10px 25px', backgroundColor: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default GuideModal;