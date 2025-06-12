import Footer from "../component/footer";
import Headers from "../component/Header";

function MainPage() {
  return (
    <>
      <Headers text="LoL 토너먼트 팀 관리 시스템" />

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh", // 🔽 1000px 대신 화면 비율로
          background: "linear-gradient(135deg,rgb(44, 44, 78) 0%,rgb(55, 58, 95) 100%)",
        padding: "24px",
      }}>
        <div style={{
          background: "#26293a",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "640px", // 🔽 너무 넓지 않게 고정
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        }}>

          <h1 style={{
            fontSize: "2rem", // 🔽 줄임
            color: "#4f46e5",
            marginBottom: "16px"
          }}>
            팀을 만들고, 토너먼트를 시작하세요!
          </h1>

          <p style={{
            fontSize: "1.1rem",
            marginBottom: "12px",
            color: "white"
          }}>
            이 사이트는 <strong>League of Legends</strong> 사용자들을 위한<br />
            <strong>팀 생성 · 팀원 관리 · 토너먼트 운영</strong>을 지원하는 플랫폼입니다.
          </p>

          <p style={{
            fontSize: "0.95rem",
            marginBottom: "20px",
            color: "#white"
          }}>
            상단 메뉴에서 <strong>팀 만들기, 토너먼트 입장</strong> 등 다양한 기능을 경험해보세요!
          </p>

          <div style={{ marginTop: "24px" }}>
            <a href="/teamMatch" style={{
              backgroundColor: "#6366f1",
              color: "white",
              padding: "10px 20px", // 🔽 padding 축소
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "0.95rem",
              boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
              transition: "background 0.2s",
            }}>
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
