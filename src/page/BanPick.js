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

const SOCKET_URL    = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';
const PER_TURN_TIME = 30; // 초

/* ───────────────────────────── 1. 드래프트 순서 헬퍼 ─────────────────────────── */
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

/* ───────────────────────────────── 컴포넌트 ─────────────────────────────────── */
export default function BanPick() {
  /* ---------- 0. 라우팅 & 공통 훅 ---------- */
  const { roomId }  = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const socketRef   = useRef(null);

  /* ---------- 1. 쿼리/초기 상태 ---------- */
  const query       = new URLSearchParams(window.location.search);
  const myHostKey   = state?.hostKey || query.get('hostKey') || null; // 나의 hostKey (uuid)

  const [roomData, setRoomData] = useState(state || null);
  const [myRole,   setMyRole]   = useState(state?.role || null);

  /* ---------- 2. 드래프트 진행 상태 ---------- */
  const [turnOrder, setTurnOrder] = useState([]);
  const [turnIdx,   setTurnIdx]   = useState(0);
  const [finished,  setFinished]  = useState(false);

  /* ---------- 3. 챔피언 / 선택 상태 ---------- */
  const [champions, setChampions] = useState([]);
  const [picked,    setPicked]    = useState([]);
  const [pending,   setPending]   = useState(null);

  /* ---------- 4. 검색/타이머/필터 ---------- */
  const [search,  setSearch]  = useState('');
  const [timer,   setTimer]   = useState(PER_TURN_TIME);
  const [endTime, setEndTime] = useState(Date.now() + PER_TURN_TIME * 1000);
  const [selectedRole, setSelectedRole] = useState('ALL');

  /* ---------- 5. 시리즈 / 모달 ---------- */
  const [series,      setSeries]      = useState({ blueWins:0, redWins:0, currentGame:1, seriesOver:false });
  const [sidePrompt,  setSidePrompt]  = useState(null);
  const [opponentLeft,setOpponentLeft]= useState(false);

  /* ---------- 6. 기타 ---------- */
  const [myId, setMyId] = useState('');
  const isHost = roomData?.hostKey && roomData.hostKey === myHostKey; // 호스트 판별

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

  /* 새로고침·닫기 직전 상대방에게 알림(emit) 
  useEffect(() => {
    const notifyLeave = () => {
      if (socketRef.current) socketRef.current.emit('user-leave', { roomId, role: myRole });
    };
    window.addEventListener('pagehide',   notifyLeave); // iOS/Safari 대응
    window.addEventListener('beforeunload', notifyLeave);
    return () => {
      window.removeEventListener('pagehide', notifyLeave);
      window.removeEventListener('beforeunload', notifyLeave);
    };
  }, [roomId, myRole]);
  */

  /* ───────────────────────────── 3. 데이터 초기 로딩 ────────────────────────── */
  /* (1) 방 정보 */
  useEffect(() => {
    if (roomData) return;
    (async () => {
      const res  = await fetch(`${SOCKET_URL}/room/${roomId}`);
      const data = await res.json();
      const role = new URLSearchParams(window.location.search).get('role');
      setRoomData({ ...data, role, roomId });
      setTurnOrder(getBanPickOrder()); // ← 이 시점에서 바로 넣는 게 좋음
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
    fetch('https://ddragon.leagueoflegends.com/cdn/14.12.1/data/ko_KR/champion.json')
      .then(r => r.json())
      .then(d =>
        setChampions(
          Object.values(d.data).map(c => ({
            id    : c.id,
            name  : c.name,
            icon  : `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${c.image.full}`,
            splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
          }))
        )
      );
  }, []);

  /* ───────────────────────────── 4. 소켓 세팅 ──────────────────────────────── */
  useEffect(() => {
    if (!roomData) return;
    const s = io(SOCKET_URL, { transports:['websocket'] });
    socketRef.current = s;

    /* ① 방 입장 */
    s.emit('join-room', {
      roomId,
      role    : myRole,
      blueTeam: roomData.blueTeam,
      redTeam : roomData.redTeam,
      bo      : roomData.bo,
      mode    : roomData.mode,
      hostKey : myHostKey
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
      setOpponentLeft(true);            // 모달 ON
    });

    return () => {
      s.emit('user-leave', { roomId, role: myRole });  // 🔥 진짜 나갈 때만 보냄
      s.disconnect();
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
    socketRef.current.emit('match-result', { roomId, winner, hostKey:myHostKey });
    alert(`${winner==='blue'? roomData.blueTeam : roomData.redTeam} 승리로 기록했습니다!`);
  };

  const chooseSide = side => {
    socketRef.current.emit('side-chosen', { roomId, loser:sidePrompt.loser, side });
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

  /* ───────────────────────────── 7. 디버그 로그 버튼 ───────────────────────── */
  const log = () => {
    console.log('소켓 ID:', socketRef.current?.id);
    console.log('호스트 키:', roomData?.hostKey);
    console.log('isHost:', isHost);
  };

  /* ───────────────────────────── 8. 렌더 ───────────────────────────────────── */
  return (
    <>
      <Headers text = "벤픽을 하고 승패를 결정하세요!"/>

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
        <button onClick={log}>로그</button>

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
          <div className={`team-column blue ${curTurn.team==='blue'?'highlight':'inactive'}`}>
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
                    <button className="blue-win" onClick={()=>handleResult('blue')}>{roomData.blueTeam} 승</button>
                    <button className="red-win"  onClick={()=>handleResult('red')}>{roomData.redTeam} 승</button>
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
                      <div key={c.id} className={`champ-card ${disabled?'disabled':''} ${selected?'pending':''}`} onClick={()=>onCardClick(c.id)}>
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
          <div className={`team-column red ${curTurn.team==='red'?'highlight':'inactive'}`}>
            {roomData?.redTeam}
            {renderPickList('red')}
            {renderBanList('red')}
          </div>
        </div>
      </div>
    </>
  );
}
