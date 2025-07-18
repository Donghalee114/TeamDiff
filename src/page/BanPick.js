// src/pages/BanPick.jsx
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Headers from '../component/Header';
import champPos from '../utils/championLine.json';
import '../utils/BanPick.css';
import TopIcon from '../utils/Position_Plat-Top.png';
import JugIcon from '../utils/Position_Plat-Jungle.png';
import MidIcon from '../utils/Position_Plat-Mid.png';
import BotIcon from '../utils/Position_Plat-Bot.png';
import SupIcon from '../utils/Position_Plat-Support.png';

export function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

const SOCKET_URL    = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';
const PER_TURN_TIME = 30; // 초

function getBanPickOrder() {
  return [
    { type:'ban',  team:'blue' }, { type:'ban',  team:'red'  },
    { type:'ban',  team:'blue' }, { type:'ban',  team:'red'  },
    { type:'ban',  team:'blue' }, { type:'ban',  team:'red'  },

    { type:'pick', team:'blue' }, { type:'pick', team:'red'  },
    { type:'pick', team:'red'  }, { type:'pick', team:'blue' },
    { type:'pick', team:'blue' }, { type:'pick', team:'red'  },

    { type:'ban',  team:'red'  }, { type:'ban',  team:'blue' },
    { type:'ban',  team:'red'  }, { type:'ban',  team:'blue' },

    { type:'pick', team:'red'  }, { type:'pick', team:'blue' },
    { type:'pick', team:'blue' }, { type:'pick', team:'red'  },
  ];
}

export default function BanPick() {

 const [lolVersion, setLolVersion] = useState('15.14.1'); // 초기 버전 설정

async function getLatestDDragonVersion() {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const versions = await response.json();
    if (versions && versions.length > 0) {
      return versions[0];
    } else {
      throw new Error("DDragon 버전을 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("DDragon 버전 API 호출 오류:", error);
    return null;
  }
}

useEffect(() => {
  getLatestDDragonVersion().then(version => {
    if (version) {
      setLolVersion(version);
    }
  });
}, []);

  /* ───────────────────────────── 0. 공통 훅 ──────────────────────────────── */
  const { roomId }  = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const socketRef   = useRef(null);
  // 새로운 ref 추가: 컴포넌트가 실제로 언마운트되는지 여부를 판단
  const isUnmounting = useRef(false);

  const query       = new URLSearchParams(window.location.search);
  const myHostKey   = state?.hostKey || query.get('hostKey') || null;

  const [roomData, setRoomData] = useState(state || null);
  const [myRole,   setMyRole]   = useState(state?.role || null);

  const [turnOrder, setTurnOrder] = useState([]);
  const [turnIdx,   setTurnIdx]   = useState(0);
  const [finished,  setFinished]  = useState(false);

  const [champions, setChampions] = useState([]);
  const [picked,    setPicked]    = useState([]);
  const [pending,   setPending]   = useState(null);

  const [search,  setSearch]  = useState('');
  const [timer,   setTimer]   = useState(PER_TURN_TIME);
  const [endTime, setEndTime] = useState(Date.now() + PER_TURN_TIME * 1000);
  const [selectedRole, setSelectedRole] = useState('ALL');

  const [series,      setSeries]      = useState({ blueWins:0, redWins:0, currentGame:1, seriesOver:false });
  const [sidePrompt,  setSidePrompt]  = useState(null);
  const [opponentLeft,setOpponentLeft]= useState(false);

  const [myId, setMyId] = useState('');
  const isHost = roomData?.hostKey && roomData.hostKey === myHostKey;

  /* ───────────────────────────── 2. 새로고침/닫기 가드 ───────────────────────── */
  /* 브라우저 새로고침(F5)·닫기 시 확인 경고 */
  useEffect(() => {
    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';           // Chrome 필수
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

    // 뒤로가기 버튼 "막기"
    useEffect(() => {
        // 컴포넌트 마운트 시 현재 URL을 history state에 다시 push하여
        // 브라우저의 뒤로가기 버튼을 눌러도 다시 현재 페이지로 돌아오게 함
        window.history.pushState(null, document.title, window.location.href);

        const handlePopState = (event) => {
            if (!finished) { // 밴픽이 아직 끝나지 않았다면
                window.history.pushState(null, document.title, window.location.href);
                console.log("뒤로가기 시도 감지! 밴픽 페이지 유지.");
            }
            // 밴픽이 끝났다면, 이 로직은 작동하지 않아 사용자가 자유롭게 뒤로갈 수 있도록 허용합니다.
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [finished]);

    // 컴포넌트 언마운트 시 isUnmounting.current 값을 true로 설정
    // 이 useEffect는 가장 마지막에 위치하는 것이 좋습니다.
    useEffect(() => {
        return () => {
            isUnmounting.current = true;
        };
    }, []);

  /* ───────────────────────────── 3. 데이터 초기 로딩 ────────────────────────── */
  /* (1) 방 정보 */
  useEffect(() => {
    if (roomData) return;
    (async () => {
      const res  = await fetch(`${SOCKET_URL}/room/${roomId}`);
      const data = await res.json();
      const role = new URLSearchParams(window.location.search).get('role');
      setRoomData({ ...data, role, roomId });
      setTurnOrder(getBanPickOrder());
      setMyRole(role);
    })();
  }, [roomData, roomId]);

  useEffect(() => {
    if (roomData && turnOrder.length === 0) {
      setTurnOrder(getBanPickOrder());
    }
  }, [roomData, turnOrder.length]);

  /* (2) 챔피언 목록 */
  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${lolVersion}/data/ko_KR/champion.json`)
      .then(r => r.json())
      .then(d =>
        setChampions(
          Object.values(d.data).map(c => ({
            id    : c.id,
            name  : c.name,
            icon  : `https://ddragon.leagueoflegends.com/cdn/${lolVersion}/img/champion/${c.image.full}`,
            splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
          }))
        )
      );
  }, [lolVersion]);

  /* ───────────────────────────── 4. 소켓 세팅 ──────────────────────────────── */
