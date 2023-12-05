import "../styles/guest-layout.css";
import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Aside from "./Calendar/items/Aside";
import { connect, useDispatch } from "react-redux";
import { windowResize } from "../redux/actions/appActions";

function GuestLayout({ isMobileLayout }) {
  const [asideShown, setAsideShown] = useState(false);
  const dispatch = useDispatch();

  const handleToggleAside = () => {
    setAsideShown(!asideShown);
  };

  useEffect(() => {
    const handleResize = () => {
      const isWindowMobile = window.innerWidth < 768;
      if (isWindowMobile !== isMobileLayout) {
        setAsideShown(false);
        dispatch(windowResize(isWindowMobile));
      } else {
        setAsideShown(true);
      }
      isWindowMobile ? setAsideShown(false) : setAsideShown(true);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileLayout, windowResize]);

  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/calendar/month" />;
  }

  const asideLinks = () => (
    <>
      <li className="aside__nav-item">
        <Link to={"/signup"} className="aside__nav-link">
          About
        </Link>
      </li>
      <li className="aside__nav-item">
        <Link to={"/signup"} className="aside__nav-link">
          Contact
        </Link>
      </li>
      <li className="aside__nav-item">
        <Link to={"/welcome"} className="aside__nav-link">
          Showcases
        </Link>
      </li>
      {isMobileLayout && <hr className="aside-seperator" />}
      <li className="aside__nav-item guest__login-link">
        <Link to={"/login"} className="aside__nav-link ">
          Login
        </Link>
      </li>
    </>
  );

  const renderNav = () => (
    <header className="guest-layout--header">
      <nav className="guest__nav--header">
        <ul className="guest__nav-list--header">
          {isMobileLayout ? (
            <li className="guest__nav-item-hamburger--header">
              <button
                className="btn-hamburger"
                onClick={() => handleToggleAside()}
              >
                <i className="fa fa-bars"></i>
              </button>
            </li>
          ) : (
            <>{asideLinks()}</>
          )}
        </ul>
      </nav>
    </header>
  );

  const renderFooter = () => (
    <footer className="guest-layout__footer">
      <p className="footer__text">&copy; 2023 TimeFlow. All rights reserved.</p>
    </footer>
  );

  return (
    <div className="guest-layout--wrapper">
      {renderNav()}
      {isMobileLayout && (
        <Aside
          handleToggleAside={handleToggleAside}
          setAsideShown={setAsideShown}
          asideShown={asideShown}
          asideLinks={asideLinks()}
        />
      )}
      <main class="guest-layout__main">
        <Outlet />
      </main>
      {renderFooter()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isMobileLayout: state.app.isMobileLayout,
});

const mapDispatchToProps = {
  windowResize,
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestLayout);
