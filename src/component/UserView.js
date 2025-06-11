import { useState, useEffect } from "react";

export default function UserView({ setLoading , teamList ,CheckTeamList ,selectedTeamId, teamCode, setTeamCode, joinTeam, adminId, setAdminId, adminPw, setAdminPw, checkAdmin }) {
  const [teamInfo, setTeamInfo] = useState([]);
  const [teamMember , setTeamMember] = useState([])
  const [warning , setWarning] = useState(false)
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";


const fetchTeamByCode = async (id) => {
  setLoading(true)
  setWarning(true)
  if (!teamCode) {
    alert("팀 코드를 입력하세요.");
    setLoading(false)
    return;
  }


  try{
    const res1 = await fetch(`${BASE_URL}/tournament/${id}/teams`)
    const data = await res1.json();

    if (res1.ok) {
    setTeamInfo(data)
    console.log("팀 조회: ", data)
    }

  }catch (err) {
    console.error("에러 : ",err)
  }finally {setLoading(false)}



  try {
    const res = await fetch(`${BASE_URL}/tournament/teams/${id}/members`);
    const data = await res.json();

    if (res.ok) {
      console.log("팀 정보:", data);
      setTeamMember(data)
      return data;
    } else {
      alert(data.error || "팀 조회 실패");
    }
  } catch (error) {
    console.error("팀 조회 에러:", error);
    alert("팀 조회 중 오류 발생");
  }
};

  const inputStyle = {
    width: "100%", padding: "8px", marginBottom: "10px",
    borderRadius: "6px", border: "1px solid #d1d5db"
  };
  const buttonStyle = {
    backgroundColor: "#6366f1", color: "white", padding: "8px 16px",
    borderRadius: "6px", border: "none", cursor: "pointer"
  };

  return (
    <div>
      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb"  ,  marginBottom : "20px"}}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>팀 목록</h2>
          <button onClick={CheckTeamList} style={{ backgroundColor: "#6366f1", color: "white" ,height : "45px" ,  borderRadius: "8px" }}>새로고침</button>
        </div>
        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {teamList.map((t, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "white", borderRadius: "8px", padding: "12px", border: "1px solid #e5e7eb" }}>
              <img src={t.logourl} alt="로고" width="64" height="64" style={{ borderRadius: "8px" }} />
              <div>
                <strong>{t.name}</strong>
                <p>팀 코드: {t.id}</p>
                <p>승률: {t.totalmatches > 0 ? `${((t.wincount / t.totalmatches) * 100).toFixed(1)}%` : '0%'}</p>
              </div>
              
            </div>
          ))}
        </div>
      </section>


      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
        <h2>팀 세부 정보</h2>
        <input
          placeholder="팀 코드 입력"
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
          style={inputStyle}
        />
        <button style={buttonStyle} onClick={() => fetchTeamByCode(teamCode)}>조회</button>

{teamMember.length !== 0 ? (
  <div>
    {teamInfo?.name && (
      <div style={{ marginTop: "10px", backgroundColor: "#eef2ff", padding: "12px", borderRadius: "8px" }}>
        <p><strong>팀 이름:</strong> {teamInfo.name}</p>
        <p><strong>토너먼트:</strong> {teamInfo.tournament_name || "없음"}</p>
        <p><strong>팀원:</strong></p>
        <ul>
          {teamMember.map((m, i) => (
            <li key={i}>
              {m.summonername} - {m.leader_puuid ? "리더" : "멤버"}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
) : (
  warning ? <div style={{fontSize : "20px" , color : "red" , fontWeight : "700"}}>잘못된 팀 코드거나 서버 오류가 발생하였습니다. 다시 시도해주세요</div> : null
)}
      </section>

      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb", marginTop: "16px" }}>
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
