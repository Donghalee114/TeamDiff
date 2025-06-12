import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Headers from '../component/Header';
import '../utils/BanPick.css';

const SOCKET_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function BanPick() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const socketRef = useRef(null);

  const [roomData, setRoomData] = useState(state || null);
  const [myRole, setMyRole] = useState(state?.role || null);
  const [turnOrder, setTurnOrder] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [selectedChampions, setSelectedChampions] = useState([]);
  const [champions, setChampions] = useState([]);
  

  useEffect(() => {
    if (!roomData) {
      fetch(`${SOCKET_URL}/room/${roomId}`)
        .then(res => res.json())
        .then(data => {
          if (!data || data.error) {
            alert('방 정보를 불러올 수 없습니다.');
            return;
          }
          const query = new URLSearchParams(window.location.search);
          const role = query.get('role');
          setRoomData({ ...data, role, roomId });
          setMyRole(role);
          setTurnOrder(getBanPickOrder(data.bo, data.mode));
        })
        .catch(console.error);
    } else {
      setMyRole(state.role);
      setTurnOrder(getBanPickOrder(state.bo, state.mode));
    }
  }, [roomData, roomId, state]);

  useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/cdn/14.12.1/data/ko_KR/champion.json')
      .then(res => res.json())
      .then(data => {
        const champs = Object.values(data.data).map(c => ({
          id: c.id,
          name: c.name,
          icon: `https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${c.image.full}`
        }));
        setChampions(champs);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit('join-draft', { roomId });

    socket.on('update-draft', ({ champion, team, type }) => {
      setSelectedChampions(prev => [...prev, champion]);
      setTurnIndex(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleChampionSelect = (champId) => {
    const current = turnOrder[turnIndex];
    if (!current) return;
    if (current.team !== myRole) return alert('당신의 차례가 아닙니다.');
    if (selectedChampions.includes(champId)) return alert('이미 선택된 챔피언입니다.');

    socketRef.current.emit('select-champion', {
      roomId,
      champion: champId,
      team: current.team,
      type: current.type,
    });
  };

  const current = turnOrder[turnIndex] || {};
  const canSelect = current.team === myRole;

  const renderSlots = (team, type) => {
    const filtered = turnOrder
      .map((t, i) => ({ ...t, champ: selectedChampions[i] }))
      .filter(t => t.team === team && t.type === type);

    return (
      <div className="slots">
        {filtered.map((t, idx) => {
          const champ = champions.find(c => c.id === t.champ);
          return (
            <div key={idx} className="slot filled">
              {champ ? <img src={champ.icon} alt={champ.name} /> : '...'}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Headers />
      <div className="banpick-layout">
        <div className={`team-side blue-side ${current.team !== 'blue' ? 'inactive' : ''}`}>
          <h3>{roomData.blueTeam} (블루)</h3>
          <div className="ban-row">
            <span>밴</span>
            {renderSlots('blue', 'ban')}
          </div>
          <div className="pick-row">
            <span>픽</span>
            {renderSlots('blue', 'pick')}
          </div>
        </div>

        <div className="center-info">
          <h2>밴픽 진행중</h2>
          <p>현재 차례: <strong>{current.team === 'blue' ? '블루팀' : '레드팀'} - {current.type?.toUpperCase()}</strong></p>
          <p>선택된 챔피언 수: {selectedChampions.length} / {turnOrder.length}</p>

          <div className="champion-grid">
            {champions.map(c => {
              const isSelected = selectedChampions.includes(c.id);
              return (
                <div
                  key={c.id}
                  className={`champ-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isSelected && canSelect && handleChampionSelect(c.id)}
                >
                  <img src={c.icon} alt={c.name} />
                  <div className="champ-name">{c.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`team-side red-side ${current.team !== 'red' ? 'inactive' : ''}`}>
          <h3>{roomData.redTeam} (레드)</h3>
          <div className="ban-row">
            <span>밴</span>
            {renderSlots('red', 'ban')}
          </div>
          <div className="pick-row">
            <span>픽</span>
            {renderSlots('red', 'pick')}
          </div>
        </div>
      </div>
    </>
  );
}

function getBanPickOrder(bo = 3, mode = 'standard') {
  return [
    { type: 'ban', team: 'blue' }, { type: 'ban', team: 'red' },
    { type: 'ban', team: 'blue' }, { type: 'ban', team: 'red' },
    { type: 'ban', team: 'blue' }, { type: 'ban', team: 'red' },

    { type: 'pick', team: 'blue' }, { type: 'pick', team: 'red' },
    { type: 'pick', team: 'red' }, { type: 'pick', team: 'blue' },
    { type: 'pick', team: 'blue' }, { type: 'pick', team: 'red' },

    { type: 'ban', team: 'red' }, { type: 'ban', team: 'blue' },
    { type: 'ban', team: 'red' }, { type: 'ban', team: 'blue' },

    { type: 'pick', team: 'red' }, { type: 'pick', team: 'blue' },
    { type: 'pick', team: 'blue' }, { type: 'pick', team: 'red' }
  ];
}
