import "../styles/login.css";
import icon from "../assets/icon.png"

function Login() {
  return (
    <>
      <div className="headerflex">
        <div className="icon">
          <img className="iconimg" src={icon} />
        </div>
        <p className="heading">Login To Cloud Editor</p>
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
          Don't have an account? <span>Register.. </span>
        </p>
        <button className="loginbutton">Log In</button>
      </div>
    </>
  );
}
export default Login;
