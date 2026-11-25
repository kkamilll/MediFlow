let allPrescriptions = [];
let currentFilter = 'all';

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const locale = I18N.lang === 'en' ? 'en-GB' : 'pl-PL';
    return d.toLocaleString(locale, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function renderPrescriptions() {
    const container = document.getElementById('admin-prescriptions');
    const query = (document.getElementById('admin-search').value || '').trim().toLowerCase();

    const filtered = allPrescriptions.filter(p => {
        if (currentFilter !== 'all' && p.status !== currentFilter) return false;
        if (!query) return true;
        const inPesel = (p.pesel || '').includes(query);
        const inPin = (p.pin || '').includes(query);
        const inMeds = (p.medications || []).some(m => (m.name || '').toLowerCase().includes(query));
        return inPesel || inPin || inMeds;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="admin-empty">${I18N.t('admin.empty')}</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const isUsed = p.status === 'used';
        const statusClass = isUsed ? 'status-pill-used' : 'status-pill-active';
        const statusText = isUsed ? I18N.t('admin.statusUsed') : I18N.t('admin.statusActive');

        const medsHtml = (p.medications || []).map(m => {
            const done = m.status === 'done';
            const medStatusColor = done ? 'var(--secondary)' : 'var(--accent)';
            const medStatusLabel = done ? I18N.t('pharmacy.statusDone') : I18N.t('pharmacy.statusPending');
            return `
                <div class="pres-med-line">
                    <span>
                        <strong style="${done ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${esc(m.name)}</strong>
                        ${m.canDiscount ? `<span class="discount-badge">${I18N.t('badge.refundable')}</span>` : ''}
                        <span style="color: var(--text-muted);">• ${esc(m.dosage)} • ${m.quantity} ${I18N.t('unit.pack')} • ${Number(m.price).toFixed(2)} PLN</span>
                    </span>
                    <span style="font-size: 0.7rem; font-weight: 800; color: ${medStatusColor}; text-transform: uppercase;">${medStatusLabel}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="pres-row">
                <div class="pres-row-head">
                    <div class="pres-meta">
                        <span><strong>PESEL:</strong> ${esc(p.pesel)}</span>
                        <span class="pin-pill">PIN: ${esc(p.pin)}</span>
                        <span class="status-pill ${statusClass}">${statusText}</span>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">${formatDate(p.createdAt)}</span>
                    </div>
                    <button type="button" class="btn btn-danger"
                        style="width: auto; padding: 6px 12px; font-size: 0.75rem;"
                        onclick="deleteOne('${esc(p._id)}', '${esc(p.pesel)}', '${esc(p.pin)}')">
                        ${I18N.t('admin.deleteOne')}
                    </button>
                </div>
                <div class="pres-meds">${medsHtml}</div>
            </div>
        `;
    }).join('');
}

async function loadStats(manual = false) {
    const btn = document.getElementById('refresh-btn');
    if (manual) { btn.style.animation = 'spin 0.6s linear'; setTimeout(() => btn.style.animation = '', 700); }
    try {
        const res = await fetch('/api/prescriptions');
        if (!res.ok) throw new Error('Failed');
        allPrescriptions = await res.json();

        const activeCount = allPrescriptions.filter(p => p.status === 'active').length;
        const usedCount = allPrescriptions.filter(p => p.status === 'used').length;

        document.getElementById('stat-active').innerText = activeCount;
        document.getElementById('stat-used').innerText = usedCount;
        const now = new Date();
        document.getElementById('last-updated').innerText =
            `(${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')})`;

        renderPrescriptions();
    } catch {
        document.getElementById('stat-active').innerText = '?';
        document.getElementById('stat-used').innerText = '?';
        if (manual) UI.toast(I18N.t('admin.loadError'), 'error');
    }
}

async function deleteOne(id, pesel, pin) {
    const confirmed = await UI.confirm({
        message: I18N.t('admin.deleteOneConfirm', { pesel, pin }),
        confirmText: I18N.t('ui.deleteConfirmBtn'),
        danger: true
    });
    if (!confirmed) return;

    try {
        const res = await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed');
        UI.toast(I18N.t('admin.deleteOneSuccess'), 'success');
        loadStats();
    } catch {
        UI.toast(I18N.t('admin.deleteOneError'), 'error');
    }
}

async function clearUsed() {
    const usedCount = document.getElementById('stat-used').innerText;
    if (usedCount === '0' || usedCount === '—' || usedCount === '?') {
        return UI.toast(I18N.t('index.noUsedAlert'), 'info');
    }
    const confirmed = await UI.confirm({
        message: I18N.t('index.clearConfirm', { count: usedCount }),
        confirmText: I18N.t('ui.deleteConfirmBtn'),
        danger: true
    });
    if (!confirmed) return;

    const btn = document.getElementById('clear-btn');
    btn.disabled = true;
    btn.innerText = I18N.t('index.deleting');

    try {
        const res = await fetch('/api/prescriptions/used', { method: 'DELETE' });
        const data = await res.json();
        UI.toast(I18N.t('index.clearSuccess', { count: data.deleted }), 'success');
        loadStats();
    } catch {
        UI.toast(I18N.t('index.clearError'), 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = I18N.t('index.clearBtn');
    }
}

window.loadStats = loadStats;
window.deleteOne = deleteOne;
window.clearUsed = clearUsed;

document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        currentFilter = tab.dataset.filter;
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t === tab));
        renderPrescriptions();
    });
});

document.getElementById('admin-search').addEventListener('input', renderPrescriptions);
window.addEventListener('mediflow:langchange', renderPrescriptions);

loadStats();
setInterval(() => loadStats(), 15000);
