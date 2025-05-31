import "../styles/login.css";
import "../styles/register.css"
import icon from "../assets/icon.png";

function Register() {
  return (
    <>
      <div className="headerflex">
        <div className="icon">
          <img className="iconimg" src={icon} />
        </div>
        <p className="heading">Register For Cloud Editor</p>
      </div>

      <div className="usrnmpswd">
        <div className="inputflex">
          <input className="usnminput" placeholder="Email ID"></input>
          <input className="usnminput" placeholder="Username"></input>
          <input type="password" className="usnminput" placeholder="Password"></input>
        </div>
        <p className="belowText">
          Already have an account? <span>Login.. </span>
        </p>
        <button className="loginbutton">Register</button>
      </div>
    </>
  );
}
export default Register;
