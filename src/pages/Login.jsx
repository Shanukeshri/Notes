import "../styles/login.css";
import icon from "../assets/icon.png"
import {useNavigate} from "react-router-dom"


function Login() {

  const nav = useNavigate()

  return (
    <>
      <div className="headerflex">
        <div className="iconholder">
          <img className="iconimg" src={icon} />
        </div>
        <p className="headingtext">Login To Cloud Editor</p>
      </div>

      <div className="usrnmpswd">
        <div className="inputflex">
          <input className="usnminput" placeholder="Username"></input>
          <input
            type="password"
            className="usnminput"
            placeholder="Password"
          ></input>
        </div>
        <p className="belowText">
          Don't have an account? <span onClick={()=>nav("/register")}>Register.. </span>
        </p>
        <button className="loginbutton">Log In</button>
      </div>
    </>
  );
}
export default Login;
