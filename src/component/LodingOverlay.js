import React from 'react';

export default function LoadingOverlay() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(99, 101, 241, 0.18)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <img
        src="https://i.gifer.com/ZZ5H.gif"
        alt="Loading..."
        style={{ width: "80px" }}
      />
      <p style={{
        color: "#6366f1",
        fontWeight: 700,
        fontSize: "1.2rem",
        marginTop: "12px"
      }}>
        로딩중입니다... 잠시만 기다려주세요!
      </p>
    </div>
  );
}
