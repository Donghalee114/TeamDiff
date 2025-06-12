import { useRef, useState , useEffect } from 'react';


const tierScoreTable = {
  IRON: 200, BRONZE: 500, SILVER: 700, GOLD: 1000,
  PLATINUM: 1500, EMERALD : 2000, DIAMOND: 2500, MASTER: 3500,
  GRANDMASTER: 4500, CHALLENGER: 5000, UNRANKED: 0
};


const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function useSummonerInput() {
  const inputRefs = useRef([]);



const [summoners, setSummoners] = useState(
  Array.from({ length: 10 }, () => ({ name: '', tag: '', input: '' }))
);

  const [result, setResult] = useState([]);
  const [teamResult, setTeamResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [warning, setWarning] = useState('');
    const [teamList, setTeamList] = useState([]);



  const handleTeamList = async () => {
  const res = await fetch(`${BASE_URL}/maketeam/selectTeams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (res.ok) {
    const data = await res.json();
    const teamdata = data.map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl
    }));


    setTeamList(teamdata);
 
  } else {
    console.error('팀 목록을 불러오는 데 실패했습니다.');
  }
}

  const handleSingleInput = (idx, value) => {
    const [name, tag = ''] = value.includes('#') ? value.split('#') : [value, ''];
    const newSummoners = [...summoners];
    newSummoners[idx] = { name, tag , input : value};
    setSummoners(newSummoners);
  };

const handleBulkPaste = e => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const parsed = lines.slice(0, 10).map(line => {
    const cleaned = line.includes(' 님이') ? line.split(' 님이')[0] : line;
    const [name, tag = 'KR1'] = cleaned.split('#');
    return {
      name: name.trim(),
      tag: tag.trim(),
      input: `${name.trim()}#${tag.trim()}`
    };
  
  });

  setSummoners(parsed); // ✅ 여기까지만

  const newSummoners = [...summoners];
  let insertIndex = newSummoners.findIndex(s => !s.name);
  parsed.forEach(player => {
    if (insertIndex < 10) newSummoners[insertIndex++] = player;
  });
  setSummoners(newSummoners);
};

  const handleDeleteSummoner = (idx) => {
    const newSummoners = [...summoners];
    newSummoners[idx] = { name: '', tag: '' };
    setSummoners(newSummoners);
  };

  const handleClearInput = () => {
    setSummoners(Array(10).fill({ name: '', tag: '' }));
  };

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const handleMakeTeams = async () => {

    try {
      setIsLoading(true);
      setTeamResult(null);
      const res = await fetch(`${BASE_URL}/teams/make-teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });

  
    await sleep(500); // 0.5초 대기
      const data = await res.json();
      setTeamResult(data);
    } catch (err) {
      console.error('팀 구성 실패', err);
    }finally {
      setIsLoading(false);}
  };

  const handleFetchAllSummoners = async () => {
    if (summoners.some(s => !s.name)) {
      setWarning('소환사 이름을 모두 입력해주세요.');
      return;
    }
    setWarning('');
    const newResult = [];

    for (let i = 0; i < summoners.length; i++) {
      const { name, tag = 'KR1' } = summoners[i];
      setLoadingIndex(i);
      setIsLoading(true);

      try {
        const encodedName = encodeURIComponent(name);
        const res1 = await fetch(`${BASE_URL}/summoner/${encodedName}?tag=${tag}`);
        const data1 = await res1.json();
        const puuid = data1.puuid;

        const res2 = await fetch(`${BASE_URL}/summoner/league/${puuid}`);
        const data2 = await res2.json();
        const soloRank = data2.find(e => e.queueType === 'RANKED_SOLO_5x5');
        const tier = soloRank ? soloRank.tier.toUpperCase() : 'UNRANKED';
        const tierScore = tierScoreTable[tier] || 0;

        await sleep(1200);

        const res3 = await fetch(`${BASE_URL}/merged-analyze/${puuid}`);
        const data3 = await res3.json();

        const winScore = data3.scoreFromWinRate || 0;
        const winRate = data3.winRate || 0;
        const totalScore = tierScore + winScore;

        newResult.push({
          name, tag, puuid, tier, tierScore,
          winScore, winRate, totalScore,
          mainRole: data3.mainRole,
          backupRoles: data3.backupRoles
        });

      } catch (err) {
        console.error(`${name} 실패`, err);
        newResult.push({
          name, tag, puuid: 'Error', tier: 'Error',
          winScore: 0, winRate: 0, totalScore: 0,
          mainRole: 'Error', backupRoles: ['Error']
        });
        await sleep(1500);
      }
    }

    setIsLoading(false);
    setWarning('');
    setCanClick(true);
    setLoadingIndex(null);
    setResult(newResult);

  };

const handleBulkPasteFromTextArea = () => {
  const textarea = document.getElementById("summonerInput");
  if (!textarea) return;
  const text = textarea.value;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const parsed = lines.slice(0, 10).map(line => {
    const cleaned = line.includes(' 님이') ? line.split(' 님이')[0] : line;
    const [name, tag = 'KR1'] = cleaned.split('#');
    return {
      name: name.trim(),
      tag: tag.trim(),
      input: `${name.trim()}#${tag.trim()}`
    };
  });

  const newSummoners = [...summoners];
  let insertIndex = newSummoners.findIndex(s => !s.name);
  parsed.forEach(player => {
    if (insertIndex < 10) newSummoners[insertIndex++] = player;
  });
  setSummoners(newSummoners);
};


  useEffect(() => {

  if (result.length === 10 && teamResult === null && canClick) {
    handleMakeTeams(); // 자동 팀 구성
  }
}, [result , canClick , teamResult]);

return {
  summoners, setSummoners, result, setResult, teamResult, setTeamResult,
  isLoading, loadingIndex, canClick, setCanClick, warning,
  inputRefs, handleBulkPasteFromTextArea, teamList, setTeamList,
  handleSingleInput, handleBulkPaste,
  handleDeleteSummoner, handleClearInput,
  handleFetchAllSummoners, handleMakeTeams , handleTeamList
};

}
