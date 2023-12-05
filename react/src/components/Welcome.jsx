import "../styles/welcome.css";
import React from "react";

function Welcome() {
  const renderMain = () => (
    <section class="welcome-main__content">
      <h1 class="main__title">
        Take control of your schedule and productivity
      </h1>
      <h2 class="main__description">
        Time planner that can fit your needs
      </h2>
      <div className="main__buttons">
        <button className="btn btn-block btn-main">
          Try it out
        </button>
      </div>


      <section class="features">
        <h2 class="features__title">Key Features</h2>
        <ul class="features__list"></ul>
      </section>

      <section class="coming-soon">
        <h2 class="coming-soon__title">Coming Soon</h2>
        <ul class="coming-soon__list"></ul>
      </section>
    </section>
  );
  return renderMain();
}

export default Welcome;
