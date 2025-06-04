import { useState, useEffect } from 'react';

export default function CreateTeamForm({ tournamentsID, setOpenTeamMake }) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

  const logoPresets = [
    { name: '로고1', url: 'https://i.imgur.com/veeUr29.jpeg' },
    { name: '로고2', url: 'https://i.imgur.com/1RZpY66.jpeg' },
    { name: '로고3', url: 'https://i.imgur.com/rma1KP7.jpeg' },
    { name: '로고4', url: 'https://i.imgur.com/qeGpW7z.jpeg' },
    { name: '로고5', url: 'https://i.imgur.com/rS8Rjsj.jpeg' },
    { name: '로고6', url: 'https://i.imgur.com/agF8YfW.jpeg' },
    { name: '토끼', url: 'https://cdn-icons-png.flaticon.com/512/616/616439.png' },
    { name: '거북이', url: 'https://cdn-icons-png.flaticon.com/512/616/616417.png' },
    { name: '도마뱀', url: 'https://cdn-icons-png.flaticon.com/512/616/616471.png' },
    { name: '곰', url: 'https://cdn-icons-png.flaticon.com/512/616/616448.png' }
  ];

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
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", background: "#f9f9f9" }}>
      <h2>팀 생성</h2>

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

      <div>
        <p>로고 선택:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {logoPresets.map((logo) => (
            <img
              key={logo.url}
              src={logo.url}
              alt={logo.name}
              title={logo.name}
              width="60"
              height="60"
              onClick={() => setLogoUrl(logo.url)}
              style={{
                border: logoUrl === logo.url ? '3px solid #6366f1' : '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '4px',
                backgroundColor: logoUrl === logo.url ? '#eef2ff' : '#fff'
              }}
            />
          ))}
        </div>
      </div>

      {logoUrl && (
        <div style={{ marginTop: "12px" }}>
          <p>선택된 로고 미리보기:</p>
          <img src={logoUrl} alt="로고 미리보기" width="80" height="80" />
        </div>
      )}

      <button type="submit" style={buttonStyle}>팀 생성</button>
    </form>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "12px",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
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
