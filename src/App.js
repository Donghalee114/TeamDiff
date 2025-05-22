
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchPlayer from './serachplayer';
import Terms from './page/terms';
import Privacy from './page/privacy';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPlayer />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* 여기에 기존 홈, 기타 라우트도 같이 넣으면 돼 */}
      </Routes>
    </Router>

    
  );
}

export default App;
