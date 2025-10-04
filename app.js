
const PACKAGES = {"usa": [{"id": "us-starter", "name": "USA Starter", "price": 5.99}, {"id": "us-pro", "name": "USA Pro", "price": 12.99}, {"id": "us-unl", "name": "USA Unlimited", "price": 29.99}], "bangladesh": [{"id": "bd-starter", "name": "BD Starter", "price": 150}, {"id": "bd-pro", "name": "BD Pro", "price": 400}, {"id": "bd-unl", "name": "BD Unlimited", "price": 900}], "pakistan": [{"id": "pk-starter", "name": "PK Starter", "price": 299}, {"id": "pk-pro", "name": "PK Pro", "price": 699}, {"id": "pk-unl", "name": "PK Unlimited", "price": 1499}], "india": [{"id": "in-starter", "name": "IN Starter", "price": 199}, {"id": "in-pro", "name": "IN Pro", "price": 499}, {"id": "in-unl", "name": "IN Unlimited", "price": 999}], "uk": [{"id": "uk-starter", "name": "UK Starter", "price": 4.99}, {"id": "uk-pro", "name": "UK Pro", "price": 11.99}, {"id": "uk-unl", "name": "UK Unlimited", "price": 24.99}], "canada": [{"id": "ca-starter", "name": "CA Starter", "price": 6.99}, {"id": "ca-pro", "name": "CA Pro", "price": 13.99}, {"id": "ca-unl", "name": "CA Unlimited", "price": 34.99}], "australia": [{"id": "au-starter", "name": "AU Starter", "price": 7.99}, {"id": "au-pro", "name": "AU Pro", "price": 15.99}, {"id": "au-unl", "name": "AU Unlimited", "price": 39.99}], "germany": [{"id": "de-starter", "name": "DE Starter", "price": 5.49}, {"id": "de-pro", "name": "DE Pro", "price": 12.49}, {"id": "de-unl", "name": "DE Unlimited", "price": 29.49}], "france": [{"id": "fr-starter", "name": "FR Starter", "price": 5.49}, {"id": "fr-pro", "name": "FR Pro", "price": 12.49}, {"id": "fr-unl", "name": "FR Unlimited", "price": 29.49}], "nigeria": [{"id": "ng-starter", "name": "NG Starter", "price": 1200}, {"id": "ng-pro", "name": "NG Pro", "price": 2500}, {"id": "ng-unl", "name": "NG Unlimited", "price": 6000}], "uae": [{"id": "ae-starter", "name": "AE Starter", "price": 9.99}, {"id": "ae-pro", "name": "AE Pro", "price": 19.99}, {"id": "ae-unl", "name": "AE Unlimited", "price": 44.99}], "saudi": [{"id": "sa-starter", "name": "SA Starter", "price": 8.99}, {"id": "sa-pro", "name": "SA Pro", "price": 18.99}, {"id": "sa-unl", "name": "SA Unlimited", "price": 39.99}], "japan": [{"id": "jp-starter", "name": "JP Starter", "price": 6.99}, {"id": "jp-pro", "name": "JP Pro", "price": 14.99}, {"id": "jp-unl", "name": "JP Unlimited", "price": 34.99}], "southkorea": [{"id": "kr-starter", "name": "KR Starter", "price": 6.99}, {"id": "kr-pro", "name": "KR Pro", "price": 14.99}, {"id": "kr-unl", "name": "KR Unlimited", "price": 34.99}], "brazil": [{"id": "br-starter", "name": "BR Starter", "price": 4.99}, {"id": "br-pro", "name": "BR Pro", "price": 11.99}, {"id": "br-unl", "name": "BR Unlimited", "price": 24.99}]};

function fmtPrice(country, price){
  if(['usa','uk','canada','australia','germany','france','japan','southkorea','brazil'].includes(country)) return '$' + (typeof price === 'number' ? price.toFixed(2) : price);
  if(country === 'bangladesh') return '৳' + price;
  if(country === 'pakistan') return '₨' + price;
  if(country === 'nigeria') return '₦' + price;
  return price;
}

let state = { country: 'usa', pkg: null, qty: 1, sims: [], selectedSim: null, buyer: { name: '', phone: '' }, paymentMethod: 'paypal' };

