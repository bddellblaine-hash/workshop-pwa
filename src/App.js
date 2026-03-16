import React, { useState, useRef } from 'react';
import './App.css';

const DEFAULT_SETTINGS = {
  labourRateVehicle: 695,
  labourRateOther: 550,
  sundriesVehicle: 295,
  sundriesOther: 115,
  defaultDueDays: 5,
};

const VEHICLE_JOB_TYPES = ['CAR/BAKKIE', 'MOTORBIKE/QUADBIKE'];

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

const TERMS = [
  'Work lead in time of 5 working days.',
  'Quotes that are not accepted will have a fee of R450.00.',
  'Items that are not collected within 3 months will be sold to defray expenses.',
  'Quotes are subject to change due to unforeseen complications.',
  'Nothing will be released without payment.',
];

const STATUS = {
  new: { label: 'Job Booked', color: '#0f3460' },
  wip: { label: 'In Progress', color: '#e94560' },
  quoting: { label: 'Quoting', color: '#533483' },
  completed: { label: 'Completed', color: '#0a9396' },
  testing: { label: 'Final Testing', color: '#ee9b00' },
  invoice: { label: 'Invoice & Collection', color: '#2d6a4f' },
};

const SAMPLE_INVENTORY = [
  { id: 1, name: 'Air Filter', price: 85 },
  { id: 2, name: 'Spark Plug', price: 45 },
  { id: 3, name: 'Fuel Filter', price: 65 },
  { id: 4, name: 'Oil Filter', price: 75 },
  { id: 5, name: 'Carburettor Kit', price: 320 },
  { id: 6, name: 'Pull Cord', price: 55 },
  { id: 7, name: 'Primer Bulb', price: 35 },
  { id: 8, name: 'Recoil Assembly', price: 180 },
  { id: 9, name: 'Brake Pads Front', price: 450 },
  { id: 10, name: 'Engine Oil 1L', price: 120 },
  { id: 11, name: 'Fuel Line', price: 45 },
  { id: 12, name: 'Blade', price: 180 },
];

const QUICK_PARTS_CHECKLIST = [
  { name: 'Spark Plug', price: 45 },
  { name: 'Fuel Filter', price: 65 },
  { name: 'Carburettor Kit', price: 320 },
  { name: 'Pull Cord', price: 55 },
  { name: 'Primer Bulb', price: 35 },
  { name: 'Fuel Line', price: 45 },
  { name: 'Blade', price: 180 },
];

const SAMPLE_JOBS = [
  { id: 1, number: 'JB11152', client: 'John Wick', phone: '0821234567', description: 'Engine misfire on startup', jobType: 'CAR/BAKKIE', vehicleMake: 'Opel', vehicleModel: 'Corsa', registration: 'ABC123GP', start: '16 Mar 2026 08:00', due: '23 Mar 2026', status: 'wip', technician: 'Blaine', notes: 'Check spark plugs and coil packs first.', photos: [], slips: [], history: [{ time: '16 Mar 2026 08:00', note: 'Job booked by Blaine' }, { time: '16 Mar 2026 09:00', note: 'Status changed to In Progress' }] },
  { id: 2, number: 'JB11153', client: 'Peter Smith', phone: '0837654321', description: 'Service and brake pads', jobType: 'CAR/BAKKIE', vehicleMake: 'VW', vehicleModel: 'Golf', registration: 'DEF456GP', start: '16 Mar 2026 09:30', due: '17 Mar 2026', status: 'new', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '16 Mar 2026 09:30', note: 'Job booked by Blaine' }] },
  { id: 3, number: 'JB11154', client: 'Mike Jones', phone: '0849876543', description: 'Not starting — quote first', jobType: 'LAWNMOWER', vehicleMake: '', vehicleModel: '', registration: '', start: '16 Mar 2026 10:00', due: '23 Mar 2026', status: 'quoting', technician: 'Blaine', notes: 'Client wants quote before proceeding.', photos: [], slips: [], history: [{ time: '16 Mar 2026 10:00', note: 'Job booked by Blaine' }] },
  { id: 4, number: 'JB11155', client: 'Sarah Brown', phone: '0851112233', description: 'Full service and blade sharpen', jobType: 'CHAINSAW/POLE SAW', vehicleMake: '', vehicleModel: '', registration: '', start: '12 Mar 2026 11:00', due: '19 Mar 2026', status: 'completed', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '12 Mar 2026 11:00', note: 'Job booked' }, { time: '13 Mar 2026 09:00', note: 'Status changed to Completed' }] },
  { id: 5, number: 'JB11156', client: 'Dave Wilson', phone: '0829998877', description: 'Carb clean and tune', jobType: 'BRUSHCUTTER/WEEDEATER', vehicleMake: '', vehicleModel: '', registration: '', start: '11 Mar 2026 14:00', due: '18 Mar 2026', status: 'testing', technician: 'Blaine', notes: '', photos: [], slips: [], history: [{ time: '11 Mar 2026 14:00', note: 'Job booked' }] },
  { id: 6, number: 'JB11157', client: 'Lisa Taylor', phone: '0834445566', description: 'Starter motor replacement', jobType: 'GENERATOR', vehicleMake: '', vehicleModel: '', registration: '', start: '10 Mar 2026 09:00', due: '17 Mar 2026', status: 'invoice', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '10 Mar 2026 09:00', note: 'Job booked' }, { time: '15 Mar 2026 14:00', note: 'Status changed to Invoice & Collection' }] },
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

