
import React, { Component } from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
} from "react-router-dom";
import Home from "./Components/Home";
import CreateSimulation from "./Components/CreateSimulation";
import ViewSimulations from "./Components/ViewSimulations";




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
                          path="/create-simulation"
                          element={<CreateSimulation />}
                      ></Route>
                      <Route
                          path = "/view-simulations"
                          element={<ViewSimulations />}
                      ></Route>
                  </Routes>
          </Router>
      );
  }
}

export default App;