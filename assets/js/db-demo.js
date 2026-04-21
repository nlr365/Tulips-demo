// ════════════════════════════════
// INDEXEDDB — PRIVATE (admin only)
// ════════════════════════════════
const DB_NAME = 'TulipsEventzDB';
let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      const store = e.target.result.createObjectStore('enquiries', { keyPath: 'id', autoIncrement: true });
      store.createIndex('status', 'status', { unique: false });
      store.createIndex('createdAt', 'createdAt', { unique: false });
    };
    req.onsuccess = e => { db = e.target.result; resolve(); };
    req.onerror = e => reject(e.target.error);
  });
}

function saveEnquiry(data) {
  return new Promise((resolve, reject) => {
    if (!db) { reject('Database not initialized'); return; }
    const tx = db.transaction(['enquiries'], 'readwrite');
    const req = tx.objectStore('enquiries').add({
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ════════════════════════════════
// FORM SUBMISSION
// ════════════════════════════════
async function submitForm() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const email   = '';
  const type    = document.getElementById('f-type').value;
  const pkg     = '';
  const date    = document.getElementById('f-date').value;
  const guests  = document.getElementById('f-guests').value;
  const msg     = document.getElementById('f-msg').value.trim();

  if (!name)  { showToast('⚠️ Please enter your name!'); return; }
  if (!phone) { showToast('⚠️ Please enter your phone number!'); return; }
  if (!type)  { showToast('⚠️ Please select event type!'); return; }

  try {
    await saveEnquiry({ name, phone, email, eventType: type, package: pkg, date, guests, message: msg });
    // Clear form
    ['f-name','f-phone','f-msg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['f-type'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['f-date','f-guests'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    showToast('✅ Enquiry sent! We will call you within 24 hours 💐');
    // Open WhatsApp
    setTimeout(() => {
      const waMsg = `Hi Tulips Eventz! I'm ${name} (${phone}). I want to enquire about a ${type} event.${pkg ? ' Package: ' + pkg + '.' : ''}${date ? ' Date: ' + date + '.' : ''}${msg ? ' Note: ' + msg : ''}`;
      window.open('https://wa.me/919597082875?text=' + encodeURIComponent(waMsg), '_blank');
    }, 1500);
  } catch(err) {
    console.error('DB Error:', err);
    showToast('Something went wrong. Please WhatsApp us directly!');
  }
}

function quickBook(pkg) {
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
      showToast('📦 ' + pkg + ' selected! Fill your details below.');
  } else {
      window.location.href = 'index.html#booking';
  }
}

// Init DB silently
initDB().catch(console.error);