function parseVoiceCommand(transcript, parts, setParts, labourHours, setLabourHours, setNotes, inventory) {
  const text = transcript.toLowerCase();
  let handled = false;

  const labourMatch = text.match(/(\d+\.?\d*)\s*(and a half|\.5)?\s*hour/);
  if (labourMatch) {
    let hours = parseFloat(labourMatch[1]);
    if (text.includes('and a half') || text.includes('.5')) hours += 0.5;
    setLabourHours(hours);
    handled = true;
  }

  const halfHourMatch = text.match(/half\s*hour/);
  if (halfHourMatch) { setLabourHours(0.5); handled = true; }

  inventory.forEach(item => {
    if (text.includes(item.name.toLowerCase())) {
      const priceMatch = text.match(/r\s*(\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : item.price;
      setParts(prev => [...prev, { id: Date.now() + Math.random(), name: item.name, price, fromInventory: true }]);
      handled = true;
    }
  });

  const addMatch = text.match(/add\s+(.+?)\s+r\s*(\d+)/);
  if (addMatch) {
    setParts(prev => [...prev, { id: Date.now(), name: addMatch[1], price: parseFloat(addMatch[2]), fromInventory: false }]);
    handled = true;
  }

  if (!handled) {
    setNotes(prev => prev ? prev + ' ' + transcript : transcript);
  }
}

function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice not supported. Please use Chrome.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-ZA';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return { listening, startListening };
}

function Dashboard({ setPage }) {
  return (
    <div className="dashboard">
      <div className="dash-grid">
        <div className="dash-card" onClick={() => setPage('jobs')}><span className="dash-icon">📋</span><span className="dash-label">Jobs</span></div>
        <div className="dash-card" onClick={() => setPage('quotes')}><span className="dash-icon">💬</span><span className="dash-label">Quotes</span></div>
        <div className="dash-card" onClick={() => setPage('invoices')}><span className="dash-icon">🧾</span><span className="dash-label">Invoices</span></div>
        <div className="dash-card" onClick={() => setPage('clients')}><span className="dash-icon">👥</span><span className="dash-label">Clients</span></div>
      </div>
      <button className="btn-primary" onClick={() => setPage('newjob')}>+ New Job Card</button>
    </div>
  );
}

function JobsList({ setPage, setSelectedJob }) {
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
    setSelectedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  };

  return (
    <div className="jobs-screen">
      <div className="jobs-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>Jobs</h2>
        <span className="job-count">{filtered.length} jobs</span>
      </div>
      <div className="search-row">
        <input className="search-input" placeholder="🔍 Search job, client, type..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>⚙ Filter</button>
      </div>
      {showFilter && (
        <div className="filter-options">
          {['all', 'new', 'wip', 'quoting', 'completed', 'testing', 'invoice'].map(f => (
            <button key={f} className={`filter-option ${filter === f ? 'active' : ''}`} onClick={() => { setFilter(f); setShowFilter(false); }}>
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
          <div key={job.id} className={`job-row ${selectedJobs.includes(job.id) ? 'selected' : ''}`}
            onClick={() => { setSelectedJob(job); setPage('jobdetail'); }}>
            <span className="col-check">
              <input type="checkbox" checked={selectedJobs.includes(job.id)} onChange={(e) => { e.stopPropagation(); toggleSelect(job.id); }} />
            </span>
            <span className="col-number job-number">{job.number}</span>
            <span className="col-client job-client">{job.client}</span>
            <span className="col-desc job-desc">{job.description}</span>
            <span className="col-type job-type">{job.jobType}</span>
            <span className="col-start job-meta">{job.start}</span>
            <span className="col-status">
              <span className="status-badge" style={{ background: STATUS[job.status].color }}>{STATUS[job.status].label}</span>
            </span>
            <span className="col-due job-meta">{job.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobDetail({ setPage, job }) {
  const isVehicle = VEHICLE_JOB_TYPES.includes(job.jobType);
  const labourRate = isVehicle ? DEFAULT_SETTINGS.labourRateVehicle : DEFAULT_SETTINGS.labourRateOther;
  const sundriesRate = isVehicle ? DEFAULT_SETTINGS.sundriesVehicle : DEFAULT_SETTINGS.sundriesOther;
  const sundriesLabel = isVehicle ? 'Vehicle Sundries' : 'Machine Sundries';

  const [status, setStatus] = useState(job.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [labourHours, setLabourHours] = useState(1);
  const [sundriesAmount, setSundriesAmount] = useState(sundriesRate);
  const [parts, setParts] = useState([]);
  const [partSearch, setPartSearch] = useState('');
  const [showPartDropdown, setShowPartDropdown] = useState(false);
  const [manualPart, setManualPart] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [notes, setNotes] = useState(job.notes);
  const [showSlips, setShowSlips] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showQuickParts, setShowQuickParts] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'assistant', text: 'Hi! I can help with repair questions. What do you need to know?' }]);
  const [aiInput, setAiInput] = useState('');
  const cameraRef = useRef(null);

  const labourTotal = labourHours * labourRate;
  const partsTotal = parts.reduce((sum, p) => sum + p.price, 0);
  const grandTotal = labourTotal + sundriesAmount + partsTotal;

  const filteredInventory = SAMPLE_INVENTORY.filter(i =>
    i.name.toLowerCase().includes(partSearch.toLowerCase())
  );

  const addFromInventory = (item) => {
    setParts(prev => [...prev, { id: Date.now(), name: item.name, price: item.price, fromInventory: true }]);
    setPartSearch('');
    setShowPartDropdown(false);
  };

  const addFromChecklist = (item) => {
    setParts(prev => [...prev, { id: Date.now(), name: item.name, price: item.price, fromInventory: true }]);
  };

  const addManualPart = () => {
    if (!manualPart || !manualPrice) return;
    setParts(prev => [...prev, { id: Date.now(), name: manualPart, price: parseFloat(manualPrice), fromInventory: false }]);
    setManualPart('');
    setManualPrice('');
  };

  const removePart = (id) => setParts(prev => prev.filter(p => p.id !== id));

  const handleVoiceResult = (transcript) => {
    setVoiceStatus(`Heard: "${transcript}"`);
    parseVoiceCommand(transcript, parts, setParts, labourHours, setLabourHours, setNotes, SAMPLE_INVENTORY);
    setTimeout(() => setVoiceStatus(''), 3000);
  };

  const { listening, startListening } = useVoice(handleVoiceResult);

  const handleAIVoiceResult = (transcript) => {
    setAiInput(transcript);
  };

  const { listening: aiListening, startListening: startAIListening } = useVoice(handleAIVoiceResult);

  const sendAIMessage = () => {
    if (!aiInput.trim()) return;
    const userMsg = { role: 'user', text: aiInput };
    setAiMessages(prev => [...prev, userMsg, { role: 'assistant', text: 'This is a placeholder AI response. Once connected to Claude API this will give real repair advice for ' + job.jobType + '.' }]);
    setAiInput('');
  };

  return (
    <div className="jobdetail-screen">
      <div className="jobdetail-header">
        <button className="back-btn" onClick={() => setPage('jobs')}>← Back</button>
        <div className="jobdetail-title">
          <span className="job-number-large">{job.number}</span>
          <span className="job-client-large">{job.client}</span>
        </div>
        <span className="status-badge" style={{ background: STATUS[status].color }}>{STATUS[status].label}</span>
      </div>

      {voiceStatus && (
        <div className="voice-status-banner">
          🎤 {voiceStatus}
        </div>
      )}

      <div className="jobdetail-body">

        <div className="detail-section">
          <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{job.phone}</span></div>
          <div className="detail-row"><span className="detail-label">Job Type</span><span className="detail-value">{job.jobType}</span></div>
          {job.vehicleMake && (
            <div className="detail-row"><span className="detail-label">Vehicle</span><span className="detail-value">{job.vehicleMake} {job.vehicleModel} — {job.registration}</span></div>
          )}
          <div className="detail-row"><span className="detail-label">Problem</span><span className="detail-value">{job.description}</span></div>
          <div className="detail-row"><span className="detail-label">Technician</span><span className="detail-value">{job.technician}</span></div>
          <div className="detail-row"><span className="detail-label">Due</span><span className="detail-value">{job.due}</span></div>
        </div>

        <div className="detail-section">
          <div className="section-row">
            <h3 className="section-title">Change Status</h3>
            <button className="toggle-btn" onClick={() => setShowStatusMenu(!showStatusMenu)}>{showStatusMenu ? '▲' : '▼'}</button>
          </div>
          {showStatusMenu && (
            <div className="status-grid">
              {Object.entries(STATUS).map(([key, val]) => (
                <button key={key}
                  className={`status-option ${status === key ? 'active' : ''}`}
                  style={{ borderColor: val.color, background: status === key ? val.color : 'transparent' }}
                  onClick={() => { setStatus(key); setShowStatusMenu(false); }}>
                  {val.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-section">
          <div className="section-row">
            <h3 className="section-title">Parts & Labour</h3>
            <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startListening}>
              {listening ? '🔴 Listening...' : '🎤 Voice'}
            </button>
          </div>

          {listening && (
            <div className="voice-hint">
              Try saying: "2 hours labour" · "Add spark plug" · "Blade R180"
            </div>
          )}

          <div className="part-row fixed-row">
            <span className="part-name">⏱ Labour</span>
            <div className="labour-controls">
              <button className="qty-btn" onClick={() => setLabourHours(h => Math.max(0.5, parseFloat((h - 0.5).toFixed(1))))}>−</button>
              <span className="labour-hours">{labourHours}h @ R{labourRate}/hr</span>
              <button className="qty-btn" onClick={() => setLabourHours(h => parseFloat((h + 0.5).toFixed(1)))}>+</button>
            </div>
            <span className="part-price">R{labourTotal.toFixed(2)}</span>
          </div>

          <div className="part-row fixed-row">
            <span className="part-name">🔧 {sundriesLabel}</span>
            <input className="sundries-input" type="number" value={sundriesAmount} onChange={e => setSundriesAmount(parseFloat(e.target.value) || 0)} />
            <span className="part-price">R{sundriesAmount.toFixed(2)}</span>
          </div>

          <div className="parts-divider">Additional Parts</div>

          {!isVehicle && (
            <div className="quick-parts-section">
              <div className="section-row" onClick={() => setShowQuickParts(!showQuickParts)} style={{ cursor: 'pointer' }}>
                <span className="quick-parts-label">⚡ Quick Parts Checklist</span>
                <button className="toggle-btn">{showQuickParts ? '▲' : '▼'}</button>
              </div>
              {showQuickParts && (
                <div className="quick-parts-grid">
                  {QUICK_PARTS_CHECKLIST.map((item, i) => {
                    const alreadyAdded = parts.filter(p => p.name === item.name).length;
                    return (
                      <button key={i}
                        className={`quick-part-btn ${alreadyAdded > 0 ? 'added' : ''}`}
                        onClick={() => addFromChecklist(item)}>
                        <span className="qp-name">{item.name}</span>
                        <span className="qp-price">R{item.price}</span>
                        {alreadyAdded > 0 && <span className="qp-count">x{alreadyAdded}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="part-search-row">
            <div className="part-search-wrapper">
              <input className="form-input" placeholder="🔍 Search inventory..." value={partSearch}
                onChange={e => { setPartSearch(e.target.value); setShowPartDropdown(true); }}
                onFocus={() => setShowPartDropdown(true)} />
              {showPartDropdown && partSearch && (
                <div className="part-dropdown">
                  {filteredInventory.length === 0 && <div className="part-dropdown-item">No items found</div>}
                  {filteredInventory.map(item => (
                    <div key={item.id} className="part-dropdown-item" onClick={() => addFromInventory(item)}>
                      <span>{item.name}</span>
                      <span className="dropdown-price">R{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="add-part-row">
            <input className="form-input part-input" placeholder="Manual part description" value={manualPart} onChange={e => setManualPart(e.target.value)} />
            <input className="form-input price-input" placeholder="Price" type="number" value={manualPrice} onChange={e => setManualPrice(e.target.value)} />
            <button className="add-part-btn" onClick={addManualPart}>+</button>
          </div>

          <div className="parts-list">
            {parts.length === 0 && <p className="no-parts">No additional parts added</p>}
            {parts.map(p => (
              <div key={p.id} className="part-row">
                <span className="part-name">{p.fromInventory ? '📦' : '✏️'} {p.name}</span>
                <span className="part-price">R{p.price.toFixed(2)}</span>
                <button className="remove-part" onClick={() => removePart(p.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="parts-total">
            <span>Grand Total</span>
            <span>R{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="detail-section">
          <div className="section-row">
            <h3 className="section-title">Notes</h3>
            <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startListening}>
              {listening ? '🔴 Listening...' : '🎤 Voice'}
            </button>
          </div>
          <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes here or use voice..." />
        </div>

        <div className="detail-section collapsible">
          <div className="section-row" onClick={() => setShowSlips(!showSlips)}>
            <h3 className="section-title">📄 Slips & Receipts</h3>
            <button className="toggle-btn">{showSlips ? '▲' : '▼'}</button>
          </div>
          {showSlips && (
            <div className="slips-body">
              <p className="no-parts">No slips uploaded yet</p>
              <button className="upload-btn">📎 Upload Slip</button>
            </div>
          )}
        </div>

        <div className="detail-section collapsible">
          <div className="section-row" onClick={() => setShowAIChat(!showAIChat)}>
            <h3 className="section-title">🤖 AI Tech Assistant</h3>
            <button className="toggle-btn">{showAIChat ? '▲' : '▼'}</button>
          </div>
          {showAIChat && (
            <div className="ai-chat">
              <div className="ai-messages">
                {aiMessages.map((m, i) => (
                  <div key={i} className={`ai-message ${m.role}`}><span>{m.text}</span></div>
                ))}
              </div>
              <div className="ai-input-row">
                <input className="form-input" placeholder="Ask a repair question..." value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAIMessage()} />
                <button className={`voice-btn ${aiListening ? 'listening' : ''}`} onClick={startAIListening}>
                  {aiListening ? '🔴' : '🎤'}
                </button>
                <button className="add-part-btn" onClick={sendAIMessage}>➤</button>
              </div>
            </div>
          )}
        </div>

        <div className="detail-section collapsible">
          <div className="section-row" onClick={() => setShowHistory(!showHistory)}>
            <h3 className="section-title">📋 Audit Trail</h3>
            <button className="toggle-btn">{showHistory ? '▲' : '▼'}</button>
          </div>
          {showHistory && (
            <div className="history-list">
              {job.history.map((h, i) => (
                <div key={i} className="history-item">
                  <span className="history-time">{h.time}</span>
                  <span className="history-note">{h.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: '80px' }}></div>
      </div>

      <div className="bottom-bar">
        <button className="bottom-btn" onClick={() => setPage('jobs')}>📋 Jobs</button>
        <label className="bottom-btn camera-label">
          📷 Camera
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} />
        </label>
        <button className="bottom-btn" onClick={startListening}>
          {listening ? '🔴' : '🎤'} Voice
        </button>
        <button className="bottom-btn">🧾 Invoice</button>
        <button className="bottom-btn whatsapp-btn">💬 WhatsApp</button>
      </div>
    </div>
  );
}

function SignaturePage({ setPage }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [signed, setSigned] = useState(false);
  const now = new Date();

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.lineTo(x, y);
    ctx.stroke();
    setSigned(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const handleConfirm = () => {
    if (!signed) { alert('Please sign before confirming.'); return; }
    alert('Job card created and terms signed!\nWhatsApp confirmation will be sent to client.');
    setPage('jobs');
  };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button className="back-btn" onClick={() => setPage('newjob')}>← Back</button>
        <h2>Terms & Signature</h2>
      </div>
      <div className="form-body">
        <div className="form-section">
          <div className="job-ref-row"><span className="job-ref-label">Job Number</span><span className="job-ref-value">JB11158</span></div>
          <div className="job-ref-row"><span className="job-ref-label">Date & Time</span><span className="job-ref-value">{now.toLocaleString('en-ZA')}</span></div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Terms & Conditions</h3>
          <div className="terms-box">
            {TERMS.map((term, i) => (
              <div key={i} className="term-item">
                <span className="term-number">{i + 1}.</span>
                <span className="term-text">{term}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Client Signature</h3>
          <p className="sig-instruction">By signing below you agree to the above terms and conditions.</p>
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} width={340} height={150} className="sig-canvas"
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
          </div>
          <button className="clear-btn" onClick={clearSignature}>Clear Signature</button>
        </div>
        <button className="btn-primary" onClick={handleConfirm}>✅ Confirm & Send WhatsApp</button>
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

  const handleNext = () => { if (validate()) setPage('signature'); };

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
            <input className="form-input" placeholder="🔍 Search client name or phone..." value={clientSearch}
              onChange={e => { setClientSearch(e.target.value); setShowClientResults(true); setSelectedClient(null); }} />
            {errors.client && <span className="error">{errors.client}</span>}
            {showClientResults && clientSearch && (
              <div className="client-results">
                {clientResults.length === 0 && <div className="client-result-item new-client">+ Create new client: {clientSearch}</div>}
                {clientResults.map(c => (
                  <div key={c.id} className="client-result-item" onClick={() => { setSelectedClient(c); setClientSearch(c.name); setShowClientResults(false); }}>
                    <span className="result-name">{c.name}</span>
                    <span className="result-phone">{c.phone}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedClient && <div className="selected-client"><span>✅ {selectedClient.name} — {selectedClient.phone}</span></div>}
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Job Type</h3>
          <div className="field">
            <select className="form-input" value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value="">Select job type...</option>
              {DEFAULT_JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.jobType && <span className="error">{errors.jobType}</span>}
          </div>
          {jobType === 'CAR/BAKKIE' && (
            <div className="vehicle-fields">
              <div className="field">
                <input className="form-input" placeholder="Vehicle Make (e.g. Toyota)" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} />
                {errors.vehicleMake && <span className="error">{errors.vehicleMake}</span>}
              </div>
              <div className="field">
                <input className="form-input" placeholder="Vehicle Model (e.g. Hilux)" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
              </div>
              <div className="field">
                <input className="form-input" placeholder="Registration Number" value={registration} onChange={e => setRegistration(e.target.value.toUpperCase())} />
                {errors.registration && <span className="error">{errors.registration}</span>}
              </div>
            </div>
          )}
        </div>
        <div className="form-section">
          <h3 className="section-title">Problem</h3>
          <div className="problems-grid">
            {DEFAULT_PROBLEMS.map(p => (
              <button key={p} className={`problem-btn ${selectedProblems.includes(p) ? 'active' : ''}`} onClick={() => toggleProblem(p)}>{p}</button>
            ))}
          </div>
          {errors.problems && <span className="error">{errors.problems}</span>}
          <div className="field" style={{ marginTop: '12px' }}>
            <textarea className="form-input" placeholder="Additional notes..." rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Technician</h3>
          <div className="field">
            <select className="form-input" value={technician} onChange={e => setTechnician(e.target.value)}>
              <option value="">Assign technician...</option>
              {DEFAULT_TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.technician && <span className="error">{errors.technician}</span>}
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Due Date</h3>
          <div className="field">
            <input className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <span className="field-hint">Auto-set to 5 working days — tap to edit</span>
          </div>
        </div>
        <button className="btn-primary" onClick={handleNext}>Next — Terms & Signature →</button>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>OBD Workshop</h1>
        <p>Job Management System</p>
      </header>
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'jobs' && <JobsList setPage={setPage} setSelectedJob={setSelectedJob} />}
      {page === 'jobdetail' && selectedJob && <JobDetail setPage={setPage} job={selectedJob} />}
      {page === 'newjob' && <NewJobCard setPage={setPage} />}
      {page === 'signature' && <SignaturePage setPage={setPage} />}
      {page === 'quotes' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Quotes — Coming Soon</h2></div>}
      {page === 'invoices' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Invoices — Coming Soon</h2></div>}
      {page === 'clients' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Clients — Coming Soon</h2></div>}
    </div>
  );
}

export default App;