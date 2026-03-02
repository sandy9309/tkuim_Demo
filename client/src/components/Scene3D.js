import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

const Scene3D = ({ roomDimensions, furnitureItems }) => {
  // 將公分轉換為 Three.js 的單位 (例如 100cm = 1單位)
  const scale = 0.01;
  const length = roomDimensions.l * scale;
  const width = roomDimensions.w * scale;

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#111827', borderRadius: '20px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 1. 模擬房間地板  */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[length, width]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* 2. 輔助網格 */}
        <Grid infiniteGrid cellSize={0.5} sectionSize={1} fadeDistance={20} />

        {/* 3. 渲染已擺放的家具方塊 [cite: 18] */}
        {furnitureItems.filter(item => item.inScene).map((item, index) => (
          <mesh key={item.id} position={[index * 0.5 - 1, 0.25, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        ))}

        {/* 軌道控制：讓使用者可以用滑鼠旋轉縮放視角 */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;