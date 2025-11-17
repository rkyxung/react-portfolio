import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './Home.scss';

// 개별 모델 컴포넌트
function LetterModel({ modelPath, position, scale = 1, index = 0, isHovered = false, rotationDirection = 0, hoverOrder = 0, tiltAngle = 0, mouseY = 0, onHover, onHoverLeave }) {
  console.log('모델 로드 시도:', modelPath);
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const groupRef = useRef();
  const rotationRef = useRef(0);
  const xRotationRef = useRef(0); // X축 회전용 ref
  const isRotatingRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const hoverBoxSizeRef = useRef(null); // 호버 영역 확장을 위한 박스 크기 저장

  useEffect(() => {
    if (scene) {
      try {
        console.log('모델 씬 로드됨:', modelPath);
        
        // 모든 자식 요소의 변환을 리셋
        scene.traverse((child) => {
          if (child.isMesh || child.isGroup) {
            child.position.set(0, 0, 0);
            child.rotation.set(0, 0, 0);
            child.scale.set(1, 1, 1);
          }
        });
        
        // 씬 자체도 리셋
        scene.position.set(0, 0, 0);
        scene.rotation.set(0, 0, 0);
        scene.scale.set(1, 1, 1);
        
        // 모델의 바운딩 박스 계산
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('모델 크기:', size, '중심:', center);
        
        // 바운딩 박스가 유효한지 확인
        if (size.x === 0 && size.y === 0 && size.z === 0) {
          console.warn('모델 크기가 0입니다:', modelPath);
          scene.scale.set(1, 1, 1);
        } else {
          // 씬을 원점으로 이동 (중심을 빼서)
          scene.position.set(-center.x, -center.y, -center.z);
          
          // ===== 모델 크기 조절 =====
          // 조절 가능: 기본값 2.5 (예: 3.0 = 더 크게, 2.0 = 더 작게)
          const BASE_SIZE = 2.5;
          
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const normalizedScale = (BASE_SIZE * scale) / maxDim;
            scene.scale.set(normalizedScale, normalizedScale, normalizedScale);
            console.log('모델 스케일:', normalizedScale, '최종 크기:', maxDim * normalizedScale);
            
            // 스케일 적용 후 다시 바운딩 박스 확인
            scene.updateMatrixWorld(true);
            const newBox = new THREE.Box3().setFromObject(scene);
            const newCenter = newBox.getCenter(new THREE.Vector3());
            const newSize = newBox.getSize(new THREE.Vector3());
            console.log('스케일 적용 후 크기:', newSize, '중심:', newCenter);
            
            // 스케일 적용 후에도 중심이 원점이 아니면 다시 조정
            if (Math.abs(newCenter.x) > 0.01 || Math.abs(newCenter.y) > 0.01 || Math.abs(newCenter.z) > 0.01) {
              scene.position.x -= newCenter.x;
              scene.position.y -= newCenter.y;
              scene.position.z -= newCenter.z;
              console.log('중심 재조정:', scene.position);
            }
            
            // 호버 영역 확장을 위한 박스 크기 저장 (10% 확장)
            hoverBoxSizeRef.current = {
              x: newSize.x * 1.5,
              y: newSize.y * 1.1,
              z: newSize.z * 1.1
            };
          }
        }
        
        // ===== 모델 색상 조절 =====
        // 조절 가능: 색상 코드 변경 (예: '#FF0000' = 빨강, '#00FF00' = 초록, '#141684' = 네이비)
        const targetColor = new THREE.Color('#141684');
        let meshCount = 0;
        scene.traverse((child) => {
          if (child.isMesh) {
            meshCount++;
            // 기존 재질을 완전히 새로 만들어서 교체 (유리 느낌의 투명 메테리얼)
            const newMaterial = new THREE.MeshPhysicalMaterial({ 
              color: targetColor,
              metalness: 0.3, // 조절 가능: 메탈 느낌 (0~1, 낮을수록 유리 느낌, 높을수록 금속 느낌)
              roughness: 0.05, // 조절 가능: 거칠기 (0~1, 낮을수록 반사가 강함, 유리 느낌)
              transmission: 0.3, // 조절 가능: 투과도 (0~1, 높을수록 투명, 유리 느낌)
              opacity: 0.95, // 조절 가능: 불투명도 (0~1, 낮을수록 투명)
              transparent: true, // 투명도 활성화
              clearcoat: 1.0, // 조절 가능: 클리어코트 (0~1, 높을수록 유리 표면 느낌)
              clearcoatRoughness: 0.05 // 조절 가능: 클리어코트 거칠기 (0~1, 낮을수록 반짝임)
            });
            
            if (Array.isArray(child.material)) {
              child.material = child.material.map(() => newMaterial.clone());
            } else {
              child.material = newMaterial;
            }
            child.visible = true;
          }
        });
        console.log(`${modelPath}: ${meshCount}개 메시 처리 완료`);
      } catch (err) {
        console.error('모델 처리 오류:', modelPath, err);
      }
    } else {
      console.warn('씬이 없습니다:', modelPath);
    }
  }, [scene, modelPath, scale]);

  // 호버 상태에 따라 회전 시작/중지 (순차적 효과)
  useEffect(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (isHovered && rotationDirection !== 0) {
      // 호버 시 순차적으로 회전 시작 (호버 순서에 따라 지연)
      const delay = hoverOrder * 5; // 조절 가능: 순차 지연 시간 (기본값 0.1초)
      hoverTimeoutRef.current = setTimeout(() => {
        isRotatingRef.current = true;
      }, delay * 1000);
    } else if (!isHovered && isRotatingRef.current) {
      // 호버 해제 시 delay 후 회전 중지
      hoverTimeoutRef.current = setTimeout(() => {
        isRotatingRef.current = false;
      }, 500); // 조절 가능: 호버 해제 후 delay 시간 (기본값 500ms)
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered, rotationDirection, hoverOrder]);

  // y축 회전 애니메이션 (커서 방향에 따라 좌우 회전) + X축 회전 (위아래 호버) + 2D 기울임 + 떠있는 애니메이션
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 떠있는 애니메이션 (위아래 부드러운 움직임)
      // 조절 가능: 떠있는 속도 (기본값 0.5, 높을수록 빠름)
      const FLOAT_SPEED = 0.8;
      // 조절 가능: 떠있는 범위 (기본값 0.1, 높을수록 더 많이 움직임)
      const FLOAT_AMOUNT = 0.1;
      const floatY = Math.sin(state.clock.elapsedTime * FLOAT_SPEED) * FLOAT_AMOUNT;
      groupRef.current.position.y = position[1] + floatY;
      
      // 2D 기울임 적용 (고정 각도)
      groupRef.current.rotation.z = tiltAngle; // 조절 가능: 기울임 각도 (라디안, 예: 0.2 = 약 11도)
      
      // X축 회전 (위아래 호버)
      // 조절 가능: 위아래 호버 시 회전 각도 (라디안, 기본값 Math.PI / 4 = 45도)
      // 예: Math.PI / 6 = 30도, Math.PI / 3 = 60도, Math.PI / 2 = 90도
      const HOVER_X_ROTATION_ANGLE = Math.PI / 6; // 45도
      
      if (isHovered) {
        // 화면 중앙 기준으로 위아래 판단
        const screenCenterY = window.innerHeight / 2;
        const targetXRotation = mouseY < screenCenterY ? HOVER_X_ROTATION_ANGLE : -HOVER_X_ROTATION_ANGLE; // 위쪽이면 위로, 아래쪽이면 아래로
        
        // 부드럽게 목표 각도로 이동
        const diff = targetXRotation - xRotationRef.current;
        xRotationRef.current += diff * delta * 5; // 조절 가능: X축 회전 속도 (기본값 5)
        groupRef.current.rotation.x = xRotationRef.current;
      } else {
        // 호버 해제 시 원래 위치로 복귀
        if (Math.abs(xRotationRef.current) > 0.01) {
          const diff = 0 - xRotationRef.current;
          xRotationRef.current += diff * delta * 3; // 조절 가능: 복귀 속도 (기본값 3)
          groupRef.current.rotation.x = xRotationRef.current;
        } else {
          xRotationRef.current = 0;
          groupRef.current.rotation.x = 0;
        }
      }
      
      if (isRotatingRef.current && rotationDirection !== 0) {
        // 회전 중일 때 커서 방향대로 회전 (y축 - 좌우 회전)
        // rotationDirection: -1 = 왼쪽, 1 = 오른쪽
        rotationRef.current += delta * 3.5 * rotationDirection; // 조절 가능: 회전 속도 (기본값 5, 높을수록 빠름)
        
        // 360도 회전 후 리셋
        if (Math.abs(rotationRef.current) >= Math.PI * 2) {
          rotationRef.current = rotationRef.current % (Math.PI * 2);
        }
        groupRef.current.rotation.y = rotationRef.current;
      } else {
        // 회전 해제 시 원래 위치로 복귀
        if (Math.abs(rotationRef.current) > 0.01) {
          const targetRotation = 0;
          const diff = targetRotation - rotationRef.current;
          rotationRef.current += diff * delta * 3; // 조절 가능: 복귀 속도 (기본값 3)
          groupRef.current.rotation.y = rotationRef.current;
        } else {
          rotationRef.current = 0;
          groupRef.current.rotation.y = 0;
        }
      }
    }
  });

  if (!scene) {
    console.warn('씬이 null입니다:', modelPath);
    return null;
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerEnter={(e) => {
        if (onHover) onHover(index, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isHovered && onHover) {
          onHover(index, e.clientY);
        }
      }}
      onPointerLeave={() => {
        if (onHoverLeave) onHoverLeave(index);
      }}
    >
      <primitive ref={modelRef} object={scene} />
      {/* 호버 영역 확장을 위한 보이지 않는 박스 (오브제 밖 10%까지) */}
      {hoverBoxSizeRef.current && (
        <mesh visible={false}>
          <boxGeometry 
            args={[
              hoverBoxSizeRef.current.x, 
              hoverBoxSizeRef.current.y, 
              hoverBoxSizeRef.current.z
            ]} 
          />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

function Scene() {
  const baseUrl = import.meta.env.BASE_URL;
  const [hoveredIndices, setHoveredIndices] = useState([]);
  const [mouseDirection, setMouseDirection] = useState(0); // -1 = 왼쪽, 1 = 오른쪽, 0 = 없음
  const [mouseYMap, setMouseYMap] = useState({}); // 각 오브제의 마우스 Y 위치 저장
  const lastMouseXRef = useRef(null);
  const hoverOrderRef = useRef([]);
  const hoverDirectionMapRef = useRef({}); // 각 오브제의 호버 시점 방향 저장
  
  // 마우스 움직임 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (lastMouseXRef.current !== null) {
        const deltaX = e.clientX - lastMouseXRef.current;
        if (Math.abs(deltaX) > 5) { // 조절 가능: 방향 감지 민감도 (기본값 5px)
          setMouseDirection(deltaX > 0 ? 1 : -1);
        }
      }
      lastMouseXRef.current = e.clientX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleHover = (index, clientY) => {
    // 마우스 Y 위치 저장
    setMouseYMap(prev => ({
      ...prev,
      [index]: clientY
    }));
    
    if (!hoveredIndices.includes(index)) {
      const newHovered = [...hoveredIndices, index].sort((a, b) => a - b);
      setHoveredIndices(newHovered);
      hoverOrderRef.current.push(index);
      // 호버 시점의 mouseDirection 저장 (0이면 현재 방향 사용, 없으면 1로 기본값)
      hoverDirectionMapRef.current[index] = mouseDirection !== 0 ? mouseDirection : 1;
    }
  };

  const handleHoverLeave = (index) => {
    setHoveredIndices(prev => {
      const newHovered = prev.filter(i => i !== index);
      // 모든 호버가 해제될 때만 mouseDirection 리셋
      if (newHovered.length === 0) {
        setMouseDirection(0);
      }
      return newHovered;
    });
    hoverOrderRef.current = hoverOrderRef.current.filter(i => i !== index);
    // 호버 해제 시 저장된 방향 제거
    delete hoverDirectionMapRef.current[index];
    // 마우스 Y 위치 제거
    setMouseYMap(prev => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });
  };

  // 각 모델의 회전 방향 계산 (호버 시점의 방향 유지)
  const getRotationDirection = (index) => {
    if (!hoveredIndices.includes(index)) {
      return 0;
    }
    
    // 호버 시점에 저장된 방향 사용 (기존 회전은 그대로 유지)
    const savedDirection = hoverDirectionMapRef.current[index];
    return savedDirection !== undefined ? savedDirection : 0;
  };

  // 각 모델의 호버 순서 계산
  const getHoverOrder = (index) => {
    if (!hoveredIndices.includes(index)) {
      return 0;
    }
    const orderIndex = hoverOrderRef.current.indexOf(index);
    return orderIndex === -1 ? 0 : orderIndex;
  };
  
  return (
    <>
      {/* ===== 배경색 조절 ===== */}
      {/* 배경색 투명 - 컨테이너 배경색이 보이도록 */}
      {/* <color attach="background" args={['#000000']} /> */}
      
      {/* ===== 조명 조절 ===== */}
      {/* 조절 가능: 전체 밝기 (0~2, 기본값 1.5) */}
      <ambientLight intensity={1.5} />
      {/* 조절 가능: 방향광 위치 [x,y,z]와 강도 (기본값 [5,5,5], 강도 2) */}
      <directionalLight position={[5, 5, 5]} intensity={2} />
      {/* 조절 가능: 반대편 방향광 (기본값 [-5,5,-5], 강도 1) */}
      <directionalLight position={[-5, 5, -5]} intensity={2} />
      {/* 조절 가능: 점광 위치 [x,y,z]와 강도 (기본값 [0,10,0], 강도 1) */}
      <pointLight position={[0, 10, 0]} intensity={1.5} />
      <pointLight position={[0, -10, 0]} intensity={0.8} />
      {/* 메탈 반사 효과를 위한 추가 조명 */}
      <directionalLight position={[0, 10, 0]} intensity={2} />
      
      <Suspense fallback={null}>
        {/* ===== 모델 위치 조절 ===== */}
        {/* position: x=좌우(음수=왼쪽, 양수=오른쪽), y=상하(음수=아래, 양수=위), z=앞뒤(음수=뒤, 양수=앞) */}
        {/* scale: 크기 배율 (1=기본, 2=2배, 0.5=절반) */}
        <LetterModel 
          modelPath={`${baseUrl}G.glb`} 
          position={[-3, 0, 0]} // x=-1.5(왼쪽), y=0(중앙), z=0(앞뒤 중앙)
          scale={1} // 크기 배율 (1=기본, 2=2배, 0.5=절반)
          index={0}
          isHovered={hoveredIndices.includes(0)}
          rotationDirection={getRotationDirection(0)}
          hoverOrder={getHoverOrder(0)}
          tiltAngle={0.13} // 조절 가능: 왼쪽으로 기울임 (음수 = 왼쪽, 양수 = 오른쪽)
          mouseY={mouseYMap[0] || 0}
          onHover={handleHover}
          onHoverLeave={handleHoverLeave}
        />
        <LetterModel 
          modelPath={`${baseUrl}A.glb`} 
          position={[-0.7, 0, 0]} // x=-0.5(왼쪽), y=0(중앙), z=0(앞뒤 중앙)
          scale={1} // 크기 배율 (1=기본, 2=2배, 0.5=절반)
          index={1}
          isHovered={hoveredIndices.includes(1)}
          rotationDirection={getRotationDirection(1)}
          hoverOrder={getHoverOrder(1)}
          tiltAngle={0.05} // 조절 가능: 살짝 왼쪽으로 기울임
          mouseY={mouseYMap[1] || 0}
          onHover={handleHover}
          onHoverLeave={handleHoverLeave}
        />
        <LetterModel 
          modelPath={`${baseUrl}Y.glb`} 
          position={[1.1, 0, 0]} // x=0.5(오른쪽), y=0(중앙), z=0(앞뒤 중앙)
          scale={1} // 크기 배율 (1=기본, 2=2배, 0.5=절반)
          index={2}
          isHovered={hoveredIndices.includes(2)}
          rotationDirection={getRotationDirection(2)}
          hoverOrder={getHoverOrder(2)}
          tiltAngle={-0.05} // 조절 가능: 살짝 오른쪽으로 기울임
          mouseY={mouseYMap[2] || 0}
          onHover={handleHover}
          onHoverLeave={handleHoverLeave}
        />
        <LetterModel 
          modelPath={`${baseUrl}O.glb`} 
          position={[3.1, 0, 0]} // x=1.5(오른쪽), y=0(중앙), z=0(앞뒤 중앙)
          scale={1} // 크기 배율 (1=기본, 2=2배, 0.5=절반)
          index={3}
          isHovered={hoveredIndices.includes(3)}
          rotationDirection={getRotationDirection(3)}
          hoverOrder={getHoverOrder(3)}
          tiltAngle={-0.2} // 조절 가능: 오른쪽으로 기울임
          mouseY={mouseYMap[3] || 0}
          onHover={handleHover}
          onHoverLeave={handleHoverLeave}
        />
      </Suspense>
      
      {/* ===== 카메라 컨트롤 조절 ===== */}
      {/* 조절 가능: enableZoom, enablePan, enableRotate를 true로 변경하면 마우스로 조작 가능 */}
      <OrbitControls 
        enableZoom={false} // true = 줌 가능, false = 줌 불가
        enablePan={false} // true = 이동 가능, false = 이동 불가
        enableRotate={false} // true = 회전 가능, false = 회전 불가
        minDistance={1} // 최소 줌 거리
        maxDistance={15} // 최대 줌 거리
        autoRotate={false} // true = 자동 회전, false = 수동
        target={[0, 0, 0]} // 카메라가 바라보는 중심점 [x, y, z]
      />
    </>
  );
}

function Home() {
  return (
    <section className="home-section">
      {/* 배경 레이아웃 */}
      {/* <div className="home-layout">
        <div className="home-header">
          <div className="home-title">GAYO</div>
          <div className="home-menu">
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="home-line top-line"></div>
        <div className="home-vertical-pattern top-pattern"></div>
        
        <div className="home-main">
          <div className="home-web-developer">
            <span className="outline-text">WEB</span>
            <span className="solid-text">DEVELOPER</span>
          </div>
        </div>
        <div className="home-line middle-line"></div>
        <div className="home-vertical-pattern middle-pattern"></div>
        
        <div className="home-content">
          <div className="home-relentless">Relentless</div>
          <div className="home-interactive">Interactive</div>
        </div>
        
        <div className="home-vertical-pattern bottom-pattern"></div>
        <div className="home-line bottom-line"></div>
        <div className="home-front-end">
          <span className="solid-text">Front-</span>
          <span className="outline-text">end</span>
        </div>
      </div> */}
      
      <div className="canvas-container">
        {/* ===== 카메라 위치 및 시야각 조절 ===== */}
        <Canvas 
          camera={{ 
            position: [0, 0, 5], // 조절 가능: 카메라 위치 [x, y, z] (z 값이 클수록 멀리, 작을수록 가까이)
            fov: 75 // 조절 가능: 시야각 (30~120, 작을수록 확대, 클수록 넓은 시야)
          }} 
          gl={{ antialias: true, alpha: true }} // antialias: true = 부드러운 렌더링, alpha: true = 투명 배경
          onCreated={(state) => {
            console.log('Canvas 생성됨, 카메라:', state.camera.position);
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </section>
  );
}

export default Home;
