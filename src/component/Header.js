import { useNavigate } from 'react-router-dom';
import '../utils/header.css';

export default function Headers({ text }) {
  const navigate = useNavigate();

  return (
    <header>
      <span className="header-left">
        <h1 onClick={() => navigate("/")}>LoL Draft</h1>
        {text && <p>{text}</p>}
      </span>
<nav>
        <span className='navbutton' onClick={() => navigate("/Tournament")} >내전 관리</span>
        <span className='navbutton' onClick={() => navigate("/MockDraft")}>모의 밴픽</span>
        <span className='navbutton' onClick={() => navigate("/teamMatch")} >팀 자동 구성</span>
        <span className='navbutton' onClick={() => navigate("/SearchPlayerInfo")}> 소환사 정보 및 전적 검색 </span>
        </nav>
    </header>
  );
}
