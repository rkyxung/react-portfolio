import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import './styles/Contact.scss';

// Matter.js Body 전역 참조 (호버 핸들러에서 사용)
const Body = Matter.Body;

// 반복되는 SVG 아이콘 컴포넌트
const SvgIcon = ({ type }) => {
  if (type === 'filled') {
    return (
      <svg viewBox="0 0 142 189" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70.7568 154.445C57.716 154.445 46.3562 152 36.6774 147.11C26.9986 142.117 19.5103 135.139 14.2125 126.173C9.01653 117.207 6.41855 106.714 6.41855 94.6916C6.41855 82.6695 9.01653 72.1757 14.2125 63.2101C19.5103 54.2445 26.9986 47.3166 36.6774 42.4263C46.3562 37.4341 57.716 34.938 70.7568 34.938C83.6958 34.938 94.9537 37.4341 104.531 42.4263C114.209 47.3166 121.698 54.2445 126.995 63.2101C132.293 72.1757 134.942 82.6695 134.942 94.6916C134.942 106.714 132.293 117.207 126.995 126.173C121.698 135.139 114.209 142.117 104.531 147.11C94.9537 152 83.6958 154.445 70.7568 154.445ZM70.7568 128.771C81.0469 128.771 89.0446 125.816 94.7499 119.907C100.455 113.896 103.308 105.491 103.308 94.6916C103.308 83.7902 100.455 75.385 94.7499 69.4758C89.0446 63.5667 81.0469 60.6121 70.7568 60.6121C60.4668 60.6121 52.4181 63.5667 46.6109 69.4758C40.8036 75.385 37.9 83.7902 37.9 94.6916C37.9 105.491 40.8036 113.896 46.6109 119.907C52.4181 125.816 60.4668 128.771 70.7568 128.771Z" fill="#FF5912"/>
        <rect x="31.5469" y="101.445" width="85.1902" height="23.3612" transform="rotate(-25.4433 31.5469 101.445)" fill="#FF5912"/>
      </svg>
    );
  } else {
    // outlined SVG style
    return (
      <svg viewBox="0 0 142 189" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70.7568 154.445C57.716 154.445 46.3562 152 36.6774 147.11C26.9986 142.117 19.5103 135.139 14.2125 126.173C9.01653 117.207 6.41855 106.714 6.41855 94.6916C6.41855 82.6695 9.01653 72.1757 14.2125 63.2101C19.5103 54.2445 26.9986 47.3166 36.6774 42.4263C46.3562 37.4341 57.716 34.938 70.7568 34.938C83.6958 34.938 94.9537 37.4341 104.531 42.4263C114.209 47.3166 121.698 54.2445 126.995 63.2101C132.293 72.1757 134.942 82.6695 134.942 94.6916C134.942 106.714 132.293 117.207 126.995 126.173C121.698 135.139 114.209 142.117 104.531 147.11C94.9537 152 83.6958 154.445 70.7568 154.445ZM70.7568 128.771C81.0469 128.771 89.0446 125.816 94.7499 119.907C100.455 113.896 103.308 105.491 103.308 94.6916C103.308 83.7902 100.455 75.385 94.7499 69.4758C89.0446 63.5667 81.0469 60.6121 70.7568 60.6121C60.4668 60.6121 52.4181 63.5667 46.6109 69.4758C40.8036 75.385 37.9 83.7902 37.9 94.6916C37.9 105.491 40.8036 113.896 46.6109 119.907C52.4181 125.816 60.4668 128.771 70.7568 128.771Z" fill="#EFF0F1"/>
          <rect x="31.5469" y="101.445" width="85.1902" height="23.3612" transform="rotate(-25.4433 31.5469 101.445)" fill="#EFF0F1"/>
      </svg>
    )
  }
}

// 떨어질 물체들의 데이터 정의 (표현용 원본 데이터)
const OBJECTS_DATA = [
  { type: 'svg-filled', id: 1 },
  { type: 'svg-filled', id: 8 },
  { type: 'svg-outlined', id: 3 },
  { type: 'svg-outlined', id: 11 },
  { type: 'text', class: 'orange', text: '0', id: 14 },
  { type: 'text', class: 'orange', text: '0', id: 6 },
  { type: 'text', class: 'orange', text: '0', id: 10 },
  { type: 'text', class: 'white', text: '0', id: 2 },
  { type: 'text', class: 'white', text: '0', id: 16 },
  { type: 'text', class: 'white', text: '0', id: 7 },
  { type: 'text', class: 'orange-border', text: '0', id: 4 },
  { type: 'text', class: 'orange-border', text: '0', id: 17 },
  { type: 'text', class: 'orange-border', text: '0', id: 13 },
  { type: 'text', class: 'white-border', text: '0', id: 5 },
  { type: 'text', class: 'white-border', text: '0', id: 15 },
  { type: 'text', class: 'white-border', text: '0', id: 9 },
  { type: 'text', class: 'white-border', text: '0', id: 12 },
];

