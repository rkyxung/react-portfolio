import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// 정육면체 메시 컴포넌트
function SquareMesh() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  
  const material = new THREE.MeshStandardMaterial({
    color: '#FF5912',
    metalness: 0.3,
    roughness: 0.4,
  });
  
  return (
    <mesh ref={meshRef} material={material}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

// 정육면체 3D 컴포넌트
function Square3D() {
  return (
    <div style={{ width: '50vh', height: '50vh', maxWidth: '500px', maxHeight: '500px' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <SquareMesh />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

export default Square3D;

