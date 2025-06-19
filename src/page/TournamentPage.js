import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Headers from '../component/Header';
import Footer from '../component/footer';
import ScoreBoard from './scoreBoard';
import LoadingOverlay from '../component/LodingOverlay';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function TournamentPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const navigate = useNavigate();

    const deleteLocalStorage = () => {
    localStorage.removeItem('tournamentCode'); 
    navigate('/tournament');
  };

  useEffect(() => {
    fetch(`${BASE_URL}/tournament/tournaments/${id}`)
      .then(res => res.json())
      .then(data => setTournament(data))
      .catch(err => {
      console.error('대회 조회 실패', err);
      deleteLocalStorage();
      alert("서버 오류 혹은 대회가 사라졌습니다. 다시 시도해주세요")
      }) 
  }, [id]);



  
 // Loading 중 메시지 추가 예시
if (!tournament) return <LoadingOverlay message="대회 정보를 불러오는 중입니다..." />;


  return (
    <>
      <Headers text={`${tournament.name}의 페이지 입니다. | 참가코드 : ${tournament.id} |`} />
   

<div style={{ zIndex: 3, marginTop: "70px", padding: "24px", maxWidth: "1500px", marginInline: "auto" }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      padding: "20px 32px",
      background: "linear-gradient(135deg, #1e293b, #334155)",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      color: "#e2e8f0",
    }}
  >
     <button onClick={() => console.log(tournament)}>test</button>
    <div>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "4px" }}>
        토너먼트 이름 : {`${tournament.name}`}
      </h1>
      <h2 style={{ fontSize: "1rem", fontWeight: 500 }}>
        참가 코드 : <span style={{ color: "#60a5fa", fontWeight: 700 }}>{tournament.id}</span>
      </h2>
    </div>

    <span
      style={{
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "8px",
        backgroundColor: "#ef4444",
        color: "#fff",
        fontWeight: 600,
        transition: "background-color 0.2s ease",
      }}
      onClick={deleteLocalStorage}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
    >
      내전 나가기
    </span>
  </div>

  <ScoreBoard tournamentID={tournament.id} />
</div>



    </>
  );
}
