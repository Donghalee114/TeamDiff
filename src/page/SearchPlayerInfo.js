import Headers from "../component/Header";
import bronze from "../utils/Rank=Bronze.png"
import silver from "../utils/Rank=Silver.png"
import gold from "../utils/Rank=Gold.png"
import platinum from "../utils/Rank=Platinum.png"
import emerald from "../utils/Rank=Emerald.png"
import diamond from "../utils/Rank=Diamond.png"
import master from "../utils/Rank=Master.png"
import grandmaster from "../utils/Rank=Grandmaster.png"
import challenger from "../utils/Rank=Challenger.png"

import MatchCard from "../component/MatchCard";
import { useState , useEffect} from "react";
import { loadRuneIconMap, getRuneIcon } from "../utils/runeUtils";

function getSummonerSpellName(id) {
  const spellMap = {
    21: "SummonerBarrier",
    1: "SummonerBoost",
    14: "SummonerDot",
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste",
    7: "SummonerHeal",
    13: "SummonerMana",
    30: "SummonerPoroRecall",
    31: "SummonerPoroThrow",
    11: "SummonerSmite",
    39: "SummonerSnowURFSnowball_Mark",
    32: "SummonerSnowball",
    12: "SummonerTeleport",
    54: "Summoner_UltBookPlaceholder",
  };
  return spellMap[id] || "SummonerUnknown";
}

const runeIconBase = "https://ddragon.canisback.com/img/perk-images/";


