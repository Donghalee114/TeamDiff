// Riot Games Dragon API의 현재 버전 (변경될 수 있으므로 필요시 업데이트 또는 동적 로드 고려)
export const DDRAGON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn/15.14.1";
export const RUNE_ICON_BASE_URL = "https://ddragon.canisback.com/img/perk-images/";

// 소환사 주문 ID와 이름 매핑
export const SUMMONER_SPELL_MAP = {
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

// 큐 ID와 게임 모드 이름 매핑
export const QUEUE_TYPE_MAP = {
  420: "솔로 랭크",
  440: "자유 랭크",
  430: "일반 게임",
  450: "칼바람 나락",
  1700: "아레나",
  // 다른 큐 ID가 있다면 여기에 추가
};

// 티어별 스타일 (색상) 매핑
export const TIER_STYLE_MAP = {
  UNRANKED: { background: "gray", color: "white" },
  IRON: { background: "#4b4b4b", color: "#e0e0e0" },
  BRONZE: { background: "#b08d57", color: "#fffaf0" },
  SILVER: { background: "#c0c0c0", color: "#1a1a1a" },
  GOLD: { background: "#ffd700", color: "#1a1a1a" },
  PLATINUM: { background: "#00bfae", color: "#ffffff" },
  EMERALD: { background: "#2ecc71", color: "#ffffff" },
  DIAMOND: { background: "#7289da", color: "#ffffff" },
  MASTER: { background: "#ae3ec9", color: "#ffffff" },
  GRANDMASTER: { background: "#e03131", color: "#ffffff" },
  CHALLENGER: { background: "#f9a825", color: "#000000" },
};

