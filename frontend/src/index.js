import App from "./components/App";
import ReactDOM from "react-dom";
import "./App.css";
import React from "react";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
