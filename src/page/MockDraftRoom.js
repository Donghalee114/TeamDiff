import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../utils/MockDraftRoom.css';
import Headers from '../component/Header';

const SOCKET_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';
let socket;

export default function MockDraftRoom() {
  const { state } = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const inviteUrl = state?.inviteUrl;

  const query = new URLSearchParams(window.location.search);
  const userRole = query.get("role");
  const userHostId = query.get("hostId"); // 🔑 쿼리에서 hostKey 추가로 받기

  const [roomData, setRoomData] = useState(state || null);
  const [isReady, setIsReady] = useState(false);
  const [roomStatus, setRoomStatus] = useState({ blueReady: false, redReady: false });
  const [draftStarted, setDraftStarted] = useState(false);

  const roleToKorean = {
    standard: '일반전',
    fearless: '피어리스',
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    alert("링크 복사 완료!")
  }

  // ✅ 새로고침 대비: state 없으면 백엔드에서 fetch
  useEffect(() => {
    if (!roomData) {
      fetch(`${SOCKET_URL}/room/${roomId}`)
        .then(res => res.json())
        .then(data => {
          if (!data || data.error) {
            alert('방 정보를 불러올 수 없습니다.');
            return;
          }

          // 쿼리스트링의 내 역할을 추가하여 상태 설정
          setRoomData({ ...data, role: userRole, roomId , hostKey : userHostId});
        })
        .catch(err => {
          console.error(err);
          alert('서버 연결 오류');
        });
    }
  }, [roomData, roomId, userRole]);

  // ✅ 소켓 연결 및 이벤트 처리
  useEffect(() => {
    if (!roomData || !roomData.role || !roomData.blueTeam || !roomData.redTeam) return;

    socket = io(SOCKET_URL);
    socket.emit('join-room', { roomId, role: roomData.role , hostKey : roomData.hostKey });

    socket.on('room-status', (status) => {
      setRoomStatus(status);
    });

    socket.on('start-draft', () => {
      setDraftStarted(true);
      navigate(`/BanPick/${roomId}`, { state: roomData }); // 백엔드에서 불러온 roomData 전달
    });

    return () => {
      socket.disconnect();
    };
  }, [roomData, roomId, navigate]);

  const handleReady = () => {
    setIsReady(true);
    socket.emit('ready');
  };

  if (!roomData) return <p style={{ textAlign: 'center', padding: '50px' }}>방 정보를 불러오는 중...</p>;

  return (
    <>
      <Headers />
      <div className="room-container">
        <div className="leader-container">
          <h1>{roomData.blueTeam}</h1>
         
          <div style={roomStatus.blueReady ? { background: "rgba(61, 182, 112, 0.38)", width: "100%" } : null}>
            {roomStatus.blueReady ? '✅ 준비 완료' : '대기 중'}
          </div>
        </div>

        <div className="room-info">
        <h2 className='copy' onClick={() => copyLink()}>방 링크 복사하기!</h2>
         
          <h3>{roomData.blueTeam} vs {roomData.redTeam}</h3>
          <p>진행 방식: BO{roomData.bo} / 벤픽 방식: {roleToKorean[roomData.mode]}</p>
          <p>당신은 <b style={roomData.role === 'blue' ? { color: "#38abe5" } : { color: "red" }}>
            {roomData.role === 'blue' ? '블루팀 팀장' : '레드팀 팀장'}
          </b>입니다.</p>

          <button onClick={handleReady} disabled={isReady}>
            {isReady ? '준비 완료' : '준비하기'}
          </button>

          <div className="waiting-message">
            {draftStarted
              ? '밴픽을 시작합니다!'
              : '양 팀 팀장이 모두 준비 시 밴픽이 시작됩니다...'}
          </div>
        </div>

        <div className="leader-container">
          <h1>{roomData.redTeam}</h1>
          <div style={roomStatus.redReady ? { background: "rgba(61, 182, 112, 0.38)", width: "100%" } : null}>
            {roomStatus.redReady ? '✅ 준비 완료' : '대기 중'}
          </div>
        </div>
      </div>
    </>
  );
}
