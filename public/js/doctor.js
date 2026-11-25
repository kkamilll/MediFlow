let medications = [];

document.getElementById('add-med-btn').addEventListener('click', addMed);
document.getElementById('save-btn').addEventListener('click', savePrescription);
window.addEventListener('mediflow:langchange', renderMeds);

function addMed() {
    const name = document.getElementById('med-name').value.trim();
    const qty = parseInt(document.getElementById('med-qty').value);
    const price = parseFloat(document.getElementById('med-price').value);
    const dosage = document.getElementById('med-dosage').value.trim();
    const promo = document.getElementById('med-promo').checked;

    if (!name) { UI.toast(I18N.t('doctor.errName'), 'warning'); return; }
    if (isNaN(qty) || qty < 1) { UI.toast(I18N.t('doctor.errQty'), 'warning'); return; }
    if (isNaN(price) || price <= 0) { UI.toast(I18N.t('doctor.errPrice'), 'warning'); return; }
    if (!dosage) { UI.toast(I18N.t('doctor.errDosage'), 'warning'); return; }

    medications.push({ name, quantity: qty, price, dosage, canDiscount: promo });
    renderMeds();

    document.getElementById('med-name').value = '';
    document.getElementById('med-price').value = '';
    document.getElementById('med-dosage').value = '';
    document.getElementById('med-qty').value = '1';
    document.getElementById('med-name').focus();
}

function renderMeds() {
    const container = document.getElementById('med-items');
    const empty = document.getElementById('empty-msg');
    
    if (medications.length > 0) {
        empty.classList.add('hidden');
    } else {
        empty.classList.remove('hidden');
    }

    container.innerHTML = medications.map((m, i) => `
        <div class="list-item animate-in" style="animation-delay: ${i * 0.05}s">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; color: var(--text);">${m.name}</span>
                    ${m.canDiscount ? `<span class="discount-badge">${I18N.t('badge.refundable')}</span>` : ''}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                    ${m.dosage} • ${m.quantity} ${I18N.t('unit.pack')} • <strong>${m.price.toFixed(2)} PLN</strong>
                </div>
            </div>
            <button class="btn btn-danger" style="width: auto; padding: 6px 12px; font-size: 0.75rem;" onclick="removeMed(${i})">${I18N.t('doctor.removeBtn')}</button>
        </div>
    `).join('');
}

window.removeMed = function(i) {
    medications.splice(i, 1);
    renderMeds();
};

async function savePrescription() {
    const peselInput = document.getElementById('pesel');
    const pesel = peselInput.value.trim();
    const peselError = document.getElementById('pesel-error');
    
    if (!/^\d{11}$/.test(pesel)) {
        peselInput.classList.add('invalid');
        peselError.style.display = 'block';
        return;
    }
    peselInput.classList.remove('invalid');
    peselError.style.display = 'none';

    if (medications.length === 0) {
        UI.toast(I18N.t('doctor.errNoMeds'), 'warning');
        return;
    }

    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    btn.innerText = I18N.t('doctor.saving');

    try {
        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesel, medications })
        });
        
        if (!res.ok) throw new Error("Server error");
        
        const data = await res.json();
        
        document.getElementById('final-pin').innerText = data.pin;
        document.getElementById('result-overlay').classList.remove('hidden');
    } catch (err) {
        UI.toast(I18N.t('doctor.errServer'), 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = I18N.t('doctor.saveBtn');
    }
}
