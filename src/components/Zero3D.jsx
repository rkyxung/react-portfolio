import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// --- 설정 상수 ---
const VIEWBOX_WIDTH = 769;
const VIEWBOX_HEIGHT = 1002;
const DEPTH = 1; // 두께
const COLOR = '#FF5912';

// SVG path를 직접 파싱하여 Shape 생성
const parseSvgPath = (pathData) => {
  const shape = new THREE.Shape();
  const commands = pathData.match(/[MLCZ][^MLCZ]*/gi) || [];
  
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let isFirst = true;
  
  const scale = 0.01;
  const offsetX = -VIEWBOX_WIDTH / 2;
  const offsetY = -VIEWBOX_HEIGHT / 2;
  
  commands.forEach((command) => {
    const type = command[0].toUpperCase();
    const coords = command.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    
    if (type === 'M') {
      // Move to
      currentX = coords[0];
      currentY = coords[1];
      startX = currentX;
      startY = currentY;
      const px = (currentX + offsetX) * scale;
      const py = -(currentY + offsetY) * scale;
      if (isFirst) {
        shape.moveTo(px, py);
        isFirst = false;
      } else {
        shape.moveTo(px, py);
      }
    } else if (type === 'L') {
      // Line to
      for (let i = 0; i < coords.length; i += 2) {
        currentX = coords[i];
        currentY = coords[i + 1];
        const px = (currentX + offsetX) * scale;
        const py = -(currentY + offsetY) * scale;
        shape.lineTo(px, py);
      }
    } else if (type === 'C') {
      // Cubic Bezier curve
      for (let i = 0; i < coords.length; i += 6) {
        const cp1x = (coords[i] + offsetX) * scale;
        const cp1y = -(coords[i + 1] + offsetY) * scale;
        const cp2x = (coords[i + 2] + offsetX) * scale;
        const cp2y = -(coords[i + 3] + offsetY) * scale;
        const x = (coords[i + 4] + offsetX) * scale;
        const y = -(coords[i + 5] + offsetY) * scale;
        shape.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        currentX = coords[i + 4];
        currentY = coords[i + 5];
      }
    } else if (type === 'Z') {
      // Close path
      const px = (startX + offsetX) * scale;
      const py = -(startY + offsetY) * scale;
      shape.lineTo(px, py);
    }
  });
  
  return shape;
};

// 회전된 사각형을 위한 Shape 생성
const createRotatedRectShape = () => {
  const shape = new THREE.Shape();
  const rectX = 148.891;
  const rectY = 557.584;
  const rectWidth = 462.948;
  const rectHeight = 126.952;
  const rotationDeg = -25.4433;
  const rotationRad = (rotationDeg * Math.PI) / 180;
  
  const scale = 0.01;
  const offsetX = -VIEWBOX_WIDTH / 2;
  const offsetY = -VIEWBOX_HEIGHT / 2;
  
  // 사각형의 네 모서리 좌표 계산 (회전 적용)
  const corners = [
    [0, 0],
    [rectWidth, 0],
    [rectWidth, rectHeight],
    [0, rectHeight]
  ];
  
  corners.forEach(([x, y], i) => {
    // 회전 적용
    const rotatedX = x * Math.cos(rotationRad) - y * Math.sin(rotationRad);
    const rotatedY = x * Math.sin(rotationRad) + y * Math.cos(rotationRad);
    
    // 위치 이동 및 정규화
    const px = (rectX + rotatedX + offsetX) * scale;
    const py = -(rectY + rotatedY + offsetY) * scale;
    
    if (i === 0) {
      shape.moveTo(px, py);
    } else {
      shape.lineTo(px, py);
    }
  });
  
  // 닫기
  const firstCorner = corners[0];
  const firstRotatedX = firstCorner[0] * Math.cos(rotationRad) - firstCorner[1] * Math.sin(rotationRad);
  const firstRotatedY = firstCorner[0] * Math.sin(rotationRad) + firstCorner[1] * Math.cos(rotationRad);
  const px = (rectX + firstRotatedX + offsetX) * scale;
  const py = -(rectY + firstRotatedY + offsetY) * scale;
  shape.lineTo(px, py);
  
  return shape;
};

