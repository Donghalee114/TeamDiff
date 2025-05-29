import Footer from "../component/footer"
import Headers from "../component/Header"

function MainPage(){
return(
  <>
  <Headers text="메인 페이지 입니다."></Headers>


  <div>
    <h1>환영합니다!</h1>
    <p>이곳은 LoL Draft의 메인 페이지입니다.</p>
    <p>소환사 정보를 입력하고 팀을 구성해보세요!</p>
    <p>상단 메뉴에서 다른 기능으로 이동할 수 있습니다.</p>
  </div>

  <Footer></Footer>
  </>
)
}

export default MainPage