let currentPres = null;
let promoBonus = 0; 

document.getElementById('v-btn').addEventListener('click', verify);
document.getElementById('apply-promo-btn').addEventListener('click', applyPromo);
document.getElementById('buy-btn').addEventListener('click', finalizeTransaction);
window.addEventListener('mediflow:langchange', () => {
    if (currentPres) {
        const checkedIndices = new Set(
            Array.from(document.querySelectorAll('.m-check:checked:not(:disabled)'))
                .map(c => parseInt(c.dataset.idx))
        );
        render(checkedIndices);
    }
});

async function verify() {
    const pesel = document.getElementById('v-pesel').value.trim();
    const pin = document.getElementById('v-pin').value.trim();
    if (!/^\d{11}$/.test(pesel) || !/^\d{4}$/.test(pin)) return UI.toast(I18N.t('pharmacy.errInvalidCreds'), 'warning');

    const btn = document.getElementById('v-btn');
    btn.disabled = true;
    btn.innerText = I18N.t('pharmacy.searching');

    try {
        const res = await fetch(`/api/prescriptions/${pesel}/${pin}`);
        if (!res.ok) throw new Error(I18N.t('pharmacy.errNotFound'));
        
        currentPres = await res.json();
        document.getElementById('content').classList.remove('hidden');
        promoBonus = 0;
        document.getElementById('promo-input').value = '';
        document.getElementById('print-btn').style.display = 'none';
        render();
        
        document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        UI.toast(err.message, 'error');
        document.getElementById('content').classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerText = I18N.t('pharmacy.fetchBtn');
    }
}

function render(checkedIndices = null) {
    const list = document.getElementById('med-list');
    const allDone = currentPres.medications.every(m => m.status === 'done');

    const existingBanner = document.getElementById('all-done-banner');
    if (existingBanner) existingBanner.remove();
    if (allDone) {
        const banner = document.createElement('div');
        banner.id = 'all-done-banner';
        banner.style.cssText = 'background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;padding:18px 24px;margin-bottom:16px;display:flex;align-items:center;gap:14px;font-weight:700;color:#15803d;';
        banner.innerHTML = `<span style="font-size:1.8rem;">✅</span><div><div>${I18N.t('pharmacy.allDoneTitle')}</div><div style="font-weight:500;font-size:0.85rem;margin-top:2px;color:#16a34a;">${I18N.t('pharmacy.allDoneDesc')}</div></div>`;
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
                       ${m.status === 'done' ? 'checked disabled' : (checkedIndices && checkedIndices.has(i) ? 'checked' : '')} 
                       onchange="updateSummary()" 
                       style="width: 22px; height: 22px; cursor: pointer; accent-color: var(--primary);">
                <label for="m-check-${i}" style="cursor: pointer; flex: 1;">
                    <div style="font-weight: 700; ${m.status === 'done' ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
                        ${m.name} ${m.canDiscount ? `<span class="discount-badge">${I18N.t('badge.refundable')}</span>` : ''}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${m.dosage} • ${m.quantity} ${I18N.t('unit.pack')} • ${m.price.toFixed(2)} PLN</div>
                </label>
            </div>
            <div style="text-align: right;">
                <span style="font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid ${m.status === 'done' ? 'var(--secondary)' : 'var(--accent)'}; color: ${m.status === 'done' ? 'var(--secondary)' : 'var(--accent)'}; text-transform: uppercase;">
                    ${m.status === 'done' ? I18N.t('pharmacy.statusDone') : I18N.t('pharmacy.statusPending')}
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

    const perc = Math.max(autoPerc, promoBonus);

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
        tip.innerText = I18N.t('pharmacy.tipSelect');
        tip.style.background = "#f8fafc";
        tip.style.color = "var(--text-muted)";
    } else if (eligible === 0) {
        tip.innerText = I18N.t('pharmacy.tipNotEligible');
        tip.style.background = "#fff1f2";
        tip.style.color = "#be123c";
    } else if (promoBonus > 0) {
        const codeName = promoBonus === 0.20 ? 'RABAT20' : 'MEDI10';
        const bonusPerc = (promoBonus * 100).toFixed(0);
        const autoPercStr = (autoPerc * 100).toFixed(0);
        if (promoBonus >= autoPerc) {
            tip.innerText = I18N.t('pharmacy.tipPromoActive', {
                code: codeName,
                bonus: bonusPerc
            });
        } else {
            tip.innerText = I18N.t('pharmacy.tipAutoBetter', {
                code: codeName,
                bonus: bonusPerc,
                auto: autoPercStr
            });
        }
        tip.style.background = "#f0fdf4";
        tip.style.color = "var(--secondary)";
    } else {
        if (eligible < 200) {
            tip.innerText = I18N.t('pharmacy.tipTier1', { amount: (200 - eligible).toFixed(2) });
            tip.style.background = "#fffbeb";
            tip.style.color = "#b45309";
        } else if (eligible < 500) {
            tip.innerText = I18N.t('pharmacy.tipTier2', { amount: (500 - eligible).toFixed(2) });
            tip.style.background = "#f0fdf4";
            tip.style.color = "var(--secondary)";
        } else if (eligible < 1000) {
            tip.innerText = I18N.t('pharmacy.tipTier3', { amount: (1000 - eligible).toFixed(2) });
            tip.style.background = "#f0fdf4";
            tip.style.color = "var(--secondary)";
        } else {
            tip.innerText = I18N.t('pharmacy.tipMax');
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
        UI.toast(I18N.t('pharmacy.promoApplied10'), 'success');
    } else if (val === "RABAT20") {
        promoBonus = 0.20;
        updateSummary();
        UI.toast(I18N.t('pharmacy.promoApplied20'), 'success');
    } else if (val === "") {
        UI.toast(I18N.t('pharmacy.promoEmpty'), 'warning');
    } else {
        UI.toast(I18N.t('pharmacy.promoInvalid', { code: val }), 'error');
    }
}

async function finalizeTransaction() {
    const checks = document.querySelectorAll('.m-check:checked:not(:disabled)');
    const indices = Array.from(checks).map(c => parseInt(c.dataset.idx));
    
    if (indices.length === 0) return UI.toast(I18N.t('pharmacy.errSelectMed'), 'warning');

    const confirmed = await UI.confirm({
        message: I18N.t('pharmacy.confirmFinalize'),
        confirmText: I18N.t('ui.dispenseConfirmBtn')
    });
    if (!confirmed) return;

    const btn = document.getElementById('buy-btn');
    btn.disabled = true;
    btn.innerText = I18N.t('pharmacy.processing');

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
            UI.toast(I18N.t('pharmacy.successFinalize'), 'success');
            document.getElementById('print-btn').style.display = 'block';
            currentPres.medications = data.medications;
            currentPres.status = data.status;
            render();
        }
    } catch (err) {
        UI.toast(I18N.t('pharmacy.errFinalize'), 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = I18N.t('pharmacy.buyBtn');
    }
}
