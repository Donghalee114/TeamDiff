import { useState, useEffect } from 'react';

export default function CreateTeamForm({ tournamentsID, setOpenTeamMake }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoUrl) return alert("로고를 선택해주세요!");

    const body = {
      name,
      shortName,
      tournamentsID,
      logoUrl,
    };

    const res = await fetch(`${BASE_URL}/tournament/${tournamentsID}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert('팀 생성 성공!');
      setOpenTeamMake(false);
    } else {
      alert('팀 생성 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", borderRadius: "10px",  background: "linear-gradient(135deg, #1e293b, #334155)",}}>
      <h2 style={{ color: "rgb(79, 70, 229)"}}>팀 생성</h2>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="팀 이름"
        required
        style={inputStyle}
      />

      <input
        type="text"
        value={shortName}
        onChange={e => setShortName(e.target.value.slice(0, 3))}
        placeholder="약어 (2~3자)"
        required
        style={inputStyle}
      />

          <div style={{display : "flex" , justifyContent : "center" , gap : "20px"}}>
          <button type="submit" style={buttonStyle}>팀 생성</button>
          <button style={buttonStyle} onClick={() => setOpenTeamMake(false)}>취소</button>
          </div>
      
    </form>
  );
}

  const inputStyle = {
    flex: 1,
    height: '32px',
    border:   '1.5px solid #444',
    borderRadius: "6px",
    backgroundColor: '#1f2235',
    color: "#fff",
    padding: "0 8px",
    fontSize: "0.95rem",
    width : "95%",
    marginBottom : "10px"
  };
const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
