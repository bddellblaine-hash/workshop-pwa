import React, { useState, useRef } from 'react';
import './App.css';

const INITIAL_SETTINGS = {
  labourRateVehicle: 695,
  labourRateOther: 550,
  sundriesVehicle: 295,
  sundriesOther: 115,
  defaultDueDays: 5,
  vatEnabled: false,
  companyName: 'OBD Workshop',
  companyAddress: '123 Workshop Street, Cape Town',
  companyPhone: '021 555 1234',
  companyEmail: 'info@obdworkshop.co.za',
  companyLogo: '',
  invoicePrefix: 'INV',
  quotePrefix: 'QT',
  invoiceNextNumber: 11158,
  quoteNextNumber: 1001,
  paymentTerms: 'Nothing will be released without payment.',
  quoteValidity: '30 days',
  invoiceHeaderText: '',
  invoiceFooterText: 'Thank you for your business!',
  bankName: 'FNB',
  bankAccount: '',
  bankBranch: '',
  bankReference: 'Invoice Number',
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
  { id: 1, name: 'Air Filter', costPrice: 45, sellingPrice: 85, category: 'Filters', barcode: '001', supplier: 'Parts Direct' },
  { id: 2, name: 'Spark Plug', costPrice: 25, sellingPrice: 45, category: 'Ignition', barcode: '002', supplier: 'Parts Direct' },
  { id: 3, name: 'Fuel Filter', costPrice: 35, sellingPrice: 65, category: 'Filters', barcode: '003', supplier: 'Parts Direct' },
  { id: 4, name: 'Oil Filter', costPrice: 40, sellingPrice: 75, category: 'Filters', barcode: '004', supplier: 'Parts Direct' },
  { id: 5, name: 'Carburettor Kit', costPrice: 180, sellingPrice: 320, category: 'Fuel System', barcode: '005', supplier: 'Stihl SA' },
  { id: 6, name: 'Pull Cord', costPrice: 30, sellingPrice: 55, category: 'Starter', barcode: '006', supplier: 'Parts Direct' },
  { id: 7, name: 'Primer Bulb', costPrice: 18, sellingPrice: 35, category: 'Fuel System', barcode: '007', supplier: 'Parts Direct' },
  { id: 8, name: 'Recoil Assembly', costPrice: 95, sellingPrice: 180, category: 'Starter', barcode: '008', supplier: 'Stihl SA' },
  { id: 9, name: 'Brake Pads Front', costPrice: 220, sellingPrice: 450, category: 'Brakes', barcode: '009', supplier: 'Midas' },
  { id: 10, name: 'Engine Oil 1L', costPrice: 65, sellingPrice: 120, category: 'Oils', barcode: '010', supplier: 'Parts Direct' },
  { id: 11, name: 'Fuel Line', costPrice: 22, sellingPrice: 45, category: 'Fuel System', barcode: '011', supplier: 'Parts Direct' },
  { id: 12, name: 'Blade', costPrice: 95, sellingPrice: 180, category: 'Cutting', barcode: '012', supplier: 'Husqvarna SA' },
];

const INITIAL_QUICK_PARTS = [
  { name: 'Spark Plug', price: 45 },
  { name: 'Fuel Filter', price: 65 },
  { name: 'Carburettor Kit', price: 320 },
  { name: 'Pull Cord', price: 55 },
  { name: 'Primer Bulb', price: 35 },
  { name: 'Fuel Line', price: 45 },
  { name: 'Blade', price: 180 },
];

const INITIAL_CLIENTS = [
  { id: 1, name: 'John Wick', phone: '0821234567', email: 'john@email.com', address: '1 Continental Hotel, Cape Town', notes: '', termsSigned: true, termsDate: '10 Jan 2026', jobHistory: ['JB11152'] },
  { id: 2, name: 'Peter Smith', phone: '0837654321', email: 'peter@email.com', address: '22 Main Road, Stellenbosch', notes: '', termsSigned: true, termsDate: '12 Feb 2026', jobHistory: ['JB11153'] },
  { id: 3, name: 'Mike Jones', phone: '0849876543', email: 'mike@email.com', address: '', notes: '', termsSigned: false, termsDate: '', jobHistory: ['JB11154'] },
  { id: 4, name: 'Sarah Brown', phone: '0851112233', email: 'sarah@email.com', address: '5 Oak Street, Paarl', notes: '', termsSigned: true, termsDate: '15 Mar 2026', jobHistory: ['JB11155'] },
];

