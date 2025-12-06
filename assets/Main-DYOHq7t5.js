const n=`# 게임 전체 흐름 - main.js\r
\r
## 게임 진행 구조\r
\r
코드 구조를 통해 4개 퍼즐이 순차적으로 진행되는 아키텍처를 볼 수 있습니다.\r
\r
### 콜백 기반 선형 진행\r
\r
\`\`\`javascript\r
// main.js\r
let ErrorValue = false;\r
let currentPuzzle = 1;\r
\r
// 각 퍼즐 중복 실행 방지 플래그\r
let puzzle01once = false;\r
let puzzle02once = false;\r
let puzzle03once = false;\r
let puzzle04once = false;\r
\r
function Puzzle() {\r
  if (currentPuzzle === 1 && !puzzle01once) {\r
    puzzle01once = true;\r
    puzzle01(() => {\r
      currentPuzzle = 2;\r
      Puzzle(); // 재귀 호출\r
    });\r
  } else if (currentPuzzle === 2 && !puzzle02once) {\r
    puzzle02once = true;\r
    puzzle02(() => {\r
      currentPuzzle = 3;\r
      Puzzle();\r
    });\r
  } else if (currentPuzzle === 3 && !puzzle03once) {\r
    puzzle03once = true;\r
    puzzle03(() => {\r
      currentPuzzle = 4;\r
      Puzzle();\r
    });\r
  } else if (currentPuzzle === 4 && !puzzle04once) {\r
    puzzle04once = true;\r
    puzzle04(() => {\r
      console.log("퍼즐4 완료");\r
    });\r
  }\r
}\r
\r
function main() {\r
  startGame({\r
    glitch,\r
    timer,\r
    ridesMessage,\r
    getIsErrorState: () => ErrorValue\r
  });\r
  Puzzle();\r
}\r
\r
document.addEventListener("DOMContentLoaded", () => {\r
  main();\r
});\r
\`\`\`\r
\r
### 기술적 특징\r
\r
**플래그 패턴**: 각 퍼즐의 \`once\` 플래그로 중복 실행 원천 차단\r
- \`puzzle01once = true\` 설정 후 puzzle01 실행\r
- 콜백으로 완료 신호를 받고 다음 퍼즐로 진행\r
- 동일한 로직으로 4개 퍼즐을 모두 처리\r
\r
**재귀 호출**: 콜백 완료 후 \`Puzzle()\` 재호출\r
- 자동으로 다음 단계 진행\r
- 함수 깊이는 깊지 않음 (4단계만)\r
\r
**상태 관리**: \`currentPuzzle\` 변수로 현재 진행 단계 추적\r
- 1 → 2 → 3 → 4 순서로 진행\r
- 각 단계에서 조건 확인 후 해당 퍼즐 실행\r
\r
### 게임 흐름도\r
\r
\`\`\`\r
DOMContentLoaded\r
    ↓\r
  main()\r
    ├─ startGame() → 초기 게임 시작 화면\r
    └─ Puzzle()   → 퍼즐 1 시작\r
        ↓\r
    puzzle01(콜백)\r
        ↓ (콜백 실행)\r
    Puzzle() → 퍼즐 2 시작\r
        ↓\r
    puzzle02(콜백)\r
        ↓ (콜백 실행)\r
    Puzzle() → 퍼즐 3 시작\r
        ↓\r
    puzzle03(콜백)\r
        ↓ (콜백 실행)\r
    Puzzle() → 퍼즐 4 시작\r
        ↓\r
    puzzle04(콜백)\r
        ↓ (콜백 실행)\r
    게임 종료\r
\`\`\`\r
\r
이 구조는 각 퍼즐이 완료될 때마다 자동으로 다음 단계로 진행되도록 설계되었습니다.\r
`;export{n as default};
