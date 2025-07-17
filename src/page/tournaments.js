import React, { useEffect, useState } from "react";
import Headers from "../component/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer";
import LoadingOverlay from "../component/LodingOverlay";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

export default function Tournaments() {
  const navigate = useNavigate();

  const [enable, setEnable] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentCode, setTournamentCode] = useState("");
  const [allTournaments, setAllTournaments] = useState([]);
  const [recentTournament, setRecentTournament] = useState({});

  const [adminID, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [checkAdminPassword , setCheckAdminPassword] = useState("")
  const [allowTournamentName , setAllowTournamentName] = useState(false)
  const [allowPassword , setAllowPassword] = useState(false)
  const [allowCheckPassword , setAllowCheckPassword] = useState(false)
  const [allowId , setAllowId] = useState(false)
  const [allow , setAllow] = useState(false)

  // 자동 입장
  useEffect(() => {
    const savedCode = localStorage.getItem("tournamentCode");
    if (savedCode) navigate(`/tournament/tournaments/${savedCode}`);
  }, []);

  // 최근 생성 토너먼트 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("makeNumber");
    if (saved) {
      try {
        setRecentTournament(JSON.parse(saved));
      } catch {
        setRecentTournament({});
      }
    }
  }, []);

  // 전체 토너먼트 조회
  useEffect(() => {
    fetch(`${BASE_URL}/tournament/tournaments`)
      .then((res) => res.json())
      .then(setAllTournaments)
      .catch((err) => console.error("전체 토너먼트 조회 실패", err));
  }, []);

  useEffect(() => {
  if (checkAdminPassword && adminPassword !== checkAdminPassword) {
    setAllow(true);
  } else {
    setAllow(false);
  }
}, [adminPassword, checkAdminPassword]);

  // 생성 요청
  const handleCreateTournament = async () => {

  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(adminID)) {
    alert("관리자 아이디는 영문자나 숫자로 입력해주세요.");
    return;           
  }

  if(!tournamentName){
    setAllowTournamentName(true)
    return
  }

  if(!adminID){
    setAllowTournamentName(false)
    setAllowId(true)
    return
  }
    if(!adminPassword){
    setAllowPassword(true)
    setAllowId(false)
    return
  }
    if(!checkAdminPassword){
    setAllowPassword(false)
    setAllowCheckPassword(true)
    return
  }

  if(allow){
    return
  }

    const res = await fetch(`${BASE_URL}/tournament/tournaments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tournamentName,
        adminId: adminID,
        adminPassword: adminPassword,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      alert(`생성 완료! 참가코드: ${data.id}`);
      localStorage.setItem("makeNumber", JSON.stringify({ id: data.id, name: data.name }));
      navigate(`/tournament/tournaments/${data.id}`);
    } else {
      alert("생성 실패");
    }
    setEnable(false);
  };

  // 참가 요청
const [loading, setLoading] = useState(false);

const handleJoinTournament = async () => {
  if (loading) return;
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentCode}`);
    if (res.ok) {
      localStorage.setItem("tournamentCode", tournamentCode);
      navigate(`/tournament/tournaments/${tournamentCode}`);
    } else {
      alert("없는 참가 코드거나 만료된 코드입니다.");
    }
  } catch (err) {
    console.error("서버 연결 실패:", err);
    alert("서버에 연결할 수 없습니다. 잠시후에 다시 시도해주세요.");
  } finally {
    setLoading(false);
  }
};


const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #555",
  backgroundColor: "#1f2235",
  color: "#fff",
  fontSize: "1rem",
  width: "400px"
};

const inputStyle2 = {
  ...inputStyle,
  width: "270px",
  marginRight: "5px"
};

