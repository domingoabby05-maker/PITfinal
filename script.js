// ===============================
// PAGE TITLES
// ===============================
const pageTitles = {
  dashboard:'Dashboard',
  patients:'Patient Registry',
  allergies:'Patient Allergies',
  staff:'Staff Management',
  rota:'Weekly Rota',
  wards:'Wards & Beds',
  inpatients:'Inpatients',
  outpatients:'Outpatients',
  appointments:'Appointments',
  medication:'Medication',
  supplies:'Supplies Inventory',
  billing:'Billing & Payments',
  reports:'Reports & Analytics',
};


// ===============================
// NAVIGATION
// ===============================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.getElementById('page-title').textContent = pageTitles[page] || page;

  renderPage(page);
}


// ===============================
// PAGE RENDERER
// ===============================
function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  if (page === 'patients') renderPatients();
}


// ===============================
// DASHBOARD (STATIC FOR NOW)
// ===============================
function renderDashboard() {
  // You can connect this later
  console.log("Dashboard loaded");
}


// ===============================
// ✅ PATIENTS (CONNECTED TO NODE)
// ===============================
async function renderPatients() {
  try {
    const res = await fetch('/patients');
    const patients = await res.json();

    const table = document.getElementById('patient-list');
    if (!table) return;

    table.innerHTML = patients.map(p => `
      <tr>
        <td>${p.patient_id}</td>
        <td><strong>${p.first_name} ${p.last_name}</strong></td>
        <td>${p.date_of_birth || ''}</td>
        <td>${p.sex || ''}</td>
        <td>${p.phone || ''}</td>
        <td>-</td>
        <td><span class="badge badge-blue">Registered</span></td>
        <td><button class="btn btn-sm btn-ghost">View</button></td>
      </tr>
    `).join('');

  } catch (err) {
    console.error("Error loading patients:", err);
    toast('error', 'Failed to load patients');
  }
}


// ===============================
// ✅ ADD PATIENT
// ===============================
async function addPatient() {
  const data = {
    first_name: document.getElementById('p-fname').value,
    last_name: document.getElementById('p-lname').value,
    address: document.getElementById('p-addr').value,
    phone: document.getElementById('p-tel').value
  };

  try {
    await fetch('/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    closeModal('modal-add-patient');
    toast('success', 'Patient added successfully');

    renderPatients();

  } catch (err) {
    console.error(err);
    toast('error', 'Failed to add patient');
  }
}


// ===============================
// MODALS
// ===============================
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}


// ===============================
// TOAST NOTIFICATIONS
// ===============================
function toast(type, msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;

  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}


// ===============================
// TABLE FILTER (SEARCH)
// ===============================
function filterTable(tableId, value, filterValue = '', colIndex = 0) {
  const input = value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const cell = row.cells[colIndex]?.innerText || '';

    const matchSearch = text.includes(input);
    const matchFilter = filterValue ? cell.includes(filterValue) : true;

    row.style.display = (matchSearch && matchFilter) ? '' : 'none';
  });
}


// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  // Close modal when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });

  // Load default page
  renderDashboard();
});