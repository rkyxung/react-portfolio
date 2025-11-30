import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// --- 설정 상수 ---
const PARTICLE_COUNT = 6000; // 성능과 밀도를 고려해 적절히 조절
const PARTICLE_SIZE = 0.1;
const PARTICLE_COLOR = '#FF5912';
const VIEWBOX_WIDTH = 682;
const VIEWBOX_HEIGHT = 1080;

// 로고의 두께감 (값이 클수록 앞뒤로 뚱뚱해짐)
const Z_DEPTH = 1.5; 

const svgPath =
  'M340.82 945.766C157.227 945.766 44.9219 813.93 44.9219 582.484C44.9219 351.039 157.227 219.203 340.82 219.203C524.414 219.203 636.719 351.039 636.719 582.484C636.719 814.906 524.414 945.766 340.82 945.766ZM340.82 810.023C416.016 810.023 465.82 738.734 465.82 582.484C465.82 428.188 416.016 353.969 340.82 353.969C265.625 353.969 216.797 428.188 215.82 582.484C214.844 738.734 265.625 810.023 340.82 810.023Z';

// 1. 텍스처 생성 (부드러운 원형)
const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  const radius = canvas.width / 2;
  const center = canvas.width / 2;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// 2. 파티클 샘플링 (동그라미 자르기 로직 제거됨)
const sampleSvgPoints = (count) => {
  const canvas = document.createElement('canvas');
  canvas.width = VIEWBOX_WIDTH;
  canvas.height = VIEWBOX_HEIGHT;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  ctx.clearRect(0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT);
  const path = new Path2D(svgPath);
  ctx.fillStyle = '#fff';
  ctx.fill(path, 'evenodd');

  // 회전된 사각형 추가
  const rectX = 95;
  const rectY = 609.697;
  const rectWidth = 481.119;
  const rectHeight = 171.38;
  const rotationDeg = -25.4433;
  const rotationRad = (rotationDeg * Math.PI) / 180;
  
  ctx.save();
  ctx.translate(rectX, rectY);
  ctx.rotate(rotationRad);
  ctx.fillRect(0, 0, rectWidth, rectHeight);
  ctx.restore();

  const { data } = ctx.getImageData(0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT);
  const gap = 3; 
  const coords = [];
  const normHeight = 10;
  
  for (let y = 0; y < VIEWBOX_HEIGHT; y += gap) {
    for (let x = 0; x < VIEWBOX_WIDTH; x += gap) {
      const alpha = data[(y * VIEWBOX_WIDTH + x) * 4 + 3];
      if (alpha > 150) {
        const px = ((x - VIEWBOX_WIDTH / 2) / VIEWBOX_HEIGHT) * normHeight;
        const py = (-(y - VIEWBOX_HEIGHT / 2) / VIEWBOX_HEIGHT) * normHeight;
        
        // [수정됨] 타원 방정식 제거 -> 단순히 범위 내 랜덤 Z값 부여
        // 이제 모양이 잘리지 않고 로고 그대로 나옵니다.
        const pz = (Math.random() - 0.5) * Z_DEPTH;
        
        coords.push(px, py, pz);
      }
    }
  }

  const result = new Float32Array(count * 3);
  const totalPoints = coords.length / 3;
  if (totalPoints === 0) return result;

  for (let i = 0; i < count; i++) {
    const index = Math.floor((i / count) * totalPoints);
    const source = index * 3;
    result.set(
      [
        coords[source] + (Math.random() - 0.5) * 0.05,
        coords[source + 1] + (Math.random() - 0.5) * 0.05,
        coords[source + 2] + (Math.random() - 0.5) * 0.05
      ],
      i * 3
    );
  }
  return result;
};

// 3. 파티클 컴포넌트
const ParticleShape = () => {
  const geometryRef = useRef();
  const initialPositions = useMemo(() => sampleSvgPoints(PARTICLE_COUNT), []);
  const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  // 마우스 위치 초기화
  const mouseRef = useRef(new THREE.Vector3(100, 100, 0));

  // --- 인터랙션 튜닝 ---
  const repulsionRadius = 2.5; // 마우스 반응 범위
  const repulsionForce = 4.0;  // 밀어내는 힘
  const returnSpeed = 0.08;    // 원래 자리로 돌아오는 속도 (낮을수록 끈적함)

  useFrame((state) => {
    if (!geometryRef.current) return;
    const { position } = geometryRef.current.attributes;
    
    // 시간값 (애니메이션용)
    const time = state.clock.elapsedTime;
    
    const dummyVec = new THREE.Vector3();
    const mouseVec = mouseRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // 1. 원래 위치 가져오기
      const baseX = initialPositions[ix];
      const baseY = initialPositions[iy];
      const baseZ = initialPositions[iz];

      // 2. [유기적 움직임] 노이즈 추가 (Swarming Effect)
      // Sin/Cos 파동을 서로 다르게 주어 불규칙하게 둥실거리게 만듦
      const noiseX = Math.sin(time * 0.5 + baseX * 2 + i) * 0.15;
      const noiseY = Math.cos(time * 0.3 + baseY * 2 + i) * 0.15;
      const noiseZ = Math.sin(time * 0.4 + baseZ * 2 + i) * 0.15;

      let targetX = baseX + noiseX;
      let targetY = baseY + noiseY;
      let targetZ = baseZ + noiseZ;

      // 3. 마우스 인터랙션 (거리 계산)
      dummyVec.set(currentPositions[ix], currentPositions[iy], currentPositions[iz]); // 현재 위치 기준
      const distance = dummyVec.distanceTo(mouseVec);

      if (distance < repulsionRadius) {
        const direction = dummyVec.sub(mouseVec).normalize();
        // 거리가 가까울수록 더 강하게, 멀수록 약하게
        const force = (1 - distance / repulsionRadius) * repulsionForce;
        
        targetX += direction.x * force;
        targetY += direction.y * force;
        targetZ += direction.z * force;
      }

      // 4. 위치 업데이트 (Lerp: 부드러운 이동)
      // 현재 위치에서 목표 위치로 서서히 이동
      currentPositions[ix] += (targetX - currentPositions[ix]) * returnSpeed;
      currentPositions[iy] += (targetY - currentPositions[iy]) * returnSpeed;
      currentPositions[iz] += (targetZ - currentPositions[iz]) * returnSpeed;
    }

    position.array.set(currentPositions);
    position.needsUpdate = true;
  });

  return (
    <>
      {/* 마우스 감지용 투명 평면 (화면 전체) */}
      <mesh visible={false} onPointerMove={(e) => mouseRef.current.copy(e.point)}>
        <planeGeometry args={[50, 50]} />
      </mesh>

      <points>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            array={currentPositions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={PARTICLE_SIZE}
          color={PARTICLE_COLOR}
          map={circleTexture}
          alphaTest={0.01}
          transparent={true}
          opacity={0.8} // 약간 투명하게 해서 겹치는 느낌 표현
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending} // 빛나는 효과
          depthWrite={false}
        />
      </points>
    </>
  );
};

export default function ParticleZero() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 35 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1.0} />
        <OrbitControls enableZoom={false} enablePan={false} target={[0, 0, 0]} />
        <ParticleShape />
      </Canvas>
    </div>
  );
}

