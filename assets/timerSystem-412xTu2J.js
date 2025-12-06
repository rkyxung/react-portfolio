const r=`# 타이머 시스템 - timer.js\r
\r
## 600초 카운트다운 + UI 업데이트\r
\r
### 요구사항\r
\r
- 600초에서 시작해서 1초마다 감소\r
- MM:SS 형식으로 화면 표시\r
- 30초 남으면 경고 (색상 변경 + 음성)\r
- 0초 도달 시 게임 오버\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function timer(seconds = 600) {\r
  let remainingSeconds = seconds;\r
  const timerDisplay = document.getElementById("timer-display");\r
  const gameOverScreen = document.querySelector(".gameOver");\r
\r
  function formatTime(totalSeconds) {\r
    const minutes = Math.floor(totalSeconds / 60);\r
    const secs = totalSeconds % 60;\r
    return \`\${minutes.toString().padStart(2, "0")}:\${secs.toString().padStart(2, "0")}\`;\r
  }\r
\r
  function updateDisplay() {\r
    timerDisplay.textContent = formatTime(remainingSeconds);\r
\r
    // 30초 남으면 경고\r
    if (remainingSeconds === 30) {\r
      timerDisplay.style.color = "red";\r
      warnSound.play(); // 경고 음성\r
    }\r
\r
    // 시간 종료\r
    if (remainingSeconds === 0) {\r
      clearInterval(countDown);\r
      gameOver(); // 게임 오버 화면 표시\r
      return;\r
    }\r
\r
    remainingSeconds--;\r
  }\r
\r
  updateDisplay(); // 초기 표시 (600:00)\r
\r
  const countDown = setInterval(updateDisplay, 1000);\r
\r
  // 게임 오버 함수\r
  function gameOver() {\r
    gameOverScreen.classList.remove("hidden");\r
    const resultText = document.querySelector(".result");\r
    resultText.textContent = "시간이 다 되었습니다.";\r
    resultText.className = "fail";\r
  }\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
**시간 포맷팅**\r
\`\`\`javascript\r
function formatTime(totalSeconds) {\r
  const minutes = Math.floor(totalSeconds / 60);\r
  const secs = totalSeconds % 60;\r
  return \`\${minutes.toString().padStart(2, "0")}:\${secs.toString().padStart(2, "0")}\`;\r
}\r
\`\`\`\r
- 분 계산: \`Math.floor(600 / 60)\` = 10분\r
- 초 계산: \`600 % 60\` = 0초\r
- \`padStart(2, "0")\`: 한 자리 숫자 앞에 0 추가 (09, 08, ...)\r
\r
**동적 UI 피드백**\r
- 30초 남으면 빨간색으로 변경\r
- 경고 음성 재생으로 긴박감 조성\r
\r
**명확한 종료 조건**\r
- \`remainingSeconds === 0\`에서 게임 오버\r
- \`setInterval\` 명시적 정리\r
\r
---\r
\r
## 타이머 진행 예시\r
\r
| 시간 | 표시 | 상태 |\r
|------|------|------|\r
| 600초 | 10:00 | 게임 시작 |\r
| 180초 | 03:00 | 진행 중 |\r
| 30초 | 00:30 | **경고 시작** (빨강 + 음성) |\r
| 1초 | 00:01 | 거의 끝남 |\r
| 0초 | 00:00 | **게임 오버** |\r
\r
---\r
\r
## 사용 예시\r
\r
### main.js에서 호출\r
\r
\`\`\`javascript\r
import { timer } from "./timer.js";\r
\r
function main() {\r
  startGame({\r
    glitch,\r
    timer, // timer 함수 전달\r
    ridesMessage,\r
    getIsErrorState: () => ErrorValue\r
  });\r
  Puzzle();\r
}\r
\`\`\`\r
\r
### start.js에서 실제 시작\r
\r
\`\`\`javascript\r
export function startGame({ timer, glitch, ... }) {\r
  yes.addEventListener("click", () => {\r
    errorEffect.play();\r
    ThemeparkBgm.pause();\r
    \r
    // ... 여러 단계 이후\r
    \r
    setTimeout(() => {\r
      timer(600); // 600초 타이머 시작\r
      glitch();\r
      ErrorValue = true;\r
    }, 5000);\r
  });\r
}\r
\`\`\``;export{r as default};
