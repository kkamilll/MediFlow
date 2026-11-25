(function () {
    const ICONS = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };

    function getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function toast(message, type = 'info', duration = 3800) {
        const container = getToastContainer();
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.setAttribute('role', 'status');

        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = ICONS[type] || ICONS.info;

        const text = document.createElement('span');
        text.className = 'toast-message';
        text.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '×';

        const dismiss = () => {
            if (el.classList.contains('toast-exit')) return;
            el.classList.add('toast-exit');
            setTimeout(() => el.remove(), 220);
        };

        closeBtn.addEventListener('click', dismiss);

        el.appendChild(icon);
        el.appendChild(text);
        el.appendChild(closeBtn);
        container.appendChild(el);

        if (duration > 0) {
            setTimeout(dismiss, duration);
        }
    }

    function confirm({ title, message, confirmText, cancelText, danger = false } = {}) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';

            const t = (key, fallback) => (window.I18N ? window.I18N.t(key) : fallback);
            const resolvedTitle = title || t('ui.confirmTitle', 'Potwierdzenie');
            const resolvedConfirm = confirmText || t('ui.confirm', 'Potwierdź');
            const resolvedCancel = cancelText || t('ui.cancel', 'Anuluj');

            const card = document.createElement('div');
            card.className = 'card modal-card animate-in';

            const iconWrap = document.createElement('div');
            iconWrap.className = `modal-icon ${danger ? 'modal-icon-danger' : 'modal-icon-primary'}`;
            iconWrap.textContent = danger ? '!' : '?';

            const heading = document.createElement('h3');
            heading.className = 'modal-title';
            heading.textContent = resolvedTitle;

            const body = document.createElement('p');
            body.className = 'modal-message';
            body.textContent = message || '';

            const actions = document.createElement('div');
            actions.className = 'modal-actions';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn-outline';
            cancelBtn.textContent = resolvedCancel;

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = danger ? 'btn btn-danger-solid' : 'btn btn-primary';
            confirmBtn.textContent = resolvedConfirm;

            actions.appendChild(cancelBtn);
            actions.appendChild(confirmBtn);

            card.appendChild(iconWrap);
            card.appendChild(heading);
            card.appendChild(body);
            card.appendChild(actions);
            overlay.appendChild(card);
            document.body.appendChild(overlay);

            const cleanup = (result) => {
                document.removeEventListener('keydown', onKeyDown);
                overlay.remove();
                resolve(result);
            };

            const onKeyDown = (e) => {
                if (e.key === 'Escape') cleanup(false);
            };

            cancelBtn.addEventListener('click', () => cleanup(false));
            confirmBtn.addEventListener('click', () => cleanup(true));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });
            document.addEventListener('keydown', onKeyDown);

            confirmBtn.focus();
        });
    }

    window.UI = { toast, confirm };
})();
