import Headers from "../component/Header";
import Footer from "../component/footer";
import { useEffect, useState } from "react";
import "../utils/scoreBoard.css";
import MatchResults from "../component/MatchResults"
import TeamRankings from "../component/TeamRankings";
import CreateTeam from "../component/createTeam";
import handleTeamList from "../utils/summonerInputUtils";
import Tournaments from "./tournaments"

export default function ScoreBoard({ tournamentId }) {
  const [activeTab, setActiveTab] = useState("matchResults");
  const [team, setTeam] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';


 useEffect(() => {
    fetch(`${BASE_URL}/tournaments/${tournamentId}/teams`)
      .then(res => res.json())
      .then(data => setTeam(data))
      .catch(err => console.error("팀 목록 불러오기 실패:", err));
  }, [tournamentId]);


  useEffect(() => {
    fetch(`${BASE_URL}/matches/${tournamentId}`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("매치 결과 불러오기 실패:", err));
  }, [tournamentId]);
  

  
      
    useEffect(() => {
      const user = navigator.userAgent;
      if (user.includes("iPhone") || user.includes("Android")) {
        setIsMobile(true);
      }
    }, []);
  
  return (
    <>
      <Headers text="점수판" />
      <div className="scoreboard-container">
        {/* 탭 선택 영역 */}
        <div className="tab-menu">

          <div style={{gap : "15px" , display : "flex" , flexDirection : "row"}}>
          <span
            className={`selectShow ${activeTab === "matchResults" ? "active" : ""}`}
            onClick={() => setActiveTab("matchResults")}
          >
            매치결과
          </span>
          <span
            className={`selectShow ${activeTab === "teamRankings" ? "active" : ""}`}
            onClick={() => setActiveTab("teamRankings")}
          >
            팀 순위
          </span>
           </div>

           <div style={{gap : "15px" , display : "flex" , flexDirection : "row"}}>
          <span
            className={`selectShow ${activeTab === "mvpScores" ? "active" : ""}`}
            onClick={() => setActiveTab("mvpScores")}
          >
            MVP ScoreBoard
          </span>
          <span
            className={`selectShow ${activeTab === "detailedMetrics" ? "active" : ""}`}
            onClick={() => setActiveTab("detailedMetrics")}
          >
            세부 지표
          </span>
          {!isMobile ? (<>
          <span className={`selectShow ${activeTab === "AddTeam" ? "active" : ""}`}
          onClick={() => setActiveTab("AddTeam")}>
            팀 생성 및 관리
          </span></>) : ( null )
}
        </div>

      </div>

        {/* 콘텐츠 영역 */}
        <div className="tab-content">
          {activeTab === "matchResults" && <MatchResults matches={matches} />}
          {activeTab === "teamRankings" && <TeamRankings  team = {team}/>}
          {activeTab === "mvpScores" && (
            <div className="mvp-scores">
              <h2>MVP ScoreBoard</h2>
              <p>여기에 MVP 점수판 내용을 추가하세요.</p>
            </div>
          )}
          {activeTab === "detailedMetrics" && (
            <div className="detailed-metrics">
              <h2>세부 지표</h2>
              <p>여기에 세부 지표 내용을 추가하세요.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
