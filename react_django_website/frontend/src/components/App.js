import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClassListPage from "./ClassListPage";
import ClassMapPage from "./ClassMapPage";
import ClassroomLayoutPage from "./ClassroomLayoutPage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/logg-inn" element={<LoginPage/>} />
          <Route path="/registrer" element={<RegisterPage/>} />
          <Route path="/klasserom" element={<ClassroomLayoutPage/>} />
          <Route path="/klasseliste" element={<ClassListPage/>} />
          <Route path="/klassekart" element={<ClassMapPage/>} />
        </Routes>
      </Router>
    );
  }
}
