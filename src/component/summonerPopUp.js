
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
      position: 'fixed', top: 100, left: '54%', marginTop : "250px", transform: 'translateX(-50%)',
      background: 'white', border: '1px solid #ccc', padding: '20px', borderRadius: '12px', zIndex: 9999,
      width: '300px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
    }}>
      <button className='buttonWarning' onClick={onClose} style={{ marginTop: '5px' , marginLeft : "230px" , width : "60px" , height : "40px" , position : "fixed" , zIndex : "1"}}>닫기</button>
      <div style={{position : "relative",  left: "0px", width: "100%",}}>
      <h3 style={{  marginBottom: '12px' }}> 소환사 저장 / 불러오기</h3>
      {Array.from({ length: 5 }).map((_, i) => {
      const filled = (savedSlots[i] || []).filter(s => s.name).length;
      return (
        <div key={i} style={{ marginBottom: '10px' }}>
          <strong>슬롯 {i + 1}: </strong>  
          {filled > 0 
            ? `${savedSlots[i]?.[0]?.name || '이름없음'} 외 ${filled - 1}명`
            : '비어있음'}
          <div style={{ marginTop: '4px' }}>
            <button className = "buttonDefault" onClick={() => saveToSlot(i)} style={{ marginRight: '8px' }}>저장</button>
            <button className = "buttonDefault" onClick={() => loadFromSlot(i)}>불러오기</button>
            <button className = "buttonWarning" onClick={() => deleteSlot(i)} style={{ marginLeft: '8px' }}>삭제</button>
          </div>
        </div>
  );
})}

</div>
    </div>
  );
}
