const education = [
  {
    title: '계원예술대학교 · 디지털미디어디자인',
    period: '2024.03 - 재학 중',
    detail: '디지털 인터랙션과 브랜드 경험을 연결하는 커리큘럼 수료',
  },
  {
    title: '인천논현고등학교',
    period: '2019.03 - 2022.02',
    detail: '인문계 졸업',
  },
];

const certificates = [
  { title: '운전면허증 2종 보통', period: '2022' },
  { title: '한국사 능력검정 2급', period: '2021' },
];

const experiences = [
  {
    title: '버거킹 인천논현점',
    period: '2023.02 - 2025.08',
    detail: '조리 업무 전반, 매장 마감 및 위생 관리',
  },
  {
    title: '빽다방 송도아트포레점',
    period: '2022.06 - 2022.12',
    detail: '고객 응대, 음료 제조, 매장 전반 관리',
  },
];

const activities = [
  {
    title: '졸업전시 준비위원회',
    period: '2025.09 - 2025.11',
    detail: '홍보팀 · 졸업전시 브랜딩 및 졸업촬영 진행',
  },
  {
    title: '연합PT 우수작 · Spike(웹)',
    period: '2025.06',
    detail: '스크롤 인터랙션과 브랜드 소개 웹으로 선정',
  },
  {
    title: '연합PT 우수작 · 용기내챌린지(영상)',
    period: '2024.12',
    detail: '영상 기획 및 연출',
  },
];

function History() {
  return (
    <section className="section history-section">
      <header className="section-header">
        <p className="eyebrow">Academic & Activity</p>
        <h1>학력 · 자격 · 경험</h1>
      </header>

      <div className="history-table">
        <h2>학력</h2>
        <ul>
          {education.map((item) => (
            <li key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <span>{item.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-table">
        <h2>자격증</h2>
        <ul>
          {certificates.map((item) => (
            <li key={item.title}>
              <div>
                <strong>{item.title}</strong>
              </div>
              <span>{item.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-table">
        <h2>경력</h2>
        <ul>
          {experiences.map((item) => (
            <li key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <span>{item.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-table">
        <h2>교내 활동</h2>
        <ul>
          {activities.map((item) => (
            <li key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <span>{item.period}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default History;
