// AdminView.jsx
import { useEffect } from "react";
import CreateTeam from "../component/createTeam";
import Modal from "../component/modal";
import "../utils/AdminPage.css";

export default function AdminView({
  openTeamMake, setOpenTeamMake,
  teamList, CheckTeamList,
  setSelectedTeamId, setCheckSetUpTeam, fetchTeamMembers,
  selectedTeamId, checkSetUpTeam, memberInputs, setMemberInputs,
  handleRegisterMembers, checkDelete, setCheckDelete,
  DeleteTeam, checkTournamentDelete, setCheckTournamentDelete,
  DeleteTournament, tournamentsID, id , handleSetTeam
}) {
  const inputStyle = {
    flex: 1,
    height: '32px',
    border:   '1.5px solid #444',
    borderRadius: "6px",
    backgroundColor: '#1f2235',
    color: "#fff",
    padding: "0 8px",
    fontSize: "0.95rem",
    width : "95%",
    marginBottom : "10px"
  };
    const inputStyle2 = {
      ...inputStyle,
      width : "100%"
  };

  const DEFAULT_LINES = ["TOP", "JUG", "MID", "BOT", "SUP"];


  useEffect(() => {
    console.log("selectedTeamId:", selectedTeamId);
    console.log("checkSetUpTeam:", checkSetUpTeam);
  }, [])

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "14px" }}>
      <h1 style={{ marginTop : "-40px" , fontSize: "1.8rem", marginBottom: "0px", color: "#4f46e5", textAlign: "center" }}>관리자 대시보드</h1>

      {/* 팀 생성 */}
      <section style={{cursor : "pointer" , marginTop : "20px" }} className={openTeamMake ? "admin-section-on" : "admin-section"} onClick={() => !openTeamMake && setOpenTeamMake(true)}>
        {!openTeamMake && <h2>팀 생성</h2>}
        {openTeamMake && <CreateTeam setOpenTeamMake={setOpenTeamMake} tournamentsID={tournamentsID} />}
      </section>

      {/* 팀 리스트 */}
      <section style={{maxHeight : "500px" ,overFlow : "hidden"}} className="admin-section">
        <div className="section-header">
          <h2>팀 목록</h2>
          <button className="refresh-button" onClick={CheckTeamList}>새로고침</button>
        </div>
        <div className="team-list">
          {teamList.map((t, idx) => (
            <div key={idx} className="team-card">
              <div>
                팀 이름 : <strong>{t.name}</strong>
                <p>팀 코드: {t.id}</p>
                <p>승률: {t.totalmatches > 0 ? `${((t.wincount / t.totalmatches) * 100).toFixed(1)}%` : '0%'}</p>
              </div>
              <div className="team-buttons">
                <button onClick={() => handleSetTeam(t.id)}>선수 관리</button>
                <button className="delete-button" onClick={() => setCheckDelete(true)}>삭제</button>
                {checkDelete && <Modal title="정말 삭제하시겠습니까?" onConfirm={() => DeleteTeam(t.id)} onCancel={() => setCheckDelete(false)} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 선수 관리 모달 */}
{selectedTeamId && checkSetUpTeam && (
  <div className="modal-overlay" >
    <div className="modal-box">
      <h2>팀 멤버 등록</h2>
      {memberInputs.map((input, idx) => (
        <div key={idx} style={{ marginBottom: "12px" }}>
          <input placeholder="소환사이름#태그" value={input.name} onChange={e => {
            const newInputs = [...memberInputs];
            newInputs[idx].name = e.target.value;
            setMemberInputs(newInputs);
          }} style={inputStyle} />

          <select value={input.role} onChange={e => {
            const newInputs = [...memberInputs];
            newInputs[idx].role = e.target.value;
            setMemberInputs(newInputs);
          }} style={inputStyle2}>
            <option value="MEMBER">MEMBER</option>
            <option value="LEADER">LEADER</option>
          </select>

          <select value={input.line} onChange={e => {
            const newInputs = [...memberInputs];
            newInputs[idx].line = e.target.value;
            setMemberInputs(newInputs);
          }} style={inputStyle2}>
            <option value="TOP">TOP</option>
            <option value="JUG">JUNGLE</option>
            <option value="MID">MID</option>
            <option value="BOT">BOTTOM</option>
            <option value="SUP">SUPPORT</option>
          </select>
        </div>
      ))}

      {memberInputs.length < 8 && (
        <button
          style={{ marginBottom: "px" }}
          onClick={() => {
            const defaultLine = DEFAULT_LINES[memberInputs.length] || "TOP";
            setMemberInputs([
              ...memberInputs,
              { name: '', puuid: '', role: 'MEMBER', line: defaultLine }
            ]);
          }}
        >
          + 멤버 추가
          
        </button>
      )}

      <div className="modal-buttons">
        <button onClick={handleRegisterMembers}>등록</button>
        <button onClick={() => {
          setCheckSetUpTeam(false);
          setSelectedTeamId(null);
          setMemberInputs(Array(5).fill(null).map((_, idx) => ({
            name: '',
            puuid: '',
            role: 'MEMBER',
            line: DEFAULT_LINES[idx]
          })));
        }}>
          취소
        </button>
      </div>
    </div>
  </div>
)}


      {/* 토너먼트 삭제 */}
      <section className="admin-section">
        <h2>토너먼트 삭제</h2>
        <button className="delete-button" onClick={() => setCheckTournamentDelete(true)}>토너먼트 삭제</button>
        {checkTournamentDelete && <Modal title="토너먼트를 정말 삭제하시겠습니까?" onConfirm={() => DeleteTournament(id)} onCancel={() => setCheckTournamentDelete(false)} />}
      </section>
    </div>
  );
}
