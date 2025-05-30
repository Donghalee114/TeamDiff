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
    if (savedCode) navigate(`/tournament/tournaments${savedCode}`);
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

  return (
    <>
      <Headers />
      <div style={{ marginTop: "100px", width: "100%" }}>
        <h1>내전/ 토너먼트 생성</h1>

        {!enable ? (
          <button onClick={() => setEnable(true)}>내전/ 토너먼트 생성하기</button>
        ) : (
          <div>
            <label>관리자 아이디</label>
            <input type="text" value={adminID} onChange={(e) => setAdminId(e.target.value)} />

            <label>비밀번호</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />

            <label>토너먼트 이름</label>
            <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} />

            <button onClick={handleCreateTournament}>생성 완료</button>
            <button onClick={() => setEnable(false)}>취소</button>
          </div>
        )}

        <h2>최근 생성한 토너먼트</h2>
        {recentTournament.id && recentTournament.name ? (
          <div>
            <p>이름: {recentTournament.name}</p>
            <p>코드: {recentTournament.id}</p>
          </div>
        ) : (
          <p>최근 내전 없음</p>
        )}

        <h2>모든 토너먼트 목록</h2>
        {allTournaments.length === 0 ? (
          <p>토너먼트가 없습니다.</p>
        ) : (
          <ul>
            {allTournaments.map((t, idx) => (
              <li key={idx}>
                {t.name} (ID: {t.id})
              </li>
            ))}
          </ul>
        )}

        <h1>토너먼트 참가</h1>
        <input
          type="text"
          placeholder="토너먼트 코드"
          value={tournamentCode}
          onChange={(e) => setTournamentCode(e.target.value)}
        />
        <button onClick={handleJoinTournament}>참가하기</button>
      </div>
      <Footer />
    </>
  );
}
