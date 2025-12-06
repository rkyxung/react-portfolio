# 게임 전체 흐름 - main.js

## 게임 진행 구조

코드 구조를 통해 4개 퍼즐이 순차적으로 진행되는 아키텍처를 볼 수 있습니다.

### 콜백 기반 선형 진행

```javascript
// main.js
let ErrorValue = false;
let currentPuzzle = 1;

// 각 퍼즐 중복 실행 방지 플래그
let puzzle01once = false;
let puzzle02once = false;
let puzzle03once = false;
let puzzle04once = false;

function Puzzle() {
  if (currentPuzzle === 1 && !puzzle01once) {
    puzzle01once = true;
    puzzle01(() => {
      currentPuzzle = 2;
      Puzzle(); // 재귀 호출
    });
  } else if (currentPuzzle === 2 && !puzzle02once) {
    puzzle02once = true;
    puzzle02(() => {
      currentPuzzle = 3;
      Puzzle();
    });
  } else if (currentPuzzle === 3 && !puzzle03once) {
    puzzle03once = true;
    puzzle03(() => {
      currentPuzzle = 4;
      Puzzle();
    });
  } else if (currentPuzzle === 4 && !puzzle04once) {
    puzzle04once = true;
    puzzle04(() => {
      console.log("퍼즐4 완료");
    });
  }
}

function main() {
  startGame({
    glitch,
    timer,
    ridesMessage,
    getIsErrorState: () => ErrorValue
  });
  Puzzle();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
```

### 기술적 특징

**플래그 패턴**: 각 퍼즐의 `once` 플래그로 중복 실행 원천 차단
- `puzzle01once = true` 설정 후 puzzle01 실행
- 콜백으로 완료 신호를 받고 다음 퍼즐로 진행
- 동일한 로직으로 4개 퍼즐을 모두 처리

**재귀 호출**: 콜백 완료 후 `Puzzle()` 재호출
- 자동으로 다음 단계 진행
- 함수 깊이는 깊지 않음 (4단계만)

**상태 관리**: `currentPuzzle` 변수로 현재 진행 단계 추적
- 1 → 2 → 3 → 4 순서로 진행
- 각 단계에서 조건 확인 후 해당 퍼즐 실행

### 게임 흐름도

```
DOMContentLoaded
    ↓
  main()
    ├─ startGame() → 초기 게임 시작 화면
    └─ Puzzle()   → 퍼즐 1 시작
        ↓
    puzzle01(콜백)
        ↓ (콜백 실행)
    Puzzle() → 퍼즐 2 시작
        ↓
    puzzle02(콜백)
        ↓ (콜백 실행)
    Puzzle() → 퍼즐 3 시작
        ↓
    puzzle03(콜백)
        ↓ (콜백 실행)
    Puzzle() → 퍼즐 4 시작
        ↓
    puzzle04(콜백)
        ↓ (콜백 실행)
    게임 종료
```

이 구조는 각 퍼즐이 완료될 때마다 자동으로 다음 단계로 진행되도록 설계되었습니다.
