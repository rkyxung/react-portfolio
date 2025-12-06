# 메인 랜딩 추천/프리뷰

## 개요
랜딩에서 오늘의 추천 루트, 암장·장비 미리보기 캐러셀을 자동 순환시켜 첫 진입 경험을 풍부하게 구성했습니다. 추천은 중복 없이 랜덤 교체되고, 두 개의 카드 리스트는 서로 다른 인터벌로 회전해 정적인 페이지 느낌을 줄였습니다.

## 주요 코드
```jsx
const [current, setCurrent] = useState(recommendations[0]);
const handleShuffle = () => {
  let random;
  do {
    random = recommendations[Math.floor(Math.random() * recommendations.length)];
  } while (random === current);
  setCurrent(random);
};
```
- 현재 추천과 중복되지 않도록 `do...while`로 새 추천을 선택해 사용자 체감 다양성을 확보.

```jsx
const [gymCards, setGymCards] = useState(GymsSeoul.slice(0, 5));
useEffect(() => {
  const gymInterval = setInterval(() => {
    setGymCards(prev => {
      const next = [...prev];
      next.unshift(next.pop());
      return next;
    });
  }, 2000);
  return () => clearInterval(gymInterval);
}, []);
```
- 2초 간격으로 카드 배열을 회전시켜 자동 캐러셀 구현, 언마운트 시 인터벌 정리로 메모리 누수 방지.

## 기술적 특징
- **자동 순환 캐러셀**: 배열 회전을 이용한 심플한 캐러셀 로직으로 라이브러리 없이 구현.
- **중복 방지 랜덤 추천**: 현재 항목 제외 선택으로 매 버튼 클릭마다 새로운 조합 보장.
- **UI 일관성**: `GymsSeoul`, `Shoes` 같은 데이터 소스를 슬라이스해 동일한 카드 레이아웃으로 프리뷰 제공.
- **스타일 집약**: Teko 폰트, 네온 컬러 그리드 등 메인 비주얼을 인라인 스타일로 세밀하게 제어.