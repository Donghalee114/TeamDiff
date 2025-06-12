import React, { useState, useEffect } from 'react';

const roleOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
const roleToKorean = {
  TOP: '탑',
  JUNGLE: '정글',
  MIDDLE: '미드',
  BOTTOM: '원딜',
  UTILITY: '서폿'
};

const tierToKorean = {
  IRON: '아이언', BRONZE: '브론즈', SILVER: '실버', GOLD: '골드',
  PLATINUM: '플래티넘', EMERALD: '에메랄드', DIAMOND: '다이아몬드',
  MASTER: '마스터', GRANDMASTER: '그랜드마스터', CHALLENGER: '챌린저'
};

export default function TeamDisplay({ teamResult, setResult, setCanClick, handleMakeTeams }) {
  const [overA, setOverA] = useState(null);
  const [scoreDiff, setScoreDiff] = useState(0);

  useEffect(() => {
    if (teamResult && typeof teamResult.teamAScore === 'number' && typeof teamResult.teamBScore === 'number') {
      setOverA(teamResult.teamAScore > teamResult.teamBScore);
      setScoreDiff(Math.abs(teamResult.teamAScore - teamResult.teamBScore));
    }
  }, [teamResult]);

  if (!teamResult) return null;

  const renderTeamList = (team) => {
    if (!Array.isArray(team)) return null;

    return team
      .filter(p => p && p.name)
      .sort((a, b) => {
        const aIndex = roleOrder.indexOf(a.assignedRole || '');
        const bIndex = roleOrder.indexOf(b.assignedRole || '');
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })
      .map((p, idx) => (
<li key={idx} style={{
  background: "#1f2235",
  borderRadius: "6px",
  padding: "6px 12px",
  marginBottom: "6px",
  fontSize: "0.95rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  {/* 왼쪽: 포지션 + 이름 + 티어 + 점수 */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <strong style={{minWidth : "130px"}}>{p.name}#{p.tag}</strong>
    <span style={{
      background: "#3f4468",
      color: "#e0e0e0",
      borderRadius: "4px",
      padding: "2px 6px"
    }}>
      {roleToKorean[p.assignedRole] || '없음'}
    </span>
    <span style={{ color: "#a3aed0" }}>
      {tierToKorean[p.tier]} ({p.totalScore}점)
    </span>
  </div>

  {/* 오른쪽: 포지션 태그 */}
  <div style={{ color: p.assignedRole === p.mainRole ? "#22c55e" : "#fbbf24" }}>
    {p.assignedRole === p.mainRole
      ? "주 포지션"
      : `부 포지션 (주: ${roleToKorean[p.mainRole]})`}
  </div>
</li>

      ));
  };

  return (
    <section style={{
      position: "relative",
      top: "-38px",
      background: "#26293a",
      borderRadius: "16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      padding: "28px 24px",
      width: "650px",
      minWidth: "340px",
      height: "890px",
      color: "#e0e0e0"
    }}>

     <h2 style={{
  fontWeight: 700,
  fontSize: "1.3rem",
  marginBottom: "18px",
  color: "#c7a008"
}}>
  3. 팀 구성 결과
</h2>


      <button onClick={handleMakeTeams} className='buttonDefault' style={{ width: "130px" }}>팀 구성 재시도</button>

      {teamResult.fallbackUsed ? (
        <div style={{ marginTop: '10px', color: '#ff6b6b', fontWeight: 600, fontSize: "1rem" }}>
          ⚠️ 포지션 충돌로 인해 점수 균형 기준으로 팀이 배정되었습니다.<br />
          (라인 밸런스 부족)
        </div>
      ) : (
        <div style={{ marginTop: '10px', color: '#22c55e', fontWeight: 600, fontSize: "1rem" }}>
          ✅ 라인과 실력점수의 균형을 기준으로 팀이 구성되었습니다.
        </div>
      )}

      {Array.isArray(teamResult?.teamA) && (
          <>
          <h3>팀 A (총점: {teamResult.teamAScore}점)</h3>
          <div style={{marginLeft : "-40px"}}>
          <ul>{renderTeamList(teamResult.teamA)}</ul>
        </div>
        </>
      )}

      {Array.isArray(teamResult?.teamB) && (
        <>
          <h3>팀 B (총점: {teamResult.teamBScore}점)</h3>
          <div style={{marginLeft : "-40px"}}>
          <ul>{renderTeamList(teamResult.teamB)}</ul>
          </div>
          
        </>
      )}

      <button onClick={() => { setResult([]); setCanClick(false); }} className="buttonWarning" style={{ marginTop: "20px" }}>
        초기화
      </button>

    </section>
  );
}
