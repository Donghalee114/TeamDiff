import { useParams , useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Headers from '../component/Header';
import Footer from '../component/footer';
import ScoreBoard from './scoreBoard';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function TournamentPage() {
  const { id } = useParams();  // ← URL에서 대회 ID 추출
  const [tournament, setTournament] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BASE_URL}/tournament/${id}`)
      .then(res => res.json())
      .then(data => setTournament(data))
      .catch(err => console.error('대회 조회 실패', err));
  }, [id]);

  const deleteLocalStorage = () => {
    localStorage.clear('tournament')
    navigate('/tournament')
  }
  if (!tournament) return <div>로딩 중...</div>;

  return (
    <>
   <Headers text = {`${tournament.name}의 페이지 입니다. |  참가코드 : ${tournament.id} |`}></Headers>
    <div style={{marginTop : "70px"}}>

        <span style={{display : "flex" , alignItems : "center" , justifyContent : "space-around"  , gap : "1230px"}}>
              <span style={{display : "flex" , alignItems : "center " , gap : "10px"}}>
              <h1>{tournament.name}</h1>
              <p>참가 코드: <strong>{tournament.id}</strong></p>
              </span>

              <span style={{cursor : "pointer" , border  : "1px solid black" , padding : "5px" , borderRadius : "16px" }} onClick={deleteLocalStorage}>내전 나가기</span>
        </span>
      
      
      <div>
        <ScoreBoard tournamentID={tournament.id}/>
      </div>
    </div>

    <Footer></Footer>
     </>
  );
}
