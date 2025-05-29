import React, { useEffect, useState } from "react";
import Headers from "../component/Header"
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer";



const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:6900';

export default function Tournaments() {
  const navigate = useNavigate()

  const [enable, setEnable] = useState(false);


  const [tournamentName, setTournamentName] = useState('');
  const [tournamentCode, setTournamentCode] = useState('');

  const [adminID , setAdminId] = useState('')
  const [adminPassword , setAdminPassword] = useState('')
  const [joinTournament , setJoinTournament] = useState('')


  useEffect(() => {
    const savedCode = localStorage.getItem('tournamentCode')
    if(savedCode)
    {
      navigate(`/tournament/${savedCode}`)
    }
  }, [])

  const handleCreateTournament = async () => {
    const res = await fetch(`${BASE_URL}/tournament/makes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tournamentName  , adminId : adminID , adminPassword : adminPassword})
    });
    if (res.ok) {
      const data = await res.json();
      alert(`내전/ 토너먼트 생성 완료! 참가코드: ${data.id}`);
      setEnable(false);
    } else {
      alert('내전/ 토너먼트 생성 실패');
    }
  };


  const handleJoinTournament = async () => {
    const res = await fetch(`${BASE_URL}/tournament/${tournamentCode}` , {
    method: "GET",
    });

    if(res.ok) {
      const data = await res.json()
      setJoinTournament(tournamentCode)
      navigate(`/tournament/${tournamentCode}`)
    } else {
      alert("없는 참가 코드이거나 만료된 코드입니다.")
    }
    localStorage.setItem('tournamentCode' , tournamentCode)
    
  }

  return (
    <>
    <Headers></Headers>
      
        <div style={{marginTop : "100px" , width : "100%"}}>
          <h1>내전/ 토너먼트 생성</h1>
          {!enable ? (
            <button onClick={() => setEnable(true)}>내전/ 토너먼트 생성하기</button>
          ) : (
            <div>

              <label>관리자의 아이디를 입력하세요.</label>
               <input
                type="text"
                name="adminID"
                placeholder="관리자의 아이디"
                value={adminID}
                onChange={(e) => setAdminId(e.target.value)}
              />
              <br/>
              <lable>관리자의 비밀번호를 입력하세요.</lable>
                <input
                type="password"
                name="adminPassword"
                placeholder="관리자의 비밀번호"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              /><br/>
              <label>내전/ 토너먼트의 이름을 입력하세요.</label>
              <input
                type="text"
                name="name"
                placeholder="내전/ 토너먼트 이름"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              /><br/>
              <button onClick={handleCreateTournament}>생성 완료</button>
              
              <button onClick={() => setEnable(false)}>X</button>
            </div>
          )}

          <h1>내전/ 토너먼트 참가</h1>
          <input
            type="text"
            placeholder="내전/ 토너먼트 코드"
            value={tournamentCode}
            onChange={(e) => setTournamentCode(e.target.value)}
          />
          <button onClick={handleJoinTournament}>참가하기</button>
        </div>
      
    {joinTournament}

      <div>내전/ 토너먼트 검색</div>

      <Footer></Footer>
    </>
  );
}
