const e=`# 찜(Like) 상태 관리

## 개요
카테고리별 찜 상태를 하나의 Context로 관리해 암장·장비·스트레칭 어디서든 같은 API(\`toggleLike\`, \`isLiked\`)로 동작합니다. Provider 밖 사용을 에러로 막아 안전하게 설계했습니다.

## 주요 코드
\`\`\`jsx
// 초기 상태
const [likedItems, setLikedItems] = useState({
  암장: [], 장비: [], 스트레칭: []
});

// 토글 로직
const toggleLike = (item, category) => {
  setLikedItems(prev => {
    const current = prev[category];
    const exists = current.some(liked => liked.id === item.id);
    return exists
      ? { ...prev, [category]: current.filter(liked => liked.id !== item.id) }
      : { ...prev, [category]: [...current, item] };
  });
};

// 조회
const isLiked = (itemId, category) =>
  likedItems[category].some(item => item.id === itemId);
\`\`\`

- 카테고리를 키로 둔 객체 상태라 신규 카테고리 추가 시 한 곳만 확장하면 됨.
- \`some\`/\`filter\`로 id 기반 토글을 명확히 처리해 중복/삭제 버그를 예방.
- Provider 외부 호출 시 명시적으로 에러를 던져 잘못된 훅 사용을 빠르게 드러냅니다.

## 기술적 특징
- **전역 캡슐화**: Context 하나로 모든 찜 상태를 관리, 하위 컴포넌트는 동일한 인터페이스만 사용.
- **방어적 설계**: Provider 외부 사용 시 에러, 비어있는 likedItems에 대한 안전 기본값을 MyPage 등에서 세팅.
- **확장 용이성**: 카테고리 키 추가만으로 전체 UI가 따라오도록 구조화.`;export{e as default};
