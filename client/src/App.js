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
            <HamQuestion level = "tech"/>
          </Route>
          <Route path="/general">
            <HamQuestion level = "general"/>
          </Route>
          <Route path="/extra">
            <HamQuestion level = "extra"/>
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
