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

  const asideLinks = () => (
    <>
      <li className="aside__nav-item">
        <Link
          to={"welcomeAbout"}
          onClick={handleToggleAside}
          spy={true}
          smooth={true}
          duration={500}
          offset={-100}
          className="aside__nav-link"
        >
          Home
        </Link>
      </li>
      <li className="aside__nav-item">
        <Link
          to={"welcomeFeatures"}
          onClick={handleToggleAside}
          spy={true}
          smooth={true}
          duration={500}
          offset={0}
          className="aside__nav-link"
        >
          Features
        </Link>
      </li>
      <li className="aside__nav-item">
        <Link
          to={"welcomeComingSoon"}
          onClick={handleToggleAside}
          spy={true}
          smooth={true}
          duration={500}
          offset={-30}
          className="aside__nav-link"
        >
          Coming soon
        </Link>
      </li>
      <li className="aside__nav-item">
        <Link
          to={"welcomeContact"}
          onClick={handleToggleAside}
          spy={true}
          smooth={true}
          duration={500}
          offset={200}
          className="aside__nav-link"
        >
         Contact 
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
