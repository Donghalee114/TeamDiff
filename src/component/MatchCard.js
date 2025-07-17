import { useState } from "react";

const winColor = "rgba(39, 50, 114, 0.76)";
const loseColor = "rgba(196, 50, 50, 0.43)";

export default function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);

  const bgColor = match.win ? winColor : loseColor;
  const borderColor = match.win
    ? "rgba(32, 73, 207, 0.95)"
    : "rgba(204, 38, 38, 0.58)";

  const kdaRatio = (
    (match.kda.kills + match.kda.assists) /
    (match.kda.deaths === 0 ? 1 : match.kda.deaths)
  ).toFixed(2);



  const isBlueTeam = match.teamId === 100;
  return (

<>
<div
      onClick={() => setExpanded(!expanded)}
      style={{
        marginBottom: expanded ? 0 : 16,
        padding: 16,
        backgroundColor: bgColor,
        opacity: expanded ? 1 : 0.85,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        color: "#f1f5f9",
        cursor: "pointer",
        transition: "background-color 0.3s ease, opacity 0.3s ease",
        userSelect: "none",
        borderLeft: `4px solid ${borderColor}`,
        width : "850px",
        display : "flex",
        height : "100px",
      }}
      title="클릭하여 상세 정보 보기/숨기기"
    >
      <div style={{ display: "flex" }}>
        {/* 승/패, 모드, 시간 */}
        
        <div
          style={{
            fontSize: 14,
            color: "#ddd",
            display: "flex",
            flexDirection: "column",
            marginRight: 0,
            width: 125,
            height: "100px",
          }}
        >
          <h3 style={{ margin: 0, color: "#fbbf24" }}>{match.winText}</h3>
          {match.gameMode} | {match.duration}
        </div>
        <span>
        {/* 챔피언 + 스펠 + 룬 */}
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            height: 64
          }}
        >
          <img
            src={match.championImg}
            alt={match.champion}
            style={{ width: 64, height: 64, borderRadius: 8 }}
          />

          {/* 스펠 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginLeft: 4,
            }}
          >
            {[match.spell1Img, match.spell2Img].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`스펠${i + 1}`}
                style={{ width: 28, height: 28, borderRadius: 5 }}
              />
            ))}
          </div>

          {/* 룬 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginLeft: 4,
            }}
          >
            {[match.perk1Img, match.perk2Img].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`룬${i + 1}`}
                style={{
                  width: 23,
                  height: 23,
                  background: "black",
                  padding: 3,
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>
          <div>
          <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 12,
          fontSize: 14,
          color: "#eee",
        }}
      >
        <div style={{ display: "flex" , gap: 1, flexDirection: "column" , marginLeft: 10  }}>
          <span><strong>CS:</strong> {match.cs} ({match.csPerMin})</span>
          <span><strong>킬관여:</strong> {match.killParticipation}%</span>
        </div>

  <div style={{ marginTop: "-20px", display: "flex", gap: 50 }}>
  {isBlueTeam ? (
    <>
      {/* 왼쪽: 블루팀 */}
      <div style={{ display: "flex", flexDirection: "column" , maxWidth : "180px" , width : "180px" , marginLeft : "50px" }}>
        {match.teamPlayers.map((p, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={p.championImg} style={{ width: "18px" }} /> 
            <span
            title={`${p.summonerName}#${p.tagLine}`}
            style={{
              maxWidth: "80px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              display: "inline-block"
            }}
          >
            {p.summonerName}
          </span>
          </span>
        ))}
      </div>

      {/* 오른쪽: 적팀 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {match.enemyPlayers.map((p, i) => (
          
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={p.championImg} style={{ width: "18px" }} /> 
              <span
              title={`${p.summonerName}#${p.tagLine}`}
              style={{
                maxWidth: "80px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "inline-block"
              }}
            >
              {p.summonerName}
            </span>

          </span>
        ))}
      </div>
    </>
  ) : (
    <>
      {/* 왼쪽: 적팀 */}
      <div style={{ display: "flex", flexDirection: "column" ,  maxWidth : "180px" ,  width : "180px" ,  marginLeft : "50px"}}>
        {match.enemyPlayers.map((p, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={p.championImg} style={{ width: "18px" }} />
            <span
            title={`${p.summonerName}#${p.tagLine}`}
              style={{
                maxWidth: "80px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "inline-block"
              }}
            >
              {p.summonerName}
            </span>

          </span>
        ))}
      </div>

      {/* 오른쪽: 레드팀(플레이어팀) */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {match.teamPlayers.map((p, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={p.championImg} style={{ width: "18px" }} /> 
            <span
            title={`${p.summonerName}#${p.tagLine}`}
            style={{
              maxWidth: "80px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              display: "inline-block"
            }}
          >
            {p.summonerName}#{p.tagLine}
          </span>
          </span>
        ))}
      </div>
    </>
  )}
</div>
      </div>
          </div>
        </div>
        

        <div style={{
          marginTop: 8,
          display: "flex",
          gap: 6
        }}
      >
        {match.items.slice(0, 7).map((itemId, idx) => (
          itemId !== 0 ? (
            <img
              key={idx}
              src={`https://ddragon.leagueoflegends.com/cdn/15.13.1/img/item/${itemId}.png`}
              alt={`item-${itemId}`}
              style={{ width: 27, height: 27, borderRadius: 4 }}
            />
          ) : (
      <div
        key={idx}
        style={{
          width: 27,
          height: 27,
          borderRadius: 4,
          background: "rgba(66, 67, 65, 0.75)",
        }}
      ></div>
      
    )
  ))}
      </div>

        </span>
        
      </div>

      
      
    </div>    
    {expanded && (
      <div>
       현재 자세히 보기 기능은 개발중입니다.
      </div>
    )}
</>
 
  );
}
