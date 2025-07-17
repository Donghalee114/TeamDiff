import { useEffect } from "react";
import Footer from "../component/footer";
import Headers from "../component/Header";
import '../utils/mainpage.css'

function MainPage() {
const snowflakes = Array.from({ length: 20 });

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

useEffect(() => {
  fetch(`${BASE_URL}/ping`)
    .then(res => res.json())
    .then(data => console.log(data.message))
    .catch(err => console.error('Ping failed:', err));
}, []);

  return (
    <>
      <Headers text="LoL 토너먼트 팀 관리 시스템" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          background: "linear-gradient(135deg,rgb(44, 44, 78) 0%,rgb(55, 58, 95) 100%)",
          padding: "24px",
        }}
      >
<div className="snow-container">
  {snowflakes.map((_, i) => {
  const left = Math.random() * 100;
  const duration = 4 + Math.random() * 4;
  const delay = Math.random() * 5; // 각 입자마다 시작 시간 다르게
  const size = 8 + Math.random() * 12;
  const colors = ['#4f46e5', '#60a5fa', '#a78bfa', '#ec4899'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      key={i}
      className="snowflake"
      style={{
        left: `${left}vw`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
    />
  );
})}

</div>
        <div
          style={{
            background: "#26293a",
            borderRadius: "20px",
            padding: "36px",
            maxWidth: "640px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            zIndex: 9999
          }}
        >

          <h1
            style={{
              fontSize: "2rem",
              color: "#4f46e5",
              marginBottom: "16px",
            }}
          >
            팀을 만들고, 토너먼트를 시작하세요!
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "12px",
              color: "white",
            }}
          >
            이 사이트는 <strong>League of Legends</strong> 사용자들을 위한
            <br />
            <strong>팀 생성 · 팀원 관리 · 토너먼트 운영</strong>을 지원하는 플랫폼입니다.
          </p>

          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "20px",
              color: "white",
            }}
          >
            상단 메뉴에서 <strong>팀 만들기, 토너먼트 입장</strong> 등 다양한 기능을 경험해보세요!
          </p>

          <div style={{ marginTop: "24px" }}>
            <a
              href="/teamMatch"
              style={{
                backgroundColor: "#6366f1",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "0.95rem",
                boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
                transition: "background 0.2s",
              }}
            >
              지금 바로 시작하기 →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MainPage;
