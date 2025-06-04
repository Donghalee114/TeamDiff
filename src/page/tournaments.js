import React, { useEffect, useState } from "react";
import Headers from "../component/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer";

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

  // 생성 요청
  const handleCreateTournament = async () => {
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
  const handleJoinTournament = async () => {
    const res = await fetch(`${BASE_URL}/tournament/tournaments/${tournamentCode}`);
    if (res.ok) {
      localStorage.setItem("tournamentCode", tournamentCode);
      navigate(`/tournament/tournaments/${tournamentCode}`);
    } else {
      alert("없는 참가 코드거나 만료된 코드입니다.");
    }
  };

  const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  width: "400px"
};


  const inputStyle2 = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  width: "270px",
  marginRight : "5px"
};

const primaryBtn = {
  padding: "10px 20px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#d1d5db",
  color: "#1f2937",
};

const cardStyle = {
  background: "#f9fafb",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "400px",
  marginBottom: "30px",
};

const cardTitle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "12px",
};


  return (
    <>
      <Headers />
      <div style={{ marginTop: "100px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
  <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px"  }}>내전 / 토너먼트 관리</h1>

  {/* 생성 섹션 */}
  <div style={{ background: "#f0f4ff", padding: "24px", borderRadius: "12px",
     width: "400px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", marginBottom: "30px" , display : "flex" , justifyContent : "center" }}>
    {!enable ? (
      <button
        onClick={() => setEnable(true)}
        style={{  width : "300px" , padding: "10px 20px", borderRadius: "8px", background: "#6366f1", color: "white", border: "none", cursor: "pointer" }}
      >
        내전 / 토너먼트 생성하기
      </button>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="관리자 아이디"
          value={adminID}
          onChange={(e) => setAdminId(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="토너먼트 이름"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={primaryBtn} onClick={handleCreateTournament}>생성 완료</button>
          <button style={secondaryBtn} onClick={() => setEnable(false)}>취소</button>
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
      <p>최근 생성된 토너먼트가 없습니다.</p>
    )}
  </div>

  {/* 전체 토너먼트 목록 */}
  <div style={cardStyle}>
    <h2 style={cardTitle}>전체 토너먼트 목록</h2>
    {allTournaments.length === 0 ? (
      <p>등록된 토너먼트가 없습니다.</p>
    ) : (
      <div style={{ maxHeight: "150px", overflowY: "auto", background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
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

      <Footer />
    </>
  );
}
