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

  useEffect(() => {
    fetch(`${BASE_URL}/tournament/tournaments/${id}`)
      .then(res => res.json())
      .then(data => setTournament(data))
      .catch(err => console.error('대회 조회 실패', err));
  }, [id]);

  const deleteLocalStorage = () => {
    localStorage.removeItem('tournamentCode'); 
    navigate('/tournament');
  };

 // Loading 중 메시지 추가 예시
if (!tournament) return <LoadingOverlay message="대회 정보를 불러오는 중입니다..." />;


  return (
    <>
      <Headers text={`${tournament.name}의 페이지 입니다. | 참가코드 : ${tournament.id} |`} />

  
  <div style={{ zIndex : 3 , marginTop: "70px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1>{tournament.name}</h1>
            <p>참가 코드: <strong>{tournament.id}</strong></p>
          </div>

          <span
            style={{
              cursor: "pointer",
              border: "1px solid black",
              padding: "5px",
              borderRadius: "16px",
            }}
            onClick={deleteLocalStorage}
          >
            내전 나가기
          </span>
        </div>

        <ScoreBoard tournamentID={tournament.id} />
      </div>

      <Footer />
    </>
  );
}
