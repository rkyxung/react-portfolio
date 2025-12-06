# 부가 시스템 - Audio, CSS 애니메이션, 성능 최적화

## 1. 오디오 시스템 (start.js, rides.js, puzzle*.js)

### 게임 진행 단계별 음성

```javascript
// start.js - 초기 환영 메시지
const WelcomeMessage = [
  { text: "환영합니다, UID-037님.", isDot: false },
  { text: "system.themepark에 오신 것을 축하합니다.", isDot: false }
];

// puzzle01.js - 비밀번호 입력 효과음
const officePswdEffect = new Audio("sounds/office_pswd.mp3");
officePswdEffect.volume = 0.6;

export const wrongEffect = new Audio("sounds/wrong_answer.mp3");
export const successEffect = new Audio("sounds/success_answer.mp3");

// puzzle02.js - 배경음악 + 글리치 효과음
export const glitchBgm = new Audio("sounds/glitch_noise.mp3");
glitchBgm.loop = true; // 반복 재생

// start.js - 게임 상태별 음성 제어
yes.addEventListener("click", () => {
  errorEffect.play();        // 오류 효과음 재생
  ThemeparkBgm.pause();      // 테마파크 배경음악 일시 정지
  Themepark.classList.add("hidden");
  YorN.classList.add("hidden");
});
```

### 기술적 특징

- **음성 재사용**: 같은 효과음을 여러 곳에서 export해서 사용
- **볼륨 조정**: `volume` 속성으로 각 음성의 중요도 반영
- **루프 재생**: `loop = true`로 배경음악 자동 반복
- **상태 기반 제어**: 게임 상태 변경에 따라 음성 재생/중지

---

## 2. CSS 애니메이션 및 상태 관리

### 클래스 토글을 통한 동적 효과

```javascript
// 여러 퍼즐에서 공통으로 사용되는 패턴

// 상태 표시
glitchLayer.classList.add("shake");           // 흔들림 애니메이션 시작
message.classList.add("hidden");              // 요소 숨김
computerView.classList.add("zoom_computer");  // 줌 인 애니메이션

// 일정 시간 후 상태 해제
setTimeout(() => {
  glitchLayer.classList.remove("shake");
  message.classList.remove("hidden");
  computerView.classList.remove("zoom_computer");
}, 3000);

// 토글 (클릭할 때마다 on/off)
lockerView.classList.toggle("zoom_locker");
```

### CSS 정의 예시

```css
/* 숨김 상태 */
.hidden {
  display: none;
}

/* 흔들림 애니메이션 */
.shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 줌 인 애니메이션 */
.zoom_computer {
  animation: zoomIn 0.8s ease-out;
  transform: scale(1.2);
}

@keyframes zoomIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1.2); opacity: 1; }
}

/* 드래그 중 상태 */
.piece.dragging {
  z-index: 100;
  opacity: 0.8;
}

/* 정답 퍼즐 */
.piece.correct {
  border: 2px solid green;
}

/* 오류 애니메이션 */
.pzError {
  animation: error 0.5s;
}

@keyframes error {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
```

### 기술적 특징

- **CSS와 JS 분리**: 스타일은 CSS에, 로직은 JS에서 관리
- **재사용성**: 동일한 클래스를 여러 곳에서 사용
- **성능**: 레이아웃 재계산 없이 CSS 클래스만 토글

---

## 3. 성능 최적화

### 3.1 이벤트 리스너 관리

**현재 코드의 잠재적 문제**:
```javascript
// 매번 새 리스너 등록 - 중복 가능성
document.addEventListener("keydown", (e) => {
  // 처리 로직
});
```

**개선 방향**:
```javascript
let isKeydownEvent = false;

if (!isKeydownEvent) {
  isKeydownEvent = true;
  document.addEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  // 처리 로직
}

// 게임 단계 변경 시 리스너 제거
function cleanup() {
  document.removeEventListener("keydown", handleKeydown);
  isKeydownEvent = false;
}
```

### 3.2 Canvas 성능