useEffect(() => {
  if (!roomData) return;
  const s = io(SOCKET_URL, { transports: ['websocket'] });
  socketRef.current = s;

  const userId = getUserId();

  s.emit('join-room', {
    roomId,
    role: myRole,
    blueTeam: roomData.blueTeam,
    redTeam: roomData.redTeam,
    bo: roomData.bo,
    mode: roomData.mode,
    hostKey: myHostKey,
    userId, // 여기 추가
  });

    /* ② 준비 완료 */
    s.emit('ready');

    /* ③ 공용 이벤트 */
    s.on('connect',         () => setMyId(s.id));
    s.on('update-draft',    ({ champion }) => {
      setPicked(p => [...p, champion]);
      setPending(null);
      setTurnIdx(i => i + 1);
      setTimer(PER_TURN_TIME);
      setEndTime(Date.now() + PER_TURN_TIME * 1000);
    });
    s.on('draft-finished',  () => setFinished(true));
    s.on('series-finished', data => {
      setSeries(data);
      alert(`시리즈 종료!\n블루 ${data.blueWins} : 레드 ${data.redWins}`);
      navigate('/');
    });
    s.on('choose-side',     ({ loser, nextGame }) => setSidePrompt({ loser, nextGame }));
    s.on('next-draft',      ({ currentGame, sideMap }) => {
      const newRole = sideMap[myRole];
      setSeries(prev => ({ ...prev, currentGame }));
      setPicked([]); setPending(null); setTurnIdx(0); setFinished(false);
      setTimer(PER_TURN_TIME); setEndTime(Date.now() + PER_TURN_TIME * 1000);
      setTurnOrder(getBanPickOrder());
      setMyRole(newRole);
      setRoomData(r => ({ ...r, role:newRole }));
    });

    /* ④ 상대방 퇴장 */
    s.on('user-left', ({ role }) => {
      console.log(`[알림] ${role} 유저 방 ${roomId}에서 나감`);
      setOpponentLeft(true);
    });

    return () => {
    if (isUnmounting.current) {
      s.emit('user-leave', { roomId, role: myRole, userId });
      s.disconnect();
    } else {
      // 리렌더링 시 연결 유지
    }
  };
}, [roomData, myRole, roomId, navigate, myHostKey]);


  
  /* ───────────────────────────── 5. 타이머 & 자동선택 ──────────────────────── */
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const remain = Math.ceil((endTime - Date.now()) / 1000);
      setTimer(remain);

      if (remain <= 0) {
        const cur = turnOrder[turnIdx];
        if (!cur) return;
        if (cur.type === 'ban') {
          socketRef.current.emit('select-champion', { roomId, champion:null, ...cur });
        } else {
          const avail  = champions.map(c => c.id).filter(id => !picked.includes(id));
          const random = avail[Math.floor(Math.random()*avail.length)];
          socketRef.current.emit('select-champion', { roomId, champion:random, ...cur });
        }
      }
    },250);
    return () => clearInterval(id);
  }, [endTime, turnIdx, champions, picked, turnOrder, finished, roomId]);

  /* ───────────────────────────── 6. 유틸 함수 ─────────────────────────────── */
  const curTurn = turnOrder[turnIdx] || {};
  const myTurn  = curTurn.team === myRole;

  const onCardClick = id => {
    if (!myTurn || picked.includes(id) || finished) return;
    setPending(p => (p === id ? null : id));
  };

  const onConfirm = () => {
    if (!pending || !myTurn || finished) return;
    socketRef.current.emit('select-champion', { roomId, champion:pending, ...curTurn });
    setPending(null);
  };

  const handleResult = winner => {
    if (myId !== roomData.hostId) return; // 안전 가드
    socketRef.current.emit('series-finished', { roomId, winner, hostKey:myHostKey });
    alert(`${winner==='blue'? roomData.blueTeam : roomData.redTeam} 승리로 기록했습니다!`);
  };

  const chooseSide = side => {
    socketRef.current.emit('choose-side', { roomId, loser:sidePrompt.loser, side });
    setSidePrompt(null);
  };

  const listOf = (team,type)=>
    turnOrder.map((t,i)=>({...t,champ:picked[i]})).filter(t=>t.team===team && t.type===type);

  const filtered = champions.filter(c=>{
    const nameMatch = c.name.includes(search)||c.id.toLowerCase().includes(search.toLowerCase());
    const roleMatch = selectedRole==='ALL'||(champPos[c.id] && champPos[c.id].includes(selectedRole));
    return nameMatch && roleMatch;
  });

  const renderPickList = team => (
    <div className="pick-list">
      {listOf(team,'pick').map((slot,i)=>{
        const champ = champions.find(c=>c.id===slot.champ);
        return <div key={i} className="pick-slot">{champ&&<img src={champ.splash} alt={champ.name} className="splash-img"/>}</div>;
      })}
    </div>
  );

  const renderBanList = team => (
    <div className="ban-list">
      {listOf(team,'ban').map((slot,i)=>{
        const champ = champions.find(c=>c.id===slot.champ);
        return <div key={i} className="ban-slot">{champ&&<img src={champ.icon} alt={champ.name}/>}</div>;
      })}
    </div>
  );

  /* ───────────────────────────── 8. 렌더 ───────────────────────────────────── */

  return (
    <>
      {/* 상대방 퇴장 모달 (확인 눌러야만 닫힘) */}
      {opponentLeft && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>상대방이 방을 나갔습니다.</h3>
            <button onClick={()=>{ setOpponentLeft(false); navigate('/'); }}>확인</button>
          </div>
        </div>
      )}

      {/* 사이드 선택 모달 */}
      {sidePrompt && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Game {sidePrompt.nextGame} — 패배 팀이 사이드를 고르세요</h3>
            <button onClick={()=>chooseSide('blue')}>BLUE 사이드</button>
            <button onClick={()=>chooseSide('red')}>RED 사이드</button>
          </div>
        </div>
      )}

      {/* ───────────────────────────── 메인 레이아웃 ─────────────────────────── */}
      <div className="banpick-wrapper">
        {/* 시리즈 스코어 / 디버그 로그 버튼 */}
        <div className="series-bar">
          <span>Game {series.currentGame}</span>
          <span className="blue-score">{series.blueWins}</span>
          <span> : </span>
          <span className="red-score">{series.redWins}</span>
        </div>

        {/* 타이머 */}
        {!finished && (
          <div className={`timer-bar ${timer<=5?'shake':timer<=10?'pulse':''}`}>
            <div className="timer-num">{timer}</div>
            <div className="timer-progress" style={{width:`${(timer/PER_TURN_TIME)*100}%`}}/>
            <span className="turn-label">{curTurn.team?.toUpperCase()} {curTurn.type}</span>
          </div>
        )}

        {/* 3컬럼 레이아웃 */}
        <div className="layout">
          {/* BLUE 컬럼 */}
          <div className={`team-column blue ${curTurn.team==='blue' || finished?' highlight':'inactive' }`}>
            {roomData?.blueTeam}
            {renderPickList('blue')}
            {renderBanList('blue')}
          </div>

          {/* CENTER 컬럼 */}
          <div className="center">
            {finished ? (
              <>
                {/* 결과 복사 박스 */}
                <div className="result-copy-box">
                  <p>설정: BO{roomData.bo} / {roomData.mode==='standard'?'일반':'피어리스'}</p>
                  <p>🔵 {roomData?.blueTeam} 픽: {listOf('blue','pick').map(s=>champions.find(c=>c.id===s.champ)?.name).join(', ')}</p>
                  <p>🔴 {roomData?.redTeam} 픽: {listOf('red','pick').map(s=>champions.find(c=>c.id===s.champ)?.name).join(', ')}</p>
                  <button onClick={()=>{
                    const text =
                      `설정: BO${roomData.bo} / ${roomData.mode==='standard'?'일반':'피어리스'}\n`+
                      `🔵 ${roomData?.blueTeam} 픽: `+
                      listOf('blue','pick').map(s=>champions.find(c=>c.id===s.champ)?.name).join(', ')+
                      `\n🔴 ${roomData?.redTeam} 픽: `+
                      listOf('red','pick').map(s=>champions.find(c=>c.id===s.champ)?.name).join(', ');
                    navigator.clipboard.writeText(text);
                    alert('복사되었습니다!');
                  }}>📋 복사하기</button>
                </div>

                {/* 경기 결과 입력 (호스트 전용) */}
                {isHost && (
                  <div className="result-panel">
                    <h3>경기 결과를 선택하세요</h3>
                    <button className="blue-win" onClick={()=> handleResult('blue')}>{roomData.blueTeam} 승</button>
                    <button className="red-win"  onClick={()=> handleResult('red')}>{roomData.redTeam} 승</button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 검색 / 라인 필터 */}
                <input className="search-input" placeholder="챔피언 이름 검색" value={search} onChange={e=>setSearch(e.target.value)}/>
                <div className="role-filter">
                  
                  {['TOP','JUNGLE','MID','BOTTOM','SUPPORT'].map(role=>(
                    <button key={role} className={selectedRole===role?'active':''} onClick={()=>setSelectedRole(selectedRole===role?'ALL':role)}>
                      {role==='TOP'?<img src={TopIcon} alt="탑"/>:
                       role==='JUNGLE'?<img src={JugIcon} alt="정글"/>:
                       role==='MID'?<img src={MidIcon} alt="미드"/>:
                       role==='BOTTOM'?<img src={BotIcon} alt="원딜"/>:
                       <img src={SupIcon} alt="서폿"/>}
                    </button>
                  ))}
                </div>

                {/* 턴 표시 */}
                <div className="turn-message">
                  {myTurn?`당신의 차례입니다 — ${curTurn.type.toUpperCase()}`:`상대팀 진행 중… — ${curTurn.team?.toUpperCase()} ${curTurn.type}`}
                </div>

                {/* 챔피언 그리드 */}
                <div className="champ-grid">
                  {filtered.map(c=>{
                    const disabled = picked.includes(c.id);
                    const selected = pending===c.id;
                    return (
                      <div key={c.id} className={`champ-card ${disabled?'disabled':''} ${selected?'pending':''}`} style={curTurn.type === 'pick' ? {border:" 1px solid rgb(110, 99, 109)"} : {}}  onClick={()=>onCardClick(c.id)}>
                        <img src={c.icon} alt={c.name}/>
                        <span className="champ-name">{c.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 확정 버튼 */}
                <button className={curTurn.type==='pick'?'confirm-btn':'ban-btn'} disabled={!pending||!myTurn} onClick={onConfirm}>
                  {curTurn.type==='pick'?'챔피언 선택':'챔피언 벤'}
                </button>
              </>
            )}
          </div>

          {/* RED 컬럼 */}
          <div className={`team-column red ${curTurn.team==='red' || finished ?'highlight':'inactive'}`}>
            {roomData?.redTeam}
            {renderPickList('red')}
            {renderBanList('red')}
          </div>
        </div>
      </div>
    </>
  );
}