const el = {
  countryList: document.getElementById('countryList'),
  packageSelect: document.getElementById('packageSelect'),
  qtyInput: document.getElementById('qty'),
  simList: document.getElementById('simList'),
  summaryCountry: document.getElementById('summaryCountry'),
  summaryPackage: document.getElementById('summaryPackage'),
  summaryQty: document.getElementById('summaryQty'),
  summaryPrice: document.getElementById('summaryPrice'),
  summaryTotal: document.getElementById('summaryTotal'),
  summarySIM: document.getElementById('summarySIM'),
  buyerName: document.getElementById('buyerName'),
  buyerPhone: document.getElementById('buyerPhone'),
  showSimsBtn: document.getElementById('showSimsBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  payOptions: document.querySelectorAll('.pay-option'),
  paymentArea: document.getElementById('paymentArea'),
  paypalContainer: document.getElementById('paypalContainer'),
  cardForm: document.getElementById('cardForm'),
  palmForm: document.getElementById('palmForm'),
  cardPayBtn: document.getElementById('cardPayBtn'),
  palmPayBtn: document.getElementById('palmPayBtn'),
  resultArea: document.getElementById('resultArea'),
  viewOrdersBtn: document.getElementById('view-orders-btn')
};

function populatePackages(){
  el.packageSelect.innerHTML = '';
  const pkgs = PACKAGES[state.country] || [];
  pkgs.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.dataset.price = p.price; opt.textContent = p.name + ' — ' + fmtPrice(state.country, p.price);
    el.packageSelect.appendChild(opt);
  });
  state.pkg = pkgs[0] || null;
  updateSummary();
}

function generateSims(country, count=6){
  const sims = [];
  for(let i=0;i<count;i++){
    let num = '+' + Math.floor(100000000 + Math.random()*900000000);
    if(country==='bangladesh') num = '+880' + Math.floor(10000000 + Math.random()*89999999);
    if(country==='pakistan') num = '+92' + Math.floor(300000000 + Math.random()*600000000);
    sims.push({ number: String(num), simId: 'SIM-' + Math.random().toString(36).slice(2,9).toUpperCase(), meta: 'Demo SIM' });
  }
  return sims;
}

function updateSummary(){
  el.summaryCountry.textContent = state.country.toUpperCase();
  el.summaryPackage.textContent = state.pkg ? state.pkg.name : '—';
  el.summaryQty.textContent = state.qty;
  el.summaryPrice.textContent = state.pkg ? fmtPrice(state.country, state.pkg.price) : '—';
  const total = state.pkg ? (state.pkg.price * state.qty) : 0;
  el.summaryTotal.textContent = fmtPrice(state.country, total);
  el.summarySIM.textContent = state.selectedSim ? (state.selectedSim.number + ' (' + state.selectedSim.simId + ')') : '—';
}

function renderSims(){
  el.simList.innerHTML = '';
  if(state.sims.length===0){ el.simList.innerHTML = '<div style="grid-column:1/-1;color:#9ff">No SIMs — click "Show Available SIMs"</div>'; return; }
  state.sims.forEach(s => {
    const c = document.createElement('div'); c.className = 'sim-card';
    const html = '<h4>' + s.number + '</h4><p>' + s.meta + '</p><div style="margin-top:8px;display:flex;gap:8px"><button class="btn small">Select</button><button class="btn small" style="background:linear-gradient(90deg,var(--accent),#00a89a);color:#001">Buy</button></div>';
    c.innerHTML = html;
    const btns = c.querySelectorAll('button');
    btns[0].onclick = function(){ state.selectedSim = s; updateSummary(); };
    btns[1].onclick = function(){ state.selectedSim = s; updateSummary(); el.paymentArea.scrollIntoView({behavior:'smooth'}); };
    el.simList.appendChild(c);
  });
}

el.showSimsBtn.addEventListener('click', ()=>{ state.sims = generateSims(state.country, 8); renderSims(); updateSummary(); });
el.refreshBtn.addEventListener('click', ()=>{ state.sims = generateSims(state.country, 6); renderSims(); });

el.countryList.addEventListener('click', (e)=>{ const c = e.target.closest('.country'); if(!c) return; document.querySelectorAll('.country').forEach(x=>x.classList.remove('active')); c.classList.add('active'); state.country = c.dataset.country; populatePackages(); state.sims = []; renderSims(); });

el.packageSelect.addEventListener('change', (e)=>{ const id = e.target.value; const p = PACKAGES[state.country].find(x=>x.id===id); state.pkg = p; updateSummary(); });
el.qtyInput.addEventListener('input', (e)=>{ state.qty = Math.max(1, parseInt(e.target.value||1)); updateSummary(); });
el.buyerName.addEventListener('input', ()=> state.buyer.name = el.buyerName.value.trim());
el.buyerPhone.addEventListener('input', ()=> state.buyer.phone = el.buyerPhone.value.trim());

el.payOptions.forEach(opt => opt.addEventListener('click', ()=>{ el.payOptions.forEach(o=>o.classList.remove('active')); opt.classList.add('active'); state.paymentMethod = opt.dataset.pay; renderPaymentArea(); }));

