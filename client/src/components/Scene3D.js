import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';

const Scene3D = ({ roomDimensions, furnitureItems }) => {
  const scale = 0.01;
  const roomL = Number(roomDimensions.l || 500) * scale;
  const roomW = Number(roomDimensions.w || 400) * scale;

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#111827', borderRadius: '20px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 房間地板 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[roomL, roomW]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        <Grid infiniteGrid cellSize={0.5} sectionSize={1} fadeDistance={20} />

        {/* 渲染已擺放的家具：僅根據輸入的長、寬、高生成模型 */}
        {furnitureItems.filter(item => item.inScene).map((item, index) => {
          const itemL = (Number(item.l) || 50) * scale;
          const itemW = (Number(item.w) || 50) * scale;
          const itemH = (Number(item.h) || 40) * scale; 
          
          return (
            <mesh 
              key={item.id} 
              // 按照順序簡單排列位置，避免重疊
              position={[(index * 1.2) - 1, itemH / 2, 0]} 
            >
              <boxGeometry args={[itemW, itemH, itemL]} /> 
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          );
        })}

        {/* 僅保留視角旋轉控制 */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;