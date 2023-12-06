import "../styles/welcome.css";
import React, { useEffect, useRef } from "react";
import svgPaths from "./svgPaths";
import { Link } from "react-router-dom";
function Welcome() {
  const featuresList = [
    {
      title: "Task Management",
      description: "Create, organize, and prioritize tasks effortlessly",
      icon: svgPaths.taskManagment,
    },
    {
      title: "Notifications and Reminders",
      description: "Stay informed with customizable reminders",
      icon: svgPaths.bell,
    },
    {
      title: "Versatile Calendar Views",
      description:
        "Switch between three user-friendly calendar views with ease",
      icon: svgPaths.calendar,
    },
  ];
  const comingSoonList = [
    {
      title: "Task Categorization for a Structured Workflow",
      icon: svgPaths.taskCategorization,
    },
    {
      title: "Enhanced Drag-and-Drop Functionality",
      icon: svgPaths.dragAndDrop,
    },
    {
      title: "Team Collaboration Tools for Efficient Task Allocation",
      icon: svgPaths.teamCollaboration,
    },
    {
      title: "Visual Data Analytics for Workflow Optimization",
      icon: svgPaths.dataAnalytics,
    },
    {
      title: "Extended Calendar Integration for Multi-Platform Usage",
      icon: svgPaths.calendarIntegration,
    },
  ];
  const headerRef = useRef();

  const reveal = () => {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("section-active");
      } else {
        element.classList.remove("section-active");
      }
    });
  };
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.classList.add("section-active");
    }
    window.addEventListener("scroll", reveal);
    return () => {
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  const renderMain = () => (
    <section id="welcomeAbout" className="welcome-main__content">
      <div ref={headerRef} className="reveal fade-bottom">
        <h1 className="main__title">
          Take control of your schedule and productivity
        </h1>
        <h2 className="main__description">
          Time planner that can fit your needs
        </h2>
        <div className="main__buttons">
          <Link to="/login" className="btn btn-block btn-main">
            Try it out
          </Link>
        </div>
      </div>
      <section id="welcomeFeatures" className="features reveal fade-right">
        <h2 className="features__title">Key Features</h2>
        <ul className="features__list">
          {featuresList.map((feature, index) => (
            <li key={index} className="features__item">
              <span className="feature__icon">
                <span className="feature__icon--container">{feature.icon}</span>
              </span>
              <div className="feature__info">
                <h3 className="feature__title">{feature.title}</h3>
                <p className="feature__description">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="welcomeComingSoon" className="coming-soon reveal fade-left">
        <h2 className="coming-soon__title">Coming soon features</h2>
        <ul className="coming-soon__list">
          {comingSoonList.map((item, index) => (
            <li className="coming-soon__item" key={index}>
              <span className="coming-soon__icon">
                <span className="coming-soon__icon--container">
                  {item.icon}
                </span>
              </span>
              <h3 className="coming-soon__item__title">{item.title}</h3>
            </li>
          ))}
        </ul>
      </section>
      <section id="welcomeContact" className="contact reveal  fade-right">
        <h4 className="contact__title">Contact information</h4>
        <div className="contact__links">
          <a href="tel://664431074">+48 664 431 074</a>
          <a href="mailto:nik.kow@outlook.com">nik.kow@outlook.com</a>
          <a href="github.com/NikKowPHP/TimeFlow">Github link</a>
        </div>
      </section>
    </section>
  );
  return renderMain();
}

export default Welcome;
