import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./navigation";
import PageBody from "./body";
import Footer from "./footer";
import React from "react";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <PageBody />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
