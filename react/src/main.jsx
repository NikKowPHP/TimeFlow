import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ContextProvider } from "./contexts/ContextProvider";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ContextProvider>
);
