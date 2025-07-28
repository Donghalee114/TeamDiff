// SearchPlayer.js - 컴포넌트 리팩토링을 위한 구조 개선 예시

import React, { useState } from "react";
import './Searchplayer.css';
import Headers from './component/Header.js';
import Footer from './component/footer.js';
import useSummonerInput from './utils/summonerInputUtils';
import SummonerInputSection from './component/SummonerInputSection.js';
import ScoreDisplay from './component/ScoreDisplay.js';
import TeamDisplay from './component/TeamDisplay.js';
import LoadingOverlay from './component/LodingOverlay.js';


function SearchPlayer() {
const {
  summoners, setSummoners,
  result, setResult,
  teamResult, 
  isLoading, loadingIndex, warning, canClick, setCanClick,
  handleSingleInput, handleBulkPaste, handleDeleteSummoner,
  handleClearInput, handleFetchAllSummoners, handleMakeTeams , handleBulkPasteFromTextArea , onPaste
} = useSummonerInput();


  const [tab, setTab] = useState('score');

  return (

    <div className="main-layout" >

      <Headers />
      <main className="panel-div" >
        <div className= "scale">
        <div className="left-panel">
          <SummonerInputSection
            summoners={summoners}
            isLoading={isLoading}
            loadingIndex={loadingIndex}
            warning={warning}
            onInput={handleSingleInput}
            onPaste={handleBulkPaste}
            onDelete={handleDeleteSummoner}
            onClear={handleClearInput}
            onFetch={handleFetchAllSummoners}
            setSummoners={setSummoners}
            handleBulkPasteFromTextArea={handleBulkPasteFromTextArea}
          />
        </div>
        <div className="right-panel">
          <div className="tabs" style={{position: "relative", top: "30px" ,left: "500px" ,  width : "200px" , zIndex: 10, background: "1b1b2f" , borderTopLeftRadius : "16px", borderTopRightRadius: "16px" }}>
            <button className={tab === 'score' ? 'tab-active' : 'tab-inactive'} onClick={() => setTab('score')}>소환사 점수</button>
            <button className={`${tab === 'team' ? 'tab-active' : 'tab-inactive'} ${canClick && tab !== 'team' ? 'blink-button' : ''}`}onClick={() => setTab('team')} style={{cursor : !canClick ? 'not-allowed' : "pointer", marginRight : "30px"}} disabled={!canClick}>팀 결과</button>
          </div>
          {tab === 'score' && <ScoreDisplay result={result} setResult={setResult} />}
          {tab === 'team' && <TeamDisplay  teamResult={teamResult} setResult={setResult} setCanClick={setCanClick} handleMakeTeams={handleMakeTeams} />}
        </div>
             </div>
      </main>
      {isLoading && <LoadingOverlay />}

    </div>

    
  );
}

export default SearchPlayer;
