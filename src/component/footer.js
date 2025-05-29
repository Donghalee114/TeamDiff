export default function Footer() {
  return(
  <footer style={{position : "fixed" , bottom : "0" , left : "0" , right : "0" , height : "35px", backgroundColor : "#6266f1" , color : "white" , padding : "10px 0" , textAlign : "center"}}>     
        <a style={{color :"#fff"}}  href="/terms">이용약관</a> | <a style={{color :"#fff"}} href="/privacy">개인정보처리방침</a>
      </footer>
  )
}