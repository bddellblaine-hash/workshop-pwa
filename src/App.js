import React, { useState } from 'react';
import './App.css';

const DEFAULT_JOB_TYPES = [
  'CAR/BAKKIE', 'LAWNMOWER', 'CHAINSAW/POLE SAW', 'BRUSHCUTTER/WEEDEATER',
  'GENERATOR', 'HEDGE TRIMMER', 'PRESSURE WASHER', 'VACUUM/BLOWER',
  'PUMP', 'MOTORBIKE/QUADBIKE', 'ELECTRICAL', '4 STROKE', 'OUTBOARD', 'OTHER'
];

const DEFAULT_TECHNICIANS = ['Blaine', 'Technician 2', 'Technician 3'];

const DEFAULT_PROBLEMS = [
  'Not Starting', 'No Power', 'Oil Leak', 'Smoke', 'Noise',
  'Full Service', 'Carb Clean', 'Quote Only', 'Overheating', 'Service Due'
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

const SAMPLE_CLIENTS = [
  { id: 1, name: 'John Wick', phone: '0821234567', email: 'john@email.com' },
  { id: 2, name: 'Peter Smith', phone: '0837654321', email: 'peter@email.com' },
  { id: 3, name: 'Mike Jones', phone: '0849876543', email: 'mike@email.com' },
  { id: 4, name: 'Sarah Brown', phone: '0851112233', email: 'sarah@email.com' },
];

function addWorkingDays(date, days) {
  let count = 0;
  let current = new Date(date);
  while (count < days) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return current;
}

function formatDate(date) {
  return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

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

function NewJobCard({ setPage }) {
  const today = new Date();
  const defaultDue = addWorkingDays(today, 5);

  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientResults, setShowClientResults] = useState(false);
  const [jobType, setJobType] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [registration, setRegistration] = useState('');
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [notes, setNotes] = useState('');
  const [technician, setTechnician] = useState('');
  const [dueDate, setDueDate] = useState(formatDate(defaultDue));
  const [errors, setErrors] = useState({});

  const clientResults = SAMPLE_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch)
  );

  const toggleProblem = (problem) => {
    setSelectedProblems(prev =>
      prev.includes(problem) ? prev.filter(p => p !== problem) : [...prev, problem]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedClient) newErrors.client = 'Please select a client';
    if (!jobType) newErrors.jobType = 'Please select a job type';
    if (jobType === 'CAR/BAKKIE' && !vehicleMake) newErrors.vehicleMake = 'Please enter vehicle make';
    if (jobType === 'CAR/BAKKIE' && !registration) newErrors.registration = 'Please enter registration';
    if (selectedProblems.length === 0 && !notes) newErrors.problems = 'Please select a problem or add notes';
    if (!technician) newErrors.technician = 'Please assign a technician';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert('Job card created successfully!');
      setPage('jobs');
    }
  };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>New Job Card</h2>
      </div>

      <div className="form-body">

        <div className="form-section">
          <h3 className="section-title">Client</h3>
          <div className="field">
            <input
              className="form-input"
              placeholder="🔍 Search client name or phone..."
              value={clientSearch}
              onChange={e => { setClientSearch(e.target.value); setShowClientResults(true); setSelectedClient(null); }}
            />
            {errors.client && <span className="error">{errors.client}</span>}
            {showClientResults && clientSearch && (
              <div className="client-results">
                {clientResults.length === 0 && (
                  <div className="client-result-item new-client">+ Create new client: {clientSearch}</div>
                )}
                {clientResults.map(c => (
                  <div key={c.id} className="client-result-item" onClick={() => {
                    setSelectedClient(c);
                    setClientSearch(c.name);
                    setShowClientResults(false);
                  }}>
                    <span className="result-name">{c.name}</span>
                    <span className="result-phone">{c.phone}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedClient && (
              <div className="selected-client">
                <span>✅ {selectedClient.name} — {selectedClient.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Job Type</h3>
          <div className="field">
            <select
              className="form-input"
              value={jobType}
              onChange={e => setJobType(e.target.value)}
            >
              <option value="">Select job type...</option>
              {DEFAULT_JOB_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.jobType && <span className="error">{errors.jobType}</span>}
          </div>

          {jobType === 'CAR/BAKKIE' && (
            <div className="vehicle-fields">
              <div className="field">
                <input
                  className="form-input"
                  placeholder="Vehicle Make (e.g. Toyota)"
                  value={vehicleMake}
                  onChange={e => setVehicleMake(e.target.value)}
                />
                {errors.vehicleMake && <span className="error">{errors.vehicleMake}</span>}
              </div>
              <div className="field">
                <input
                  className="form-input"
                  placeholder="Vehicle Model (e.g. Hilux)"
                  value={vehicleModel}
                  onChange={e => setVehicleModel(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  className="form-input"
                  placeholder="Registration Number"
                  value={registration}
                  onChange={e => setRegistration(e.target.value.toUpperCase())}
                />
                {errors.registration && <span className="error">{errors.registration}</span>}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3 className="section-title">Problem</h3>
          <div className="problems-grid">
            {DEFAULT_PROBLEMS.map(p => (
              <button
                key={p}
                className={`problem-btn ${selectedProblems.includes(p) ? 'active' : ''}`}
                onClick={() => toggleProblem(p)}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.problems && <span className="error">{errors.problems}</span>}
          <div className="field" style={{ marginTop: '12px' }}>
            <textarea
              className="form-input"
              placeholder="Additional notes..."
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Technician</h3>
          <div className="field">
            <select
              className="form-input"
              value={technician}
              onChange={e => setTechnician(e.target.value)}
            >
              <option value="">Assign technician...</option>
              {DEFAULT_TECHNICIANS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.technician && <span className="error">{errors.technician}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Due Date</h3>
          <div className="field">
            <input
              className="form-input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
            <span className="field-hint">Auto-set to 5 working days — tap to edit</span>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Create Job Card
        </button>

      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="app">
      <header className="header">
        <h1>OBD Workshop</h1>
        <p>Job Management System</p>
      </header>
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'jobs' && <JobsList setPage={setPage} />}
      {page === 'newjob' && <NewJobCard setPage={setPage} />}
      {page === 'quotes' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Quotes — Coming Soon</h2></div>}
      {page === 'invoices' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Invoices — Coming Soon</h2></div>}
      {page === 'clients' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Clients — Coming Soon</h2></div>}
    </div>
  );
}

export default App;