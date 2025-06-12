export default function Footer() {
  return (
    <footer style={{
      position: "relative",
      height: "35px",
      backgroundColor: "#1b1b2f",
      color: "white",
      padding: "10px 0",
      textAlign: "center",
      marginTop: "auto" // 👉 main-layout이 flex일 경우 맨 아래로 밀림
    }}>
      <a style={{ color: "#fff" }} href="/terms">이용약관</a> | <a style={{ color: "#fff" }} href="/privacy">개인정보처리방침</a>
    </footer>
  );
}
