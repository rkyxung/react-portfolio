import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useTexture } from '@react-three/drei';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';

// 이미지 import (경로는 프로젝트 설정에 맞게 유지)
import spikleImg from '/img/spikle.jpg';
import pivotTimeImg from '/img/pivot-time.jpg';
import climbOnImg from '/img/climb-on.jpg';
import code404Img from '/img/code404.jpg';

// 텍스처를 사용하는 컴포넌트
function SquareMeshWithTexture({ onRotationChange, controlsRef }) {
  const meshRef = useRef();
  
  // useTexture로 모든 이미지 로드
  const frontTexture = useTexture(spikleImg);
  const backTexture = useTexture(pivotTimeImg);
  const rightTexture = useTexture(climbOnImg);
  const leftTexture = useTexture(code404Img);
  
  // 텍스처 설정: 이미지가 면을 꽉 채우도록 (cover 효과 - 빈 여백 없이)
  useEffect(() => {
    [frontTexture, backTexture, rightTexture, leftTexture].forEach(texture => {
      if (texture) {
        // 이미지를 약간 확대하여 면을 꽉 채우도록 (잘려도 괜찮음)
        texture.repeat.set(0.97, 0.97); // 5% 확대로 빈 여백 제거
        texture.offset.set(0.025, 0.025); // 중앙 정렬
        
        // 텍스처 랩핑 및 필터 설정
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        texture.needsUpdate = true;
      }
    });
  }, [frontTexture, backTexture, rightTexture, leftTexture]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // y축 회전 (좌우로만 회전) - 속도 느리게
      meshRef.current.rotation.y += delta * 0.08;
      
      // 회전 각도를 부모 컴포넌트에 전달 (매 프레임마다)
      if (onRotationChange) {
        let rotationY = meshRef.current.rotation.y;
        
        // OrbitControls가 있으면 카메라의 azimuth 각도 사용
        // OrbitControls는 카메라를 회전시키므로, 실제로 보이는 면을 계산하려면
        // mesh 회전과 카메라 회전을 결합해야 함
        if (controlsRef?.current) {
          const controls = controlsRef.current;
          const azimuth = controls.getAzimuthalAngle();
          // azimuth는 -π ~ π 범위
          // 카메라가 회전하면 실제로는 반대 방향으로 보이므로 보정 필요
          // mesh 회전 + 카메라 회전 = 실제 보이는 각도
          const cameraRotation = -azimuth; // 반대 방향
          rotationY = meshRef.current.rotation.y + cameraRotation;
        }
        
        // 각도를 0~2π 범위로 정규화
        rotationY = ((rotationY % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        onRotationChange(rotationY);
      }
    }
  });

  // 투명한 material (위아래 면)
  const transparentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.2,
    flatShading: false, // 부드러운 쉐이딩
  }), []);

  // 각 면의 material 생성
  // Box Geometry Material 순서: [Right, Left, Top, Bottom, Front, Back]
  const materials = useMemo(() => {
    if (!frontTexture || !backTexture || !rightTexture || !leftTexture) {
      return new Array(6).fill(transparentMaterial);
    }
    
    return [
      // 1. Right 면 (오른쪽)
      new THREE.MeshStandardMaterial({ 
        map: rightTexture,
        side: THREE.FrontSide,
        toneMapped: false, // 색상이 더 선명하게
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2, // 원래 밝기
        flatShading: false,
        color: new THREE.Color(1.2, 1.2, 1.2), // 채도 증가 (밝기 약간 증가로 채도 효과)
      }),
      // 2. Left 면 (왼쪽)
      new THREE.MeshStandardMaterial({ 
        map: leftTexture, 
        side: THREE.FrontSide,
        toneMapped: false,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2, // 원래 밝기
        flatShading: false,
        color: new THREE.Color(1.2, 1.2, 1.2), // 채도 증가
      }),
      // 3. Top 면 (위 - 투명)
      transparentMaterial,
      // 4. Bottom 면 (아래 - 투명)
      transparentMaterial,
      // 5. Front 면 (앞)
      new THREE.MeshStandardMaterial({ 
        map: frontTexture,
        side: THREE.FrontSide,
        toneMapped: false,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2, // 원래 밝기
        flatShading: false,
        color: new THREE.Color(1.2, 1.2, 1.2), // 채도 증가
      }),
      // 6. Back 면 (뒤)
      new THREE.MeshStandardMaterial({ 
        map: backTexture,
        side: THREE.FrontSide,
        toneMapped: false,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.2, // 원래 밝기
        flatShading: false,
        color: new THREE.Color(1.2, 1.2, 1.2), // 채도 증가
      }),
    ];
  }, [frontTexture, backTexture, rightTexture, leftTexture, transparentMaterial]);

  // 일반 mesh + boxGeometry 사용 (각 면에 다른 material 적용)
  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[1.6, 0.9, 1.6]} />
    </mesh>
  );
}

// 로딩 중 폴백 컴포넌트
function SquareMeshFallback() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const transparentMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.2,
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.6, 0.9, 1.6]} />
      <primitive object={transparentMaterial} attach="material" />
    </mesh>
  );
}

// 정육면체 3D 컴포넌트 메인
function Square3D({ onRotationChange }) {
  const controlsRef = useRef();
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={1.5} />
        <directionalLight position={[0, 5, 0]} intensity={1} />
        
        <Suspense fallback={<SquareMeshFallback />}>
          <SquareMeshWithTexture onRotationChange={onRotationChange} controlsRef={controlsRef} />
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={false}
          minPolarAngle={Math.PI / 2} // 수평 고정
          maxPolarAngle={Math.PI / 2} // 수평 고정
          target={[0, 0, 0]}
          rotateSpeed={0.5} // 드래그 회전 감도 낮춤 (기본값 1.0)
        />
      </Canvas>
    </div>
  );
}

export default Square3D;