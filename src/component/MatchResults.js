// MatchResults.jsx
import { useEffect, useState } from "react";
import "../utils/MatchResults.css";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

export default function MatchResults() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ───────── fetch 전체 매치 ───────── */
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tournament/matches`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("매치 조회 실패:", err);
        setError("⚠️ 서버에 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  /* ───────── UI ───────── */
  if (loading) return <p style={{ textAlign: "center" }}>불러오는 중...</p>;
  if (error)   return <p style={{ textAlign: "center", color: "#ef4444" }}>{error}</p>;
  if (!matches.length) return <p style={{ textAlign: "center" }}>아직 기록된 경기가 없습니다.</p>;

  return (
    <div className="match-results">
      <div className="match-result-header">
        <h2>최근 경기 결과</h2>
        <button onClick={() => alert("매치 입력 기능은 추후 구현")}>
          매치 결과 입력
        </button>
      </div>

      {matches.map((m) => (
        <div key={m.matchid} className="match-card">
          <div className="team">
            <span>{m.team_a_name}</span>
            <span className={m.winner_team === m.team_a_id ? "score win" : "score lose"}>
              {m.score_a}
            </span>
          </div>

          <div className="match-date">
            {new Date(m.game_start_time).toLocaleDateString("ko-KR")}
          </div>

          <div className="team">
            <span className={m.winner_team === m.team_b_id ? "score win" : "score lose"}>
              {m.score_b}
            </span>
            <span>{m.team_b_name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
