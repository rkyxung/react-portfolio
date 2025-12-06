const r=`# 부가 시스템 - Audio, CSS 애니메이션, 성능 최적화\r
\r
## 1. 오디오 시스템 (start.js, rides.js, puzzle*.js)\r
\r
### 게임 진행 단계별 음성\r
\r
\`\`\`javascript\r
// start.js - 초기 환영 메시지\r
const WelcomeMessage = [\r
  { text: "환영합니다, UID-037님.", isDot: false },\r
  { text: "system.themepark에 오신 것을 축하합니다.", isDot: false }\r
];\r
\r
// puzzle01.js - 비밀번호 입력 효과음\r
const officePswdEffect = new Audio("sounds/office_pswd.mp3");\r
officePswdEffect.volume = 0.6;\r
\r
export const wrongEffect = new Audio("sounds/wrong_answer.mp3");\r
export const successEffect = new Audio("sounds/success_answer.mp3");\r
\r
// puzzle02.js - 배경음악 + 글리치 효과음\r
export const glitchBgm = new Audio("sounds/glitch_noise.mp3");\r
glitchBgm.loop = true; // 반복 재생\r
\r
// start.js - 게임 상태별 음성 제어\r
yes.addEventListener("click", () => {\r
  errorEffect.play();        // 오류 효과음 재생\r
  ThemeparkBgm.pause();      // 테마파크 배경음악 일시 정지\r
  Themepark.classList.add("hidden");\r
  YorN.classList.add("hidden");\r
});\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **음성 재사용**: 같은 효과음을 여러 곳에서 export해서 사용\r
- **볼륨 조정**: \`volume\` 속성으로 각 음성의 중요도 반영\r
- **루프 재생**: \`loop = true\`로 배경음악 자동 반복\r
- **상태 기반 제어**: 게임 상태 변경에 따라 음성 재생/중지\r
\r
---\r
\r
## 2. CSS 애니메이션 및 상태 관리\r
\r
### 클래스 토글을 통한 동적 효과\r
\r
\`\`\`javascript\r
// 여러 퍼즐에서 공통으로 사용되는 패턴\r
\r
// 상태 표시\r
glitchLayer.classList.add("shake");           // 흔들림 애니메이션 시작\r
message.classList.add("hidden");              // 요소 숨김\r
computerView.classList.add("zoom_computer");  // 줌 인 애니메이션\r
\r
// 일정 시간 후 상태 해제\r
setTimeout(() => {\r
  glitchLayer.classList.remove("shake");\r
  message.classList.remove("hidden");\r
  computerView.classList.remove("zoom_computer");\r
}, 3000);\r
\r
// 토글 (클릭할 때마다 on/off)\r
lockerView.classList.toggle("zoom_locker");\r
\`\`\`\r
\r
### CSS 정의 예시\r
\r
\`\`\`css\r
/* 숨김 상태 */\r
.hidden {\r
  display: none;\r
}\r
\r
/* 흔들림 애니메이션 */\r
.shake {\r
  animation: shake 0.5s infinite;\r
}\r
\r
@keyframes shake {\r
  0%, 100% { transform: translateX(0); }\r
  25% { transform: translateX(-5px); }\r
  75% { transform: translateX(5px); }\r
}\r
\r
/* 줌 인 애니메이션 */\r
.zoom_computer {\r
  animation: zoomIn 0.8s ease-out;\r
  transform: scale(1.2);\r
}\r
\r
@keyframes zoomIn {\r
  from { transform: scale(0.5); opacity: 0; }\r
  to { transform: scale(1.2); opacity: 1; }\r
}\r
\r
/* 드래그 중 상태 */\r
.piece.dragging {\r
  z-index: 100;\r
  opacity: 0.8;\r
}\r
\r
/* 정답 퍼즐 */\r
.piece.correct {\r
  border: 2px solid green;\r
}\r
\r
/* 오류 애니메이션 */\r
.pzError {\r
  animation: error 0.5s;\r
}\r
\r
@keyframes error {\r
  0%, 100% { transform: rotate(0deg); }\r
  25% { transform: rotate(-5deg); }\r
  75% { transform: rotate(5deg); }\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **CSS와 JS 분리**: 스타일은 CSS에, 로직은 JS에서 관리\r
- **재사용성**: 동일한 클래스를 여러 곳에서 사용\r
- **성능**: 레이아웃 재계산 없이 CSS 클래스만 토글\r
\r
---\r
\r
## 3. 성능 최적화\r
\r
### 3.1 이벤트 리스너 관리\r
\r
**현재 코드의 잠재적 문제**:\r
\`\`\`javascript\r
// 매번 새 리스너 등록 - 중복 가능성\r
document.addEventListener("keydown", (e) => {\r
  // 처리 로직\r
});\r
\`\`\`\r
\r
**개선 방향**:\r
\`\`\`javascript\r
let isKeydownEvent = false;\r
\r
if (!isKeydownEvent) {\r
  isKeydownEvent = true;\r
  document.addEventListener("keydown", handleKeydown);\r
}\r
\r
function handleKeydown(e) {\r
  // 처리 로직\r
}\r
\r
// 게임 단계 변경 시 리스너 제거\r
function cleanup() {\r
  document.removeEventListener("keydown", handleKeydown);\r
  isKeydownEvent = false;\r
}\r
\`\`\`\r
\r
### 3.2 Canvas 성능\r
\r
\`\`\`javascript\r
// 500ms 간격으로 업데이트 (매 프레임이 아님)\r
setInterval(glitchCanvas, 500);\r
\r
// 필요한 영역만 갱신 (전체 캔버스가 아님)\r
ctx.clearRect(x, y, width, height); // 전체가 아닌 일부만 클리어\r
\`\`\`\r
\r
### 3.3 음성 오버래핑 방지\r
\r
\`\`\`javascript\r
// 문제: 같은 음성이 겹쳐서 재생될 수 있음\r
typingAudio.play();\r
typingAudio.play(); // 다시 재생\r
\r
// 개선: 현재 음성이 끝나지 않았으면 초기화 후 재생\r
if (!typingAudio.paused) {\r
  typingAudio.pause();\r
  typingAudio.currentTime = 0;\r
}\r
typingAudio.play();\r
\`\`\`\r
\r
### 3.4 메모리 누수 방지\r
\r
**문제 패턴**:\r
\`\`\`javascript\r
// 각 단계마다 새로운 Audio 인스턴스 생성 - 메모리 누수\r
function createSound(src) {\r
  return new Audio(src); // 계속 생성되지만 제거되지 않음\r
}\r
\`\`\`\r
\r
**개선 방향**:\r
\`\`\`javascript\r
// 미리 생성하고 재사용\r
const sounds = {\r
  typing: new Audio("sounds/typing.mp3"),\r
  correct: new Audio("sounds/correct.mp3"),\r
  wrong: new Audio("sounds/wrong.mp3")\r
};\r
\r
// 필요할 때마다 재사용\r
sounds.correct.play();\r
\`\`\`\r
\r
---\r
\r
## 4. SVG 마스크를 이용한 손전등 효과 (선택)\r
\r
### 구현 개념\r
\r
\`\`\`html\r
<!-- SVG 마스크 정의 -->\r
<svg style="display: none;">\r
  <defs>\r
    <mask id="spotlight-mask">\r
      <!-- 검은 배경 -->\r
      <rect width="100%" height="100%" fill="black"/>\r
      <!-- 밝은 원 (손전등) -->\r
      <circle id="spotlight-circle" r="150" fill="white"/>\r
    </mask>\r
  </defs>\r
</svg>\r
\r
<!-- 마스크 적용 -->\r
<div class="spotlight" style="mask: url(#spotlight-mask)"></div>\r
\`\`\`\r
\r
### JavaScript로 동적 조절\r
\r
\`\`\`javascript\r
document.addEventListener("mousemove", (e) => {\r
  const circle = document.getElementById("spotlight-circle");\r
  circle.setAttribute("cx", e.clientX);\r
  circle.setAttribute("cy", e.clientY);\r
});\r
\`\`\`\r
\r
---\r
\r
## 5. 데이터 속성 활용\r
\r
### HTML5 dataset API\r
\r
\`\`\`javascript\r
// 정답 위치 저장\r
img.dataset.correctX = piece.x;\r
img.dataset.correctY = piece.y;\r
\r
// 상태 저장 (중복 카운트 방지)\r
dragging.dataset.placed = "true";\r
\r
// 나중에 조회\r
const correctX = parseFloat(dragging.dataset.correctX);\r
if (dragging.dataset.placed === "true") {\r
  // 이미 놓인 퍼즐\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **DOM 요소에 메타 정보 저장**: 따로 객체 관리 필요 없음\r
- **타입 변환**: \`dataset\`은 문자열이므로 필요시 \`parseFloat\` 사용\r
- **선택자로 쿼리 가능**: \`document.querySelector('[data-placed="true"]')\`\r
\r
---\r
\r
## 6. IntersectionObserver로 성능 최적화\r
\r
### 화면에 보일 때만 효과 실행\r
\r
\`\`\`javascript\r
const canvas = document.getElementById("glitch-layer");\r
let glitchEffect = null;\r
\r
const observer = new IntersectionObserver((entries) => {\r
  entries.forEach((entry) => {\r
    if (entry.isIntersecting) {\r
      // 화면에 보임 - 글리치 시작\r
      glitchEffect = glitch();\r
    } else {\r
      // 화면 밖 - 글리치 중지\r
      if (glitchEffect) glitchEffect();\r
    }\r
  });\r
});\r
\r
observer.observe(canvas);\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **리소스 절감**: 보이지 않는 요소는 효과 실행 안 함\r
- **성능 개선**: CPU/메모리 사용량 감소\r
- **자동 감지**: 스크롤이나 레이아웃 변경 시 자동 감지\r
\r
---\r
\r
## 요약\r
\r
| 기능 | 파일 | 목적 |\r
|------|------|------|\r
| 음성 | start.js, puzzle*.js | 게임 내러티브 및 피드백 |\r
| CSS 애니메이션 | index.css, animation.css | 상태 변화 시각화 |\r
| 이벤트 관리 | 각 puzzle 파일 | 사용자 입력 처리 |\r
| Canvas 성능 | glitch.js, deepGlitch.js | 부하 관리 |\r
| 메타 정보 | 각 puzzle 파일 | 정답 저장 및 검증 |\r
| 성능 모니터링 | 전체 | 최적화 고려 |\r
`;export{r as default};
