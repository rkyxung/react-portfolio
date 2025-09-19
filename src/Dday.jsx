import React from 'react';

function Dday() {
  // TODO: 아래 날짜를 원하는 졸업일로 수정하세요.
  const graduationDate = new Date('2026-02-20');
  const today = new Date();

  const timeDiff = graduationDate.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <div className="dday-container">
      <h2>졸업까지 🎓</h2>
      <p>D-{dayDiff}</p>
    </div>
  );
}

export default Dday;
