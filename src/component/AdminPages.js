import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6900";

export default function DetailPage() {
  const { id } = useParams(); // 토너먼트 ID
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [teamCode, setTeamCode] = useState("");

  const testAdmin = () => setIsAdmin(prev => !prev);
  const testTeam = () => setHasTeam(prev => !prev);

  // 관리자 확인 API 연동
  const checkAdmin = async () => {
    
    try {
      const res = await fetch(`${BASE_URL}/tournament/tournaments/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: adminId,
          adminPassword: adminPw,
        }),
      });

      if (res.ok) {
        setIsAdmin(true);
        alert("관리자 로그인 성공");
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("관리자 확인 에러:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const makeTeam = () => {
    alert("팀 생성 기능 (추후 구현)");
  };

  const joinTeam = () => {
    alert(`팀 코드 ${teamCode}로 가입 시도 (추후 구현)`);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <button onClick={testAdmin}>Admin Test</button>
        <button onClick={testTeam}>Team Test</button>
      </div>

      {isAdmin ? (
        <div>
          <h1>🔒 관리자 상태</h1>
          <div>
            <h2>🛠 팀 생성</h2>
            <button onClick={makeTeam}>팀 생성</button>
          </div>
          <div>
            <h2>📋 팀 관리</h2>
            <p>팀원 목록, 편집 등 표시 예정</p>
          </div>
          <div>
            <h2>🗑 팀 삭제</h2>
            <button>삭제</button>
          </div>
          <div>
            <h2>🔥 토너먼트 삭제</h2>
            <button>삭제</button>
          </div>
        </div>
      ) : (
        <div>
          {!hasTeam ? (
            <div>
              <h2>팀 가입</h2>
              <input
                placeholder="팀 코드 입력"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
              />
              <button onClick={joinTeam}>가입</button>
            </div>
          ) : (
            <div>
              <h2>팀 정보</h2>
              <p>팀 이름, 멤버 리스트 등 표시 예정</p>
            </div>
          )}

          <hr style={{ margin: "24px 0" }} />

          <h1>토너먼트 관리를 위한 로그인</h1>
          <label>관리자 아이디</label>
          <input
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
          />
          <button onClick={checkAdmin}>확인</button>

          <hr />
        </div>
      )}
    </div>
  );
}
