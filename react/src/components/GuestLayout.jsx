import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Aside from "./Calendar/items/Aside";
import { connect, useDispatch } from "react-redux";
import { windowResize } from "../redux/actions/appActions";

function GuestLayout({ isMobileLayout }) {
  const [asideShown, setAsideShown] = useState(false);
  const dispatch = useDispatch();

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

  console.log(isMobileLayout);
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/calendar/month" />;
  }

  const renderNav = () => (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item">
            {isMobileLayout}
            <button
              className="btn-hamburger"
              onClick={() => handleToggleAside()}
            >
              <i className="fa fa-bars"></i>
            </button>
          </li>
          <li className="header__nav-item">
            <a href="/login" className="header__nav-link">
              Login
            </a>
          </li>
          <li className="header__nav-item">
            <a href="/signup" className="header__nav-link">
              Register
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );

  const renderFooter = () => (
    <footer className="footer">
      <p className="footer__text">&copy; 2023 TimeFlow. All rights reserved.</p>
    </footer>
  );

  return (
    <div className="guestLayout-wrapper">
      {renderNav()}
      <Aside setAsideShown={setAsideShown} asideShown={asideShown} />
      <Outlet />
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