function renderPaymentArea(){
  el.paypalContainer.innerHTML = ''; el.cardForm.classList.add('hidden'); el.palmForm.classList.add('hidden');
  if(state.paymentMethod === 'paypal'){ const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Pay with PayPal (Simulate)'; btn.onclick = function(){ simulatePayment('paypal'); }; el.paypalContainer.appendChild(btn); }
  else if(state.paymentMethod === 'card'){ el.cardForm.classList.remove('hidden'); }
  else if(state.paymentMethod === 'palmpay'){ el.palmForm.classList.remove('hidden'); }
}

function simulatePayment(method){
  if(!state.pkg){ alert('Select a package'); return; }
  if(!state.buyer.name || !state.buyer.phone){ alert('Enter buyer name and phone'); return; }
  if(!state.selectedSim && !confirm('No SIM selected — continue and assign automatically?')) return;
  const id = 'ORD-' + Date.now().toString(36).toUpperCase().slice(4);
  const total = state.pkg.price * state.qty;
  const order = { id: id, country: state.country, package: state.pkg, qty: state.qty, total: total, buyer: Object.assign({}, state.buyer), sim: state.selectedSim || generateSims(state.country,1)[0], payment: { method: method, status: 'processing', ts: Date.now() } };
  const db = JSON.parse(localStorage.getItem('hh_orders') || '[]'); db.push(order); localStorage.setItem('hh_orders', JSON.stringify(db));
  el.resultArea.innerHTML = '<div class="note">Processing ' + method + ' payment for <strong>' + fmtPrice(state.country,total) + '</strong>...</div>';
  setTimeout(function(){ order.payment.status='paid'; order.payment.txn = 'TXN-' + Math.random().toString(36).slice(2,9).toUpperCase(); localStorage.setItem('hh_orders', JSON.stringify(db)); showOrderSuccess(order); }, 1200 + Math.random()*1200);
}

el.cardPayBtn.addEventListener('click', function(){ if(!document.getElementById('cardName').value) return alert('Enter cardholder name'); simulatePayment('card'); });
el.palmPayBtn.addEventListener('click', function(){ if(!document.getElementById('palmNumber').value) return alert('Enter PalmPay number'); simulatePayment('palmpay'); });

function showOrderSuccess(order){
  el.resultArea.innerHTML = '<div style="background:linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3));padding:12px;border-radius:8px;color:#cff"><div style="display:flex;justify-content:space-between"><div><strong>Order ID:</strong> ' + order.id + '</div><div><strong>Status:</strong> ' + order.payment.status.toUpperCase() + '</div></div><div style="margin-top:8px">Package: <strong>' + order.package.name + '</strong> · Qty: ' + order.qty + ' · Paid: <strong>' + fmtPrice(order.country,order.total) + '</strong></div><div style="margin-top:10px;background:linear-gradient(90deg, rgba(0,255,215,0.04), rgba(0,168,154,0.03));padding:8px;border-radius:6px;color:#001;font-weight:800">Assigned SIM: ' + order.sim.number + ' (' + order.sim.simId + ')</div><div style="margin-top:10px"><button class="btn" onclick="downloadReceipt(\'' + order.id + '\')">Download Receipt (JSON)</button></div><div class="note" style="margin-top:8px">TXN: ' + (order.payment.txn || '—') + '</div></div>';
}

window.downloadReceipt = function(orderId){ const db = JSON.parse(localStorage.getItem('hh_orders')||'[]'); const ord = db.find(o=>o.id===orderId); if(!ord) return alert('Order not found'); const blob = new Blob([JSON.stringify(ord,null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='HH-' + orderId + '-receipt.json'; a.click(); URL.revokeObjectURL(url); };

el.viewOrdersBtn.addEventListener('click', function(){ const db = JSON.parse(localStorage.getItem('hh_orders')||'[]').reverse(); if(db.length===0) return alert('No orders yet'); const html = db.map(function(o){ return 'ID:' + o.id + ' · ' + o.package.name + ' · ' + o.buyer.name + ' · ' + fmtPrice(o.country,o.total) + ' · ' + o.payment.status; }).join('\n'); alert('Orders (latest first):\n\n' + html); });

(function init(){
  const countryData = [["usa", "USA"], ["bangladesh", "Bangladesh"], ["pakistan", "Pakistan"], ["india", "India"], ["uk", "United Kingdom"], ["canada", "Canada"], ["australia", "Australia"], ["germany", "Germany"], ["france", "France"], ["nigeria", "Nigeria"], ["uae", "UAE"], ["saudi", "Saudi Arabia"], ["japan", "Japan"], ["southkorea", "South Korea"], ["brazil", "Brazil"]];
  const countryList = document.getElementById('countryList');
  countryData.forEach(function(c){ const d = document.createElement('div'); d.className='country'; d.dataset.country=c[0]; d.title=c[1]; d.innerHTML = '<img src="images/' + c[0] + '.svg" alt="' + c[1] + '">'; if(c[0]==='usa') d.classList.add('active'); countryList.appendChild(d); });
  populatePackages();
  state.sims = [];
  renderSims();
  updateSummary();
  renderPaymentArea();
})();
