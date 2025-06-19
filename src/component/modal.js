function Modal({ title, onConfirm, onCancel }) {
  const buttonStyle = {
  backgroundColor: "#6366f1",
  color: "white",
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};

const buttonDangerStyle = {
  ...buttonStyle,
  backgroundColor: "#ef4444"
};

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #334155)" , padding: "24px", borderRadius: "8px",
        width: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ marginBottom: "16px" }}>{title}</h2>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button style={buttonDangerStyle} onClick={onConfirm}>삭제</button>
          <button style={buttonStyle} onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default Modal