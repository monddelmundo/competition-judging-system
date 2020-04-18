import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { StateProvider } from "./context/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <Router>
    <StateProvider>
      <App />
    </StateProvider>
    <ToastContainer autoClose={3000} hideProgressBar />
  </Router>,
  document.getElementById("root")
);
