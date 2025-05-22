import React, { useState } from "react";
import './Searchplayer.css';
import dummyScenarios from './DummyData.js';

const tierScoreTable = {
  IRON: 800, BRONZE: 900, SILVER: 1000, GOLD: 1100,
  PLATINUM: 1200, EMERALD: 1800, DIAMOND: 1400,
  MASTER: 1500, GRANDMASTER: 1600, CHALLENGER: 1700
};


const BASE_URL = "https://api.example.com"; // Replace with your actual API URL

const roleOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

const roleToKorean = {
  TOP: '탑', JUNGLE: '정글', MIDDLE: '미드', BOTTOM: '원딜', UTILITY: '서폿'
};

const tierToKorean = {
  IRON: '아이언', BRONZE: '브론즈', SILVER: '실버', GOLD: '골드',
  PLATINUM: '플래티넘', EMERALD: '에메랄드', DIAMOND: '다이아몬드',
  MASTER: '마스터', GRANDMASTER: '그랜드마스터', CHALLENGER: '챌린저'
};

function SearchPlayer() {
  const [summoners, setSummoners] = useState(Array(10).fill({ name: '', tag: '' }));
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [teamResult, setTeamResult] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [positionMode, setPositionMode] = useState("auto");
  const [showRoles, setShowRoles] = useState(Array(result.length).fill(false));
  const [warning, setWarning] = useState('');

  // 테스트용 더미 데이터
  const injectDummyData = () => {
    const dummyPlayers = [
      { name: "탑유저1", tag: "KR1", tier: "GOLD",  winScore: 50, winRate: 51.3, totalScore: 1150, mainRole: "TOP", backupRoles: ["JUNGLE", "MIDDLE"] },
      { name: "탑유저2", tag: "KR1", tier: "GOLD",  winScore: 70, winRate: 60.0, totalScore: 1170, mainRole: "TOP", backupRoles: ["BOTTOM", "UTILITY"] },
      { name: "탑유저3", tag: "KR1", tier: "SILVER",  winScore: 80, winRate: 63.8, totalScore: 1080, mainRole: "TOP", backupRoles: ["MIDDLE", "UTILITY"] },
      { name: "정글유저1", tag: "KR1", tier: "PLATINUM",  winScore: 30, winRate: 49.2, totalScore: 1230, mainRole: "JUNGLE", backupRoles: ["MIDDLE", "TOP"] },
      { name: "정글유저2", tag: "KR1", tier: "PLATINUM",  winScore: 60, winRate: 55.4, totalScore: 1260, mainRole: "JUNGLE", backupRoles: ["UTILITY", "BOTTOM"] },
      { name: "정글유저3", tag: "KR1", tier: "DIAMOND",  winScore: 50, winRate: 51.1, totalScore: 1450, mainRole: "JUNGLE", backupRoles: ["TOP", "BOTTOM"] },
      { name: "미드유저1", tag: "KR1", tier: "BRONZE", winScore: 100, winRate: 68.2, totalScore: 1000, mainRole: "MIDDLE", backupRoles: ["UTILITY", "JUNGLE"] },
      { name: "미드유저2", tag: "KR1", tier: "PLATINUM",  winScore: 100, winRate: 70.0, totalScore: 1300, mainRole: "MIDDLE", backupRoles: ["BOTTOM", "JUNGLE"] },
      { name: "바텀유저1", tag: "KR1", tier: "IRON", winScore: 90, winRate: 66.0, totalScore: 890, mainRole: "BOTTOM", backupRoles: ["UTILITY", "MIDDLE"] },
      { name: "서폿유저1", tag: "KR1", tier: "SILVER",  winScore: 80, winRate: 63.3, totalScore: 1080, mainRole: "UTILITY", backupRoles: ["TOP", "JUNGLE"] }
    ];
    setResult(dummyPlayers);
    setCanClick(true);
  };

  const handleChange = (idx, key, value) => {
    const newSummoners = [...summoners];
    newSummoners[idx] = { ...newSummoners[idx], [key]: value };
    setSummoners(newSummoners);
  };

  function getRoleDistribution(result) {
    const roleCount = { TOP: 0, JUNGLE: 0, MIDDLE: 0, BOTTOM: 0, UTILITY: 0 };
    result.forEach(p => {
      if (p.mainRole && roleCount[p.mainRole] !== undefined) {
        roleCount[p.mainRole]++;
      }
    });
    return roleCount;
  }

  const roleDistribution = getRoleDistribution(result);

  const handleMakeTeams = async () => {
    if (result.length !== 10) {
      alert('10명의 소환사 정보를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/teams/make-teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const data = await response.json();
      setTeamResult(data);
    } catch (error) {
      console.error('팀 구성 실패:', error);
    }
  };

  const handleFetchAllSummoners = async () => {
    if (summoners.some(summoner => !summoner.name)) {
      setWarning('❗ 소환사 이름을 모두 입력해주세요.');
      return;
    }
    setWarning('');
    const newResult = [];
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < summoners.length; i++) {
      const summoner = summoners[i];
      const name = encodeURIComponent(summoner.name);
      const tag = summoner.tag || 'KR1';
      setLoadingIndex(i);
      setIsLoading(true);
      try {
        const res1 = await fetch(`${BASE_URL}/summoner/${name}?tag=${tag}`);
        const data1 = await res1.json();
        const puuid = data1.puuid;
        await sleep(1800);

        const res2 = await fetch(`${BASE_URL}/summoner/league/${puuid}`);
        const data2 = await res2.json();
        const soloRank = data2.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
        const tier = soloRank ? soloRank.tier.toUpperCase() : 'UNRANKED';
        const tierScore = tierScoreTable[tier] || 0;
        await sleep(1800);

        const res3 = await fetch(`${BASE_URL}/analyze/${puuid}`);
        const data3 = await res3.json();
        const winScore = data3.scoreFromWinRate || 0;
        const winRate = data3.winRate || 0;
        await sleep(1800);

        const totalScore = tierScore + winScore;

        const res4 = await fetch(`${BASE_URL}/roles/${puuid}`);
        const data4 = await res4.json();
        await sleep(1800);

        newResult.push({
          name: summoner.name,
          tag,
          puuid,
          tier,
          tierScore,
          winScore,
          winRate,
          totalScore,
          mainRole: data4.mainRole,
          backupRoles: data4.backupRoles
        });
      } catch (error) {
        console.error('Error fetching summoner data:', error);
        newResult.push({
          name: summoner.name,
          tag,
          puuid: "Error",
          tier: "Error",
                  winScore: 0,
          winRate: 0,
          totalScore: 0,
          mainRole: "Error",
          backupRoles: ["Error"]
        });
        await sleep(1000);
      } finally {
        setIsLoading(false);
        setCanClick(true);
      }
    }
    setResult(newResult);
  };

  const handleBulkPaste = e => {
    const lines = e.target.value.trim().split('\n');
    const parsed = lines.slice(0, 10).map(line => {
      const [name, tag] = line.split('#');
      return { name: name?.trim() || '', tag: tag?.trim() || '' };
    });
    const newSummoners = Array(10).fill({ name: '', tag: '' });
    parsed.forEach((s, i) => { newSummoners[i] = s; });
    setSummoners(newSummoners);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
      fontFamily: "'Noto Sans KR', sans-serif",
      padding: "0",
      margin: "0"
    }}>
      {/* 상단 고정 헤더 */}
      <header style={{
        background: "#6366f1",
        color: "white",
        padding: "24px 0 16px 0",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(99,102,241,0.08)"
      }}>
        <h1 style={{ margin: 0, fontWeight: 900, fontSize: "2.2rem", letterSpacing: "-1px" }}>롤 5vs5 팀짜기</h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "1.1rem", color: "#e0e7ff" }}>10명의 소환사 정보를 입력하고, 실력과 포지션을 고려해 자동으로 팀을 구성하세요!</p>
      </header>
