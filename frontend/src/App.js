
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Home from "./Components/Home";
import CreateSimulation from "./Components/CreateSimulation";
import "./App.css";



class App extends Component {
  render() {
      return (
        
          <Router>
                  <Routes>
                      <Route
                          path="/"
                          element={<Home />}
                      ></Route>
                      <Route
                          path="/simulation"
                          element={<CreateSimulation />}
                      ></Route>
                  </Routes>
          </Router>
      );
  }
}

export default App;