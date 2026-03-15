import React from 'react';
import './App.css';

function App() {
  const jobStats = {
    new: 3,
    wip: 5,
    quoting: 2,
    completed: 4,
    testing: 1,
    invoice: 2,
  };

  return (
    <div className="app">
      <header className="header">
        <h1>OBD Workshop</h1>
        <p>Job Management System</p>
      </header>

      <div className="dashboard">
        <div className="stat-card new">
          <span className="count">{jobStats.new}</span>
          <span className="label">New Jobs</span>
        </div>
        <div className="stat-card wip">
          <span className="count">{jobStats.wip}</span>
          <span className="label">Work In Progress</span>
        </div>
        <div className="stat-card quoting">
          <span className="count">{jobStats.quoting}</span>
          <span className="label">Quoting</span>
        </div>
        <div className="stat-card completed">
          <span className="count">{jobStats.completed}</span>
          <span className="label">Completed</span>
        </div>
        <div className="stat-card testing">
          <span className="count">{jobStats.testing}</span>
          <span className="label">Final Testing</span>
        </div>
        <div className="stat-card invoice">
          <span className="count">{jobStats.invoice}</span>
          <span className="label">Invoice & Collection</span>
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary">+ New Job Card</button>
      </div>

    </div>
  );
}

export default App;