<div style={{display  : "flex" , justifyContent : "space-around" , alignItems : "center" , marginTop : "20px"}}>
      {/* 메인 컨텐츠 */}
      <main style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "32px",
        margin: "40px auto",
        maxWidth: "1800px"
      }}>
        {/* 왼쪽: 소환사 입력 */}
        <section style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
          padding: "32px 28px",
          width: "650px",
          minWidth: "340px",
         height : "760px"
        }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>1. 소환사 정보 입력</h2>
          <div style={{ marginBottom: "16px" }}>
            <textarea
              rows={4}
              placeholder="한 줄에 한 명씩 닉네임#태그 입력 (예: 홍길동#KR1)"
              onBlur={handleBulkPaste}
              style={{
                position: "relative",
                width: "95%",
                border: "1.5px solid #c7d2fe",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "1rem",
                marginBottom: "8px",
                resize: "none",
                background: "#f3f4f6"
              }}
            />
            <br/>
            <small style={{ color: "#6b7280" }}>최대 10명까지 입력 가능</small>
          </div>
          {summoners.map((summoner, idx) => (
            <div key={idx} style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
              alignItems: "center"
            }}>
              <input
                type="text"
                placeholder="소환사 이름"
                value={summoner.name}
                onChange={e => handleChange(idx, 'name', e.target.value)}
                style={{
                  flex: 2,
                  height: '32px',
                  border: loadingIndex === idx ? '2px solid #fbbf24' : '1.5px solid #c7d2fe',
                  borderRadius: "6px",
                  backgroundColor: loadingIndex === idx ? '#fef9c3' : '#f9fafb',
                  padding: "0 8px",
                  fontSize: "1rem"
                }}
              />
              <input
                type="text"
                placeholder="태그 (예: KR1)"
                value={summoner.tag}
                onChange={e => handleChange(idx, 'tag', e.target.value)}
                style={{
                  flex: 1,
                  height: '32px',
                  border: loadingIndex === idx ? '2px solid #fbbf24' : '1.5px solid #c7d2fe',
                  borderRadius: "6px",
                  backgroundColor: loadingIndex === idx ? '#fef9c3' : '#f9fafb',
                  padding: "0 8px",
                  fontSize: "1rem"
                }}
              />
              {loadingIndex === idx && <span style={{ marginLeft: '6px', fontSize: "1.1rem" }}>🔄</span>}
            </div>
          ))}
          {warning && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{warning}</div>}
          <button
            onClick={handleFetchAllSummoners}
            style={{
              width: "100%",
              marginTop: "10px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 0",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            disabled={isLoading}
          >
            소환사 점수화
          </button>
        </section>

        {/* 중앙: 결과 및 포지션 */}
        <section style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
          padding: "32px 28px",
          width: "600px",
          minWidth: "440px",
          minheight : "740px"
        }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>2. 소환사 점수 및 포지션</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: 600, marginRight: "10px" }}>포지션 모드:</label>
            <select
              value={positionMode}
              onChange={e => setPositionMode(e.target.value)}
              style={{
                width: "180px",
                height: "32px",
                borderRadius: "6px",
                border: "1.5px solid #c7d2fe",
                fontSize: "1rem",
                background: "#f3f4f6"
              }}
            >
              <option value="auto">포지션 자동 선택</option>
              <option value="manual">포지션 수동 선택</option>
            </select>
          </div>
          {result.length > 0 && (
            <div style={{
              marginBottom: '14px',
              backgroundColor: '#f1f5f9',
              padding: '10px 14px',
              borderRadius: "8px",
              fontSize: "0.98rem"
            }}>
              <strong>현재 주 포지션 분포:</strong><br />
              {roleOrder.map(role => `${roleToKorean[role]}: ${roleDistribution[role] || 0}명`).join(' | ')}
            </div>
          )}
          <div style={{
            maxHeight: '540px',
            overflowY: 'auto',
            padding: '6px',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            marginBottom: "10px"
          }}>
            {result.length === 0 && <p style={{ color: "#6b7280" }}>소환사 점수화 버튼을 눌러주세요</p>}
            {result.map((r, idx) => (
              <div key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f3f4f6',
                  padding: '12px 10px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{r.name}#{r.tag}</span>
                  <span style={{
                    background: "#6366f1",
                    color: "white",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "0.95rem",
                    marginLeft: "4px"
                  }}>{tierToKorean[r.tier] || r.tier}</span>
                  <span style={{ color: "#64748b", fontSize: "0.95rem" }}>({r.tierScore}점)</span>
                </div>
                <div style={{ fontSize: "0.97rem", margin: "2px 0 4px 0" }}>
                  <span>승률 점수: <strong>{r.winScore}점</strong> | 승률: <strong>{r.winRate}%</strong> | <strong>주 포지션 : {r.mainRole} </strong></span>
                </div>
                {positionMode === 'manual' ? (
                  <>
                    <button
                      onClick={() => {
                        const updated = [...showRoles];
                        updated[idx] = !updated[idx];
                        setShowRoles(updated);
                      }}
                      style={{
                        background: showRoles[idx] ? "#fbbf24" : "#e0e7ff",
                        color: "#374151",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: "4px"
                      }}
                    >
                      {showRoles[idx] ? '포지션 접기' : '포지션 설정'}
                    </button>
                    {showRoles[idx] && (
                      <div style={{ marginTop: "4px", marginBottom: "4px" }}>
                        <div style={{ marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600 }}>✅ 주 포지션:</span>
                          <select
                            value={r.mainRole || ''}
                            onChange={e => {
                              const updated = [...result];
                              updated[idx].mainRole = e.target.value;
                              updated[idx].backupRoles = updated[idx].backupRoles?.filter(role => role !== e.target.value);
                              setResult(updated);
                            }}
                            style={{
                              marginLeft: "8px",
                              borderRadius: "5px",
                              border: "1px solid #c7d2fe",
                              padding: "2px 8px"
                            }}
                          >
                            <option value="">선택 안함</option>
                            {roleOrder.map(role => (
                              <option key={role} value={role}>{roleToKorean[role]}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>⚙️ 부 포지션:</span>
                          {roleOrder.map(role => (
                            <label key={role} style={{ marginRight: '10px', marginLeft: "6px", fontWeight: 500 }}>
                              <input
                                type="checkbox"
                                checked={r.backupRoles?.includes(role)}
                                onChange={e => {
                                  const updated = [...result];
                                  const currentBackups = updated[idx].backupRoles || [];
                                  if (e.target.checked) {
                                    updated[idx].backupRoles = [...new Set([...currentBackups, role])];
                                  } else {
                                    updated[idx].backupRoles = currentBackups.filter(r => r !== role);
                                  }
                                  setResult(updated);
                                }}
                                disabled={role === r.mainRole}
                                style={{ marginRight: "2px" }}
                              />
                              {roleToKorean[role]}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: "0.97rem" }}>
                    <span>주 역할: <strong>{roleToKorean[r.mainRole]}</strong></span>
                    <span style={{ marginLeft: "10px" }}>
                      보조 역할: <strong>{
                        Array.isArray(r.backupRoles)
                          ? r.backupRoles.map(role => roleToKorean[role] || role).join(', ')
                          : '정보 없음'
                      }</strong>
                    </span>
                  </div>
                )}
                <div style={{ marginTop: "2px", fontWeight: 700, color: "#6366f1" }}>
                  총점: {r.totalScore}점
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 오른쪽: 팀 결과 및 시나리오 */}
        <section style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
          padding: "32px 28px",
          width: "750px",
          minWidth: "340px"
        }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>3. 팀 구성 결과</h2>
          <button
            disabled={!canClick}
            className={canClick ? "CanClick" : "DisabledClick"}
            onClick={handleMakeTeams}
            style={{
              width: "100%",
              height: "50px",
              background: canClick ? "#22c55e" : "#d1d5db",
              color: canClick ? "white" : "#6b7280",
              border: "none",
              borderRadius: "8px",
              padding: "12px 0",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: canClick ? "pointer" : "not-allowed",
              marginBottom: "16px",
              transition: "background 0.2s"
            }}
          >
            팀 자동 구성
          </button>
          {teamResult && teamResult.fallbackUsed ? (
            <div style={{ marginTop: '10px', color: '#ef4444', fontWeight: 600, fontSize: "1rem" }}>
              ⚠️ 라인 포지션 충돌로 인해, 실력 점수 균형 기준으로 팀이 자동 배정되었습니다.<br />
              (라인 밸런스 부족으로 인한 예외 상황)
            </div>
          ) : teamResult &&
            <div style={{ marginTop: '10px', color: '#22c55e', fontWeight: 600, fontSize: "1rem" }}>
              ✅ 라인과 실력점수의 균형을 기준으로 팀이 구성되었습니다.
            </div>
          }
          {teamResult?.teamA && (
            <div style={{ marginTop: "18px" }}>
              <h3 style={{ color: "#6366f1", fontWeight: 700 }}>팀 A <span style={{ color: "#64748b", fontWeight: 500 }}>(총점: {teamResult.teamAScore})</span></h3>
              <ul style={{ paddingLeft: "18px", marginBottom: "12px" }}>
                {[...teamResult.teamA]
                  .sort((a, b) => roleOrder.indexOf(a.assignedRole) - roleOrder.indexOf(b.assignedRole))
                  .map((p, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>
                      <span style={{ fontWeight: 600 }}>{p.name}#{p.tag}</span>
                      <span style={{
                        background: "#e0e7ff",
                        color: "#6366f1",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        marginLeft: "8px",
                        fontSize: "0.98rem"
                      }}>
                        {roleToKorean[p.assignedRole] || p.assignedRole}
                      </span>
                      <span style={{ marginLeft: "8px", color: "#64748b" }}>
                        {tierToKorean[p.tier]} ({p.totalScore}점)
                      </span>
                      {p.mainRole && p.assignedRole === p.mainRole
                        ? <span style={{ color: "#22c55e", marginLeft: "8px" }}>✅ 주 포지션</span>
                        : p.mainRole
                          ? <span style={{ color: "#fbbf24", marginLeft: "8px" }}>⚠️ 부 포지션 (주: {roleToKorean[p.mainRole] || p.mainRole})</span>
                          : ""}
                    </li>
                  ))}
              </ul>
              <h3 style={{ color: "#6366f1", fontWeight: 700 }}>팀 B <span style={{ color: "#64748b", fontWeight: 500 }}>(총점: {teamResult.teamBScore})</span></h3>
              <ul style={{ paddingLeft: "18px" }}>
                {[...teamResult.teamB]
                  .sort((a, b) => roleOrder.indexOf(a.assignedRole) - roleOrder.indexOf(b.assignedRole))
                  .map((p, idx) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>
                      <span style={{ fontWeight: 600 }}>{p.name}#{p.tag}</span>
                      <span style={{
                        background: "#e0e7ff",
                        color: "#6366f1",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        marginLeft: "8px",
                        fontSize: "0.98rem"
                      }}>
                        {roleToKorean[p.assignedRole] || p.assignedRole}
                      </span>
                      <span style={{ marginLeft: "8px", color: "#64748b" }}>
                        {tierToKorean[p.tier]} ({p.totalScore}점)
                      </span>
                      {p.mainRole && p.assignedRole === p.mainRole
                        ? <span style={{ color: "#22c55e", marginLeft: "8px" }}>✅ 주 포지션</span>
                        : p.mainRole
                          ? <span style={{ color: "#fbbf24", marginLeft: "8px" }}>⚠️ 부 포지션 (주: {roleToKorean[p.mainRole] || p.mainRole})</span>
                          : ""}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* 더미 데이터/시나리오 버튼 */}
          <div style={{
            marginTop: "30px",
            background: "#f3f4f6",
            borderRadius: "10px",
            padding: "12px 10px"
          }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#6366f1", fontWeight: 700, fontSize: "1.05rem" }}>테스트/시나리오</h4>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px"
            }}>
              <button onClick={() => setResult([])} style={dummyBtnStyle()}>초기화</button>
              <button onClick={injectDummyData} style={dummyBtnStyle()}>더미 데이터</button>
              <button onClick={() => dummyScenarios.injectDummyData_JungleOverload(setResult, setCanClick)} style={dummyBtnStyle()}>정글 5명</button>
              <button onClick={() => dummyScenarios.injectDummyData_NoBackups(setResult, setCanClick)} style={dummyBtnStyle()}>백업 없음</button>
              <button onClick={() => dummyScenarios.injectDummyData_UnbalancedScore(setResult, setCanClick)} style={dummyBtnStyle()}>점수 불균형</button>
              <button onClick={() => dummyScenarios.injectDummyData_MissingRoles(setResult, setCanClick)} style={dummyBtnStyle()}>역할 없음</button>
              <button onClick={() => dummyScenarios.injectDummyData_PotentialDuplicateInTeam(setResult, setCanClick)} style={dummyBtnStyle()}>역할 중복</button>
              <button onClick={() => dummyScenarios.injectDummyData_OnlyOneSupport(setResult, setCanClick)} style={dummyBtnStyle()}>서폿 1명</button>
              <button onClick={() => dummyScenarios.injectDummyData_NoMid(setResult, setCanClick)} style={dummyBtnStyle()}>미드 없음</button>
              <button onClick={() => dummyScenarios.injectDummyData_AllUnranked(setResult, setCanClick)} style={dummyBtnStyle()}>언랭크 10명</button>
              <button onClick={() => dummyScenarios.injectDummyData_AllSameTierButRandomRoles(setResult, setCanClick)} style={dummyBtnStyle()}>동일티어/랜덤역할</button>
              <button onClick={() => dummyScenarios.injectDummyData_HardFallbackRequired(setResult, setCanClick)} style={dummyBtnStyle()}>팀 구성 불가</button>
              <button onClick={() => dummyScenarios.injectDummyData_NormalMatch1(setResult, setCanClick)} style={dummyBtnStyle()}>일반매칭1</button>
              <button onClick={() => dummyScenarios.injectDummyData_NormalMatch2(setResult, setCanClick)} style={dummyBtnStyle()}>일반매칭2</button>
              <button onClick={() => dummyScenarios.injectDummyData_OneTeamOverloaded(setResult, setCanClick)} style={dummyBtnStyle()}>한팀 과부하</button>
            </div>
          </div>
        </section>
      </main>
    </div>
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(99,102,241,0.12)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img src="https://media.tenor.com/0r1a2g3b4eMAAAAC/loading.gif" alt="Loading..." style={{ width: "80px" }} />
          <p style={{ color: "#6366f1", fontWeight: 700, fontSize: "1.2rem", marginTop: "12px" }}>분석 중입니다... 잠시만 기다려주세요!</p>
        </div>
      )}
    </div>
  );

  // 버튼 스타일 공통
  function dummyBtnStyle() {
    return {
      background: "#e0e7ff",
      color: "#6366f1",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      fontWeight: 600,
      fontSize: "0.97rem",
      cursor: "pointer",
      marginBottom: "2px",
      transition: "background 0.2s"
    };
  }
}

export default SearchPlayer;
