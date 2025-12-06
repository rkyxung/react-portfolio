# 퍼즐 시스템 - puzzle01.js, puzzle02.js, puzzle03.js, puzzle04.js

## 퍼즐 구조 개요

4개의 퍼즐은 각각 다른 인터랙션 방식을 사용하지만, 모두 **콜백 완료 패턴**을 따릅니다.

---

## Puzzle 1: 비밀번호 입력 (puzzle01.js)

사용자가 정답을 입력하면 다음 퍼즐으로 진행하는 구조입니다.

### 구현

```javascript
export function puzzle01(onComplete) {
  const ErrorThemepark = document.querySelector(".Error_themepark");
  const ErrorOffice = document.querySelector(".Error_office");
  const password = document.getElementById("office_password");
  const modalPassword = document.querySelector(".modal.Password");
  const message = document.querySelector(".SystemMessage");
  const nums = document.querySelectorAll(".modal.Password span");

  let pswd = "";
  let answer = false;

  glitchBgm.loop = true; // 글리치 효과음 반복

  // 비밀번호 입력 숫자 클릭
  nums.forEach((num) => {
    num.addEventListener("click", (e) => {
      if (!answer) {
        pswd += e.target.innerText;
        modalPswd.value = pswd;
        officePswdEffect.play(); // 입력음 재생
      }
    });
  });

  // 정답 검증
  password.addEventListener("click", () => {
    if (pswd === "0000") { // 정답
      successEffect.play();
      answer = true;
      message.classList.remove("hidden");
      message.innerText = "인증 완료";
      
      setTimeout(() => {
        message.classList.add("hidden");
        if (onComplete) onComplete(); // 콜백 실행
      }, 1000);
    } else { // 오답
      wrongEffect.play();
      pswd = "";
      modalPswd.value = "";
    }
  });
}
```

### 기술적 특징

- **이벤트 위임**: 여러 숫자 버튼을 forEach로 순회하며 클릭 이벤트 등록
- **정답 검증**: 입력값과 정답("0000")을 비교
- **피드백**: 정답/오답 효과음 재생
- **콜백 신호**: 정답 후 onComplete() 호출

---

## Puzzle 2: 회로 + 컴퓨터 (puzzle02.js)

여러 단계의 인터랙션(회로 선택 → 컴퓨터 접근 → 비밀번호 입력)을 거쳐야 합니다.

### 구현

```javascript
export function puzzle02(onComplete) {
  const computerView = document.getElementById("computerView");
  const computer = document.getElementById("computer");
  const computerMessage = document.getElementById("computerMessage");
  const message = document.querySelector(".errorMessage");
  const glitchLayer = document.getElementById("glitch-layer");
  const ErrorThemepark = document.querySelector(".Error_themepark");

  let answer02 = false;
  let answer03 = false;

  // 회로 선택 (answer02)
  breaker.addEventListener("click", () => {
    if (!answer02) {
      breaker.style.backgroundColor = "green";
      successEffect.play();
      answer02 = true; // 회로 완료
    }
  });

  // 컴퓨터 접근 (answer02 이후만 가능)
  computer.addEventListener("click", () => {
    if (!answer02) return;
    
    computerView.classList.remove("hidden");
    glitch();
    
    message.innerText = "관리자 인증 필요. 비밀번호 입력: ";
    message.classList.remove("hidden");

    // 키보드 입력 (answer03)
    document.addEventListener("keydown", (e) => {
      pswd03 += e.key;
      computerPswd.innerText += e.key;

      if (pswd03.length === 8) {
        if (pswd03 === "20110517") {
          answer03 = true; // 비밀번호 정답
          successEffect.play();
          computerMessage.innerText = "CORRECT";

          setTimeout(() => {
            // 다음 단계로 진행하는 긴 타이밍 시퀀스
            setTimeout(() => {
              glitchLayer.classList.add("shake");
              setTimeout(() => {
                glitchLayer.classList.remove("shake");
                ErrorThemepark.classList.remove("hidden");
                if (onComplete) onComplete(); // 콜백 실행
                deepGlitch();
              }, 3000);
            }, 8000);
          }, 2000);
        } else {
          wrongEffect.play();
          pswd03 = "";
        }
      }
    });
  });
}
```

### 기술적 특징

- **다단계 검증**: answer02 → answer03 순차 확인
- **접근 제어**: answer02 완료 전까지 컴퓨터 접근 불가 (`if (!answer02) return`)
- **복잡한 타이밍**: 3초, 8초, 2초 등 다양한 setTimeout으로 단계별 진행
- **콜백 신호**: 모든 단계 완료 후 onComplete() 호출

---

## Puzzle 3: 내러티브 진행 (puzzle03.js)

애니메이션이나 시간 기반 진행으로 다음 단계로 넘어갑니다.

### 구현

