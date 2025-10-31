import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <div className="container-fluid row justify-content-center align-otems-center m-0">
        <div className="LogForm col-md-2 col-10 text-center py-3 px-1">
          <h2>login</h2>
          <div className="inputContainer mb-2">
            <label>email</label>
            <input type="email" />
          </div>
          <div className="inputContainer mb-3">
            <label>password</label>
            <input type="password" />
          </div>
          <button className="mb-2">login</button>
          <div className="line mb-2"></div>
          <button className="withBtn">
            <FcGoogle />
          </button>
          <button className="withBtn facebook">
            <FaFacebookF />
          </button>
          <button className="withBtn github">
            <FaGithub />
          </button>
          <Link className="d-block mt-2" to={"/signup"}>
            don't have an account ?
          </Link>
        </div>
      </div>
    </>
  );
}