// 실제 물리 시뮬레이션과 렌더링에 사용할 정렬된 데이터 (id 오름차순)
const SORTED_OBJECTS = [...OBJECTS_DATA].sort((a, b) => a.id - b.id);

function Contact() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const elementRefs = useRef([]); // DOM 요소들을 참조할 배열
  const bodiesRef = useRef([]);   // Matter.js 바디들을 참조할 배열

  // CONTACT 정보 클릭 핸들러들
  const handlePhoneClick = () => {
    window.location.href = 'tel:01062025991';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:kimgy071928@gmail.com';
  };

  const handleGithubClick = () => {
    window.open('https://github.com/rkyxung', '_blank', 'noopener,noreferrer');
  };

  // 호버 시 눈에 띄게 튕기도록 속도를 바꿔주는 함수
  const handleHover = (index) => {
    const engine = engineRef.current;
    const bodies = bodiesRef.current;
    if (!engine || !bodies[index]) return;

    const body = bodies[index];
    const currentVel = body.velocity;

    // 위쪽으로 확실하게 튕기도록 y 속도를 크게 음수 방향으로 변경
    Body.setVelocity(body, {
      x: currentVel.x + (Math.random() - 0.5) * 4, // 좌우로 살짝 퍼지게
      y: -18,                                      // 위로 강하게 튕김
    });
  };

  useEffect(() => {
    // 1. Matter.js 엔진 초기화
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Runner = Matter.Runner;

    const engine = Engine.create();
    engineRef.current = engine;

    const sceneElement = sceneRef.current;
    if (!sceneElement) return;

    // 물리 월드 크기: 실제 .physics-scene 박스 크기(px)
    const rect = sceneElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // 2. 렌더러 생성 (마우스 감지용, 실제로는 투명)
    const render = Render.create({
      element: sceneElement,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false, 
        background: 'transparent'
      }
    });

    // 3. 벽과 바닥 생성 (하단 바닥 + 좌측/우측 벽 + 경사 벽)
    const wallThickness = 60;

    // 하단 바닥: 화면 하단이 아니라, SCSS에서 .line 이 위치한 높이를 끝지점으로 사용
    // .line 은 bottom: 7vh 이므로, 월드 높이(height)를 기준으로 93% 지점에 라인이 있다고 가정
    const lineY = height * 0.915; // 라인 위치 (대략)
    const ground = Bodies.rectangle(
      width / 2,
      lineY + wallThickness / 2, // 라인 바로 아래에 바닥을 두어 라인이 끝지점처럼 보이게
      width,
      wallThickness,
      { isStatic: true, render: { visible: false } }
    );

    // 우측 세로 벽
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, render: { visible: false } }
    );

    // 좌측 세로 벽
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, render: { visible: false } }
    );

    // 좌측 경사 벽: 좌하단에서 우상단으로 이어지는 흰색 선을 대략 따라감
    const slopeLength = Math.sqrt(width * width + height * height * 0.5 * 0.5);
    const slopeAngle = -Math.atan2(height * 0.5, width); // 약간 올라가는 대각선
    const slope = Bodies.rectangle(
      width * 0.1,        // 대략 왼쪽 내부에서 시작
      height * 0.4,       // 중심 y
      slopeLength,
      wallThickness,
      {
        isStatic: true,
        angle: slopeAngle,
        render: { visible: false }
      }
    );

    World.add(engine.world, [ground, rightWall, leftWall, slope]);

    // 4. 오브젝트 생성
    const spawnX = width * 0.75; 
    const spawnY = -200; 

    const bodies = SORTED_OBJECTS.map((obj, index) => {
      // .physics-item 의 시각적 반지름(4vw)보다 약간 작은 물리 반지름을 사용해서
      // 실제 원(그래픽)끼리는 거의 맞닿아 보이도록 보정
      const visualRadius = width * 0.04;      // 4vw 상당
      const radius = visualRadius * 0.85;      // 물리 바디는 70% 크기로
      
      const body = Bodies.circle(
        spawnX + (Math.random() - 0.5) * 200, 
        spawnY - (index * 100), 
        radius, 
        {
          restitution: 0.5,  // 바운스 약하게
          friction: 0.8,     // 마찰 크게
          frictionAir: 0.02, // 공기 저항으로 속도 더 빨리 줄어들게
          render: { visible: false }
        }
      );

      // 초기 낙하 속도를 조금 더 빠르게 설정 (충돌/드래그 감도는 그대로)
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5, // 살짝 좌우 랜덤
        y: 12                           // 기본보다 빠르게 아래로
      });

      return body;
    });

    World.add(engine.world, bodies);
    bodiesRef.current = bodies;

    // 5. 실행
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // DOM 동기화 루프 (월드(px) → 컨테이너 내부 px로 그대로 반영)
    const updateLoop = () => {
      bodies.forEach((body, index) => {
        const domEl = elementRefs.current[index];
        if (domEl) {
          const { x, y } = body.position;
          const angle = body.angle;

          // Matter.js 원(circle)의 중심 좌표(x, y)가
          // DOM 원의 중심과 일치하도록, 반지름만큼 보정해서 이동
          const r = body.circleRadius || 0;

          domEl.style.position = 'absolute';
          domEl.style.left = '0';
          domEl.style.top = '0';
          domEl.style.transform = `translate(${x - r}px, ${y - r}px) rotate(${angle}rad)`;
        }
      });
      requestAnimationFrame(updateLoop);
    };
    const animationId = requestAnimationFrame(updateLoop);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="contact">
      <div className="contact-zero">
        <svg viewBox="0 0 817 149" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M103.258 84.0942C102.419 91.6413 99.8273 98.2736 95.482 103.991C91.1367 109.632 85.4192 114.016 78.3295 117.141C71.3161 120.267 63.2354 121.83 54.0874 121.83C44.1009 121.83 35.3722 119.962 27.9013 116.226C20.4305 112.491 14.5986 107.269 10.4058 100.561C6.28923 93.852 4.23094 86.0381 4.23094 77.1189C4.23094 68.1996 6.28923 60.3857 10.4058 53.6772C14.5986 46.9687 20.4305 41.7467 27.9013 38.0113C35.3722 34.2758 44.1009 32.4081 54.0874 32.4081C63.2354 32.4081 71.3161 33.9709 78.3295 37.0965C85.4192 40.222 91.1367 44.6435 95.482 50.361C99.8273 56.0023 102.419 62.5965 103.258 70.1435H79.473C78.7107 66.4843 77.2242 63.3969 75.0134 60.8812C72.8026 58.2893 69.9058 56.3072 66.3228 54.935C62.8161 53.5628 58.7376 52.8767 54.0874 52.8767C48.7511 52.8767 44.139 53.8678 40.2511 55.8498C36.3632 57.7556 33.3901 60.5382 31.3318 64.1973C29.2735 67.7803 28.2444 72.0875 28.2444 77.1189C28.2444 82.1502 29.2735 86.4955 31.3318 90.1547C33.3901 93.7377 36.3632 96.5202 40.2511 98.5023C44.139 100.408 48.7511 101.361 54.0874 101.361C58.7376 101.361 62.8161 100.713 66.3228 99.4171C69.9058 98.1211 72.8026 96.1771 75.0134 93.5852C77.2242 90.9933 78.7107 87.8296 79.473 84.0942H103.258ZM156.155 121.83C146.016 121.83 137.097 119.962 129.397 116.226C121.774 112.491 115.828 107.269 111.559 100.561C107.366 93.852 105.27 86.0381 105.27 77.1189C105.27 68.1996 107.366 60.3857 111.559 53.6772C115.828 46.9687 121.774 41.7467 129.397 38.0113C137.097 34.2758 146.016 32.4081 156.155 32.4081C166.37 32.4081 175.29 34.2758 182.913 38.0113C190.536 41.7467 196.483 46.9687 200.752 53.6772C205.021 60.3857 207.155 68.1996 207.155 77.1189C207.155 86.0381 205.021 93.852 200.752 100.561C196.483 107.269 190.536 112.491 182.913 116.226C175.29 119.962 166.37 121.83 156.155 121.83ZM156.155 100.675C161.72 100.675 166.523 99.722 170.563 97.8162C174.604 95.9103 177.691 93.2041 179.826 89.6973C182.036 86.1906 183.142 81.9978 183.142 77.1189C183.142 72.2399 182.036 68.0471 179.826 64.5404C177.691 61.0337 174.604 58.3274 170.563 56.4216C166.523 54.5157 161.72 53.5628 156.155 53.5628C150.666 53.5628 145.902 54.5157 141.862 56.4216C137.821 58.3274 134.696 61.0337 132.485 64.5404C130.274 68.0471 129.169 72.2399 129.169 77.1189C129.169 81.9978 130.274 86.1906 132.485 89.6973C134.696 93.2041 137.821 95.9103 141.862 97.8162C145.902 99.722 150.666 100.675 156.155 100.675ZM293.128 103.419L285.81 104.906V34.2377H308.794V120H278.949L229.436 49.4462L236.64 47.9597V120H213.655V34.2377H244.301L293.128 103.419ZM345.921 44.6435H369.706V120H345.921V44.6435ZM313.217 34.2377H402.41V55.2781H313.217V34.2377ZM409.87 103.534V84.4372H468.989V103.534H409.87ZM455.496 34.2377L494.489 120H469.218L436.514 44.3005H443.375L410.557 120H385.285L424.278 34.2377H455.496ZM587.011 84.0942C586.172 91.6413 583.58 98.2736 579.235 103.991C574.89 109.632 569.172 114.016 562.082 117.141C555.069 120.267 546.988 121.83 537.84 121.83C527.854 121.83 519.125 119.962 511.654 116.226C504.183 112.491 498.351 107.269 494.159 100.561C490.042 93.852 487.984 86.0381 487.984 77.1189C487.984 68.1996 490.042 60.3857 494.159 53.6772C498.351 46.9687 504.183 41.7467 511.654 38.0113C519.125 34.2758 527.854 32.4081 537.84 32.4081C546.988 32.4081 555.069 33.9709 562.082 37.0965C569.172 40.222 574.89 44.6435 579.235 50.361C583.58 56.0023 586.172 62.5965 587.011 70.1435H563.226C562.464 66.4843 560.977 63.3969 558.766 60.8812C556.555 58.2893 553.659 56.3072 550.076 54.935C546.569 53.5628 542.49 52.8767 537.84 52.8767C532.504 52.8767 527.892 53.8678 524.004 55.8498C520.116 57.7556 517.143 60.5382 515.085 64.1973C513.026 67.7803 511.997 72.0875 511.997 77.1189C511.997 82.1502 513.026 86.4955 515.085 90.1547C517.143 93.7377 520.116 96.5202 524.004 98.5023C527.892 100.408 532.504 101.361 537.84 101.361C542.49 101.361 546.569 100.713 550.076 99.4171C553.659 98.1211 556.555 96.1771 558.766 93.5852C560.977 90.9933 562.464 87.8296 563.226 84.0942H587.011ZM616.43 44.6435H640.214V120H616.43V44.6435ZM583.726 34.2377H672.918V55.2781H583.726V34.2377Z" fill="#EFF0F1"/>
            <path d="M761.554 120.92C751.315 120.92 742.396 119 734.797 115.16C727.198 111.241 721.318 105.761 717.159 98.7223C713.079 91.683 711.039 83.444 711.039 74.005C711.039 64.5661 713.079 56.327 717.159 49.2878C721.318 42.2485 727.198 36.8091 734.797 32.9696C742.396 29.05 751.315 27.0902 761.554 27.0902C771.713 27.0902 780.552 29.05 788.071 32.9696C795.67 36.8091 801.549 42.2485 805.709 49.2878C809.868 56.327 811.948 64.5661 811.948 74.005C811.948 83.444 809.868 91.683 805.709 98.7223C801.549 105.761 795.67 111.241 788.071 115.16C780.552 119 771.713 120.92 761.554 120.92ZM761.554 100.762C769.633 100.762 775.912 98.4423 780.392 93.8028C784.871 89.0833 787.111 82.4841 787.111 74.005C787.111 65.446 784.871 58.8467 780.392 54.2072C775.912 49.5677 769.633 47.248 761.554 47.248C753.475 47.248 747.155 49.5677 742.596 54.2072C738.036 58.8467 735.757 65.446 735.757 74.005C735.757 82.4841 738.036 89.0833 742.596 93.8028C747.155 98.4423 753.475 100.762 761.554 100.762Z" fill="#FF5912"/>
            <rect x="730.773" y="79.6484" width="66.8861" height="18.3418" transform="rotate(-25.4433 730.773 79.6484)" fill="#FF5912"/>
            <rect x="123" y="84.3848" width="63.7438" height="17.4801" transform="rotate(-25.4433 123 84.3848)" fill="#EFF0F1"/>
        </svg>
      </div>

      <div className="phone" onClick={handlePhoneClick}>
        <div>PHONE</div>
        <p>010-6202-5991</p>
      </div>
      <div className="email" onClick={handleEmailClick}>
        <div>E-mail</div>
        <p>kimgy071928@gmail.com</p>
      </div>
      <div className="github" onClick={handleGithubClick}>
        <div>GitHub</div>
        <span>https://github.com/rkyxung</span>
      </div>

      {/* 물리 엔진이 적용될 영역 */}
      <div className="physics-scene" ref={sceneRef}>
        {SORTED_OBJECTS.map((obj, index) => (
          <div
            key={obj.id}
            ref={(el) => (elementRefs.current[index] = el)}
            className={`physics-item ${obj.class || ''}`}
            onMouseEnter={() => handleHover(index)}
            style={{ 
                position: 'absolute', 
                pointerEvents: 'auto', 
                willChange: 'transform' 
            }} 
          >
            {obj.type === 'svg-filled' && <SvgIcon type="filled" />}
            {obj.type === 'svg-outlined' && <SvgIcon type="outlined" />}
            {obj.type === 'text' && obj.text}
          </div>
        ))}
      </div>

      <div className="line"></div>
    </div>
  );
}

export default Contact;