```javascript
export function puzzle03(onComplete) {
  const narrativeElement = document.querySelector(".story-text");
  const message = document.querySelector(".SystemMessage");

  // 스토리 텍스트 출력
  textType(storyMessages, message, () => {
    // 텍스트 완료 후
    setTimeout(() => {
      message.classList.add("hidden");
      narrativeElement.classList.add("slideIn");
      
      // 애니메이션 완료 후
      narrativeElement.addEventListener("animationend", () => {
        setTimeout(() => {
          if (onComplete) onComplete(); // 콜백 실행
        }, 2000);
      }, { once: true });
    }, 1500);
  });
}
```

### 기술적 특징

- **순차 이벤트**: textType 콜백 → 애니메이션 → onComplete
- **animationend 이벤트**: CSS 애니메이션 완료를 감지
- **{ once: true }**: 이벤트 리스너가 한 번만 실행되도록 설정

---

## Puzzle 4: 드래그 앤 드롭 (puzzle04.js)

퍼즐 조각을 올바른 위치에 드래그해서 놓아야 합니다.

### 데이터 구조

```javascript
const pieceData = [
  { src: "pz01", w: 14.7, h: 28.9, x: 10.3, y: 71.1 },
  { src: "pz02", w: 14.7, h: 28.9, x: 25.0, y: 71.1 },
  // ... 32개 조각
];
```

### 드래그 로직

```javascript
export function puzzle04(onComplete) {
  const board = document.querySelector(".puzzleBoard");
  let dragging = null, offsetX = 0, offsetY = 0;
  let correctCount = 0;
  const totalPieces = pieceData.length;

  // 퍼즐 조각 생성 및 데이터 저장
  pieceData.forEach(piece => {
    const img = document.createElement("img");
    img.src = `img/puzzle/${piece.src}.png`;
    img.className = "piece";
    img.dataset.correctX = piece.x; // 정답 x 좌표 저장
    img.dataset.correctY = piece.y; // 정답 y 좌표 저장
    img.style.left = `${Math.random() * 80}vw`;
    img.style.top = `${Math.random() * 80}vh`;
    board.appendChild(img);
  });

  // 마우스 다운: 드래그 시작
  board.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("piece")) return;
    dragging = e.target;
    dragging.classList.add("dragging");
    const rect = dragging.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  // 마우스 무브: 드래그 중 위치 업데이트
  board.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const boardRect = board.getBoundingClientRect();
    const x = ((e.clientX - boardRect.left - offsetX) / boardRect.width) * 100;
    const y = ((e.clientY - boardRect.top - offsetY) / boardRect.height) * 100;
    dragging.style.left = `${x}vw`;
    dragging.style.top = `${y}vh`;
  });

  // 마우스 업: 정답 검증
  board.addEventListener("mouseup", () => {
    const correctX = parseFloat(dragging.dataset.correctX);
    const correctY = parseFloat(dragging.dataset.correctY);
    const currentX = parseFloat(dragging.style.left);
    const currentY = parseFloat(dragging.style.top);

    // ±5% 범위 내 정답 인정
    if (Math.abs(currentX - correctX) < 5 && Math.abs(currentY - correctY) < 5) {
      correctCount++;
      dragging.classList.add("correct");
      successEffect.play();

      // 모든 퍼즐 완료
      if (correctCount === totalPieces) {
        board.classList.add("hidden");
        if (onComplete) onComplete(); // 콜백 실행
      }
    } else {
      dragging.classList.add("pzError"); // 오류 애니메이션
      setTimeout(() => {
        dragging.classList.remove("pzError");
      }, 1000);
    }

    dragging.classList.remove("dragging");
    dragging = null;
  });
}
```

### 기술적 특징

- **좌표 변환**: 마우스 위치 → 보드 상대 위치 → vw/vh 퍼센트
- **공차 설정**: ±5% 범위로 정답 인정 (사용성 고려)
- **데이터 속성 활용**: `dataset.correctX/Y`로 정답 위치 저장
- **진행도 추적**: `correctCount`로 완료된 퍼즐 개수 관리
- **콜백 신호**: 모든 퍼즐 완료 후 onComplete() 호출

---

## 퍼즐 시스템의 일관된 인터페이스

모든 퍼즐이 동일한 콜백 패턴을 사용하므로, main.js의 Puzzle() 함수에서 일관되게 처리할 수 있습니다:

```javascript
puzzle01(() => { currentPuzzle = 2; Puzzle(); });
puzzle02(() => { currentPuzzle = 3; Puzzle(); });
puzzle03(() => { currentPuzzle = 4; Puzzle(); });
puzzle04(() => { console.log("완료"); });
```

각 퍼즐의 내부 구현은 다르지만(입력, 선택, 드래그), 완료 신호만 일관되게 콜백으로 전달합니다.
