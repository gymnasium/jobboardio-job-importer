import React, { Component } from 'react';
import './App.css';

import JSONParser from './components/JSONParser';
import jsonInput from './sampeinput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="https://thegymnasium.com/static/gymnasium/images/gymnasiumLogo.png" className="App-logo" alt="logo" />
          <h2>Jobboard.io JSON->.csv preprocessor</h2>
        </div>

        <JSONParser source={jsonInput} />

      </div>
    );
  }
}

export default App;
