import React from 'react';
import './header.css';
import {useAuthStore} from "../store/auth";
import {LoggedOutView} from "../pages/Home";


const Navbar = () => {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);
    return (
        <nav className="navbar-dark navbar bg-body-tertiary">
          <div className="logo-container container-fluid">
            <div className="logo">
            </div>
            <h3 className="goal-getter-text">GoalGetter</h3>
              {isLoggedIn ?
                  <form>
                      <a className="btn-secondary">{user().email}</a>
                      <button className="btn btn-outline" type="submit">Log out</button>
                  </form>
                  :
                  <form>
                      <button className="btn btn-outline-secondary" type="submit">Sign in</button>
                      <button className="btn btn-primary" type="submit">Sign up</button>
                  </form>
              }

          </div>
        </nav>
  );
};

export default Navbar;
