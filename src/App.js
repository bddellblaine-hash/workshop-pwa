import React, { useState } from 'react';
import './App.css';

const DEFAULT_JOB_TYPES = [
  'CAR/BAKKIE', 'LAWNMOWER', 'CHAINSAW/POLE SAW', 'BRUSHCUTTER/WEEDEATER',
  'GENERATOR', 'HEDGE TRIMMER', 'PRESSURE WASHER', 'VACUUM/BLOWER',
  'PUMP', 'MOTORBIKE/QUADBIKE', 'ELECTRICAL', '4 STROKE', 'OUTBOARD', 'OTHER'
];

const STATUS = {
  new: { label: 'Job Booked', color: '#0f3460' },
  wip: { label: 'In Progress', color: '#e94560' },
  quoting: { label: 'Quoting', color: '#533483' },
  completed: { label: 'Completed', color: '#0a9396' },
  testing: { label: 'Final Testing', color: '#ee9b00' },
  invoice: { label: 'Invoice & Collection', color: '#2d6a4f' },
};

const SAMPLE_JOBS = [
  { id: 1, number: 'JB11152', client: 'John Wick', description: 'Engine misfire on startup', jobType: 'CAR/BAKKIE', start: '16 Mar 2026 08:00', due: '23 Mar 2026', status: 'new' },
  { id: 2, number: 'JB11153', client: 'Peter Smith', description: 'Service and brake pads', jobType: 'CAR/BAKKIE', start: '16 Mar 2026 09:30', due: '17 Mar 2026', status: 'wip' },
  { id: 3, number: 'JB11154', client: 'Mike Jones', description: 'Not starting — quote first', jobType: 'LAWNMOWER', start: '16 Mar 2026 10:00', due: '23 Mar 2026', status: 'quoting' },
  { id: 4, number: 'JB11155', client: 'Sarah Brown', description: 'Full service and blade sharpen', jobType: 'CHAINSAW/POLE SAW', start: '12 Mar 2026 11:00', due: '19 Mar 2026', status: 'completed' },
  { id: 5, number: 'JB11156', client: 'Dave Wilson', description: 'Carb clean and tune', jobType: 'BRUSHCUTTER/WEEDEATER', start: '11 Mar 2026 14:00', due: '18 Mar 2026', status: 'testing' },
  { id: 6, number: 'JB11157', client: 'Lisa Taylor', description: 'Starter motor replacement', jobType: 'GENERATOR', start: '10 Mar 2026 09:00', due: '17 Mar 2026', status: 'invoice' },
];

function Dashboard({ setPage }) {
  return (
    <div className="dashboard">
      <div className="dash-grid">
        <div className="dash-card" onClick={() => setPage('jobs')}>
          <span className="dash-icon">📋</span>
          <span className="dash-label">Jobs</span>
        </div>
        <div className="dash-card" onClick={() => setPage('quotes')}>
          <span className="dash-icon">💬</span>
          <span className="dash-label">Quotes</span>
        </div>
        <div className="dash-card" onClick={() => setPage('invoices')}>
          <span className="dash-icon">🧾</span>
          <span className="dash-label">Invoices</span>
        </div>
        <div className="dash-card" onClick={() => setPage('clients')}>
          <span className="dash-icon">👥</span>
          <span className="dash-label">Clients</span>
        </div>
      </div>
      <button className="btn-primary" onClick={() => setPage('newjob')}>+ New Job Card</button>
    </div>
  );
}

function JobsList({ setPage }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const filtered = SAMPLE_JOBS.filter(job => {
    const matchSearch =
      job.client.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.number.toLowerCase().includes(search.toLowerCase()) ||
      job.jobType.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || job.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id) => {
    setSelectedJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  return (
    <div className="jobs-screen">
      <div className="jobs-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>Jobs</h2>
        <span className="job-count">{filtered.length} jobs</span>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          placeholder="🔍 Search job, client, type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>⚙ Filter</button>
      </div>

      {showFilter && (
        <div className="filter-options">
          {['all', 'new', 'wip', 'quoting', 'completed', 'testing', 'invoice'].map(f => (
            <button
              key={f}
              className={`filter-option ${filter === f ? 'active' : ''}`}
              onClick={() => { setFilter(f); setShowFilter(false); }}
            >
              {f === 'all' ? 'All Jobs' : STATUS[f].label}
            </button>
          ))}
        </div>
      )}

      <div className="table-header">
        <span className="col-check"></span>
        <span className="col-number">Number</span>
        <span className="col-client">Customer</span>
        <span className="col-desc">Description</span>
        <span className="col-type">Job Type</span>
        <span className="col-start">Start</span>
        <span className="col-status">Status</span>
        <span className="col-due">Due Date</span>
      </div>

      <div className="jobs-list">
        {filtered.length === 0 && <p className="no-jobs">No jobs found</p>}
        {filtered.map(job => (
          <div key={job.id} className={`job-row ${selectedJobs.includes(job.id) ? 'selected' : ''}`}>
            <span className="col-check">
              <input
                type="checkbox"
                checked={selectedJobs.includes(job.id)}
                onChange={() => toggleSelect(job.id)}
              />
            </span>
            <span className="col-number job-number">{job.number}</span>
            <span className="col-client job-client">{job.client}</span>
            <span className="col-desc job-desc">{job.description}</span>
            <span className="col-type job-type">{job.jobType}</span>
            <span className="col-start job-meta">{job.start}</span>
            <span className="col-status">
              <span className="status-badge" style={{ background: STATUS[job.status].color }}>
                {STATUS[job.status].label}
              </span>
            </span>
            <span className="col-due job-meta">{job.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('dashboard');
  const jobTypes = DEFAULT_JOB_TYPES; // eslint-disable-line

  return (
    <div className="app">
      <header className="header">
        <h1>OBD Workshop</h1>
        <p>Job Management System</p>
      </header>
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'jobs' && <JobsList setPage={setPage} jobTypes={jobTypes} />}
      {page === 'quotes' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Quotes — Coming Soon</h2></div>}
      {page === 'invoices' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Invoices — Coming Soon</h2></div>}
      {page === 'clients' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Clients — Coming Soon</h2></div>}
      {page === 'newjob' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>New Job Card — Coming Soon</h2></div>}
    </div>
  );
}

export default App;