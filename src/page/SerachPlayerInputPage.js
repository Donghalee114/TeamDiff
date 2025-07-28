// SearchPlayerInputPage.jsx
import { useNavigate } from "react-router-dom";
import Headers from "../component/Header";
import { useState } from "react";

export default function SearchPlayerInputPage() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!inputValue.includes("#")) {
      alert("소환사 이름과 태그를 #으로 구분해서 입력해주세요.");
      return;
    }

    const [name, tag] = inputValue.split("#");
    const trimmedName = name.trim();
    const trimmedTag = tag.trim();

    if (!trimmedName || !trimmedTag) {
      alert("잘못된 입력입니다.");
      return;
    }

    navigate(`/SearchPlayerInfo/${encodeURIComponent(trimmedName)}%23${encodeURIComponent(trimmedTag)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <Headers />
      <div style={{ marginTop: "100px", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>LoL 전적 검색 시스템</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          소환사 이름을 검색하고 랭크와 최근 전적을 확인해보세요!
        </p>
        <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
<input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="소환사이름#KR1"
          onKeyDown={handleKeyDown}
          style={{
            padding: "12px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            width: "300px",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 16px",
            borderRadius: "0 8px 8px 0",
            backgroundColor: "#339afaff",
            color: "#1e293b",
            border: "none",
            fontWeight: "bold",
            height : "42px",
            marginTop: "-2px"
          }}
        >
          검색
        </button>
        </span>
        
      </div>
    </>
  );
}
