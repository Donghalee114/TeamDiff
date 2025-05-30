import React, { useState , useEffect } from 'react';

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


  const renderTeamList = (team) => {
  if (!Array.isArray(team)) return null;

  return team
    .filter(p => p && p.name) // null 방지
    .sort((a, b) =>
      roleOrder.indexOf(a.assignedRole || '') - roleOrder.indexOf(b.assignedRole || '')
    )
    .map((p, idx) => (
      <li key={idx} style={{ marginBottom: "2px" }}>
        <span style={{ fontWeight: 600 }}>{p.name}#{p.tag}</span>
        <span style={{
          background: "#e0e7ff", color: "#6366f1", borderRadius: "4px",
          padding: "2px 8px", marginLeft: "8px", fontSize: "0.98rem"
        }}>
          {roleToKorean[p.assignedRole] || '포지션 없음'}
        </span>
        <span style={{ marginLeft: "8px", color: "#64748b" }}>
          {tierToKorean[p.tier]} ({p.totalScore}점)
        </span>
        {p.mainRole ? (
          p.assignedRole === p.mainRole ? (
            <span style={{ color: "#22c55e", marginLeft: "8px" }}>주 포지션</span>
          ) : (
            <span style={{ color: "#fbbf24", marginLeft: "8px" }}>
              부 포지션 (주: {roleToKorean[p.mainRole] || p.mainRole})
            </span>
          )
        ) : null}
      </li>
    ));
};


  return (
    <section style={{
      position: "relative",
      top : "-38px",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
      padding: "32px 28px",
      width: "650px",
      minWidth: "340px",
      height: "765px",
    }}>
      <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>3. 팀 구성 결과</h2>


    <button onClick={handleMakeTeams} className='buttonDefault' style={{width : "130px" }}>팀 구성 재시도</button>
      {teamResult && teamResult.fallbackUsed ? (
        <div style={{ marginTop: '10px', color: '#ef4444', fontWeight: 600, fontSize: "1rem" }}>
          ⚠️ 라인 포지션 충돌로 인해, 실력 점수 균형 기준으로 팀이 자동 배정되었습니다.<br />
          (라인 밸런스 부족으로 인한 예외 상황)
        </div>
      ) : teamResult && (
        <div style={{ marginTop: '10px', color: '#22c55e', fontWeight: 600, fontSize: "1rem" }}>
          ✅ 라인과 실력점수의 균형을 기준으로 팀이 구성되었습니다.
        </div>
      )}
        {Array.isArray(teamResult?.teamA) && (
          <>
            <h3>팀 A ({teamResult.teamAScore}점)</h3>
            <ul>{renderTeamList(teamResult.teamA)}</ul>
          </>
        )}

      {Array.isArray(teamResult?.teamB) && (
          <>
            <h3>팀 B ({teamResult.teamBScore}점)</h3>
            <ul>{renderTeamList(teamResult.teamB)}</ul>
          </>
        )}

      <button onClick={() => {setResult([]); setCanClick(false)}} className="buttonWarning" style={{ marginTop: "20px" }}>
        초기화
      </button>

      <div style={{
  marginTop: "30px",
  background: "#f3f4f6",
  borderRadius: "10px",
  padding: "12px 10px"
}}>
  <h4 style={{ margin: "0 0 8px 0", color: "#6366f1", fontWeight: 700, fontSize: "1.05rem" }}>점수차</h4>
  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
    <span style={{ background: "#e0e7ff", color: "#6366f1", padding: "4px 8px", borderRadius: "4px" }}>
     팀 A 평균 점수: {teamResult?.teamAScore ?? '-'}점<br />
      팀 B 평균 점수: {teamResult?.teamBScore ?? '-'}점<br />
      {overA !== null && (
        overA ? (
          <div>A팀의 점수가 {scoreDiff}점 더 높습니다.</div>
        ) : (
          <div>B팀의 점수가 {scoreDiff}점 더 높습니다.</div>
        )
      )}
    </span>
  </div>
</div>
    </section>
  );
}
