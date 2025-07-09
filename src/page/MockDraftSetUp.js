// MockDraftSetup.jsx
import React, { useEffect, useState } from 'react';
import '../utils/MockDraft.css';
import { v4 as uuidv4 } from 'uuid';
import Headers from '../component/Header';
import Footer from '../component/footer';
import { useNavigate } from 'react-router-dom';

const MockDraftSetup = () => {
  const [blueTeam, setBlueTeam] = useState('');
  const [redTeam, setRedTeam] = useState('');
  const [bo, setBo] = useState(3);
  const [mode, setMode] = useState('standard'); // standard or fearless
  const [role, setRole] = useState('blue');
  const [anotherRole , setAnotherRole] = useState('')
  const hostKey = uuidv4();   
  const navigate = useNavigate();

    useEffect(() => {
    if(role === 'blue'){
      setAnotherRole("red")
    }else {
      setAnotherRole("blue")
    }
    }, [role])

const handleSubmit = async () => {
  if (!blueTeam || !redTeam) return alert('팀 이름을 입력해주세요.');

  const roomId = uuidv4();
  const roomData = { roomId, blueTeam, redTeam, bo, mode , hostKey };

  try {
    // 백엔드에 방 정보 저장
    const res = await fetch(`${process.env.REACT_APP_BASE_URL || 'http://localhost:6900'}/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });

    if (!res.ok) {
      const error = await res.json();
      return alert(`방 생성 실패: ${error.message || '서버 오류'}`);
    }

    // 상대팀 링크 생성
    const inviteUrl = `${window.location.origin}/MockDrafts/${roomId}?role=${anotherRole}&hostKey=${hostKey}&blueTeam=${encodeURIComponent(
      blueTeam
    )}&redTeam=${encodeURIComponent(redTeam)}&bo=${bo}&mode=${mode}`;

    // 현재 유저는 바로 입장
    navigate(`/MockDrafts/${roomId}`, {
      state: { ...roomData, role , inviteUrl}
    });

    // 초대 링크 복사
    await navigator.clipboard.writeText(inviteUrl);
    alert(`클립보드에 링크가 복사되었습니다. 상대방에게 링크를 보내주세요!`);

  } catch (err) {
    console.error(err);
    alert('서버와 연결 중 오류가 발생했습니다.');
  }
};


  return (
    <>
      <Headers />

      <div className="setup-container">
        <h2>모의 밴픽 설정</h2>

        <div className="setup-field">
          <label>블루팀 이름</label>
          <input value={blueTeam} onChange={e => setBlueTeam(e.target.value)} />
        </div>

        <div className="setup-field">
          <label>레드팀 이름</label>
          <input value={redTeam} onChange={e => setRedTeam(e.target.value)} />
        </div>

        <div className="setup-field">
          <label>진행 방식</label>
          <div className="radio-group">
            <label><input type="radio" value={1} checked={bo === 1} onChange={() => {setBo(1); setMode("standard") }} /> 단판</label>
            <label><input type="radio" value={3} checked={bo === 3} onChange={() => setBo(3)} /> 3판 2선제</label>
            <label><input type="radio" value={5} checked={bo === 5} onChange={() => setBo(5)} /> 5판 3선제</label>
          </div>
        </div>

        <div className="setup-field">
          <label>벤픽 방식</label>
          <div className="radio-group">
            <label><input type="radio" value="standard" checked={mode === "standard"} onChange={() => setMode("standard")} /> 일반</label>
            <label>
              <input
                type="radio"
                value="fearless"
                checked={mode === "fearless"}
                onChange={() => setMode("fearless")}
                disabled={bo === 1}
              />
              피어리스
              {bo === 1 && <span style={{ color: "#facc15", fontSize: "0.9rem" }}> (단판은 일반만 가능)</span>}
            </label>
          </div>
        </div>

        <div className="setup-field">
          <label>팀 선택</label>
          <div className="radio-group">
            <label><input type="radio" value="blue" checked={role === "blue"} onChange={() => setRole("blue")} /> 블루팀</label>
            <label><input type="radio" value="red" checked={role === "red"} onChange={() => setRole("red")} /> 레드팀</label>
          </div>
        </div>

        <button className="start-button" onClick={handleSubmit}>방 생성 및 입장</button>
      </div>
    </>
  );
};

export default MockDraftSetup;
