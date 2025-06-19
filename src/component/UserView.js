import { useState, useEffect } from "react";

export default function UserView({ setLoading , teamList ,CheckTeamList ,selectedTeamId, teamCode, setTeamCode, joinTeam, adminId, setAdminId, adminPw, setAdminPw, checkAdmin }) {
  const [teamInfo, setTeamInfo] = useState([]);
  const [teamMember , setTeamMember] = useState([])
  const [warning , setWarning] = useState(false)
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";




  const inputStyle = {
    flex: 1,
    height: '32px',
    border:   '1.5px solid #444',
    borderRadius: "6px",
    backgroundColor: '#1f2235',
    color: "#fff",
    padding: "0 8px",
    fontSize: "0.95rem",
    width : "95%"
  };
  const buttonStyle = {
    backgroundColor: "#6366f1", color: "white", padding: "8px 16px",
    borderRadius: "6px", border: "none", cursor: "pointer"
  };

  useEffect(() => {
  if (!teamList.length) return;

  (async () => {
    try {
      const all = await Promise.all(
        teamList.map(t =>
          fetch(`${BASE_URL}/tournament/teams/${t.id}/members`)
            .then(r => r.json())
            .then(d => (d.members ?? d).map(m => ({ ...m, teamid: t.id })))
        )
      );
      setTeamMember(all.flat());
    } catch (e) {
      console.error("멤버 로드 실패", e);
    }
  })();
}, [teamList]);


  return (
    <div>
      <section style={{ borderRadius: "12px", padding: "20px",background: "linear-gradient(135deg, #1e293b, #334155)"  ,  marginBottom : "20px"}}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>팀 목록</h2>
          <button onClick={CheckTeamList} style={{ backgroundColor: "#6366f1", color: "white" ,height : "45px" ,  borderRadius: "8px" , marginBottom : "10px" }}>새로고침</button>
        </div>
        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {teamList.map(team => {
              const members = teamMember.filter(m => m.teamid === team.id);

              return (
                <div key={team.id} style={{ display: "flex", alignItems: "center", gap: "12px",  backgroundColor:" rgb(52, 61, 71)",  boxShadow:" 0 4px 16px rgba(0,0,0,0.3)", borderRadius: "8px", padding: "12px" }}>
                  <div style={{ flex: 1 }}>
                    팀 이름 : <strong>{team.name}</strong>
                    <p>팀 코드: {team.id}</p>
                    <p>승률: {team.totalmatches ? ((team.wincount / team.totalmatches) * 100).toFixed(1) + "%" : "0%"}</p>
                    <span>
                      경기 {team.totalmatches} | 승 {team.wincount} | 패 {team.losscount}
                    </span>
                  </div>

                  
                  <div style={{ flex: 1  , display : "flex" , flexDirection : "column" , alignItems : "start"}}>
                    <h4 style={{marginBottom : "1px"}}>팀 멤버</h4>
                    {members.length ? (
                      members.map(m => <span style={{}} key={m.id}>{m.summonername} {m.leader_puuid ? <span> 👑</span> : <></>}</span>)
                    ) : (
                      <span style={{marginBottom : "40px"}}>팀 멤버가 없습니다. 관리자에게 문의하세요</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>



      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor:" rgb(52, 61, 71)", marginTop: "16px" }}>
        <h2>관리자 로그인</h2>
        <label>아이디</label>
        <input value={adminId} onChange={(e) => setAdminId(e.target.value)} style={inputStyle} />
        <label>비밀번호</label>
        <input type="password" value={adminPw} onChange={(e) => setAdminPw(e.target.value)} style={inputStyle} />
        <button style={buttonStyle} onClick={checkAdmin}>로그인</button>
      </section>
    </div>
  );
}
