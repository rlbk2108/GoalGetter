
import './header.css';
import {useAuthStore} from "../store/auth";
import {logout} from "../utils/auth";
import {useNavigate} from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    const toLogin = () => {
        navigate("/login")
    }

    const toRegister = () => {
        navigate("/registration")
    }

    return (
        <nav className="navbar-dark navbar bg-body-tertiary">
          <div className="logo-container container-fluid">
            <div className="logo">
            </div>
            <h3 className="goal-getter-text">GoalGetter</h3>
              {isLoggedIn() ?
                  <form>
                      <a className="btn-secondary">{user().email}</a>
                      <button className="btn btn-outline" type="submit" onClick={logout}>Log out</button>
                  </form>
                  :
                  <form>
                      <button className="btn btn-outline-secondary" type="submit" onClick={toLogin}>Sign in</button>
                      <button className="btn btn-primary" type="submit" onClick={toRegister}>Sign up</button>
                  </form>
              }

          </div>
        </nav>
  );
};

export default Navbar;
