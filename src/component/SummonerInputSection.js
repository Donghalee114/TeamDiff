import React, { useRef , useState } from 'react';
import SummonerStoragePopup from './summonerPopUp';
import '../Searchplayer.css'

export default function SummonerInputSection({
  summoners,
  setSummoners,
  isLoading,
  loadingIndex,
  warning,
  onInput,
  onPaste,
  onClear,
  onDelete,
  onFetch,
  handleBulkPasteFromTextArea
}) {
  const inputRefs = useRef([]);
  

  const [showStoragePopup, setShowStoragePopup] = React.useState(false);
  const toggleStoragePopup = () => {
    setShowStoragePopup(!showStoragePopup);
  };


  return (
    <section style={{
      background: "#26293a", // 어두운 카드 배경
      borderRadius: "16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      padding: "28px 24px",
      width: "650px",
      minWidth: "340px",
      height: "900px",
      color: "#e0e0e0"
    }}>

     {showStoragePopup ? <SummonerStoragePopup summoners={summoners} setSummoners={setSummoners} onClose={toggleStoragePopup}/> : null}
      <h2 style={{
          fontWeight: 700,
          fontSize: "1.2rem",
          marginBottom: "18px",
          color: "#c7a008"
        }}>
          1. 소환사 정보 입력
        </h2>

      <div style={{ marginBottom: "-37px" }}>
      <textarea
        rows={4}
        placeholder="위 입력창에 아래의 예시처럼 복사하거나 입력하시고 추가버튼을 누르시면 입력하실수 있습니다. 
        예시 1)
          JUGKlNG #kr 님이 로비에 참가하셨습니다.
          DK Sharvel #KR1 님이 로비에 참가하셨습니다.
          예시 2)
          SDW blunt#KR1
          홍길동#KR4
          Hide on Bush#KR1
          "
        onPaste={onPaste}
        style={{
          width: "96%",
          height: "130px",
          border: "1.5px solid #444",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "0.95rem",
          resize: "none",
          background: "#1f2235",
          color: "#e0e0e0"
        }}

        id="summonerInput"
      />

      <div style={{
        marginTop: "2px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px"
      }}>
        <button className="buttonDefault" onClick={handleBulkPasteFromTextArea}>추가</button>
        <button className="buttonDefault" onClick={toggleStoragePopup}>저장 및 불러오기</button>
      </div>

      </div>
        {warning && <span style={{color: '#ff6b6b', fontWeight: 700 }}>{warning}</span>}
        <span style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 0"
        }}>
          <button  style={{marginTop : "px"}}className="buttonWarning" onClick={onClear}>초기화</button>
          
        </span>


      {summoners.map((summoner, idx) => (
        <div key={idx} style={{
          display: "flex",
          gap: "8px",
          marginBottom: "8px",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span style={{ width: "26px", textAlign: "right", marginRight: "6px", fontWeight: "bold" }}>{idx + 1}.</span>
            <input
              
              type="text"
              ref={el => { if (el) inputRefs.current[idx] = el; }}
              placeholder="닉네임#태그 (예: Kimman#KR1)"
             value={summoner.input || (summoner.tag ? `${summoner.name || ''}#${summoner.tag}` : summoner.name || '')}

              onKeyDown={e => {
                if (e.key === 'Tab' && !e.shiftKey && idx === 9) {
                  e.preventDefault();
                  inputRefs.current[0]?.focus();
                }
              }}
              onChange={e => {
                const newSummoners = [...summoners];
                newSummoners[idx].input = e.target.value;
                setSummoners(newSummoners);
              }}
              onBlur={() => {
                const inputVal = summoners[idx].input || '';
                const [name, tag = ''] = inputVal.includes('#') ? inputVal.split('#') : [inputVal, ''];
                const newSummoners = [...summoners];
                newSummoners[idx] = {
                  ...newSummoners[idx],
                  name: name.trim(),
                  tag: tag.trim(),
                  input: `${name.trim()}${tag ? `#${tag.trim()}` : ''}`
                };
                setSummoners(newSummoners);
              }}
              style={{
                flex: 1,
                height: '32px',
                border: loadingIndex === idx ? '2px solid #fbbf24' : '1.5px solid #444',
                borderRadius: "6px",
                backgroundColor: loadingIndex === idx ? '#3b3a10' : '#1f2235',
                color: "#fff",
                padding: "0 8px",
                fontSize: "0.95rem"
              }}
            />

            <button
              className="buttonWarning"
              onClick={() => onDelete(idx)}
              tabIndex={-1}
              style={{

                border: "none",
                borderRadius: "6px",
                padding: "4px 8px",
                fontWeight: 600,
                marginLeft: "8px",
                cursor: "pointer"
              }}
            >
              삭제
            </button>
          </div>
          {loadingIndex === idx && <span style={{ marginLeft: '6px', fontSize: "1.1rem" }}>🔄</span>}
        </div>
      ))}
          
      <button
        onClick={onFetch}
        style={{
          width: "100%",
          marginTop: "16px",
          background: "#e7e7e7",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          padding: "12px 0",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer"
        }}
        className='hovers'
        disabled={isLoading}
      >
        소환사 점수화
      </button>

    </section>
  );
}