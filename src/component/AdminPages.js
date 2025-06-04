import { useState, useEffect } from "react";

import { useParams , useNavigate} from "react-router-dom";
import CreateTeam from "../component/createTeam"
import Modal from "../component/modal"

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

export default function DetailPage({tournamentsID}) {
  const navigate = useNavigate()
  const { id } = useParams(); // 토너먼트 ID
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamList , setTeamList] = useState([])
  const [checkDelete , setCheckDelete] = useState(false)
  const [checkTournamentDelete , setCheckTournamentDelete] = useState(false)

  const [openTeamMake , setOpenTeamMake] = useState(false)

  const testAdmin = () => setIsAdmin(prev => !prev);
  const testTeam = () => setHasTeam(prev => !prev);

  useEffect(() => {
  console.log(`======================================`)
  console.log('[DetailPage] tournamentsID:', tournamentsID);
  console.log('[DetailPage] HasTeam:', hasTeam);
  console.log('[DetailPage] ISAdmin:', isAdmin);
}, [tournamentsID , hasTeam , isAdmin]);


useEffect(() => {
  CheckTeamList()
}, [])

const TournamentDeleteCheck = () => {
  if(checkTournamentDelete) setCheckTournamentDelete(false)
  else setCheckTournamentDelete(true)
}

const DeleteCheck = () => {
  if(checkDelete) setCheckDelete(false);
  else setCheckDelete(true)
}
  // 관리자 확인 API 연동
  const checkAdmin = async () => {
    
    try {
      const res = await fetch(`${BASE_URL}/tournament/tournaments/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: adminId,
          adminPassword: adminPw,
        }),
      });

      if (res.ok) {
        setIsAdmin(true);
        alert("관리자 로그인 성공");
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("관리자 확인 에러:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

const DeleteTournament = async (tournamentsID) => {
  try{
    const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentsID}` , {
      method : "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok){
      alert("토너먼트가 삭제되었습니다.")
    localStorage.removeItem('tournamentCode'); 
    navigate('/tournament');
    }else {
      alert("삭제에 실패했습니다.")
    }
  } catch (error) {
    console.error("팀 삭제 에러", error);
    alert("서버 오류가 발생했습니다.");
  }
}

const DeleteTeam = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}/tournament/${teamId}/teams`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("팀이 삭제되었습니다.");
      CheckTeamList(); // 삭제 후 팀 목록 갱신
    } else {
      alert("삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("팀 삭제 에러", error);
    alert("서버 오류가 발생했습니다.");
  }
};



const CheckTeamList = async () => {

  try {
    const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentsID}/teams`, {
      method : "GET",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    console.log("팀 리스트 :" ,data)
    setTeamList(data);
      
  } catch (error) {
    console.error("팀 목록 에러" , error)
    alert("서버 오류가 발생했습니다.")
  }
}

  const makeTeam = () => {
    if(openTeamMake)
      {setOpenTeamMake(false)}
    else
    {setOpenTeamMake(true)}
  };

  const joinTeam = () => {
    alert(`팀 코드 ${teamCode}로 가입 시도 (추후 구현)`);
  };

  const titleStyle = {
  fontSize: "2rem",
  marginBottom: "20px",
  color: "#4f46e5"
};

const subtitleStyle = {
  fontSize: "1.2rem",
  marginBottom: "12px",
  
};

const cardStyle = {
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  backgroundColor: "#f9fafb"
};

const teamCardStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  padding: "12px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  backgroundColor: "white"
};

const buttonStyle = {
  backgroundColor: "#6366f1",
  color: "white",
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
  , textAlign : "center"
};

const buttonDangerStyle = {
  ...buttonStyle,
  backgroundColor: "#ef4444"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #d1d5db"
};

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "auto" }}>
  <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end", gap: "10px"  }}>
    <button style={buttonStyle} onClick={testAdmin}>Admin Test</button>
    <button style={buttonStyle} onClick={testTeam}>Team Test</button>
  </div>

  {isAdmin ? (
    <div>
      <h1 style={titleStyle}> 관리자 대시보드</h1>

      {/* 팀 생성 */}
      <section style={cardStyle}>
        <div style={{cursor : "pointer", display : "flex" , justifyContent : "center" , alignItems : "center" , gap : "240px"}} onClick={makeTeam}>
        
        {openTeamMake ? <></> :
        <>
        <h2 style={subtitleStyle}> 팀 생성</h2>
        </>
      }
        </div>
        
        {openTeamMake && <CreateTeam setOpenTeamMake={setOpenTeamMake} tournamentsID={tournamentsID} />}
      </section>

      {/* 팀 리스트 */}
      <section style={cardStyle}>
        <span style={{display : "flex" , justifyContent : "center" , alignItems : "center" }}><h2 style={subtitleStyle}> 팀 목록</h2> 
        <h2
          onClick={CheckTeamList}
         style={{cursor : "pointer"  , padding : "10px", background : "#6366f1" , color : "white" ,borderRadius : "16px", marginLeft : "240px" ,  ...subtitleStyle}}
        >
          새로고침
        </h2>
        
        </span>
        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {teamList.map((t, idx) => (
            <div key={idx} style={teamCardStyle}>
              <img src={t.logourl} alt="로고" width="64" height="64" style={{ borderRadius: "8px" }} />
              <div>
                <strong>{t.name}</strong>
                <p>팀 코드: {t.id}</p>
                <p>경기 수: {t.totalmatches} | 승리: {t.wincount} | 승률: {
                  t.totalmatches > 0
                    ? `${((t.wincount / t.totalmatches) * 100).toFixed(1)}%`
                    : "0%"
                }</p>
              </div>
              <div style={{display : "flex" , flexDirection : "column" , marginLeft : "250px"}}>
              <button style={buttonStyle}>선수 관리</button>
              <button style={buttonDangerStyle} onClick={DeleteCheck}>삭제</button>
              </div>
              {checkDelete && (
                <Modal
                  title="정말 삭제하시겠습니까?"
                  onConfirm={() => DeleteTeam(t.id)}
                  onCancel={() => setCheckDelete(false)}
                />
              )}
              
            </div>
          ))}
        </div>
      </section>

      {/* 토너먼트 삭제 */}
      <section style={cardStyle}>
        <h2 style={subtitleStyle}> 토너먼트 삭제</h2>
        <button style={buttonDangerStyle} onClick={TournamentDeleteCheck}>토너먼트 삭제</button>
        {checkTournamentDelete && (
          <Modal
            title="토너먼트를 정말 삭제하시겠습니까?"
            onConfirm={() => DeleteTournament(id)}
            onCancel={() => setCheckTournamentDelete(false)}
          />
        )}
      </section>
    </div>
  ) : (
    <div>
      {!hasTeam ? (
        <section style={cardStyle}>
          <h2 style={subtitleStyle}> 팀 가입</h2>
          <input
            placeholder="팀 코드 입력"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={joinTeam}>팀 가입</button>
        </section>
      ) : (
        <section style={cardStyle}>
          <h2>팀 정보 (준비 중)</h2>
        </section>
      )}

      <section style={cardStyle}>
        <h2 style={subtitleStyle}> 관리자 로그인</h2>
        <label>아이디</label>
        <input value={adminId} onChange={(e) => setAdminId(e.target.value)} style={inputStyle} />
        <label>비밀번호</label>
        <input type="password" value={adminPw} onChange={(e) => setAdminPw(e.target.value)} style={inputStyle} />
        <button style={buttonStyle} onClick={checkAdmin}>로그인</button>
      </section>
    </div>
  )}
</div>

  );
}
