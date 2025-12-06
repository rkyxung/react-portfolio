const r=`# 퍼즐 시스템 - puzzle01.js, puzzle02.js, puzzle03.js, puzzle04.js\r
\r
## 퍼즐 구조 개요\r
\r
4개의 퍼즐은 각각 다른 인터랙션 방식을 사용하지만, 모두 **콜백 완료 패턴**을 따릅니다.\r
\r
---\r
\r
## Puzzle 1: 비밀번호 입력 (puzzle01.js)\r
\r
사용자가 정답을 입력하면 다음 퍼즐으로 진행하는 구조입니다.\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function puzzle01(onComplete) {\r
  const ErrorThemepark = document.querySelector(".Error_themepark");\r
  const ErrorOffice = document.querySelector(".Error_office");\r
  const password = document.getElementById("office_password");\r
  const modalPassword = document.querySelector(".modal.Password");\r
  const message = document.querySelector(".SystemMessage");\r
  const nums = document.querySelectorAll(".modal.Password span");\r
\r
  let pswd = "";\r
  let answer = false;\r
\r
  glitchBgm.loop = true; // 글리치 효과음 반복\r
\r
  // 비밀번호 입력 숫자 클릭\r
  nums.forEach((num) => {\r
    num.addEventListener("click", (e) => {\r
      if (!answer) {\r
        pswd += e.target.innerText;\r
        modalPswd.value = pswd;\r
        officePswdEffect.play(); // 입력음 재생\r
      }\r
    });\r
  });\r
\r
  // 정답 검증\r
  password.addEventListener("click", () => {\r
    if (pswd === "0000") { // 정답\r
      successEffect.play();\r
      answer = true;\r
      message.classList.remove("hidden");\r
      message.innerText = "인증 완료";\r
      \r
      setTimeout(() => {\r
        message.classList.add("hidden");\r
        if (onComplete) onComplete(); // 콜백 실행\r
      }, 1000);\r
    } else { // 오답\r
      wrongEffect.play();\r
      pswd = "";\r
      modalPswd.value = "";\r
    }\r
  });\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **이벤트 위임**: 여러 숫자 버튼을 forEach로 순회하며 클릭 이벤트 등록\r
- **정답 검증**: 입력값과 정답("0000")을 비교\r
- **피드백**: 정답/오답 효과음 재생\r
- **콜백 신호**: 정답 후 onComplete() 호출\r
\r
---\r
\r
## Puzzle 2: 회로 + 컴퓨터 (puzzle02.js)\r
\r
여러 단계의 인터랙션(회로 선택 → 컴퓨터 접근 → 비밀번호 입력)을 거쳐야 합니다.\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function puzzle02(onComplete) {\r
  const computerView = document.getElementById("computerView");\r
  const computer = document.getElementById("computer");\r
  const computerMessage = document.getElementById("computerMessage");\r
  const message = document.querySelector(".errorMessage");\r
  const glitchLayer = document.getElementById("glitch-layer");\r
  const ErrorThemepark = document.querySelector(".Error_themepark");\r
\r
  let answer02 = false;\r
  let answer03 = false;\r
\r
  // 회로 선택 (answer02)\r
  breaker.addEventListener("click", () => {\r
    if (!answer02) {\r
      breaker.style.backgroundColor = "green";\r
      successEffect.play();\r
      answer02 = true; // 회로 완료\r
    }\r
  });\r
\r
  // 컴퓨터 접근 (answer02 이후만 가능)\r
  computer.addEventListener("click", () => {\r
    if (!answer02) return;\r
    \r
    computerView.classList.remove("hidden");\r
    glitch();\r
    \r
    message.innerText = "관리자 인증 필요. 비밀번호 입력: ";\r
    message.classList.remove("hidden");\r
\r
    // 키보드 입력 (answer03)\r
    document.addEventListener("keydown", (e) => {\r
      pswd03 += e.key;\r
      computerPswd.innerText += e.key;\r
\r
      if (pswd03.length === 8) {\r
        if (pswd03 === "20110517") {\r
          answer03 = true; // 비밀번호 정답\r
          successEffect.play();\r
          computerMessage.innerText = "CORRECT";\r
\r
          setTimeout(() => {\r
            // 다음 단계로 진행하는 긴 타이밍 시퀀스\r
            setTimeout(() => {\r
              glitchLayer.classList.add("shake");\r
              setTimeout(() => {\r
                glitchLayer.classList.remove("shake");\r
                ErrorThemepark.classList.remove("hidden");\r
                if (onComplete) onComplete(); // 콜백 실행\r
                deepGlitch();\r
              }, 3000);\r
            }, 8000);\r
          }, 2000);\r
        } else {\r
          wrongEffect.play();\r
          pswd03 = "";\r
        }\r
      }\r
    });\r
  });\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **다단계 검증**: answer02 → answer03 순차 확인\r
- **접근 제어**: answer02 완료 전까지 컴퓨터 접근 불가 (\`if (!answer02) return\`)\r
- **복잡한 타이밍**: 3초, 8초, 2초 등 다양한 setTimeout으로 단계별 진행\r
- **콜백 신호**: 모든 단계 완료 후 onComplete() 호출\r
\r
---\r
\r
## Puzzle 3: 내러티브 진행 (puzzle03.js)\r
\r
애니메이션이나 시간 기반 진행으로 다음 단계로 넘어갑니다.\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function puzzle03(onComplete) {\r
  const narrativeElement = document.querySelector(".story-text");\r
  const message = document.querySelector(".SystemMessage");\r
\r
  // 스토리 텍스트 출력\r
  textType(storyMessages, message, () => {\r
    // 텍스트 완료 후\r
    setTimeout(() => {\r
      message.classList.add("hidden");\r
      narrativeElement.classList.add("slideIn");\r
      \r
      // 애니메이션 완료 후\r
      narrativeElement.addEventListener("animationend", () => {\r
        setTimeout(() => {\r
          if (onComplete) onComplete(); // 콜백 실행\r
        }, 2000);\r
      }, { once: true });\r
    }, 1500);\r
  });\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **순차 이벤트**: textType 콜백 → 애니메이션 → onComplete\r
- **animationend 이벤트**: CSS 애니메이션 완료를 감지\r
- **{ once: true }**: 이벤트 리스너가 한 번만 실행되도록 설정\r
\r
---\r
\r
## Puzzle 4: 드래그 앤 드롭 (puzzle04.js)\r
\r
퍼즐 조각을 올바른 위치에 드래그해서 놓아야 합니다.\r
\r
### 데이터 구조\r
\r
\`\`\`javascript\r
const pieceData = [\r
  { src: "pz01", w: 14.7, h: 28.9, x: 10.3, y: 71.1 },\r
  { src: "pz02", w: 14.7, h: 28.9, x: 25.0, y: 71.1 },\r
  // ... 32개 조각\r
];\r
\`\`\`\r
\r
### 드래그 로직\r
\r
\`\`\`javascript\r
export function puzzle04(onComplete) {\r
  const board = document.querySelector(".puzzleBoard");\r
  let dragging = null, offsetX = 0, offsetY = 0;\r
  let correctCount = 0;\r
  const totalPieces = pieceData.length;\r
\r
  // 퍼즐 조각 생성 및 데이터 저장\r
  pieceData.forEach(piece => {\r
    const img = document.createElement("img");\r
    img.src = \`img/puzzle/\${piece.src}.png\`;\r
    img.className = "piece";\r
    img.dataset.correctX = piece.x; // 정답 x 좌표 저장\r
    img.dataset.correctY = piece.y; // 정답 y 좌표 저장\r
    img.style.left = \`\${Math.random() * 80}vw\`;\r
    img.style.top = \`\${Math.random() * 80}vh\`;\r
    board.appendChild(img);\r
  });\r
\r
  // 마우스 다운: 드래그 시작\r
  board.addEventListener("mousedown", (e) => {\r
    if (!e.target.classList.contains("piece")) return;\r
    dragging = e.target;\r
    dragging.classList.add("dragging");\r
    const rect = dragging.getBoundingClientRect();\r
    offsetX = e.clientX - rect.left;\r
    offsetY = e.clientY - rect.top;\r
  });\r
\r
  // 마우스 무브: 드래그 중 위치 업데이트\r
  board.addEventListener("mousemove", (e) => {\r
    if (!dragging) return;\r
    const boardRect = board.getBoundingClientRect();\r
    const x = ((e.clientX - boardRect.left - offsetX) / boardRect.width) * 100;\r
    const y = ((e.clientY - boardRect.top - offsetY) / boardRect.height) * 100;\r
    dragging.style.left = \`\${x}vw\`;\r
    dragging.style.top = \`\${y}vh\`;\r
  });\r
\r
  // 마우스 업: 정답 검증\r
  board.addEventListener("mouseup", () => {\r
    const correctX = parseFloat(dragging.dataset.correctX);\r
    const correctY = parseFloat(dragging.dataset.correctY);\r
    const currentX = parseFloat(dragging.style.left);\r
    const currentY = parseFloat(dragging.style.top);\r
\r
    // ±5% 범위 내 정답 인정\r
    if (Math.abs(currentX - correctX) < 5 && Math.abs(currentY - correctY) < 5) {\r
      correctCount++;\r
      dragging.classList.add("correct");\r
      successEffect.play();\r
\r
      // 모든 퍼즐 완료\r
      if (correctCount === totalPieces) {\r
        board.classList.add("hidden");\r
        if (onComplete) onComplete(); // 콜백 실행\r
      }\r
    } else {\r
      dragging.classList.add("pzError"); // 오류 애니메이션\r
      setTimeout(() => {\r
        dragging.classList.remove("pzError");\r
      }, 1000);\r
    }\r
\r
    dragging.classList.remove("dragging");\r
    dragging = null;\r
  });\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
- **좌표 변환**: 마우스 위치 → 보드 상대 위치 → vw/vh 퍼센트\r
- **공차 설정**: ±5% 범위로 정답 인정 (사용성 고려)\r
- **데이터 속성 활용**: \`dataset.correctX/Y\`로 정답 위치 저장\r
- **진행도 추적**: \`correctCount\`로 완료된 퍼즐 개수 관리\r
- **콜백 신호**: 모든 퍼즐 완료 후 onComplete() 호출\r
\r
---\r
\r
## 퍼즐 시스템의 일관된 인터페이스\r
\r
모든 퍼즐이 동일한 콜백 패턴을 사용하므로, main.js의 Puzzle() 함수에서 일관되게 처리할 수 있습니다:\r
\r
\`\`\`javascript\r
puzzle01(() => { currentPuzzle = 2; Puzzle(); });\r
puzzle02(() => { currentPuzzle = 3; Puzzle(); });\r
puzzle03(() => { currentPuzzle = 4; Puzzle(); });\r
puzzle04(() => { console.log("완료"); });\r
\`\`\`\r
\r
각 퍼즐의 내부 구현은 다르지만(입력, 선택, 드래그), 완료 신호만 일관되게 콜백으로 전달합니다.\r
`;export{r as default};
