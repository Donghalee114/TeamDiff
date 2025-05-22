export const injectDummyData_JungleOverload = (setResult, setCanClick) => {
  const players = [
    { name: "정글1", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 80, totalScore: 1280, mainRole: "JUNGLE", backupRoles: ["TOP", "MID"] },
    { name: "정글2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "JUNGLE", backupRoles: ["BOTTOM"] },
    { name: "정글3", tag: "KR1", tier: "DIAMOND", tierScore: 1400, winScore: 90, totalScore: 1490, mainRole: "JUNGLE", backupRoles: ["UTILITY"] },
    { name: "정글4", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 40, totalScore: 1040, mainRole: "JUNGLE", backupRoles: ["TOP", "MID"] },
    { name: "정글5", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "JUNGLE", backupRoles: [] },
    { name: "미드1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "MIDDLE", backupRoles: ["BOTTOM"] },
    { name: "탑1", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 70, totalScore: 1270, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "서폿1", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 50, totalScore: 1050, mainRole: "UTILITY", backupRoles: ["BOTTOM"] },
    { name: "원딜1", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 60, totalScore: 1060, mainRole: "BOTTOM", backupRoles: ["UTILITY"] },
    { name: "탑2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "TOP", backupRoles: [] },
  ];
  setResult(players);
  setCanClick(true);
}

export const injectDummyData_NoBackups = (setResult, setCanClick) => {
  const players = Array(10).fill(0).map((_, i) => ({
    name: `유저${i+1}`,
    tag: "KR1",
    tier: "GOLD",
    tierScore: 1100,
    winScore: 50,
    totalScore: 1150,
    mainRole: i < 5 ? "TOP" : "JUNGLE", // 중복 라인
    backupRoles: [] // 부 포지션 없음
  }));
  setResult(players);
  setCanClick(true);
}


export const injectDummyData_UnbalancedScore = (setResult, setCanClick) => {
  const players = [
    { name: "고수1", tag: "KR1", tier: "CHALLENGER", tierScore: 1700, winScore: 100, totalScore: 1800, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "고수2", tag: "KR1", tier: "CHALLENGER", tierScore: 1700, winScore: 100, totalScore: 1800, mainRole: "JUNGLE", backupRoles: ["MIDDLE"] },
    { name: "고수3", tag: "KR1", tier: "GRANDMASTER", tierScore: 1600, winScore: 100, totalScore: 1700, mainRole: "MIDDLE", backupRoles: [] },
    { name: "고수4", tag: "KR1", tier: "MASTER", tierScore: 1500, winScore: 90, totalScore: 1590, mainRole: "BOTTOM", backupRoles: [] },
    { name: "고수5", tag: "KR1", tier: "MASTER", tierScore: 1500, winScore: 90, totalScore: 1590, mainRole: "UTILITY", backupRoles: [] },

    { name: "브론즈1", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "TOP", backupRoles: [] },
    { name: "브론즈2", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "JUNGLE", backupRoles: [] },
    { name: "브론즈3", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "MIDDLE", backupRoles: [] },
    { name: "브론즈4", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "BOTTOM", backupRoles: [] },
    { name: "브론즈5", tag: "KR1", tier: "BRONZE", tierScore: 900, winScore: 30, totalScore: 930, mainRole: "UTILITY", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
}


export const injectDummyData_MissingRoles = (setResult, setCanClick) => {
  const players = [
    ...Array(5).fill(0).map((_, i) => ({
      name: `정상${i+1}`,
      tag: "KR1",
      tier: "GOLD",
      tierScore: 1100,
      winScore: 50,
      totalScore: 1150,
      mainRole: ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"][i],
      backupRoles: []
    })),
    ...Array(5).fill(0).map((_, i) => ({
      name: `미상${i+1}`,
      tag: "KR1",
      tier: "SILVER",
      tierScore: 1000,
      winScore: 30,
      totalScore: 1030,
      mainRole: null,
      backupRoles: []
    }))
  ];
  setResult(players);
  setCanClick(true);
}


export const injectDummyData_PotentialDuplicateInTeam = (setResult, setCanClick) => {
  const players = [
    { name: "A1", tag: "KR1", totalScore: 1200, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "A2", tag: "KR1", totalScore: 1250, mainRole: "JUNGLE", backupRoles: ["TOP"] },
    { name: "A3", tag: "KR1", totalScore: 1150, mainRole: "MIDDLE", backupRoles: [] },
    { name: "A4", tag: "KR1", totalScore: 1100, mainRole: "BOTTOM", backupRoles: [] },
    { name: "A5", tag: "KR1", totalScore: 1000, mainRole: "UTILITY", backupRoles: [] },

    { name: "B1", tag: "KR1", totalScore: 1200, mainRole: "TOP", backupRoles: [] },
    { name: "B2", tag: "KR1", totalScore: 1250, mainRole: "JUNGLE", backupRoles: [] },
    { name: "B3", tag: "KR1", totalScore: 1150, mainRole: "MIDDLE", backupRoles: [] },
    { name: "B4", tag: "KR1", totalScore: 1100, mainRole: "BOTTOM", backupRoles: [] },
    { name: "B5", tag: "KR1", totalScore: 1000, mainRole: "UTILITY", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
}

export const injectDummyData_OnlyOneSupport = (setResult, setCanClick) => {
  const players = [
    { name: "유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "유저2", tag: "KR1", tier: "GOLD", tierScore: 1080, winScore: 50, totalScore: 1130, mainRole: "TOP", backupRoles: ["BOTTOM"] },
    { name: "유저3", tag: "KR1", tier: "GOLD", tierScore: 1150, winScore: 50, totalScore: 1200, mainRole: "JUNGLE", backupRoles: [] },
    { name: "유저4", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 40, totalScore: 1040, mainRole: "JUNGLE", backupRoles: [] },
    { name: "유저5", tag: "KR1", tier: "GOLD", tierScore: 1120, winScore: 20, totalScore: 1140, mainRole: "MIDDLE", backupRoles: [] },
    { name: "유저6", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "MIDDLE", backupRoles: [] },
    { name: "유저7", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 100, totalScore: 1100, mainRole: "BOTTOM", backupRoles: ["TOP"] },
    { name: "유저8", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "BOTTOM", backupRoles: [] },
    { name: "유저9", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 10, totalScore: 1110, mainRole: "TOP", backupRoles: ["UTILITY"] },
    { name: "유저10", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 0, totalScore: 1100, mainRole: "UTILITY", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
};

export const injectDummyData_NoMid = (setResult, setCanClick) => {
  const players = [
    { name: "유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 30, totalScore: 1130, mainRole: "TOP", backupRoles: [] },
    { name: "유저2", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 50, totalScore: 1050, mainRole: "TOP", backupRoles: [] },
    { name: "유저3", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 70, totalScore: 1170, mainRole: "JUNGLE", backupRoles: [] },
    { name: "유저4", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 60, totalScore: 1060, mainRole: "JUNGLE", backupRoles: [] },
    { name: "유저5", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 30, totalScore: 1130, mainRole: "BOTTOM", backupRoles: ["MIDDLE"] },
    { name: "유저6", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "BOTTOM", backupRoles: [] },
    { name: "유저7", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "UTILITY", backupRoles: [] },
    { name: "유저8", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 50, totalScore: 1050, mainRole: "UTILITY", backupRoles: [] },
    { name: "유저9", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 45, totalScore: 1145, mainRole: "TOP", backupRoles: [] },
    { name: "유저10", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 35, totalScore: 1035, mainRole: "JUNGLE", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
};


export const injectDummyData_AllUnranked = (setResult, setCanClick) => {
  const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
  const players = Array(10).fill(0).map((_, i) => ({
    name: `언랭${i+1}`,
    tag: "KR1",
    tier: "UNRANKED",
    tierScore: 0,
    winScore: 0,
    totalScore: 0+i*100,
    mainRole: roles[i % 5],
    backupRoles: []
  }));
  setResult(players);
  setCanClick(true);
};

export const injectDummyData_AllSameTierButRandomRoles = (setResult, setCanClick) => {
  const players = [
    { name: "유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: ["UTILITY"] },
    { name: "유저2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: ["MIDDLE"] },
    { name: "유저3", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "JUNGLE", backupRoles: [] },
    { name: "유저4", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "JUNGLE", backupRoles: ["BOTTOM"] },
    { name: "유저5", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "MIDDLE", backupRoles: ["TOP"] },
    { name: "유저6", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "BOTTOM", backupRoles: [] },
    { name: "유저7", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "BOTTOM", backupRoles: [] },
    { name: "유저8", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "UTILITY", backupRoles: [] },
    { name: "유저9", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "UTILITY", backupRoles: [] },
    { name: "유저10", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "MIDDLE", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
};


export const injectDummyData_HardFallbackRequired = (setResult, setCanClick) => {
  const players = Array(10).fill(0).map((_, i) => ({
    name: `탑러${i+1}`,
    tag: "KR1",
    tier: "GOLD",
    tierScore: 1100,
    winScore: 50,
    totalScore: 1150+i*40,
    mainRole: "TOP",
    backupRoles: []
  }));
  setResult(players);
  setCanClick(true);
};

export const injectDummyData_NormalMatch1 = (setResult, setCanClick) => {
  const players = [
    { name: "탑유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "정글유저1", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 60, totalScore: 1260, mainRole: "JUNGLE", backupRoles: [] },
    { name: "미드유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 55, totalScore: 1155, mainRole: "MIDDLE", backupRoles: [] },
    { name: "원딜유저1", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 80, totalScore: 1080, mainRole: "BOTTOM", backupRoles: ["UTILITY"] },
    { name: "서폿유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "UTILITY", backupRoles: [] },
    
    { name: "탑유저2", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 50, totalScore: 1250, mainRole: "TOP", backupRoles: [] },
    { name: "정글유저2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "JUNGLE", backupRoles: ["TOP"] },
    { name: "미드유저2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 45, totalScore: 1145, mainRole: "MIDDLE", backupRoles: ["BOTTOM"] },
    { name: "원딜유저2", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 70, totalScore: 1070, mainRole: "BOTTOM", backupRoles: [] },
    { name: "서폿유저2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "UTILITY", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
};


export const injectDummyData_NormalMatch2 = (setResult, setCanClick) => {
  const players = [
    { name: "A1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 55, totalScore: 1155, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "A2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 45, totalScore: 1145, mainRole: "JUNGLE", backupRoles: ["TOP"] },
    { name: "A3", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "MIDDLE", backupRoles: [] },
    { name: "A4", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 65, totalScore: 1165, mainRole: "BOTTOM", backupRoles: ["UTILITY"] },
    { name: "A5", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "UTILITY", backupRoles: [] },
    { name: "B1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: [] },
    { name: "B2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 55, totalScore: 1155, mainRole: "JUNGLE", backupRoles: [] },
    { name: "B3", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "MIDDLE", backupRoles: ["BOTTOM"] },
    { name: "B4", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "BOTTOM", backupRoles: [] },
    { name: "B5", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 45, totalScore: 1145, mainRole: "UTILITY", backupRoles: [] }
  ];
  setResult(players);
  setCanClick(true);
};
export const injectDummyData_OneTeamOverloaded = (setResult, setCanClick) => {
  const players = [
    { name: "탑유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 50, totalScore: 1150, mainRole: "TOP", backupRoles: ["JUNGLE"] },
    { name: "정글유저1", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 60, totalScore: 1260, mainRole: "JUNGLE", backupRoles: [] },
    { name: "미드유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 55, totalScore: 1155, mainRole: "MIDDLE", backupRoles: [] },
    { name: "원딜유저1", tag: "KR1", tier: "SILVER", tierScore: 1000, winScore: 80, totalScore: 1080, mainRole: "BOTTOM", backupRoles: ["UTILITY"] },
    { name: "서폿유저1", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 40, totalScore: 1140, mainRole: "UTILITY", backupRoles: [] },
    
    { name: "탑유저2", tag: "KR1", tier: "PLATINUM", tierScore: 1200, winScore: 50, totalScore: 1250, mainRole: "TOP", backupRoles: [] },
    { name: "정글유저2", tag: "KR1", tier: "GOLD", tierScore: 1100, winScore: 60, totalScore: 1160, mainRole: "JUNGLE", backupRoles:["TOP"] },
    { name: "미드유저2", tag:"KR1" ,tier:"GOLD" ,tierScore:"1100" ,winScore:"45" ,totalScore:"1145" ,mainRole:"MIDDLE" ,backupRoles:["BOTTOM"]},
    { name:"원딜유저2" ,tag:"KR1" ,tier:"SILVER" ,tierScore:"1000" ,winScore:"70" ,totalScore:"1070" ,mainRole:"BOTTOM" ,backupRoles:[]},
    { name:"서폿유저2" ,tag:"KR1" ,tier:"GOLD" ,tierScore:"1100" ,winScore:"40" ,totalScore:"1140" ,mainRole:"UTILITY" ,backupRoles:[]} 
  ];
  setResult(players);
  setCanClick(true);
}

export default {
  injectDummyData_JungleOverload,
  injectDummyData_NoBackups,
  injectDummyData_UnbalancedScore,
  injectDummyData_MissingRoles,
  injectDummyData_PotentialDuplicateInTeam,
  injectDummyData_OnlyOneSupport,
  injectDummyData_NoMid,
  injectDummyData_AllUnranked,
  injectDummyData_AllSameTierButRandomRoles,
  injectDummyData_HardFallbackRequired,
  injectDummyData_NormalMatch1,
  injectDummyData_NormalMatch2,
  injectDummyData_OneTeamOverloaded
}