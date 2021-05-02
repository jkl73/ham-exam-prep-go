import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Container } from "semantic-ui-react";
import WelcomePage from "./Welcome-page";
import HamQuestion from "./Ham-Question-Pool";

function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route path="/tech">
            <HamQuestion level = "T"/>
          </Route>
          <Route path="/general">
            <HamQuestion level = "G"/>
          </Route>
          <Route path="/extra">
            <HamQuestion level = "E"/>
          </Route>
          <Route path="/">
            <WelcomePage />
          </Route>
        </Switch>
      </Router>
      </Container>   
  );
}

export default App;
