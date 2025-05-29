import React, { useRef , useState } from 'react';
import SummonerStoragePopup from './summonerPopUp';

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
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
      padding: "32px 28px",
      width: "650px",
      minWidth: "340px",
      height: "760px"
    }}>
     {showStoragePopup ? <SummonerStoragePopup summoners={summoners} setSummoners={setSummoners} onClose={toggleStoragePopup}/> : null}
      <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "18px", color: "#6366f1" }}>
        1. 소환사 정보 입력
      </h2>
      <div style={{ marginBottom: "16px" }}>
        <textarea
          rows={4}
          placeholder="한 줄에 한 명씩 닉네임#태그 입력 (예: 홍길동#KR1)"
          id="summonerInput"
          onPaste={onPaste}
          style={{
            position: "relative",
            width: "95%",
            border: "1.5px solid #c7d2fe",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "1rem",
            resize: "none",
            background: "#f3f4f6"
          }}
        />
        <div style={{
          marginLeft: "355px",
          background: "#f3f4f6",
          borderRadius: "10px",
          border: "1.5px solid #c7d2fe",
          padding: "12px 10px",
          display: "flex",
          justifyContent: "center",
          gap: "13px",
          alignItems: "center",
          width: "40%",
          height: "24px"
        }}>
          <button className="buttonDefault" onClick={handleBulkPasteFromTextArea}>추가</button>
          <button className="buttonDefault" onClick={toggleStoragePopup}>저장 및 불러오기</button>
        </div>
      </div>
      <button className="buttonWarning" style={{ marginLeft: "8px", marginBottom: "15px" }} onClick={onClear}>초기화</button>
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
              value={summoner.tag ? `${summoner.name || ''}#${summoner.tag}` : summoner.name || ''}
              onKeyDown={e => {
                if (e.key === 'Tab' && !e.shiftKey && idx === 9) {
                  e.preventDefault();
                  inputRefs.current[0]?.focus();
                }
              }}
              onChange={e => onInput(idx, e.target.value)}
              style={{
                flex: 1,
                height: '32px',
                border: loadingIndex === idx ? '2px solid #fbbf24' : '1.5px solid #c7d2fe',
                borderRadius: "6px",
                backgroundColor: loadingIndex === idx ? '#fef9c3' : '#f9fafb',
                padding: "0 8px",
                fontSize: "1rem"
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
      {warning && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{warning}</div>}
      <button
        onClick={onFetch}
        style={{
          width: "100%",
          marginTop: "10px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 0",
          fontWeight: 700,
          fontSize: "1.1rem",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        disabled={isLoading}
      >
        소환사 점수화
      </button>
    </section>
  );
}