const SAMPLE_JOBS = [
  { id: 1, number: 'JB11152', client: 'John Wick', phone: '0821234567', email: 'john@email.com', description: 'Engine misfire on startup', jobType: 'CAR/BAKKIE', vehicleMake: 'Opel', vehicleModel: 'Corsa', registration: 'ABC123GP', start: '16 Mar 2026 08:00', due: '23 Mar 2026', status: 'wip', technician: 'Blaine', notes: 'Check spark plugs first.', photos: [], slips: [], history: [{ time: '16 Mar 2026 08:00', note: 'Job booked by Blaine' }], parts: [{ id: 1, name: 'Spark Plug', price: 45, fromInventory: true }, { id: 2, name: 'Air Filter', price: 85, fromInventory: true }], labourHours: 2, sundriesAmount: 295 },
  { id: 2, number: 'JB11153', client: 'Peter Smith', phone: '0837654321', email: 'peter@email.com', description: 'Service and brake pads', jobType: 'CAR/BAKKIE', vehicleMake: 'VW', vehicleModel: 'Golf', registration: 'DEF456GP', start: '16 Mar 2026 09:30', due: '17 Mar 2026', status: 'new', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '16 Mar 2026 09:30', note: 'Job booked' }], parts: [], labourHours: 1, sundriesAmount: 295 },
  { id: 3, number: 'JB11154', client: 'Mike Jones', phone: '0849876543', email: 'mike@email.com', description: 'Not starting', jobType: 'LAWNMOWER', vehicleMake: '', vehicleModel: '', registration: '', start: '16 Mar 2026 10:00', due: '23 Mar 2026', status: 'quoting', technician: 'Blaine', notes: '', photos: [], slips: [], history: [{ time: '16 Mar 2026 10:00', note: 'Job booked' }], parts: [{ id: 1, name: 'Carburettor Kit', price: 320, fromInventory: true }], labourHours: 1.5, sundriesAmount: 115 },
  { id: 4, number: 'JB11155', client: 'Sarah Brown', phone: '0851112233', email: 'sarah@email.com', description: 'Full service', jobType: 'CHAINSAW/POLE SAW', vehicleMake: '', vehicleModel: '', registration: '', start: '12 Mar 2026 11:00', due: '19 Mar 2026', status: 'completed', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '12 Mar 2026 11:00', note: 'Job booked' }], parts: [{ id: 1, name: 'Air Filter', price: 85, fromInventory: true }, { id: 2, name: 'Spark Plug', price: 45, fromInventory: true }], labourHours: 1, sundriesAmount: 115 },
  { id: 5, number: 'JB11156', client: 'Dave Wilson', phone: '0829998877', email: '', description: 'Carb clean', jobType: 'BRUSHCUTTER/WEEDEATER', vehicleMake: '', vehicleModel: '', registration: '', start: '11 Mar 2026 14:00', due: '18 Mar 2026', status: 'testing', technician: 'Blaine', notes: '', photos: [], slips: [], history: [{ time: '11 Mar 2026 14:00', note: 'Job booked' }], parts: [], labourHours: 1, sundriesAmount: 115 },
  { id: 6, number: 'JB11157', client: 'Lisa Taylor', phone: '0834445566', email: '', description: 'Starter motor', jobType: 'GENERATOR', vehicleMake: '', vehicleModel: '', registration: '', start: '10 Mar 2026 09:00', due: '17 Mar 2026', status: 'invoice', technician: 'Technician 2', notes: '', photos: [], slips: [], history: [{ time: '10 Mar 2026 09:00', note: 'Job booked' }], parts: [{ id: 1, name: 'Recoil Assembly', price: 180, fromInventory: true }], labourHours: 2, sundriesAmount: 115 },
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
    setLabourHours(hours); handled = true;
  }
  if (text.match(/half\s*hour/)) { setLabourHours(0.5); handled = true; }
  inventory.forEach(item => {
    if (text.includes(item.name.toLowerCase())) {
      const priceMatch = text.match(/r\s*(\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : item.sellingPrice;
      setParts(prev => [...prev, { id: Date.now() + Math.random(), name: item.name, price, fromInventory: true }]);
      handled = true;
    }
  });
  const addMatch = text.match(/add\s+(.+?)\s+r\s*(\d+)/);
  if (addMatch) { setParts(prev => [...prev, { id: Date.now(), name: addMatch[1], price: parseFloat(addMatch[2]), fromInventory: false }]); handled = true; }
  if (!handled) setNotes(prev => prev ? prev + ' ' + transcript : transcript);
}

function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { alert('Voice not supported. Use Chrome.'); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-ZA';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.start();
  };
  return { listening, startListening };
}

function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="settings-section">
      <div className="settings-section-header" onClick={() => setOpen(!open)}>
        <h3 className="settings-section-title">{title}</h3>
        <button className="toggle-btn">{open ? '▲' : '▼'}</button>
      </div>
      {open && <div className="settings-section-body">{children}</div>}
    </div>
  );
}

