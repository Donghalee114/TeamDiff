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
    width: "100%", padding: "8px", marginBottom: "10px",
    borderRadius: "6px", border: "1px solid #d1d5db"
  };

  useEffect(() => {
  console.log("selectedTeamId:", selectedTeamId);
console.log("checkSetUpTeam:", checkSetUpTeam);
  }, [])


  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#4f46e5" }}>관리자 대시보드</h1>

      {/* 팀 생성 */}
      <section className={openTeamMake ? "" : "MakeTeam"} onClick={() => !openTeamMake && setOpenTeamMake(true)} style={{ marginBottom: "15px" }}>
        {!openTeamMake && <h2>팀 생성</h2>}
        {openTeamMake && <CreateTeam setOpenTeamMake={setOpenTeamMake} tournamentsID={tournamentsID} />}
      </section>

      {/* 팀 리스트 */}
      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
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
              <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => handleSetTeam(t.id)}>선수 관리</button>

                <button onClick={() => setCheckDelete(true)} style={{ backgroundColor: "#ef4444", color: "white" }}>삭제</button>
                {checkDelete && <Modal title="정말 삭제하시겠습니까?" onConfirm={() => DeleteTeam(t.id)} onCancel={() => setCheckDelete(false)} />}
              </div>
            </div>
          ))}
        </div>
      </section>
      

      {/* 선수 관리 모달 */}
      {selectedTeamId && checkSetUpTeam && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", width: "400px" }}>
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
                }} style={inputStyle}>
                  <option value="MEMBER">MEMBER</option>
                  <option value="LEADER">LEADER</option>
                </select>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleRegisterMembers}>등록</button>
              <button onClick={() => {
                setCheckSetUpTeam(false);
                setSelectedTeamId(null);
                setMemberInputs(Array(5).fill({ name: '', puuid: '', role: 'MEMBER' }));
              }}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 토너먼트 삭제 */}
      <section style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
        <h2>토너먼트 삭제</h2>
        <button onClick={() => setCheckTournamentDelete(true)} style={{ backgroundColor: "#ef4444", color: "white", padding: "6px 12px", borderRadius: "8px" }}>토너먼트 삭제</button>
        {checkTournamentDelete && <Modal title="토너먼트를 정말 삭제하시겠습니까?" onConfirm={() => DeleteTournament(id)} onCancel={() => setCheckTournamentDelete(false)} />}
      </section>
    </div>
  );
}
