import React from "react";
import NavBar from "./navigation";
import PageBody from "./body";
import Footer from "./footer";
import { BrowserRouter as Router } from "react-router-dom";

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
