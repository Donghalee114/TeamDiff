import React, { useState } from 'react';
import SummonerStoragePopup from './summonerPopUp';

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

export default function ScoreDisplay({ result, setResult }) {
  const [positionMode, setPositionMode] = useState('auto');
  const [showRoles, setShowRoles] = useState(Array(result.length).fill(false));

  const getRoleDistribution = () => {
    const roleCount = { TOP: 0, JUNGLE: 0, MIDDLE: 0, BOTTOM: 0, UTILITY: 0 };
    result.forEach(p => {
      if (p.mainRole && roleCount[p.mainRole] !== undefined) {
        roleCount[p.mainRole]++;
      }
    });
  
    return roleCount;
  };

  const roleDistribution = getRoleDistribution();

  const getDuplicatedMainRoles = () => {
  const count = {};
  result.forEach(p => {
    if (p.mainRole) {
      count[p.mainRole] = (count[p.mainRole] || 0) + 1;
    }
  });
  // 중복된 포지션만 리턴
  return Object.keys(count).filter(role => count[role] > 1);
};

const duplicatedRoles = getDuplicatedMainRoles();

  

  return (
    <section style={{
      position: "relative",
      top : "-38px",
      background: "white",
       borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
      padding: "32px 28px",
      width: "650px",
      minWidth: "440px",
      height: "765px",
      maxHeight: "770px",
    }}>
      <h2 style={{ zIndex : 100 , fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>
        2. 소환사 점수 및 포지션
      </h2>
     
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
      {positionMode === 'manual' && duplicatedRoles.length > 0 && (
    <div style={{
      backgroundColor: '#fef3c7',
      color: '#92400e',
      padding: '10px 12px',
      borderRadius: '8px',
      marginBottom: '12px',
      fontWeight: 600,
      fontSize: "0.95rem"
    }}>
      주 포지션 중복 경고: {duplicatedRoles.map(role => roleToKorean[role]).join(', ')}에 중복된 인원이 있습니다.
    </div>
  )}
      <div style={{
        maxHeight: '540px',
        overflowY: 'auto',
        padding: '6px',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb'
      }}>
        {result.length === 0 && <p style={{ color: "#6b7280" }}>소환사 점수화 버튼을 눌러주세요</p>}
        {result.map((r, idx) => (
          <div key={idx} style={{
            backgroundColor: idx % 2 === 0 ? '#fff' : '#f3f4f6',
            padding: '12px 10px',
            marginBottom: '8px',
            borderRadius: '6px',
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700 }}>{r.name}#{r.tag}</span>
              <span style={{ background: "#6366f1", color: "white", borderRadius: "4px", padding: "2px 8px" }}>
                {tierToKorean[r.tier] || r.tier}
              </span>
              <span style={{ color: "#64748b" }}>({r.tierScore}점)</span>
            </div>
            <div style={{ fontSize: "0.95rem", marginTop: "4px" }}>
              승률 점수: <strong>{r.winScore}점</strong> | 승률: <strong>{r.winRate}%</strong> | 주 포지션: <strong>{roleToKorean[r.mainRole]}</strong> | 부포지션 : <strong>{r.backupRoles?.length ? r.backupRoles.map(role => roleToKorean[role]).join(', ') : '없음'}</strong>
           
            </div>
            
            {positionMode === 'manual' && (
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
                    marginTop: "6px"
                  }}
                >
                  
                  {showRoles[idx] ? '포지션 접기' : '포지션 설정'}
                </button>
                {showRoles[idx] && (
                  <div style={{ marginTop: "6px" }}>
                    <label>주 포지션:
                      <select
                        value={r.mainRole || ''}
                        onChange={e => {
                          const updated = [...result];
                          updated[idx].mainRole = e.target.value;
                          updated[idx].backupRoles = updated[idx].backupRoles?.filter(role => role !== e.target.value);
                          setResult(updated);
                        }}
                        style={{ marginLeft: "6px" }}
                      >
                        <option value="">선택 안함</option>
                        {roleOrder.map(role => (
                          <option key={role} value={role}>{roleToKorean[role]}</option>
                        ))}
                      </select>
                    </label>
                    <div style={{ marginTop: "6px" }}>
                      <label>부 포지션:</label>
                      {roleOrder.map(role => (
                        <label key={role} style={{ marginLeft: "10px" }}>
                          <input
                            type="checkbox"
                            checked={r.backupRoles?.includes(role)}
                            onChange={e => {
                              const updated = [...result];
                              const current = updated[idx].backupRoles || [];
                              if (e.target.checked) {
                                updated[idx].backupRoles = [...new Set([...current, role])];
                              } else {
                                updated[idx].backupRoles = current.filter(r => r !== role);
                              }
                              setResult(updated);
                            }}
                            disabled={role === r.mainRole}
                          />
                          {roleToKorean[role]}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <div style={{ marginTop: "6px", fontWeight: 700, color: "#6366f1" }}>총점: {r.totalScore}점</div>
          </div>
        ))}
      </div>
    </section>
  );
}
