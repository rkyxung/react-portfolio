# 타이머 시스템 - timer.js

## 600초 카운트다운 + UI 업데이트

### 요구사항

- 600초에서 시작해서 1초마다 감소
- MM:SS 형식으로 화면 표시
- 30초 남으면 경고 (색상 변경 + 음성)
- 0초 도달 시 게임 오버

### 구현

```javascript
export function timer(seconds = 600) {
  let remainingSeconds = seconds;
  const timerDisplay = document.getElementById("timer-display");
  const gameOverScreen = document.querySelector(".gameOver");

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);

    // 30초 남으면 경고
    if (remainingSeconds === 30) {
      timerDisplay.style.color = "red";
      warnSound.play(); // 경고 음성
    }

    // 시간 종료
    if (remainingSeconds === 0) {
      clearInterval(countDown);
      gameOver(); // 게임 오버 화면 표시
      return;
    }

    remainingSeconds--;
  }

  updateDisplay(); // 초기 표시 (600:00)

  const countDown = setInterval(updateDisplay, 1000);

  // 게임 오버 함수
  function gameOver() {
    gameOverScreen.classList.remove("hidden");
    const resultText = document.querySelector(".result");
    resultText.textContent = "시간이 다 되었습니다.";
    resultText.className = "fail";
  }
}
```

### 기술적 특징

**시간 포맷팅**
```javascript
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
```
- 분 계산: `Math.floor(600 / 60)` = 10분
- 초 계산: `600 % 60` = 0초
- `padStart(2, "0")`: 한 자리 숫자 앞에 0 추가 (09, 08, ...)

**동적 UI 피드백**
- 30초 남으면 빨간색으로 변경
- 경고 음성 재생으로 긴박감 조성

**명확한 종료 조건**
- `remainingSeconds === 0`에서 게임 오버
- `setInterval` 명시적 정리

---

## 타이머 진행 예시

| 시간 | 표시 | 상태 |
|------|------|------|
| 600초 | 10:00 | 게임 시작 |
| 180초 | 03:00 | 진행 중 |
| 30초 | 00:30 | **경고 시작** (빨강 + 음성) |
| 1초 | 00:01 | 거의 끝남 |
| 0초 | 00:00 | **게임 오버** |

---

## 사용 예시

### main.js에서 호출

```javascript
import { timer } from "./timer.js";

function main() {
  startGame({
    glitch,
    timer, // timer 함수 전달
    ridesMessage,
    getIsErrorState: () => ErrorValue
  });
  Puzzle();
}
```

### start.js에서 실제 시작

```javascript
export function startGame({ timer, glitch, ... }) {
  yes.addEventListener("click", () => {
    errorEffect.play();
    ThemeparkBgm.pause();
    
    // ... 여러 단계 이후
    
    setTimeout(() => {
      timer(600); // 600초 타이머 시작
      glitch();
      ErrorValue = true;
    }, 5000);
  });
}
```