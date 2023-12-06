import "../styles/welcome.css";
import React from "react";
import svgPaths from "./svgPaths";

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
    "Task Categorization for a Structured Workflow",
    "Enhanced Drag-and-Drop Functionality",
    "Team Collaboration Tools for Efficient Task Allocation",
    "Visual Data Analytics for Workflow Optimization",
    "Extended Calendar Integration for Multi-Platform Usage",
  ];
  const renderMain = () => (
    <section class="welcome-main__content">
      <h1 class="main__title">
        Take control of your schedule and productivity
      </h1>
      <h2 class="main__description">Time planner that can fit your needs</h2>
      <div className="main__buttons">
        <button className="btn btn-block btn-main">Try it out</button>
      </div>

      <section class="features">
        <h2 class="features__title">Key Features</h2>
        <ul class="features__list">
          {featuresList.map((feature, index) => (
            <li key={index} className="features__item">
              <span className="feature__icon">
                <span className="feature__icon--container">
                  {feature.icon}
                  </span>
              </span>
              <div className="feature__info">
                <h3 className="feature__title">{feature.title}</h3>
                <p className="feature__description">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section class="coming-soon">
        <h2 className="coming-soon__title">Coming soon features</h2>
        <ul className="coming-soon__list">
          {comingSoonList.map((item, index) => (
            <li className="coming-soon__item" key={index}>
              <span coming-soon__icon>
                {item.icon}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
  return renderMain();
}

export default Welcome;