const inputwarning = {
  ...inputStyle,
  border : "1px solid red"
}
const primaryBtn = {
  padding: "10px 20px",
  background: "#c7a008",  // 골드 포인트
  color: "#000",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const primaryBtn2 = {
  ...primaryBtn,
  width : "80%"
}


const secondaryBtn = {
  ...primaryBtn,
  background: "#d1d5db",
  color: "#1f2937",
};

const cardStyle = {
  background: "#26293a", // 어두운 카드 배경
  color: "#eee",         // 밝은 텍스트
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  width: "400px",
  marginBottom: "30px",
};

const cardStyle2 = {
  ...cardStyle,
    display : "flex",
  flexDirection: "column",
  alignItems : "center"
}
const cardTitle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "12px",
};



  return (
    <>
    {loading && <LoadingOverlay />}
<Headers />
<div style={{
  background: "linear-gradient(135deg,rgb(44, 44, 78) 0%,rgb(55, 58, 95) 100%)",
  minHeight: "100vh",
  paddingTop: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white"
}}>

  <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px"  }}>내전 / 토너먼트 관리</h1>

  {/* 생성 섹션 */}
  <div style={cardStyle2}>
    {!enable ? (
      <button
        onClick={() => setEnable(true)}
        style={primaryBtn2}
      >
        내전 / 토너먼트 생성하기
      </button>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      <span>토너먼트 이름 </span>
        <input
          type="text"
          placeholder="토너먼트 이름"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          style={allowTournamentName ? inputwarning : inputStyle}
        />



        <span>관리자 아이디</span>
      <input
          type="text"
          placeholder="관리자 아이디"
          value={adminID}
          onChange={(e) => setAdminId(e.target.value)}
          style={allowId ? inputwarning : inputStyle}
        />  

        
        <span>비밀번호</span>
        <input
          type="password"
          placeholder="비밀번호"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          style={allowPassword ? inputwarning : inputStyle}
        />
        <span>비밀번호 확인 {allow && <span style={{color : "red" , marginLeft : "35%"}}> 비밀번호가 일치하지 않습니다.</span>}</span> 
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={checkAdminPassword}
          onChange={(e) => setCheckAdminPassword(e.target.value)}
          style={allowCheckPassword ? inputwarning : inputStyle}
        />
  

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={primaryBtn} onClick={handleCreateTournament}>생성 완료</button>
          <button style={secondaryBtn} onClick={() => {
            setEnable(false); 
            setAllow(false);  
            setAllowId(false)
            setAllowPassword(false)
            setAllowCheckPassword(false)
            setAllowTournamentName(false)
            }}>취소</button>
        </div>
      </div>
    )}
  </div>

  {/* 최근 생성 토너먼트 */}
  <div style={cardStyle}>
    <h2 style={cardTitle}>최근 생성한 토너먼트</h2>
    {recentTournament.id ? (
      <>
        <p>이름: <strong>{recentTournament.name}</strong></p>
        <p>코드: <strong>{recentTournament.id}</strong></p>
      </>
    ) : (
      <p>최근 생성하신 토너먼트가 없습니다.</p>
    )}
  </div>

  {/* 전체 토너먼트 목록 */}
  <div style={cardStyle}>
    <h2 style={cardTitle}>전체 토너먼트 목록</h2>
 
    {allTournaments.length === 0 ? (
      <p>등록된 토너먼트가 없습니다.</p>
    ) : (
      <div style={{
            maxHeight: "150px",
            overflowY: "auto",
            background: "#1f2235", // 어두운 박스
            color: "#ddd",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #444"
          }}>
        <ul style={{ margin: 0, paddingLeft: "16px" }}>
          {allTournaments.map((t, idx) => (
            <li key={idx}>{t.name} (ID: {t.id})</li>
          ))}
        </ul>
      </div>
    )}
  </div>

  {/* 참가하기 섹션 */}
  <div style={{ ...cardStyle, marginBottom: "80px" }}>
    <h2 style={cardTitle}>토너먼트 참가</h2>
    <input
      type="text"
      placeholder="참가 코드 입력"
      value={tournamentCode}
      onChange={(e) => setTournamentCode(e.target.value)}
      style={inputStyle2}
    />
    <button style={primaryBtn} onClick={handleJoinTournament}>참가하기</button>
  </div>
</div>

    </>
  );
}
