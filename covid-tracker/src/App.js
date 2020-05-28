import React from 'react';
import logo from './virus1.png';
import './App.css';
import ReportChart from './Component/ReportChart.jsx';

export default class App extends React.Component {
  
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <p className="heading" style={{color:"white"}}>
            C<img src={logo} className="App-logo" alt="logo" />VID-19 TRACKER
          </p>
          <ReportChart/>
        </header>
      </div>
    );
  }
}