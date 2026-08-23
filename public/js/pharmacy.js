let currentPres = null;
let promoBonus = 0; 

document.getElementById('v-btn').addEventListener('click', verify);
document.getElementById('apply-promo-btn').addEventListener('click', applyPromo);
document.getElementById('buy-btn').addEventListener('click', finalizeTransaction);

async function verify() {
    const pesel = document.getElementById('v-pesel').value.trim();
    const pin = document.getElementById('v-pin').value.trim();
    if (pesel.length !== 11 || pin.length !== 4) return alert("Please provide a valid PESEL (11 digits) and PIN (4 digits).");

    const btn = document.getElementById('v-btn');
    btn.disabled = true;
    btn.innerText = "Searching database...";

    try {
        const res = await fetch(`/api/prescriptions/${pesel}/${pin}`);
        if (!res.ok) throw new Error("Prescription not found or invalid credentials.");
        
        currentPres = await res.json();
        document.getElementById('content').classList.remove('hidden');
        promoBonus = 0;
        document.getElementById('promo-input').value = '';
        document.getElementById('print-btn').style.display = 'none';
        render();
        
        document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert(err.message);
        document.getElementById('content').classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerText = "Fetch Prescription Data";
    }
}

function render() {
    const list = document.getElementById('med-list');
    const allDone = currentPres.medications.every(m => m.status === 'done');

    const existingBanner = document.getElementById('all-done-banner');
    if (existingBanner) existingBanner.remove();
    if (allDone) {
        const banner = document.createElement('div');
        banner.id = 'all-done-banner';
        banner.style.cssText = 'background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;padding:18px 24px;margin-bottom:16px;display:flex;align-items:center;gap:14px;font-weight:700;color:#15803d;';
        banner.innerHTML = '<span style="font-size:1.8rem;">✅</span><div><div>Prescription Fully Dispensed</div><div style="font-weight:500;font-size:0.85rem;margin-top:2px;color:#16a34a;">All medications from this prescription have already been dispensed to the patient.</div></div>';
        list.parentElement.insertBefore(banner, list);
        document.getElementById('buy-btn').disabled = true;
        document.getElementById('buy-btn').style.opacity = '0.5';
    } else {
        document.getElementById('buy-btn').disabled = false;
        document.getElementById('buy-btn').style.opacity = '1';
    }

    list.innerHTML = currentPres.medications.map((m, i) => `
        <div class="list-item" style="${m.status === 'done' ? 'background: #f1f5f9; opacity: 0.7;' : ''}">
            <div style="display: flex; gap: 16px; align-items: center; flex: 1;">
                <input type="checkbox" id="m-check-${i}" class="m-check" data-idx="${i}" 
                       ${m.status === 'done' ? 'checked disabled' : ''} 
                       onchange="updateSummary()" 
                       style="width: 22px; height: 22px; cursor: pointer; accent-color: var(--primary);">
                <label for="m-check-${i}" style="cursor: pointer; flex: 1;">
                    <div style="font-weight: 700; ${m.status === 'done' ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
                        ${m.name} ${m.canDiscount ? '<span class="discount-badge">REFUNDABLE</span>' : ''}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${m.dosage} • ${m.quantity} pack(s) • ${m.price.toFixed(2)} PLN</div>
                </label>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid ${m.status === 'done' ? 'var(--secondary)' : 'var(--accent)'}; color: ${m.status === 'done' ? 'var(--secondary)' : 'var(--accent)'}; text-transform: uppercase;">
                    ${m.status === 'done' ? 'Dispensed' : 'Pending'}
                </span>
            </div>
        </div>
    `).join('');

    updateSummary();
}

