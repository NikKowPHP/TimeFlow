import "../styles/guest-layout.css";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Aside from "./Calendar/items/Aside";
import { connect, useDispatch } from "react-redux";
import { windowResize } from "../redux/actions/appActions";
import { Link } from "react-scroll";

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

  const asideLinks = () => {
    let listClasses = "";
    let linkClasses = "";
    if (isMobileLayout) {
      listClasses = "aside__nav-item";
      linkClasses = "aside__nav-link";
    } else {
      listClasses = "guest__nav-item";
      linkClasses = "guest__nav-link";
    }
    return (
      <>
        <li className={listClasses}>
          <Link
            to={"welcomeAbout"}
            onClick={handleToggleAside}
            spy={true}
            smooth={true}
            duration={500}
            offset={-100}
            className={linkClasses}
          >
            Home
          </Link>
        </li>
        <li className={listClasses}>
          <Link
            to={"welcomeFeatures"}
            onClick={handleToggleAside}
            spy={true}
            smooth={true}
            duration={500}
            offset={0}
            className={linkClasses}
          >
            Features
          </Link>
        </li>
        <li className={listClasses}>
          <Link
            to={"welcomeComingSoon"}
            onClick={handleToggleAside}
            spy={true}
            smooth={true}
            duration={500}
            offset={-30}
            className={linkClasses}
          >
            Coming soon
          </Link>
        </li>
        <li className={listClasses}>
          <Link
            to={"welcomeContact"}
            onClick={handleToggleAside}
            spy={true}
            smooth={true}
            duration={500}
            offset={200}
            className={linkClasses}
          >
            Contact
          </Link>
        </li>
        {isMobileLayout && <hr className="aside-seperator" />}
        <li className={`${listClasses} guest__login-link`}>
          <Link to={"/login"} className={linkClasses}>
            Login
          </Link>
        </li>
      </>
    );
  };

  const renderNav = () => (
    <header className="guest-layout--header">
      <nav className="guest__nav--header">
        <div className="guest__nav-item header__logo">
          <Link className="guest__nav-link guest__nav-logo" to="welcomeHome">
            TimeFlow 
          </Link>
          <span className="header__logo-dot">.</span>
        </div>
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
            <>
            {asideLinks()}</>
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
      <main className="guest-layout__main">
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
