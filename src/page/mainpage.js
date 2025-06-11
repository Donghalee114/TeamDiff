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
        minHeight: "80vh",
        background: "linear-gradient(135deg, #e0e7ff, #fdf4ff)",
        padding: "40px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "48px",
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
        }}>

          <h1 style={{ fontSize: "2.7rem", color: "#4f46e5", marginBottom: "16px" }}>
             팀을 만들고, 토너먼트를 시작하세요!
          </h1>

          <p style={{ fontSize: "1.25rem", marginBottom: "16px", color: "#374151" }}>
            이 사이트는 <strong>League of Legends</strong> 사용자들을 위한<br />
            <strong>팀 생성 · 팀원 관리 · 토너먼트 운영</strong>을 지원하는 플랫폼입니다.
          </p>

          <p style={{ fontSize: "1.05rem", marginBottom: "20px", color: "#6b7280" }}>
            상단 메뉴에서 <strong>팀 만들기, 토너먼트 입장</strong> 등 다양한 기능을 경험해보세요!
          </p>

          <div style={{ marginTop: "32px" }}>
            <a href="/teamMatch" style={{
              backgroundColor: "#6366f1",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
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
