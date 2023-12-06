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

      <section class="coming-soon">
        <h2 className="coming-soon__title">Coming soon features</h2>
        <ul className="coming-soon__list">
          {comingSoonList.map((item, index) => (
            <li className="coming-soon__item" key={index}>
              <span className="coming-soon__icon">
                <span className="coming-soon__icon--container">{item.icon}</span>
              </span>
              <h3 className="coming-soon__item__title">{item.title}</h3>
              
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
  return renderMain();
}

export default Welcome;
