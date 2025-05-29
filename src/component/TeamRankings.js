import '../utils/TeamRanking.css'


export default function TeamRankings({ team }) {
return (
  <>
  <div>
    <h1>STANDINGS</h1>
    <div>
      {team.map((item, index) => (
        <div className="team-ranking" key={index}>
          <span className='number'>{index + 1}</span>
          <span className="team-name">{item.name}</span>
          <span className="team-score">{item.score}</span>
        </div>
      ))}
    </div>
  </div>
  </>
)


}