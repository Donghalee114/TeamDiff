// DetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminView from "../component/AdminView";
import UserView from "../component/UserView";
import LoadingOverlay from "../component/LodingOverlay"
import "../utils/AdminPage.css";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

export default function DetailPage({ tournamentsID }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [checkDelete, setCheckDelete] = useState(false);
  const [checkTournamentDelete, setCheckTournamentDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checkSetUpTeam, setCheckSetUpTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

    const emptyInputs = () => Array(5).fill(null).map(() => ({ name: '', puuid: '', role: 'MEMBER' }));

  const [memberInputs, setMemberInputs] = useState(emptyInputs());

  const [openTeamMake, setOpenTeamMake] = useState(false);

  useEffect(() => { CheckTeamList(); }, []);
  useEffect(() => {
    console.log("[DetailPage] tournamentsID:", tournamentsID);
  }, [tournamentsID, isAdmin]);

 
  const parseNameAndTag = (fullInput) => {
    const [name, tag] = fullInput.split('#');
    return { name: name?.trim() || '', tag: tag?.trim() || 'KR1' };
  };

  const checkAdmin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tournament/tournaments/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, adminPassword: adminPw })
      });
      if (res.ok) {
        setIsAdmin(true);
        alert("관리자 로그인 성공");
      } else alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    } catch (err) {
      console.error("관리자 확인 에러:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const CheckTeamList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentsID}/teams`);
      const data = await res.json();
      setTeamList(data);
    } catch (err) {
      console.error("팀 목록 에러:", err);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

const fetchTeamMembers = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}/tournament/teams/${teamId}/members`);
    const data = await res.json();
    const filled = Array(5).fill(null).map((_, idx) => {
    const d = data[idx];
    if (!d) return { name: '', puuid: '', role: 'MEMBER' };

  return {
    name: d.summonername || '',  // summonerName은 name + 태그로 다시 붙여도 됨
    puuid: d.leader_puuid || d.member_puuid || '',
    role: d.leader_puuid ? 'LEADER' : 'MEMBER'
  };
});
    setMemberInputs(filled);
  } catch (err) {
    console.error("팀 멤버 조회 실패:", err);
    setMemberInputs(Array(5).fill({ name: '', puuid: '', role: 'MEMBER' }));
  }
};

const handleSetTeam = async (teamId) => {
  setSelectedTeamId(teamId);
  await fetchTeamMembers(teamId); //  멤버 정보 불러오기
  setCheckSetUpTeam(true);        //  설정 UI 띄우기
};


  const handleRegisterMembers = async () => {
    const leaderCount = memberInputs.filter(m => m.role === 'LEADER').length;
    if (leaderCount > 1) return alert("리더는 한 명만 지정할 수 있습니다.");

    if (leaderCount === 0 ) return alert("리더를 지정해 주세요")

    const inputsWithPuuid = [];
    for (let m of memberInputs) {
      if (!m.name.includes('#')) continue;
      const { name, tag } = parseNameAndTag(m.name);

      try {
        const res = await fetch(`${BASE_URL}/summoner/${encodeURIComponent(name)}?tag=${encodeURIComponent(tag)}`);
        const data = await res.json();
        const summonerName = name + "#" + tag
        inputsWithPuuid.push({
          teamId: selectedTeamId,
          tournamentsID: tournamentsID,
          summonerName: summonerName,
          leader_puuid: m.role === 'LEADER' ? data.puuid : null,
          member_puuid: m.role === 'MEMBER' ? data.puuid : null,
          role: m.role
        });
      } catch (err) {
        alert(`${m.name} 정보를 가져오는 데 실패했습니다.`);
        return;
      }
    }

  try{
    await fetch(`${BASE_URL}/tournament/teams/${selectedTeamId}/members`, {
      method : "DELETE",
      headers: { "Content-Type": "application/json" },
    })
  }catch (err) {
    console.error("팀 삭제 에러: " , err)
  }


for (let m of inputsWithPuuid) {
  const res = await fetch(`${BASE_URL}/tournament/teams/${selectedTeamId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(m)
  });

  if (!res.ok) {
    const data = await res.json();
    alert(`등록 실패: ${data.error || "서버 오류"}`);
    return;
  }
}

    alert("등록 완료");
    setCheckSetUpTeam(false);
    setSelectedTeamId(null);
    setMemberInputs(emptyInputs());
  };

  const DeleteTeam = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}/tournament/${teamId}/teams`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("팀이 삭제되었습니다.");
      CheckTeamList(); // 삭제 후 목록 새로고침
    } else {
      alert("팀 삭제 실패");
    }
  } catch (error) {
    console.error("팀 삭제 에러:", error);
    alert("서버 오류가 발생했습니다.");
  }
};

const DeleteTournament = async (tournamentsID) => {
  try {
    const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentsID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("토너먼트가 삭제되었습니다.");
      localStorage.removeItem("tournamentCode");
      navigate("/tournament");
    } else {
      alert("토너먼트 삭제 실패");
    }
  } catch (error) {
    console.error("토너먼트 삭제 에러:", error);
    alert("서버 오류가 발생했습니다.");
  }
};

const joinTeam = () => {
  alert(`팀 코드 ${selectedTeamId}로 가입 시도 (기능 구현 예정)`);
};


  return (
    <div style={{ padding: "32px", fontFamily: "Arial", maxWidth: "1000px", margin: "auto" }}>
      {loading && <LoadingOverlay />}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button onClick={() => setIsAdmin(p => !p)}>Admin Test</button>
      </div>

      {isAdmin ? (
        <AdminView
          {...{
            openTeamMake, setOpenTeamMake,
            teamList, CheckTeamList,teamCode,
            setSelectedTeamId, setCheckSetUpTeam, fetchTeamMembers,
            selectedTeamId, checkSetUpTeam, memberInputs, setMemberInputs,
            handleRegisterMembers, checkDelete, setCheckDelete,
            DeleteTeam, checkTournamentDelete, setCheckTournamentDelete,
            DeleteTournament, tournamentsID, id , handleSetTeam , setLoading
            

          }}
        />
      ) : (
        <UserView {...{ setLoading ,teamList , CheckTeamList ,selectedTeamId, setTeamCode, joinTeam, adminId, setAdminId, adminPw, setAdminPw, checkAdmin , teamCode }} />
      )}
    </div>
  );
}
