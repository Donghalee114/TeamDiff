
import React, { useState, useEffect } from 'react';
import '../Searchplayer.css'

export default function SummonerStoragePopup({ summoners, setSummoners, onClose }) {
  const [savedSlots, setSavedSlots] = useState(Array(5).fill(null));

const loadSavedSlots = () => {
  const loaded = savedSlots.map((_, i) => {
    const data = localStorage.getItem(`savedSummoners_${i}`);
    return data ? JSON.parse(data) : null;
  });
  setSavedSlots(loaded);
};

useEffect(() => {
  loadSavedSlots();
}, []);


  const saveToSlot = (index) => {
    if (summoners.length === 0 || !summoners.some(s => s.name)) {
      alert('저장할 소환사 정보가 없습니다.');
      return;
    }
    localStorage.setItem(`savedSummoners_${index}`, JSON.stringify(summoners));
    alert(`슬롯 ${index + 1}에 저장되었습니다.`);
    loadSavedSlots();
  };

  const loadFromSlot = (index) => {
    const data = localStorage.getItem(`savedSummoners_${index}`);
    if (data) {
      setSummoners(JSON.parse(data));
      alert(`슬롯 ${index + 1}에서 불러왔습니다.`);
      loadSavedSlots();
      onClose();
    } else {
      alert('저장된 데이터가 없습니다.');
    }
    loadSavedSlots();
  };

  const deleteSlot = (index) => {
    localStorage.removeItem(`savedSummoners_${index}`);
    alert(`슬롯 ${index + 1}이 삭제되었습니다.`);
    loadSavedSlots();
  }

  const vaild = summoners.filter(s => s.name && s.tag);

  return (
<div style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#2a2d4e',  // 어두운 배경
  border: '1px solid #3b3f5c',
  padding: '24px',
  borderRadius: '16px',
  zIndex: 9999,
  width: '340px',
  maxHeight: '360px',
  overflowY: 'auto',
  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  color: '#e0e0e0'
}}>
  <button
    className='buttonWarning'
    onClick={onClose}
    style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: '#ff4d4d',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      cursor: 'pointer'
    }}>
    닫기
  </button>

  <h3 style={{ marginBottom: '16px', color: '#facc15' }}>
    📦 소환사 저장 / 불러오기
  </h3>

  {Array.from({ length: 5 }).map((_, i) => {
    const filled = (savedSlots[i] || []).filter(s => s.name).length;
    return (
      <div key={i} style={{
        marginBottom: '14px',
        background: '#1f2235',
        borderRadius: '8px',
        padding: '12px'
      }}>
        <strong style={{ fontSize: '1rem', color: '#facc15' }}>
          슬롯 {i + 1}:
        </strong>
        <div style={{ fontSize: '0.9rem', margin: '6px 0', color: '#cbd5e1' }}>
          {filled > 0
            ? `${savedSlots[i]?.[0]?.name || '이름없음'} 외 ${filled - 1}명`
            : '비어있음'}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button className='buttonDefault' onClick={() => saveToSlot(i)}>저장</button>
          <button className='buttonDefault' onClick={() => loadFromSlot(i)}>불러오기</button>
          <button className='buttonWarning' onClick={() => deleteSlot(i)}>삭제</button>
        </div>
      </div>
    );
  })}
</div>

  );
}
