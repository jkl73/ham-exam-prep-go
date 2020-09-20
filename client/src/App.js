import React from 'react';
import './App.css';

import { Container } from "semantic-ui-react";
import HamQuestion from "./Ham-Question-Pool";


function App() {
  return (
    <div>
      <Container>
        <HamQuestion />
      </Container>
    </div>
  );
}

export default App;