// 3D 메시 컴포넌트
const Zero3DShape = () => {
  const meshRef = useRef();
  
  // Geometry 생성
  const geometries = useMemo(() => {
    console.log('Zero3DShape: Geometry 생성 시작');
    
    const shapes = [];
    
    // 메인 path shape 생성
    const mainPath = 'M384.513 839.288C313.645 839.288 251.913 826 199.315 799.425C146.718 772.296 106.025 734.37 77.2347 685.649C48.9984 636.927 34.8802 579.901 34.8802 514.57C34.8802 449.238 48.9984 392.212 77.2347 343.49C106.025 294.769 146.718 257.12 199.315 230.545C251.913 203.416 313.645 189.851 384.513 189.851C454.827 189.851 516.006 203.416 568.049 230.545C620.646 257.12 661.34 294.769 690.13 343.49C718.92 392.212 733.315 449.238 733.315 514.57C733.315 579.901 718.92 636.927 690.13 685.649C661.34 734.37 620.646 772.296 568.049 799.425C516.006 826 454.827 839.288 384.513 839.288ZM384.513 699.767C440.432 699.767 483.894 683.711 514.898 651.599C545.903 618.933 561.405 573.257 561.405 514.57C561.405 455.329 545.903 409.652 514.898 377.54C483.894 345.428 440.432 329.372 384.513 329.372C328.594 329.372 284.855 345.428 253.297 377.54C221.738 409.652 205.959 455.329 205.959 514.57C205.959 573.257 221.738 618.933 253.297 651.599C284.855 683.711 328.594 699.767 384.513 699.767Z';
    
    try {
      const mainShape = parseSvgPath(mainPath);
      shapes.push(mainShape);
      console.log('메인 path shape 생성 성공');
    } catch (error) {
      console.error('메인 path 파싱 오류:', error);
    }
    
    // 회전된 사각형 shape 생성
    try {
      const rectShape = createRotatedRectShape();
      shapes.push(rectShape);
      console.log('사각형 shape 생성 성공');
    } catch (error) {
      console.error('사각형 shape 생성 오류:', error);
    }
    
    if (shapes.length === 0) {
      console.warn('Shape이 생성되지 않았습니다.');
      return [];
    }
    
    // ExtrudeGeometry 설정
    const extrudeSettings = {
      depth: DEPTH,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 1
    };
    
    // 각 shape을 geometry로 변환
    const geos = shapes.map((shape, index) => {
      try {
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Geometry의 중심을 계산하고 원점으로 이동
        geo.computeBoundingBox();
        const center = new THREE.Vector3();
        geo.boundingBox.getCenter(center);
        geo.translate(-center.x, -center.y, -center.z);
        
        console.log(`Geometry ${index} 생성 성공, vertices:`, geo.attributes.position.count);
        return geo;
      } catch (error) {
        console.error(`ExtrudeGeometry ${index} 생성 오류:`, error);
        return null;
      }
    }).filter(geo => geo !== null);
    
    console.log('생성된 geometries 개수:', geos.length);
    return geos;
  }, []);

  // Material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLOR,
      metalness: 0.5,
      roughness: 0.5
    });
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // x축과 y축 모두 360도 완전한 회전 (더 느린 속도)
      meshRef.current.rotation.y += delta * 0.2; // y축 회전 속도
      meshRef.current.rotation.x += delta * 0.15; // x축 회전 속도
    }
  });

  if (geometries.length === 0) {
    console.warn('렌더링할 geometry가 없습니다.');
    return null;
  }

  return (
    <group ref={meshRef}>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={material} />
      ))}
    </group>
  );
};

export default function Zero3D() {
  return (
    <div style={{ 
      width: '60%', 
      height: '60%', 
      background: 'transparent', 
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
        <Zero3DShape />
      </Canvas>
    </div>
  );
}
