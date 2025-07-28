import Headers from "../component/Header";
import bronze from "../utils/Rank=Bronze.png";
import silver from "../utils/Rank=Silver.png";
import gold from "../utils/Rank=Gold.png";
import platinum from "../utils/Rank=Platinum.png";
import emerald from "../utils/Rank=Emerald.png";
import diamond from "../utils/Rank=Diamond.png";
import master from "../utils/Rank=Master.png";
import grandmaster from "../utils/Rank=Grandmaster.png";
import challenger from "../utils/Rank=Challenger.png";
import LoadingOverlay from "../component/LodingOverlay";

import MatchCard from "../component/MatchCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadRuneIconMap, getRuneIcon } from "../utils/runeUtils";
import {
  DDRAGON_BASE_URL,
  SUMMONER_SPELL_MAP,
  QUEUE_TYPE_MAP,
  TIER_STYLE_MAP,
} from "../utils/constants"; // 상수 파일 임포트


// 소환사 주문 ID를 이름으로 변환하는 함수 (상수 파일로 이동)
function getSummonerSpellName(id) {
  return SUMMONER_SPELL_MAP[id] || "SummonerUnknown";
}

export default function SearchPlayerInfo() {
  const [runeMap, setRuneMap] = useState(null);
  const [styleIconMap, setStyleIconMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // roading -> isLoading
  const [soloRankInfo, setSoloRankInfo] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // next -> showDetails
  const [summonerInfo, setSummonerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // 새로운 에러 메시지 상태
  const [hasMore, setHasMore] = useState(true); // 매치가 더 있는지 여부
  const [startIndex, setStartIndex] = useState(0);

const {summonerNameAndTag} = useParams();

useEffect(() => {
  if (summonerNameAndTag) {
    setIsLoading(true);
    const [name, tag] = decodeURIComponent(summonerNameAndTag).split("#");
    if (name && tag) {
      handleSearch(name, tag); // handleSearch가 name, tag 받도록 수정
    }
  }
}, [summonerNameAndTag]);

  // 티어 이미지 맵
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
    unranked: bronze, // 언랭크드 기본 이미지 (필요시 추가)
    iron: bronze, // 아이언 기본 이미지 (필요시 추가)
  };

  useEffect(() => {
    loadRuneIconMap()
      .then(({ runeMap, styleIconMap }) => {
        setRuneMap(runeMap);
        setStyleIconMap(styleIconMap);
      })
      .catch((error) => {
        console.error("룬/스타일 아이콘 로드 오류:", error);
        setErrorMessage("게임 데이터를 불러오는 데 실패했습니다.");
      });
  }, []);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

const fetchMatchHistory = async (puuid, start , count = 10) => {
  try {
    const matchIdsResponse = await fetch(`${BASE_URL}/match/${puuid}/matches?start=${start}&count=${count}`);
    if (!matchIdsResponse.ok) throw new Error("매치 ID를 불러오는 데 실패했습니다.");
    const matchIds = await matchIdsResponse.json();

    if (!matchIds || matchIds.length === 0) {
      if (start === 0) setErrorMessage("최근 매치 기록이 없습니다.");
      return;
    }

    const slicedMatchIds = matchIds.slice(start, start + count);
    if (slicedMatchIds.length === 0) return;

    const matchDetailsPromises = slicedMatchIds.map(async (matchId) => {
      const response = await fetch(`${BASE_URL}/match/detail/${matchId}`);
      if (!response.ok) return null;
      return response.json();
    });

    const matchDetails = (await Promise.all(matchDetailsPromises)).filter(Boolean);

    const processedMatchDetails = matchDetails.map((match) => {
      const player = match.info.participants.find((p) => p.puuid === puuid);
      if (!player) return null;

      const teamKills = match.info.participants
        .filter((p) => p.teamId === player.teamId)
        .reduce((acc, p) => acc + p.kills, 0);

      const commonPlayerProps = (p) => ({
        champion: p.championName,
        summonerName: p.riotIdGameName,
        tagLine: p.riotIdTagline,
        win: p.win,
        cs: p.totalMinionsKilled + p.neutralMinionsKilled,
        kda: { kills: p.kills, deaths: p.deaths, assists: p.assists },
        items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map(itemId =>
          itemId === 0 ? null : `${DDRAGON_BASE_URL}/img/item/${itemId}.png`
        ),
        visionScore: p.visionScore,
        totalDamageDealtToChampions: p.totalDamageDealtToChampions,
        goldEarned: p.goldEarned,
        perk1Img: runeMap ? getRuneIcon(p.perks.styles[0].selections[0].perk, runeMap) : null,
        perk2Img: styleIconMap ? styleIconMap[p.perks.styles[1].style] : null,
        spell1Img: `${DDRAGON_BASE_URL}/img/spell/${getSummonerSpellName(p.summoner1Id)}.png`,
        spell2Img: `${DDRAGON_BASE_URL}/img/spell/${getSummonerSpellName(p.summoner2Id)}.png`,
        champLevel: p.champLevel,
        championImg: `${DDRAGON_BASE_URL}/img/champion/${p.championName}.png`,
      });

      const teamPlayers = match.info.participants
        .filter((p) => p.teamId === player.teamId)
        .map(commonPlayerProps);

      const enemyPlayers = match.info.participants
        .filter((p) => p.teamId !== player.teamId)
        .map(commonPlayerProps);

      const isArena = match.info.queueId === 1700;
      const arenaPlayers = isArena
        ? match.info.participants.map((p) => ({
            ...commonPlayerProps(p),
            place: p.placement,
          }))
        : null;

      const minutes = Math.floor(match.info.gameDuration / 60);
      const seconds = match.info.gameDuration % 60;
      const durationFormatted = `${minutes}분 ${seconds < 10 ? "0" : ""}${seconds}초`;

      const date = new Date(match.info.gameStartTimestamp);
      const monthDayStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

      return {
        matchId: match.metadata.matchId,
        champion: player.championName,
        championImg: `${DDRAGON_BASE_URL}/img/champion/${player.championName}.png`,
        kda: { kills: player.kills, deaths: player.deaths, assists: player.assists },
        teamColor: player.teamId === 100 ? "blue" : "red",
        cs: player.totalMinionsKilled + player.neutralMinionsKilled,
        gold: player.goldEarned,
        win: player.win,
        winText: player.win ? "승리" : "패배",
        gameMode: QUEUE_TYPE_MAP[match.info.queueId] || match.info.gameMode,
        duration: durationFormatted,
        killParticipation:
          teamKills > 0 ? (((player.kills + player.assists) / teamKills) * 100).toFixed(1) : 0,
        totalDamage: player.totalDamageDealtToChampions,
        visionScore: player.visionScore,
        items: [player.item0, player.item1, player.item2, player.item3, player.item4, player.item5, player.item6].map(itemId =>
          itemId === 0 ? null : `${DDRAGON_BASE_URL}/img/item/${itemId}.png`
        ),
        spell1Img: `${DDRAGON_BASE_URL}/img/spell/${getSummonerSpellName(player.summoner1Id)}.png`,
        spell2Img: `${DDRAGON_BASE_URL}/img/spell/${getSummonerSpellName(player.summoner2Id)}.png`,
        perk1Img: runeMap ? getRuneIcon(player.perks.styles[0].selections[0].perk, runeMap) : null,
        perk2Img: styleIconMap ? styleIconMap[player.perks.styles[1].style] : null,
        level: player.champLevel,
        csPerMin: ((player.totalMinionsKilled + player.neutralMinionsKilled) / (match.info.gameDuration / 60)).toFixed(1),
        teamId: player.teamId,
        teamPlayers,
        enemyPlayers,
        arenaPlayers,
        queueId: match.info.queueId,
        timestamp: monthDayStr,
      };
    });

    setMatchHistory((prev) =>
      start === 0
        ? processedMatchDetails.filter(Boolean)
        : [...prev, ...processedMatchDetails.filter(Boolean)]
    );

    if (matchIds.length < count) {
  setHasMore(false);
} else {
  setHasMore(true);
}
  } catch (error) {
    console.error("매치 기록 불러오기 오류:", error);
    setErrorMessage(error.message || "매치 기록을 불러오는 데 실패했습니다.");
    if (start === 0) setMatchHistory([]);
  }
};


const handleSearch = async (nameParam, tagParam) => {
  const name = nameParam?.trim();
  const tag = tagParam?.trim() || "KR1";

  if (!name || !tag) {
    setErrorMessage("소환사 이름과 태그를 정확히 입력해주세요.");
    setIsLoading(false);
    return;
  }

  const encodeName = encodeURIComponent(name);
  const encodeTag = encodeURIComponent(tag);

  setIsLoading(true);
  setErrorMessage("");
  setMatchHistory([]);
  setShowDetails(false);
  setHasMore(true);

  try {
    const summonerResponse = await fetch(`${BASE_URL}/summoner/${encodeName}?tag=${encodeTag}`);
    if (!summonerResponse.ok) {
      if (summonerResponse.status === 404) {
        throw new Error("검색하신 소환사를 찾을 수 없습니다.");
      }
      throw new Error("소환사 정보를 불러오는 데 실패했습니다.");
    }
    const summonerData = await summonerResponse.json();
    setSummonerInfo(summonerData);

    const leagueResponse = await fetch(`${BASE_URL}/summoner/league/${summonerData.puuid}`);
    if (!leagueResponse.ok) throw new Error("랭크 정보를 불러오는 데 실패했습니다.");
    const leagueData = await leagueResponse.json();

    const soloRank = leagueData.find(rank => rank.queueType === "RANKED_SOLO_5x5");
    setSoloRankInfo(soloRank || null);
    if (!soloRank) setErrorMessage("솔로 랭크 정보가 없습니다.");

    await fetchMatchHistory(summonerData.puuid, 0, 10);
    setShowDetails(true);
  } catch (error) {
    console.error("검색 오류:", error);
    setErrorMessage(error.message || "소환사 정보를 불러오는 중 오류가 발생했습니다.");
    setSummonerInfo(null);
    setSoloRankInfo(null);
    setMatchHistory([]);
    setShowDetails(false);
  } finally {
    setIsLoading(false);
  }
};


const handleLoadMore = async () => {
  if (!summonerInfo || !summonerInfo.puuid) return;
  const nextStart = startIndex + 10;
  setStartIndex(nextStart);
  await fetchMatchHistory(summonerInfo.puuid, nextStart, 10);
  
};

  // 조건부 렌더링을 위한 content 결정
  let mainContent;
  if (isLoading) {
    mainContent = <LoadingOverlay message="소환사 정보를 불러오는 중입니다..." />;
  } else if (errorMessage) {
    mainContent = (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ marginBottom: "10px" }}>오류 발생!</h1>
        <p>소환사 정보가 없거나 불러오는 데 실패했습니다.</p>
        <p>정보를 불러오시려면 다시한번 검색해주세요 </p>
        <p>{errorMessage}</p>
      </div>
    );
  } else if (showDetails && summonerInfo) {
    mainContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "20px",
          justifyContent: "start",
          gap: "50px",
          // height: "400px", // 매치 기록이 길어질 수 있으므로 고정 높이 제거
        }}
      >
        <div
          style={{
            width: "500px",
            padding: "16px",
            backgroundColor: "#1c1f3a",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            maxHeight: "400px", // 최소 높이 설정
          }}
        >
          <h1 style={{ color: "#fbbf24", marginBottom: "10px" }}>소환사 정보</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "16px",
              height: "100px",
            }}
          >
            <img
              src={`${DDRAGON_BASE_URL}/img/profileicon/${summonerInfo.profileIconId}.png`}
              alt="Profile Icon"
              style={{ width: "100px", height: "100px", marginRight: "10px" }}
            />
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100px",
              }}
            >
              {soloRankInfo ? (
                <span
                  style={{
                    ...(TIER_STYLE_MAP[soloRankInfo.tier] || {}),
                    width: "200px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                >
                  솔랭 티어: {soloRankInfo.tier} {soloRankInfo.rank} |{" "}
                  {soloRankInfo.leaguePoints} LP
                </span>
              ) : (
                <span
                  style={{
                    ...(TIER_STYLE_MAP.UNRANKED || {}),
                    width: "200px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                >
                  랭크 정보 없음
                </span>
              )}
              <span
                style={{
                  color: "#d1d5db",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                레벨: {summonerInfo.summonerLevel}
              </span>
              <span style={{ color: "#d1d5db" }}>
                <strong>
                  {summonerInfo.name}#{summonerInfo.tagLine}
                </strong>
              </span>
              {soloRankInfo && (
                <>
                  <span style={{ color: "#d1d5db" }}>
                    승률:{" "}
                    {(
                      (soloRankInfo.wins /
                        (soloRankInfo.wins + soloRankInfo.losses)) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                  <span style={{ color: "#d1d5db" }}>
                    승: {soloRankInfo.wins} | 패: {soloRankInfo.losses}
                  </span>
                </>
              )}
            </span>
          </div>
          {soloRankInfo && soloRankInfo.tier && (
            <div style={{ display: "flex", flexDirection: "row", gap: "16px" ,  }}>
              <img
                src={tierImages[soloRankInfo.tier.toLowerCase()]}
                alt={`${soloRankInfo.tier} icon`}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
        </div>
        <div style={{ width: "100%", maxWidth: "950px" }}> {/* 매치카드 너비 조정 */}
          <h1 style={{ color: "#fbbf24", marginBottom: "10px" }}>소환사 전적</h1>
          {matchHistory.length > 0 ? (
            <div style={{ maxHeight: "1500px" }}> {/* 스크롤 추가 */}
              {matchHistory.map((match, index) => (
                <MatchCard key={match.matchId || index} match={match} />
              ))}

             {hasMore && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleLoadMore}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              더 보기
            </button>
      </div>
    )}
            </div>
          ) : (
            <p style={{ color: "#d1d5db", textAlign: "center", marginTop: "20px" }}>
              최근 매치 기록이 없습니다.
            </p>
          )}
        </div>
      </div>
    );
  } else {
    mainContent = (
      <div style={{ color: "White", textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          LoL 전적 검색 시스템
        </h1>
        <p style={{ fontSize: "1.2rem" }}>
          소환사 이름을 검색하고 랭크와 최근 전적을 확인해보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <LoadingOverlay message="소환사 정보를 불러오는 중입니다..." />
      )}
      <div
        style={{
          minHeight: "100vh", // 최소 높이를 화면 전체로
          zIndex: 3,
          marginTop: "70px",
          padding: "24px",
          maxWidth: "1500px",
          marginInline: "auto",
        }}
      >
        <Headers />
        {/* <button onClick={() => console.log(matchHistory)}>dddd</button> */} {/* 디버그 버튼 제거 */}
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
         
          {summonerInfo && showDetails && (
            <div style={{ alignSelf: "flex-start", marginTop: "20px" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  // marginRight: "60vw", // 반응형을 위해 제거
                }}
              >
                <img
                  src={`${DDRAGON_BASE_URL}/img/profileicon/${summonerInfo.profileIconId}.png`}
                  alt="Profile Icon"
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#d1d5db",
                    fontSize: "20px",
                  }}
                >
                  <strong>
                    {summonerInfo.name}#{summonerInfo.tagLine}
                  </strong>
                  {soloRankInfo ? (
                    <strong>
                      {soloRankInfo.tier} {soloRankInfo.rank} |{" "}
                      {soloRankInfo.leaguePoints} LP
                    </strong>
                  ) : (
                    <strong>랭크 정보 없음</strong>
                  )}
                </div>
              </span>
            </div>
          )}
        </div>
        {mainContent}
      </div>
    </>
  );
}