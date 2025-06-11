import React from 'react';
import '../utils/MatchResults.css';

const dummyMatches = [
  { id: 1, date: "2025-05-27", teamA: "팀 Alpha", teamB: "팀 Beta", scoreA: 1, scoreB: 2, winner: "팀 Alpha", mvp: "Hide on bush" },
  { id: 2, date: "2025-05-26", teamA: "팀 Alpha", teamB: "팀 Gamma", scoreA: 0, scoreB: 2, winner: "팀 Gamma", mvp: "Faker" },
  { id: 3, date: "2025-05-27", teamA: "팀 Alpha", teamB: "팀 Beta", scoreA: 1, scoreB: 2, winner: "팀 Alpha", mvp: "Hide on bush" },
  // ... 중복 생략 가능
];

export default function MatchResults() {
  return (
    <div className="match-results">
      <div className="match-result-wrapper">
        <span>      
        <h2>최근 경기 결과</h2>
        <button>매치 결과 입력</button>
        </span>
        {dummyMatches.map((match, index) => (
        <div className="match-card" key={index}>
            <div className="team team-a">
              <span>{match.teamA}</span>
              <span className={match.winner === match.teamA ? 'score win' : 'score lose'}>{match.scoreA}</span>
            </div>

            <div className="match-date">{match.date}</div>

            <div className="team team-b">
              <span className={match.winner === match.teamB ? 'score win' : 'score lose'}>{match.scoreB}</span>
              <span>{match.teamB}</span>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}
