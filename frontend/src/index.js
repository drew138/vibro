import { Provider } from "react-redux";
import App from "./components/App";
import ReactDOM from "react-dom";
import store from "./store";
import React from "react";
import "./App.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
