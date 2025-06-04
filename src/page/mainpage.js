import Footer from "../component/footer"
import Headers from "../component/Header"

function MainPage() {
  return (
    <>
      <Headers text="메인 페이지 입니다." />

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "linear-gradient(135deg, #e0e7ff, #fff)",
        padding: "40px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
        }}>
          <h1 style={{ fontSize: "2.5rem", color: "#4f46e5", marginBottom: "20px" }}>환영합니다!</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "12px" }}>이곳은 <strong>LoL Draft</strong>의 메인 페이지입니다.</p>
          <p style={{ fontSize: "1.1rem", marginBottom: "12px" }}>소환사 정보를 입력하고 팀을 구성해보세요.</p>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>상단 메뉴에서 다양한 기능으로 이동할 수 있습니다.</p>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default MainPage;