function updateSummary() {
    const checks = document.querySelectorAll('.m-check:checked:not(:disabled)');
    const selected = Array.from(checks).map(c => currentPres.medications[parseInt(c.dataset.idx)]);

    const subtotal = selected.reduce((s, m) => s + (m.price * m.quantity), 0);
    const eligible = selected.reduce((s, m) => s + (m.canDiscount ? (m.price * m.quantity) : 0), 0);

    let autoPerc = 0;
    if (eligible >= 1000) autoPerc = 0.25;
    else if (eligible >= 500) autoPerc = 0.15;
    else if (eligible >= 200) autoPerc = 0.05;

    let perc = autoPerc + promoBonus;

    const disc = eligible * perc;
    const total = subtotal - disc;

    document.getElementById('s-subtotal').innerText = subtotal.toFixed(2) + " PLN";
    document.getElementById('s-perc').innerText = `(${(perc * 100).toFixed(0)}%)`;
    document.getElementById('s-disc').innerText = `-${disc.toFixed(2)} PLN`;
    document.getElementById('s-total').innerText = total.toFixed(2) + " PLN";

    const bar = document.getElementById('p-bar');
    bar.style.width = Math.min((eligible / 1000) * 100, 100) + '%';

    const tip = document.getElementById('promo-tip');
    if (selected.length === 0) {
        tip.innerText = "Select items to calculate pricing and discounts.";
        tip.style.background = "#f8fafc";
        tip.style.color = "var(--text-muted)";
    } else if (eligible === 0) {
        tip.innerText = "Selected items are not eligible for reimbursement — no discount applies.";
        tip.style.background = "#fff1f2";
        tip.style.color = "#be123c";
    } else if (promoBonus > 0) {
        const codeName = promoBonus === 0.20 ? 'RABAT20' : 'MEDI10';
        const bonusPerc = (promoBonus * 100).toFixed(0);
        tip.innerText = `Promo code ${codeName} active (+${bonusPerc}%)! Total discount: ${(perc * 100).toFixed(0)}%`;
        tip.style.background = "#f0fdf4";
        tip.style.color = "var(--secondary)";
    } else {
        if (eligible < 200) {
            tip.innerText = `Add ${(200 - eligible).toFixed(2)} PLN more of refundable items for a 5% discount`;
            tip.style.background = "#fffbeb";
            tip.style.color = "#b45309";
        } else if (eligible < 500) {
            tip.innerText = `5% discount active! Reach 15% by adding ${(500 - eligible).toFixed(2)} PLN more`;
            tip.style.background = "#f0fdf4";
            tip.style.color = "var(--secondary)";
        } else if (eligible < 1000) {
            tip.innerText = `15% discount active! Reach 25% by adding ${(1000 - eligible).toFixed(2)} PLN more`;
            tip.style.background = "#f0fdf4";
            tip.style.color = "var(--secondary)";
        } else {
            tip.innerText = "Maximum system discount of 25% granted!";
            tip.style.background = "#f0fdf4";
            tip.style.color = "var(--secondary)";
        }
    }
}

window.updateSummary = updateSummary; 

function applyPromo() {
    const val = document.getElementById('promo-input').value.trim().toUpperCase();
    if (val === "MEDI10") {
        promoBonus = 0.10;
        updateSummary();
        alert("Promo code MEDI10 applied! Extra +10% discount on refundable medications.");
    } else if (val === "RABAT20") {
        promoBonus = 0.20;
        updateSummary();
        alert("Promo code RABAT20 applied! Extra +20% discount on refundable medications.");
    } else if (val === "") {
        alert("Please enter a promo code.");
    } else {
        alert(`Promo code "${val}" is invalid or expired.`);
    }
}

async function finalizeTransaction() {
    const checks = document.querySelectorAll('.m-check:checked:not(:disabled)');
    const indices = Array.from(checks).map(c => parseInt(c.dataset.idx));
    
    if (indices.length === 0) return alert("Please select at least one medication to dispense.");

    if (!confirm("Are you sure you want to finalize this transaction and dispense selected medications?")) return;

    const btn = document.getElementById('buy-btn');
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerText = "Processing...";

    try {
        const res = await fetch('/api/prescriptions/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pesel: currentPres.pesel, 
                pin: currentPres.pin, 
                indices 
            })
        });
        
        const data = await res.json();
        if (data.success) {
            alert("Transaction completed successfully. Medications have been dispensed.");
            document.getElementById('print-btn').style.display = 'block';
            currentPres.medications = data.medications;
            currentPres.status = data.status;
            render();
        }
    } catch (err) {
        alert("An error occurred while finalizing the transaction.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}
