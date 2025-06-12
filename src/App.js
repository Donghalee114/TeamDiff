
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchPlayer from './serachplayer';
import Terms from './page/terms';
import Privacy from './page/privacy';
import MainPage from './page/mainpage'
import Tournaments from './page/tournaments';
import TournamentPage from './page/TournamentPage';
import MockDraftSetup from './page/MockDraftSetUp'
import MockDraftRoom from './page/MockDraftRoom'
import BanPick from './page/BanPick'


function App() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Tournament" element={<Tournaments />} />
        <Route path="/tournament/tournaments/:id" element={<TournamentPage />} />
        <Route path="/teamMatch" element={<SearchPlayer/>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/MockDraft" element={<MockDraftSetup />} />
        <Route path="/MockDrafts/:roomId" element={<MockDraftRoom/>}/>
        <Route path="/BanPick/:roomId" element={<BanPick />} />
        {/* 여기에 기존 홈, 기타 라우트도 같이 넣으면 돼 */}
      </Routes>
    </Router>

    
  );
}

export default App;
