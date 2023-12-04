import "../styles/welcome.css";
import React from "react";

function Welcome() {
  const renderMain = () => (
    <main class="main">
      <section class="main__content">
        <h1 class="main__title">Welcome to TimeFlow</h1>
        <p class="main__description">
          Take control of your schedule and productivity.
        </p>

        <section class="features">
          <h2 class="features__title">Key Features</h2>
          <ul class="features__list"></ul>
        </section>

        <section class="coming-soon">
          <h2 class="coming-soon__title">Coming Soon</h2>
          <ul class="coming-soon__list"></ul>
        </section>
      </section>
    </main>
  );
  return renderMain();
}

export default Welcome;