export default function SearchPlayerInfo(){
const [runeMap, setRuneMap] = useState(null);
const [styleIconMap, setStyleIconMap] = useState(null);

 const tierImages = {
 bronze,
 silver,
 gold,
 platinum,
 emerald,
 diamond,
 master,
 grandmaster,
 challenger,
};




useEffect(() => {
  loadRuneIconMap()
    .then(({ runeMap, styleIconMap }) => {
      setRuneMap(runeMap);
      setStyleIconMap(styleIconMap);
    })
    .catch(console.error);
}, []);



const tierStyleMap = {
 UNRANKED : {background : "gray" , color : "white"},
 IRON:    { background: "#4b4b4b", color: "#e0e0e0" },  // 어두운 회색, 밝은 텍스트
 BRONZE:   { background: "#b08d57", color: "#fffaf0" },  // 황갈색, 따뜻한 흰색
 SILVER:   { background: "#c0c0c0", color: "#1a1a1a" },  // 중간 회색, 짙은 글자
 GOLD:    { background: "#ffd700", color: "#1a1a1a" },  // 선명한 금색, 짙은 글자
 PLATINUM:  { background: "#00bfae", color: "#ffffff" },  // 청록색, 흰색
 EMERALD:  { background: "#2ecc71", color: "#ffffff" },  // 선명한 에메랄드, 흰색
 DIAMOND:  { background: "#7289da", color: "#ffffff" },  // 연보라 블루, 흰색
 MASTER:   { background: "#ae3ec9", color: "#ffffff" },  // 보라색 계열, 흰색
 GRANDMASTER:{ background: "#e03131", color: "#ffffff" },  // 강렬한 빨강, 흰색
 CHALLENGER: { background: "#f9a825", color: "#000000" },  // 진한 황금색, 검정
};

 const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';
 const [inputValue , setInputValue] = useState('');
 const [soloRankInfo, setSoloRankInfo] = useState(null); // 솔로 랭크 정보를 위한 새 상태
 const [matchHistory, setMatchHistory] = useState([]); // 매치 기록을 위한 새 상태
 const [next , setNext] = useState(false)
 const [summonerInfo , setSummonerInfo] = useState(null);
 const [isSearch , setIsSearch] = useState(false);
 
const [iconId , setIconId] = useState(' ');
 const [nickname , setNickname] = useState(' ');
 const [tag, setTag] = useState(' ');

const handleSearch = async () => {
 if (!inputValue.includes('#')) {
  alert("소환사 이름에 태그를 포함해주세요. 예시: 소환사이름#KR1");
  return;
 }

 const [name, tag] = inputValue.split('#');
 setNickname(name);
 setTag(tag);

 const encodeName = encodeURIComponent(name.trim());

 if (!inputValue.trim()) {
  alert("소환사 이름을 입력해주세요.");
  return;
 }

 try {
  const response = await fetch(`${BASE_URL}/summoner/${encodeName}?tag=${tag}`);
  if (!response.ok) {
   throw new Error("소환사 정보를 불러오는 데 실패했습니다.");
  }
  const data = await response.json();
  setSummonerInfo(data);
  setIconId(data.profileIconId);

  const res2 = await fetch(`${BASE_URL}/summoner/league/${data.puuid}`);
  if (!res2.ok) {
   throw new Error("랭크 정보를 불러오는 데 실패했습니다.");
  }
  const data2 = await res2.json();

  if (!data2 || data2.length === 0) {
   alert("소환사 랭크 정보가 없습니다.");
   setSoloRankInfo(null); // 랭크 정보 없을 시 초기화
      setMatchHistory([]); // 매치 기록도 초기화
   setNext(false);
   return;
  }

  const soloRank = data2.find(rank => rank.queueType === "RANKED_SOLO_5x5");

  if (!soloRank) {
   alert("솔로 랭크 정보가 없습니다.");
   setSoloRankInfo(null); // 솔로 랭크 정보 없을 시 초기화
      setMatchHistory([]); // 매치 기록도 초기화
   setNext(false);
   return;
  }

  setSoloRankInfo(soloRank); // 솔로 랭크 정보 업데이트
  setNext(true);
  
    // 매치 정보 불러오기
    await fetchMatchHistory(data.puuid); // puuid를 인자로 전달
 } catch (error) {
  console.error("검색 오류:", error);
  alert("소환사 정보를 불러오는 데 실패했습니다.");
 }

 setIsSearch(true); // 검색 완료 상태로 변경
setInputValue(''); // 입력 필드 초기화
};

const fetchMatchHistory = async (puuid) => { // puuid를 인자로 받도록 수정
  try {
    const matchDataResponse = await fetch(`${BASE_URL}/match/${puuid}/matches`); // puuid 사용
    if (!matchDataResponse.ok) {
      throw new Error("매치 정보를 불러오는 데 실패했습니다.");
    }
    const matchIds = await matchDataResponse.json();

    if (!matchIds || matchIds.length === 0) {
      alert("매치 정보가 없습니다.");
      setMatchHistory([]); // 매치 기록 없을 시 초기화
      return;
    }

    const matchDetails = await Promise.all(
      matchIds.slice(0, 10).map(async (matchId) => {
        const response = await fetch(`${BASE_URL}/match/detail/${matchId}`);
        if (!response.ok) {
          throw new Error("매치 상세 정보를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
    );

const playerMatchDetails = matchDetails.map((match) => {
  const player = match.info.participants.find(p => p.puuid === puuid);
  if (!player) return null;

  const teamKills = match.info.participants
    .filter(p => p.teamId === player.teamId)
    .reduce((acc, p) => acc + p.kills, 0);

  const teamPlayers = match.info.participants
    .filter(p => p.teamId === player.teamId)
    .map(p => ({
      champion: p.championName,
      summonerName: p.riotIdGameName,
      win: p.win,
      cs: p.totalMinionsKilled + p.neutralMinionsKilled,
      tagLine : p.riotIdTagline,
      kda: {
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
      },
      items: [
        p.item0,
        p.item1,
        p.item2,
        p.item3,
        p.item4,
        p.item5,
        p.item6
      ],
      visionScore: p.visionScore,
      totalDamageDealtToChampions: p.totalDamageDealtToChampions,
      goldEarned: p.goldEarned,
      perk1Img: runeMap ? getRuneIcon(p.perks.styles[0].selections[0].perk, runeMap) : null,
      perk2Img: styleIconMap ? styleIconMap[p.perks.styles[1].style] : null,
      spell1Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(p.summoner1Id)}.png`,
      spell2Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(p.summoner2Id)}.png`,

      champLevel : p.champLevel,
      championImg : `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${p.championName}.png`,
    }));

  const enemyPlayers = match.info.participants
    .filter(p => p.teamId !== player.teamId)
    .map(p => ({
      champion: p.championName,
      summonerName: p.riotIdGameName,
      cs : p.totalMinionsKilled + p.neutralMinionsKilled,
      win: p.win,
      tagline : p.riotIdTagLine,
      kda: {
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
      },
      items: [
        p.item0,
        p.item1,
        p.item2,
        p.item3,
        p.item4,
        p.item5,
        p.item6
      ],
      visionScore: p.visionScore,
      totalDamageDealtToChampions: p.totalDamageDealtToChampions,
      goldEarned: p.goldEarned,
      perk1Img: runeMap ? getRuneIcon(p.perks.styles[0].selections[0].perk, runeMap) : null,
      perk2Img: styleIconMap ? styleIconMap[p.perks.styles[1].style] : null,
      spell1Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(p.summoner1Id)}.png`,
      spell2Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(p.summoner2Id)}.png`,
      
      champLevel : p.champLevel,
      championImg : `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${p.championName}.png`,
    }));

  // 시간 계산 (초 → "분:초")
  const minutes = Math.floor(match.info.gameDuration / 60);
  const seconds = match.info.gameDuration % 60;
  const durationFormatted = `${minutes}분 ${seconds < 10 ? "0" : ""}${seconds}초`;

  return {
    matchId: match.metadata.matchId,
    champion: player.championName,
    championImg: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${player.championName}.png`,
    kda: {
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
    },
    teamColor : player.teamId === 100 ? "blue" : "red",
    cs: player.totalMinionsKilled + player.neutralMinionsKilled,
    gold: player.goldEarned,
    
    win: player.win,
    winText: player.win ? "승리" : "패배",
    gameMode: match.info.queueId === 420 ? "솔랭" : match.info.queueId === 440 ? "자랭" : match.info.queueId === 430 ? "일반"  :  match.info.queueId === 450 ? "칼바람" : match.info.gameMode,
    duration: durationFormatted,
    killParticipation: teamKills > 0 ? ((player.kills + player.assists) / teamKills * 100).toFixed(1) : 0,
    totalDamage: player.totalDamageDealtToChampions,
    visionScore: player.visionScore,
    items: [
      player.item0,
      player.item1,
      player.item2,
      player.item3,
      player.item4,
      player.item5,
      player.item6,
    ],
    spell1Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(player.summoner1Id)}.png`,
    spell2Img: `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/spell/${getSummonerSpellName(player.summoner2Id)}.png`,
  perk1Img: runeMap ? getRuneIcon(player.perks.styles[0].selections[0].perk, runeMap) : null,
  perk2Img: styleIconMap ? styleIconMap[player.perks.styles[1].style] : null,
  level : player.champLevel,
  csPerMin : ((player.totalMinionsKilled + player.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),

    teamId: player.teamId,
    teamPlayers,
    enemyPlayers,
  };
});

    setMatchHistory(playerMatchDetails.filter(match => match !== null)); // null 제거
  } catch (error) {
    console.error("매치 기록 불러오기 오류:", error); 
  }
};

 return (
  <div style={{height : "100vh" , zIndex: 3, marginTop: "70px", padding: "24px", maxWidth: "1500px", marginInline: "auto" }}>
   <Headers/>
   <div
    style={{
     display: "flex",
    justifyContent: "center",
      alignItems: "center",
     marginBottom: "24px",
     padding: "20px 32px",
     background: "linear-gradient(135deg, #1e293b, #334155)",
     borderRadius: "12px",
     boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
     color: "#e2e8f0",
     flexDirection: "column",
    }}
   >
      <span>
    <input
     type="text"
     value={inputValue}
     onChange={(e) => setInputValue(e.target.value)}
     placeholder="소환사 이름을 입력하세요"
     style={{

      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      width: "300px",
      fontSize: "1rem"
     }}
    />
    <button 
     onClick={handleSearch}
     style={{height : "43px"}}>
    검색
    </button>
     </span>
  {!isSearch ? (
    <>
    <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "4px" }}>
      LoL 전적 검색 시스템
     </h1>
    </>
  ) : (

  <div>
  <span style={{ display: "flex", alignItems: "center", gap: "16px" , marginRight : "60vw" }}>
    <img
     src={`https://ddragon.leagueoflegends.com/cdn/15.13.1/img/profileicon/${iconId}.png`}
      alt="Profile Icon"
      style={{ width: "100px", height: "100px"}}
    />
    <div style={{"display": "flex", "flexDirection": "column", color: "#d1d5db" , fontSize : "20px" }}>
    <strong>{summonerInfo.name}#{summonerInfo.tagLine}</strong>
    <strong>{soloRankInfo.tier} {soloRankInfo.rank} | {soloRankInfo.leaguePoints} LP</strong>

    </div>
  </span>


     </div>

  )}

   </div>


    {next && summonerInfo && soloRankInfo ? ( // summonerInfo와 soloRankInfo 모두 있을 때만 렌더링
    <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" , justifyContent: "start", gap: "50px" , height : "400px" }}>
     <div style={{ width : "500px" , padding: "16px", backgroundColor: "#1c1f3a", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
     <h1 style={{ color: "#fbbf24", marginBottom: "10px" }}>소환사 정보</h1> 
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "16px" }}> 
          <img src={`https://ddragon.leagueoflegends.com/cdn/15.13.1/img/profileicon/${summonerInfo.profileIconId}.png`} alt="Profile Icon" 
          style={{ width: "100px", height: "100px", marginRight : "10px" }} />
          <span style={{ display: "flex", flexDirection: "column", justifyContent : "center" , height: "100px" ,}}>
                <span style={{...(tierStyleMap[soloRankInfo.tier] || {} ) , width : "200px" , height : "30px" , display : "flex" , alignItems : "center" , justifyContent : "center" , borderRadius : "6px"}}>
          솔랭 티어: {soloRankInfo.tier} {soloRankInfo.rank} | {soloRankInfo.leaguePoints} LP
                </span>
                <span style={{ color: "#d1d5db" ,display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}> 레벨: {summonerInfo.summonerLevel}</span>
                <span style={{ color: "#d1d5db" }}><strong>{summonerInfo.name}#{summonerInfo.tagLine}</strong></span>
          <span style={{ color: "#d1d5db" }}>승률: {(soloRankInfo.wins / (soloRankInfo.wins + soloRankInfo.losses) * 100).toFixed(2)}%</span>
          <span style={{ color: "#d1d5db" }}>승: {soloRankInfo.wins} | 패: {soloRankInfo.losses}</span>
          </span>
      </div>
      

      
     </div>

      <div style={{ width : "1500px" , height : "1500px" }}>
      <h1 style={{ color: "#fbbf24", marginBottom: "10px" }}>소환사 전적</h1>


{matchHistory.length > 0 ? (
  <div style={{ overflowX: "auto" }}>
    {matchHistory.map((match, index) => (
      <MatchCard key={index} match={match} />
    ))}
  </div>
) : (
  <p style={{ color: "#d1d5db", textAlign: "center", marginTop: "20px" }}>
    매치 기록이 없습니다.
  </p>
)}

      </div>
    </div>
  ) : (
    <div style={{color : "White" , textAlign : "center" , marginTop : "100px"}}>
    <h1>닉네임을 검색하신후 전적을 확인하세요!</h1>
    <p>Riot API 제한이 있어 전적검색이 원할하지 않을 수 있습니다.</p>
    </div>
  )}
  </div>

 ); 

}