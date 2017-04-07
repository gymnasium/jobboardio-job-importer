import React, { Component } from 'react';
import './App.css';

import XMLParser from './components/XMLParser';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="https://thegymnasium.com/static/gymnasium/images/gymnasiumLogo.png" className="App-logo" alt="logo" />
          <h2>Jobboard.io JSON->.csv preprocessor</h2>
        </div>

        <XMLParser />

      </div>
    );
  }
}

export default App;
