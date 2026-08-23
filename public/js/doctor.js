let medications = [];

document.getElementById('add-med-btn').addEventListener('click', addMed);
document.getElementById('save-btn').addEventListener('click', savePrescription);

function addMed() {
    const name = document.getElementById('med-name').value.trim();
    const qty = parseInt(document.getElementById('med-qty').value);
    const price = parseFloat(document.getElementById('med-price').value);
    const dosage = document.getElementById('med-dosage').value.trim();
    const promo = document.getElementById('med-promo').checked;

    if (!name) { alert("Please enter the medication name."); return; }
    if (isNaN(qty) || qty < 1) { alert("Please enter a valid quantity (minimum 1)."); return; }
    if (isNaN(price) || price <= 0) { alert("Please enter a valid price."); return; }
    if (!dosage) { alert("Please enter the dosage instructions."); return; }

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
                    ${m.canDiscount ? '<span class="discount-badge">REFUNDABLE</span>' : ''}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                    ${m.dosage} • ${m.quantity} pack(s) • <strong>${m.price.toFixed(2)} PLN</strong>
                </div>
            </div>
            <button class="btn btn-danger" style="width: auto; padding: 6px 12px; font-size: 0.75rem;" onclick="removeMed(${i})">Remove</button>
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
    
    if (pesel.length !== 11 || isNaN(pesel)) {
        peselInput.classList.add('invalid');
        peselError.style.display = 'block';
        return;
    }
    peselInput.classList.remove('invalid');
    peselError.style.display = 'none';

    if (medications.length === 0) {
        alert("Prescription must contain at least one medication.");
        return;
    }

    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerText = "Submitting to database...";

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
        alert("Server connection error. Make sure the MediFlow server is running.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}