```javascript
// 500ms 간격으로 업데이트 (매 프레임이 아님)
setInterval(glitchCanvas, 500);

// 필요한 영역만 갱신 (전체 캔버스가 아님)
ctx.clearRect(x, y, width, height); // 전체가 아닌 일부만 클리어
```

### 3.3 음성 오버래핑 방지

```javascript
// 문제: 같은 음성이 겹쳐서 재생될 수 있음
typingAudio.play();
typingAudio.play(); // 다시 재생

// 개선: 현재 음성이 끝나지 않았으면 초기화 후 재생
if (!typingAudio.paused) {
  typingAudio.pause();
  typingAudio.currentTime = 0;
}
typingAudio.play();
```

### 3.4 메모리 누수 방지

**문제 패턴**:
```javascript
// 각 단계마다 새로운 Audio 인스턴스 생성 - 메모리 누수
function createSound(src) {
  return new Audio(src); // 계속 생성되지만 제거되지 않음
}
```

**개선 방향**:
```javascript
// 미리 생성하고 재사용
const sounds = {
  typing: new Audio("sounds/typing.mp3"),
  correct: new Audio("sounds/correct.mp3"),
  wrong: new Audio("sounds/wrong.mp3")
};

// 필요할 때마다 재사용
sounds.correct.play();
```

---

## 4. SVG 마스크를 이용한 손전등 효과 (선택)

### 구현 개념

```html
<!-- SVG 마스크 정의 -->
<svg style="display: none;">
  <defs>
    <mask id="spotlight-mask">
      <!-- 검은 배경 -->
      <rect width="100%" height="100%" fill="black"/>
      <!-- 밝은 원 (손전등) -->
      <circle id="spotlight-circle" r="150" fill="white"/>
    </mask>
  </defs>
</svg>

<!-- 마스크 적용 -->
<div class="spotlight" style="mask: url(#spotlight-mask)"></div>
```

### JavaScript로 동적 조절

```javascript
document.addEventListener("mousemove", (e) => {
  const circle = document.getElementById("spotlight-circle");
  circle.setAttribute("cx", e.clientX);
  circle.setAttribute("cy", e.clientY);
});
```

---

## 5. 데이터 속성 활용

### HTML5 dataset API

```javascript
// 정답 위치 저장
img.dataset.correctX = piece.x;
img.dataset.correctY = piece.y;

// 상태 저장 (중복 카운트 방지)
dragging.dataset.placed = "true";

// 나중에 조회
const correctX = parseFloat(dragging.dataset.correctX);
if (dragging.dataset.placed === "true") {
  // 이미 놓인 퍼즐
}
```

### 기술적 특징

- **DOM 요소에 메타 정보 저장**: 따로 객체 관리 필요 없음
- **타입 변환**: `dataset`은 문자열이므로 필요시 `parseFloat` 사용
- **선택자로 쿼리 가능**: `document.querySelector('[data-placed="true"]')`

---

## 6. IntersectionObserver로 성능 최적화

### 화면에 보일 때만 효과 실행

```javascript
const canvas = document.getElementById("glitch-layer");
let glitchEffect = null;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 화면에 보임 - 글리치 시작
      glitchEffect = glitch();
    } else {
      // 화면 밖 - 글리치 중지
      if (glitchEffect) glitchEffect();
    }
  });
});

observer.observe(canvas);
```

### 기술적 특징

- **리소스 절감**: 보이지 않는 요소는 효과 실행 안 함
- **성능 개선**: CPU/메모리 사용량 감소
- **자동 감지**: 스크롤이나 레이아웃 변경 시 자동 감지

---

## 요약

| 기능 | 파일 | 목적 |
|------|------|------|
| 음성 | start.js, puzzle*.js | 게임 내러티브 및 피드백 |
| CSS 애니메이션 | index.css, animation.css | 상태 변화 시각화 |
| 이벤트 관리 | 각 puzzle 파일 | 사용자 입력 처리 |
| Canvas 성능 | glitch.js, deepGlitch.js | 부하 관리 |
| 메타 정보 | 각 puzzle 파일 | 정답 저장 및 검증 |
| 성능 모니터링 | 전체 | 최적화 고려 |