function InvoiceView({ setPage, job, settings, type = 'invoice' }) {
  const isVehicle = VEHICLE_JOB_TYPES.includes(job.jobType);
  const labourRate = isVehicle ? settings.labourRateVehicle : settings.labourRateOther;
  const isQuote = type === 'quote';
  const docNumber = isQuote ? `${settings.quotePrefix}${settings.quoteNextNumber}` : `${settings.invoicePrefix}${settings.invoiceNextNumber}`;
  const title = isQuote ? 'QUOTATION' : 'INVOICE';

  const labourTotal = job.labourHours * labourRate;
  const partsTotal = job.parts.reduce((sum, p) => sum + p.price, 0);
  const grandTotal = labourTotal + job.sundriesAmount + partsTotal;
  const today = new Date();

  const handleWhatsApp = () => {
    const msg = `Hi ${job.client}, please find your ${title} ${docNumber} from ${settings.companyName}.\n\nTotal: R${grandTotal.toFixed(2)}\n\n${settings.paymentTerms}`;
    const phone = job.phone.replace(/\D/g, '');
    window.open(`https://wa.me/27${phone.slice(1)}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrint = () => window.print();

  return (
    <div className="invoice-screen">
      <div className="invoice-actions no-print">
        <button className="back-btn" onClick={() => setPage('jobdetail')}>← Back</button>
        <button className="inv-action-btn" onClick={handlePrint}>🖨 Print / PDF</button>
        <button className="inv-action-btn whatsapp" onClick={handleWhatsApp}>💬 WhatsApp</button>
      </div>

      <div className="invoice-doc">
        <div className="inv-header">
          <div className="inv-company">
            {settings.companyLogo && <img src={settings.companyLogo} alt="logo" className="inv-logo" />}
            <div>
              <h2 className="inv-company-name">{settings.companyName}</h2>
              {settings.companyAddress && <p>{settings.companyAddress}</p>}
              {settings.companyPhone && <p>Tel: {settings.companyPhone}</p>}
              {settings.companyEmail && <p>{settings.companyEmail}</p>}
            </div>
          </div>
          <div className="inv-title-block">
            <h1 className="inv-title">{title}</h1>
            <table className="inv-meta-table">
              <tbody>
                <tr><td>{isQuote ? 'Quote No' : 'Invoice No'}:</td><td><strong>{docNumber}</strong></td></tr>
                <tr><td>Job Ref:</td><td><strong>{job.number}</strong></td></tr>
                <tr><td>Date:</td><td>{today.toLocaleDateString('en-ZA')}</td></tr>
                {isQuote && <tr><td>Valid Until:</td><td>{formatDate(addWorkingDays(today, 30))}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="inv-divider" />

        <div className="inv-client-section">
          <div className="inv-client">
            <p className="inv-section-label">BILL TO</p>
            <p className="inv-client-name">{job.client}</p>
            <p>{job.phone}</p>
            {job.email && <p>{job.email}</p>}
          </div>
          <div className="inv-job-info">
            <p className="inv-section-label">JOB DETAILS</p>
            <p><strong>Type:</strong> {job.jobType}</p>
            {job.vehicleMake && <p><strong>Vehicle:</strong> {job.vehicleMake} {job.vehicleModel}</p>}
            {job.registration && <p><strong>Reg:</strong> {job.registration}</p>}
            <p><strong>Description:</strong> {job.description}</p>
          </div>
        </div>

        <div className="inv-divider" />

        {settings.invoiceHeaderText && <p className="inv-header-text">{settings.invoiceHeaderText}</p>}

        <table className="inv-table">
          <thead>
            <tr>
              <th className="inv-th-desc">Description</th>
              <th className="inv-th-qty">Qty</th>
              <th className="inv-th-price">Unit Price</th>
              <th className="inv-th-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="inv-row">
              <td>Labour — {job.jobType} ({job.labourHours}hrs @ R{labourRate}/hr)</td>
              <td className="inv-center">{job.labourHours}</td>
              <td className="inv-right">R{labourRate.toFixed(2)}</td>
              <td className="inv-right">R{labourTotal.toFixed(2)}</td>
            </tr>
            <tr className="inv-row">
              <td>{isVehicle ? 'Vehicle Sundries' : 'Machine Sundries'}</td>
              <td className="inv-center">1</td>
              <td className="inv-right">R{job.sundriesAmount.toFixed(2)}</td>
              <td className="inv-right">R{job.sundriesAmount.toFixed(2)}</td>
            </tr>
            {job.parts.map((part, i) => (
              <tr key={i} className="inv-row">
                <td>{part.name}</td>
                <td className="inv-center">1</td>
                <td className="inv-right">R{part.price.toFixed(2)}</td>
                <td className="inv-right">R{part.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="inv-totals">
          <div className="inv-total-row"><span>Subtotal</span><span>R{grandTotal.toFixed(2)}</span></div>
          <div className="inv-total-row grand"><span>TOTAL</span><span>R{grandTotal.toFixed(2)}</span></div>
        </div>

        <div className="inv-divider" />

        {(settings.bankName || settings.bankAccount) && (
          <div className="inv-bank">
            <p className="inv-section-label">BANKING DETAILS</p>
            <div className="inv-bank-grid">
              {settings.bankName && <><span>Bank:</span><span>{settings.bankName}</span></>}
              {settings.bankAccount && <><span>Account:</span><span>{settings.bankAccount}</span></>}
              {settings.bankBranch && <><span>Branch Code:</span><span>{settings.bankBranch}</span></>}
              {settings.bankReference && <><span>Reference:</span><span>{docNumber}</span></>}
            </div>
          </div>
        )}

        <div className="inv-divider" />

        <div className="inv-terms">
          <p className="inv-section-label">TERMS & CONDITIONS</p>
          <p>{settings.paymentTerms}</p>
        </div>

        {settings.invoiceFooterText && (
          <div className="inv-footer">
            <p>{settings.invoiceFooterText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryScreen({ setPage, inventory, setInventory }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', costPrice: '', sellingPrice: '', category: '', barcode: '', supplier: '' });
  const [showScanner, setShowScanner] = useState(false);
  const barcodeRef = useRef(null);

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.barcode.includes(search)
  );

  const handleSave = () => {
    if (!form.name) return;
    if (editItem) {
      setInventory(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form, costPrice: parseFloat(form.costPrice), sellingPrice: parseFloat(form.sellingPrice) } : i));
      setEditItem(null);
    } else {
      setInventory(prev => [...prev, { ...form, id: Date.now(), costPrice: parseFloat(form.costPrice), sellingPrice: parseFloat(form.sellingPrice) }]);
    }
    setForm({ name: '', costPrice: '', sellingPrice: '', category: '', barcode: '', supplier: '' });
    setShowAdd(false);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, costPrice: item.costPrice, sellingPrice: item.sellingPrice, category: item.category, barcode: item.barcode, supplier: item.supplier });
    setShowAdd(true);
  };

  const handleDelete = (id) => setInventory(prev => prev.filter(i => i.id !== id));

  const markup = (cost, sell) => cost > 0 ? Math.round(((sell - cost) / cost) * 100) : 0;

  return (
    <div className="jobs-screen">
      <div className="jobs-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>Inventory</h2>
        <span className="job-count">{filtered.length} items</span>
      </div>

      <div className="search-row">
        <input className="search-input" placeholder="🔍 Search name, category, barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="filter-btn" onClick={() => { setShowAdd(!showAdd); setEditItem(null); setForm({ name: '', costPrice: '', sellingPrice: '', category: '', barcode: '', supplier: '' }); }}>+ Add</button>
      </div>

      {showAdd && (
        <div className="form-section" style={{ marginBottom: '12px' }}>
          <h3 className="section-title">{editItem ? 'Edit Item' : 'New Item'}</h3>
          <div className="field"><input className="form-input" placeholder="Item Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="add-part-row">
            <input className="form-input" placeholder="Cost Price" type="number" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: e.target.value }))} />
            <input className="form-input" placeholder="Selling Price" type="number" value={form.sellingPrice} onChange={e => setForm(p => ({ ...p, sellingPrice: e.target.value }))} />
          </div>
          <div className="field"><input className="form-input" placeholder="Category (e.g. Filters)" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
          <div className="add-part-row">
            <input className="form-input" placeholder="Barcode / QR Code" value={form.barcode} onChange={e => setForm(p => ({ ...p, barcode: e.target.value }))} />
            <label className="filter-btn" style={{ cursor: 'pointer', textAlign: 'center' }}>
              📷 Scan
              <input ref={barcodeRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} />
            </label>
          </div>
          <div className="field"><input className="form-input" placeholder="Supplier Name" value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} /></div>
          {form.costPrice && form.sellingPrice && (
            <p className="field-hint" style={{ marginBottom: '8px' }}>
              Markup: {markup(parseFloat(form.costPrice), parseFloat(form.sellingPrice))}%
            </p>
          )}
          <div className="add-tag-row">
            <button className="btn-primary" onClick={handleSave}>{editItem ? 'Update Item' : 'Save Item'}</button>
            <button className="clear-btn" onClick={() => { setShowAdd(false); setEditItem(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="inv-list-header">
        <span>Item</span>
        <span>Cost</span>
        <span>Price</span>
        <span>Markup</span>
        <span></span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filtered.length === 0 && <p className="no-jobs">No items found</p>}
        {filtered.map(item => (
          <div key={item.id} className="inv-item-row">
            <div className="inv-item-info">
              <span className="inv-item-name">{item.name}</span>
              <span className="inv-item-meta">{item.category} {item.supplier ? '· ' + item.supplier : ''} {item.barcode ? '· #' + item.barcode : ''}</span>
            </div>
            <span className="inv-cost">R{item.costPrice}</span>
            <span className="inv-price">R{item.sellingPrice}</span>
            <span className="inv-markup">{markup(item.costPrice, item.sellingPrice)}%</span>
            <div className="inv-actions">
              <button className="inv-edit-btn" onClick={() => handleEdit(item)}>✏️</button>
              <button className="inv-delete-btn" onClick={() => handleDelete(item.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
      <div className="dash-grid" style={{ marginTop: '0' }}>
        <div className="dash-card" onClick={() => setPage('inventory')}><span className="dash-icon">📦</span><span className="dash-label">Inventory</span></div>
        <div className="dash-card" onClick={() => setPage('settings')}><span className="dash-icon">⚙️</span><span className="dash-label">Settings</span></div>
      </div>
      <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => setPage('newjob')}>+ New Job Card</button>
    </div>
  );
}

function JobsList({ setPage, setSelectedJob }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const filtered = SAMPLE_JOBS.filter(job => {
    const matchSearch = job.client.toLowerCase().includes(search.toLowerCase()) || job.description.toLowerCase().includes(search.toLowerCase()) || job.number.toLowerCase().includes(search.toLowerCase()) || job.jobType.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || job.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id) => setSelectedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

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
          <div key={job.id} className={`job-row ${selectedJobs.includes(job.id) ? 'selected' : ''}`} onClick={() => { setSelectedJob(job); setPage('jobdetail'); }}>
            <span className="col-check"><input type="checkbox" checked={selectedJobs.includes(job.id)} onChange={(e) => { e.stopPropagation(); toggleSelect(job.id); }} /></span>
            <span className="col-number job-number">{job.number}</span>
            <span className="col-client job-client">{job.client}</span>
            <span className="col-desc job-desc">{job.description}</span>
            <span className="col-type job-type">{job.jobType}</span>
            <span className="col-start job-meta">{job.start}</span>
            <span className="col-status"><span className="status-badge" style={{ background: STATUS[job.status].color }}>{STATUS[job.status].label}</span></span>
            <span className="col-due job-meta">{job.due}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobDetail({ setPage, job, settings, quickParts, setSelectedJob, setInvoiceType }) {
  const isVehicle = VEHICLE_JOB_TYPES.includes(job.jobType);
  const labourRate = isVehicle ? settings.labourRateVehicle : settings.labourRateOther;
  const sundriesRate = isVehicle ? settings.sundriesVehicle : settings.sundriesOther;
  const sundriesLabel = isVehicle ? 'Vehicle Sundries' : 'Machine Sundries';

  const [status, setStatus] = useState(job.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [labourHours, setLabourHours] = useState(job.labourHours || 1);
  const [sundriesAmount, setSundriesAmount] = useState(job.sundriesAmount || sundriesRate);
  const [parts, setParts] = useState(job.parts || []);
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

  const filteredInventory = SAMPLE_INVENTORY.filter(i => i.name.toLowerCase().includes(partSearch.toLowerCase()));
  const addFromInventory = (item) => { setParts(prev => [...prev, { id: Date.now(), name: item.name, price: item.sellingPrice, fromInventory: true }]); setPartSearch(''); setShowPartDropdown(false); };
  const addFromChecklist = (item) => setParts(prev => [...prev, { id: Date.now(), name: item.name, price: item.price, fromInventory: true }]);
  const addManualPart = () => { if (!manualPart || !manualPrice) return; setParts(prev => [...prev, { id: Date.now(), name: manualPart, price: parseFloat(manualPrice), fromInventory: false }]); setManualPart(''); setManualPrice(''); };
  const removePart = (id) => setParts(prev => prev.filter(p => p.id !== id));

  const handleVoiceResult = (transcript) => { setVoiceStatus(`Heard: "${transcript}"`); parseVoiceCommand(transcript, parts, setParts, labourHours, setLabourHours, setNotes, SAMPLE_INVENTORY); setTimeout(() => setVoiceStatus(''), 3000); };
  const { listening, startListening } = useVoice(handleVoiceResult);
  const handleAIVoiceResult = (transcript) => setAiInput(transcript);
  const { listening: aiListening, startListening: startAIListening } = useVoice(handleAIVoiceResult);

  const sendAIMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages(prev => [...prev, { role: 'user', text: aiInput }, { role: 'assistant', text: 'Placeholder response for ' + job.jobType + '. Claude API coming soon.' }]);
    setAiInput('');
  };

  const openInvoice = (type) => {
    const updatedJob = { ...job, labourHours, sundriesAmount, parts };
    setSelectedJob(updatedJob);
    setInvoiceType(type);
    setPage('invoiceview');
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

      {voiceStatus && <div className="voice-status-banner">🎤 {voiceStatus}</div>}

      <div className="jobdetail-body">
        <div className="detail-section">
          <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{job.phone}</span></div>
          <div className="detail-row"><span className="detail-label">Job Type</span><span className="detail-value">{job.jobType}</span></div>
          {job.vehicleMake && <div className="detail-row"><span className="detail-label">Vehicle</span><span className="detail-value">{job.vehicleMake} {job.vehicleModel} — {job.registration}</span></div>}
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
                <button key={key} className={`status-option ${status === key ? 'active' : ''}`}
                  style={{ borderColor: val.color, background: status === key ? val.color : 'transparent' }}
                  onClick={() => { setStatus(key); setShowStatusMenu(false); }}>{val.label}</button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-section">
          <div className="section-row">
            <h3 className="section-title">Parts & Labour</h3>
            <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startListening}>{listening ? '🔴 Listening...' : '🎤 Voice'}</button>
          </div>
          {listening && <div className="voice-hint">Try: "2 hours labour" · "Add spark plug" · "Blade R180"</div>}

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
                  {quickParts.map((item, i) => {
                    const alreadyAdded = parts.filter(p => p.name === item.name).length;
                    return (
                      <button key={i} className={`quick-part-btn ${alreadyAdded > 0 ? 'added' : ''}`} onClick={() => addFromChecklist(item)}>
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
                onChange={e => { setPartSearch(e.target.value); setShowPartDropdown(true); }} onFocus={() => setShowPartDropdown(true)} />
              {showPartDropdown && partSearch && (
                <div className="part-dropdown">
                  {filteredInventory.length === 0 && <div className="part-dropdown-item">No items found</div>}
                  {filteredInventory.map(item => (
                    <div key={item.id} className="part-dropdown-item" onClick={() => addFromInventory(item)}>
                      <span>{item.name}</span><span className="dropdown-price">R{item.sellingPrice.toFixed(2)}</span>
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

          <div className="parts-total"><span>Grand Total</span><span>R{grandTotal.toFixed(2)}</span></div>
        </div>

        <div className="detail-section">
          <div className="section-row">
            <h3 className="section-title">Notes</h3>
            <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={startListening}>{listening ? '🔴 Listening...' : '🎤 Voice'}</button>
          </div>
          <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes here or use voice..." />
        </div>

        <div className="detail-section collapsible">
          <div className="section-row" onClick={() => setShowSlips(!showSlips)}>
            <h3 className="section-title">📄 Slips & Receipts</h3>
            <button className="toggle-btn">{showSlips ? '▲' : '▼'}</button>
          </div>
          {showSlips && <div className="slips-body"><p className="no-parts">No slips uploaded yet</p><button className="upload-btn">📎 Upload Slip</button></div>}
        </div>

        <div className="detail-section collapsible">
          <div className="section-row" onClick={() => setShowAIChat(!showAIChat)}>
            <h3 className="section-title">🤖 AI Tech Assistant</h3>
            <button className="toggle-btn">{showAIChat ? '▲' : '▼'}</button>
          </div>
          {showAIChat && (
            <div className="ai-chat">
              <div className="ai-messages">
                {aiMessages.map((m, i) => <div key={i} className={`ai-message ${m.role}`}><span>{m.text}</span></div>)}
              </div>
              <div className="ai-input-row">
                <input className="form-input" placeholder="Ask a repair question..." value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAIMessage()} />
                <button className={`voice-btn ${aiListening ? 'listening' : ''}`} onClick={startAIListening}>{aiListening ? '🔴' : '🎤'}</button>
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
        <label className="bottom-btn camera-label">📷 Camera<input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} /></label>
        <button className="bottom-btn" onClick={startListening}>{listening ? '🔴' : '🎤'} Voice</button>
        <button className="bottom-btn" onClick={() => openInvoice('quote')}>💬 Quote</button>
        <button className="bottom-btn" onClick={() => openInvoice('invoice')}>🧾 Invoice</button>
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
    ctx.beginPath(); ctx.moveTo(x, y); setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff';
    ctx.lineTo(x, y); ctx.stroke(); setSigned(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const handleConfirm = () => {
    if (!signed) { alert('Please sign before confirming.'); return; }
    alert('Job card created!\nWhatsApp confirmation will be sent to client.');
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
            {TERMS.map((term, i) => <div key={i} className="term-item"><span className="term-number">{i + 1}.</span><span className="term-text">{term}</span></div>)}
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

function NewJobCard({ setPage, settings, jobTypes, technicians, problems }) {
  const today = new Date();
  const defaultDue = addWorkingDays(today, settings.defaultDueDays);
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

  const clientResults = INITIAL_CLIENTS.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch));
  const toggleProblem = (problem) => setSelectedProblems(prev => prev.includes(problem) ? prev.filter(p => p !== problem) : [...prev, problem]);

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
                    <span className="result-name">{c.name}</span><span className="result-phone">{c.phone}</span>
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
              {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.jobType && <span className="error">{errors.jobType}</span>}
          </div>
          {jobType === 'CAR/BAKKIE' && (
            <div className="vehicle-fields">
              <div className="field"><input className="form-input" placeholder="Vehicle Make" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} />{errors.vehicleMake && <span className="error">{errors.vehicleMake}</span>}</div>
              <div className="field"><input className="form-input" placeholder="Vehicle Model" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} /></div>
              <div className="field"><input className="form-input" placeholder="Registration Number" value={registration} onChange={e => setRegistration(e.target.value.toUpperCase())} />{errors.registration && <span className="error">{errors.registration}</span>}</div>
            </div>
          )}
        </div>
        <div className="form-section">
          <h3 className="section-title">Problem</h3>
          <div className="problems-grid">
            {problems.map(p => <button key={p} className={`problem-btn ${selectedProblems.includes(p) ? 'active' : ''}`} onClick={() => toggleProblem(p)}>{p}</button>)}
          </div>
          {errors.problems && <span className="error">{errors.problems}</span>}
          <div className="field" style={{ marginTop: '12px' }}><textarea className="form-input" placeholder="Additional notes..." rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Technician</h3>
          <div className="field">
            <select className="form-input" value={technician} onChange={e => setTechnician(e.target.value)}>
              <option value="">Assign technician...</option>
              {technicians.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.technician && <span className="error">{errors.technician}</span>}
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Due Date</h3>
          <div className="field">
            <input className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <span className="field-hint">Auto-set to {settings.defaultDueDays} working days — tap to edit</span>
          </div>
        </div>
        <button className="btn-primary" onClick={handleNext}>Next — Terms & Signature →</button>
      </div>
    </div>
  );
}

function ClientsList({ setPage, clients, setClients, setSelectedClient }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', notes: '' });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newClient.name || !newClient.phone) return;
    setClients(prev => [...prev, { ...newClient, id: Date.now(), termsSigned: false, termsDate: '', jobHistory: [] }]);
    setNewClient({ name: '', phone: '', email: '', address: '', notes: '' });
    setShowAdd(false);
  };

  return (
    <div className="jobs-screen">
      <div className="jobs-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>Clients</h2>
        <span className="job-count">{filtered.length} clients</span>
      </div>
      <div className="search-row">
        <input className="search-input" placeholder="🔍 Search name, phone, email..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="filter-btn" onClick={() => setShowAdd(!showAdd)}>+ Add</button>
      </div>
      {showAdd && (
        <div className="form-section" style={{ marginBottom: '12px' }}>
          <h3 className="section-title">New Client</h3>
          <div className="field"><input className="form-input" placeholder="Full Name *" value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="field"><input className="form-input" placeholder="Phone Number *" value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} /></div>
          <div className="field"><input className="form-input" placeholder="Email Address" value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} /></div>
          <div className="field"><input className="form-input" placeholder="Physical Address" value={newClient.address} onChange={e => setNewClient(p => ({ ...p, address: e.target.value }))} /></div>
          <div className="field"><textarea className="form-input" rows={2} placeholder="Notes..." value={newClient.notes} onChange={e => setNewClient(p => ({ ...p, notes: e.target.value }))} /></div>
          <div className="add-tag-row" style={{ marginTop: '8px' }}>
            <button className="btn-primary" onClick={handleAdd}>Save Client</button>
            <button className="clear-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="table-header" style={{ gridTemplateColumns: '1fr 120px 150px 80px', minWidth: 'unset' }}>
        <span>Name</span><span>Phone</span><span>Email</span><span>Terms</span>
      </div>
      <div className="jobs-list" style={{ minWidth: 'unset' }}>
        {filtered.length === 0 && <p className="no-jobs">No clients found</p>}
        {filtered.map(client => (
          <div key={client.id} className="job-row" style={{ gridTemplateColumns: '1fr 120px 150px 80px', minWidth: 'unset' }}
            onClick={() => { setSelectedClient(client); setPage('clientdetail'); }}>
            <span className="job-client">{client.name}</span>
            <span className="job-meta">{client.phone}</span>
            <span className="job-desc">{client.email}</span>
            <span>{client.termsSigned ? <span className="status-badge" style={{ background: '#2d6a4f' }}>✅ Signed</span> : <span className="status-badge" style={{ background: '#e94560' }}>⚠ Pending</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({ setPage, client, setClients }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...client });
  const clientJobs = SAMPLE_JOBS.filter(j => j.client === client.name);

  const handleSave = () => { setClients(prev => prev.map(c => c.id === client.id ? { ...c, ...form } : c)); setEditing(false); };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button className="back-btn" onClick={() => setPage('clients')}>← Back</button>
        <h2>👤 {client.name}</h2>
        <button className="filter-btn" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : '✏️ Edit'}</button>
      </div>
      <div className="form-body">
        <div className="form-section">
          <h3 className="section-title">Contact Details</h3>
          {editing ? (
            <>
              <div className="field"><label className="settings-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="field"><label className="settings-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div className="field"><label className="settings-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="field"><label className="settings-label">Address</label><textarea className="form-input" rows={2} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="field"><label className="settings-label">Notes</label><textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
              <button className="btn-primary" style={{ marginTop: '12px' }} onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <>
              <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{client.phone}</span></div>
              <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{client.email || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{client.address || '—'}</span></div>
              {client.notes && <div className="detail-row"><span className="detail-label">Notes</span><span className="detail-value">{client.notes}</span></div>}
            </>
          )}
        </div>
        <div className="form-section">
          <h3 className="section-title">Terms & Conditions</h3>
          {client.termsSigned ? (
            <div className="terms-signed-banner">✅ Terms signed on {client.termsDate}<p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Permanently saved to client profile</p></div>
          ) : (
            <div className="terms-unsigned-banner">⚠ Terms not yet signed<p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Will be signed on next job booking</p></div>
          )}
        </div>
        <div className="form-section">
          <h3 className="section-title">Job History ({clientJobs.length} jobs)</h3>
          {clientJobs.length === 0 && <p className="no-parts">No jobs yet</p>}
          {clientJobs.map(job => (
            <div key={job.id} className="history-item" style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="job-number">{job.number}</span>
                <span className="status-badge" style={{ background: STATUS[job.status].color }}>{STATUS[job.status].label}</span>
              </div>
              <span style={{ fontSize: '13px', color: '#ccc' }}>{job.description}</span>
              <span className="history-time">{job.start}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ setPage, settings, setSettings, jobTypes, setJobTypes, technicians, setTechnicians, problems, setProblems, quickParts, setQuickParts }) {
  const [newJobType, setNewJobType] = useState('');
  const [newTechnician, setNewTechnician] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newQuickPartName, setNewQuickPartName] = useState('');
  const [newQuickPartPrice, setNewQuickPartPrice] = useState('');
  const [saved, setSaved] = useState(false);
  const logoRef = useRef(null);

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSetting('companyLogo', ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button>
        <h2>⚙ Settings</h2>
      </div>
      <div className="form-body">
        <CollapsibleSection title="🏢 Company Details" defaultOpen={true}>
          <div className="field"><label className="settings-label">Company Name</label><input className="form-input" value={settings.companyName} onChange={e => updateSetting('companyName', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Address</label><textarea className="form-input" rows={2} value={settings.companyAddress} onChange={e => updateSetting('companyAddress', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Phone</label><input className="form-input" value={settings.companyPhone} onChange={e => updateSetting('companyPhone', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Email</label><input className="form-input" value={settings.companyEmail} onChange={e => updateSetting('companyEmail', e.target.value)} /></div>
          <div className="field">
            <label className="settings-label">Logo</label>
            {settings.companyLogo && <img src={settings.companyLogo} alt="logo" className="logo-preview" />}
            <button className="upload-btn" onClick={() => logoRef.current.click()}>📷 Upload Logo</button>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="💰 Labour & Sundries Rates">
          <div className="settings-row"><label className="settings-label">Vehicle Labour Rate (R/hr)</label><input className="settings-input" type="number" value={settings.labourRateVehicle} onChange={e => updateSetting('labourRateVehicle', parseFloat(e.target.value))} /></div>
          <div className="settings-row"><label className="settings-label">Other Labour Rate (R/hr)</label><input className="settings-input" type="number" value={settings.labourRateOther} onChange={e => updateSetting('labourRateOther', parseFloat(e.target.value))} /></div>
          <div className="settings-row"><label className="settings-label">Vehicle Sundries (R)</label><input className="settings-input" type="number" value={settings.sundriesVehicle} onChange={e => updateSetting('sundriesVehicle', parseFloat(e.target.value))} /></div>
          <div className="settings-row"><label className="settings-label">Machine Sundries (R)</label><input className="settings-input" type="number" value={settings.sundriesOther} onChange={e => updateSetting('sundriesOther', parseFloat(e.target.value))} /></div>
          <div className="settings-row"><label className="settings-label">Default Due Days</label><input className="settings-input" type="number" value={settings.defaultDueDays} onChange={e => updateSetting('defaultDueDays', parseInt(e.target.value))} /></div>
        </CollapsibleSection>

        <CollapsibleSection title="🧾 Invoice & Quote Layout">
          <div className="settings-row"><label className="settings-label">Invoice Prefix</label><input className="settings-input" value={settings.invoicePrefix} onChange={e => updateSetting('invoicePrefix', e.target.value)} /></div>
          <div className="settings-row"><label className="settings-label">Next Invoice Number</label><input className="settings-input" type="number" value={settings.invoiceNextNumber} onChange={e => updateSetting('invoiceNextNumber', parseInt(e.target.value))} /></div>
          <div className="settings-row"><label className="settings-label">Quote Prefix</label><input className="settings-input" value={settings.quotePrefix} onChange={e => updateSetting('quotePrefix', e.target.value)} /></div>
          <div className="settings-row"><label className="settings-label">Next Quote Number</label><input className="settings-input" type="number" value={settings.quoteNextNumber} onChange={e => updateSetting('quoteNextNumber', parseInt(e.target.value))} /></div>
          <div className="field"><label className="settings-label">Payment Terms</label><textarea className="form-input" rows={2} value={settings.paymentTerms} onChange={e => updateSetting('paymentTerms', e.target.value)} /></div>
          <div className="settings-row"><label className="settings-label">Quote Validity</label><input className="settings-input" value={settings.quoteValidity} onChange={e => updateSetting('quoteValidity', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Invoice Header Text</label><input className="form-input" value={settings.invoiceHeaderText} onChange={e => updateSetting('invoiceHeaderText', e.target.value)} placeholder="Optional..." /></div>
          <div className="field"><label className="settings-label">Invoice Footer Text</label><input className="form-input" value={settings.invoiceFooterText} onChange={e => updateSetting('invoiceFooterText', e.target.value)} placeholder="Optional..." /></div>
        </CollapsibleSection>

        <CollapsibleSection title="🏦 Bank Details">
          <div className="field"><label className="settings-label">Bank Name</label><input className="form-input" value={settings.bankName} onChange={e => updateSetting('bankName', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Account Number</label><input className="form-input" value={settings.bankAccount} onChange={e => updateSetting('bankAccount', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Branch Code</label><input className="form-input" value={settings.bankBranch} onChange={e => updateSetting('bankBranch', e.target.value)} /></div>
          <div className="field"><label className="settings-label">Reference Format</label><input className="form-input" value={settings.bankReference} onChange={e => updateSetting('bankReference', e.target.value)} /></div>
        </CollapsibleSection>

        <CollapsibleSection title="👷 Technicians">
          <div className="tags-list">{technicians.map((t, i) => <div key={i} className="tag-item"><span>{t}</span><button className="tag-remove" onClick={() => setTechnicians(prev => prev.filter((_, idx) => idx !== i))}>✕</button></div>)}</div>
          <div className="add-tag-row"><input className="form-input" placeholder="Add technician..." value={newTechnician} onChange={e => setNewTechnician(e.target.value)} /><button className="add-part-btn" onClick={() => { if (newTechnician.trim()) { setTechnicians(prev => [...prev, newTechnician.trim()]); setNewTechnician(''); } }}>+</button></div>
        </CollapsibleSection>

        <CollapsibleSection title="🔧 Job Types">
          <div className="tags-list">{jobTypes.map((t, i) => <div key={i} className="tag-item"><span>{t}</span><button className="tag-remove" onClick={() => setJobTypes(prev => prev.filter((_, idx) => idx !== i))}>✕</button></div>)}</div>
          <div className="add-tag-row"><input className="form-input" placeholder="Add job type..." value={newJobType} onChange={e => setNewJobType(e.target.value)} /><button className="add-part-btn" onClick={() => { if (newJobType.trim()) { setJobTypes(prev => [...prev, newJobType.trim().toUpperCase()]); setNewJobType(''); } }}>+</button></div>
        </CollapsibleSection>

        <CollapsibleSection title="📋 Problem Checklist">
          <div className="tags-list">{problems.map((p, i) => <div key={i} className="tag-item"><span>{p}</span><button className="tag-remove" onClick={() => setProblems(prev => prev.filter((_, idx) => idx !== i))}>✕</button></div>)}</div>
          <div className="add-tag-row"><input className="form-input" placeholder="Add problem..." value={newProblem} onChange={e => setNewProblem(e.target.value)} /><button className="add-part-btn" onClick={() => { if (newProblem.trim()) { setProblems(prev => [...prev, newProblem.trim()]); setNewProblem(''); } }}>+</button></div>
        </CollapsibleSection>

        <CollapsibleSection title="⚡ Quick Parts Checklist">
          <div className="tags-list">{quickParts.map((p, i) => <div key={i} className="tag-item"><span>{p.name} — R{p.price}</span><button className="tag-remove" onClick={() => setQuickParts(prev => prev.filter((_, idx) => idx !== i))}>✕</button></div>)}</div>
          <div className="add-tag-row">
            <input className="form-input part-input" placeholder="Part name..." value={newQuickPartName} onChange={e => setNewQuickPartName(e.target.value)} />
            <input className="form-input price-input" placeholder="Price" type="number" value={newQuickPartPrice} onChange={e => setNewQuickPartPrice(e.target.value)} />
            <button className="add-part-btn" onClick={() => { if (newQuickPartName.trim() && newQuickPartPrice) { setQuickParts(prev => [...prev, { name: newQuickPartName.trim(), price: parseFloat(newQuickPartPrice) }]); setNewQuickPartName(''); setNewQuickPartPrice(''); } }}>+</button>
          </div>
        </CollapsibleSection>

        <button className="btn-primary" onClick={handleSave}>{saved ? '✅ Saved!' : 'Save Settings'}</button>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [invoiceType, setInvoiceType] = useState('invoice');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [jobTypes, setJobTypes] = useState(DEFAULT_JOB_TYPES);
  const [technicians, setTechnicians] = useState(DEFAULT_TECHNICIANS);
  const [problems, setProblems] = useState(DEFAULT_PROBLEMS);
  const [quickParts, setQuickParts] = useState(INITIAL_QUICK_PARTS);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);

  return (
    <div className="app">
      <header className="header">
        <h1>{settings.companyName}</h1>
        <p>Job Management System</p>
      </header>
      {page === 'dashboard' && <Dashboard setPage={setPage} />}
      {page === 'jobs' && <JobsList setPage={setPage} setSelectedJob={setSelectedJob} />}
      {page === 'jobdetail' && selectedJob && <JobDetail setPage={setPage} job={selectedJob} settings={settings} quickParts={quickParts} setSelectedJob={setSelectedJob} setInvoiceType={setInvoiceType} />}
      {page === 'invoiceview' && selectedJob && <InvoiceView setPage={setPage} job={selectedJob} settings={settings} type={invoiceType} />}
      {page === 'newjob' && <NewJobCard setPage={setPage} settings={settings} jobTypes={jobTypes} technicians={technicians} problems={problems} />}
      {page === 'signature' && <SignaturePage setPage={setPage} />}
      {page === 'clients' && <ClientsList setPage={setPage} clients={clients} setClients={setClients} setSelectedClient={setSelectedClient} />}
      {page === 'clientdetail' && selectedClient && <ClientDetail setPage={setPage} client={selectedClient} setClients={setClients} />}
      {page === 'inventory' && <InventoryScreen setPage={setPage} inventory={inventory} setInventory={setInventory} />}
      {page === 'settings' && <SettingsScreen setPage={setPage} settings={settings} setSettings={setSettings} jobTypes={jobTypes} setJobTypes={setJobTypes} technicians={technicians} setTechnicians={setTechnicians} problems={problems} setProblems={setProblems} quickParts={quickParts} setQuickParts={setQuickParts} />}
      {page === 'quotes' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Quotes — Coming Soon</h2></div>}
      {page === 'invoices' && <div className="coming-soon"><button className="back-btn" onClick={() => setPage('dashboard')}>← Back</button><h2>Invoice History — Coming Soon</h2></div>}
    </div>
  );
}

export default App;