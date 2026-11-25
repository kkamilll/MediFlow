(function () {
    const STORAGE_KEY = 'mediflow_lang';

    const translations = {
        pl: {
            'nav.home': 'Start',
            'nav.doctor': 'Lekarz',
            'nav.pharmacy': 'Farmaceuta',
            'nav.admin': 'Administrator',
            'badge.refundable': 'REFUNDOWANY',
            'unit.pack': 'op.',

            'index.title': 'MediFlow | System zarządzania e-receptami',
            'index.subtitle': 'Nowoczesna platforma łącząca lekarzy, pacjentów i farmaceutów',
            'index.doctorTitle': 'Portal Lekarza',
            'index.doctorDesc': 'Wystawiaj bezpieczne e-recepty w kilka sekund. Automatyczna walidacja PESEL i dawkowanie leków.',
            'index.doctorBtn': 'Otwórz Portal Lekarza',
            'index.pharmacyTitle': 'Portal Farmaceuty',
            'index.pharmacyDesc': 'Realizuj recepty z automatycznym silnikiem rabatowym. Progi zniżek i obsługa kodów promocyjnych.',
            'index.pharmacyBtn': 'Otwórz Portal Farmaceuty',
            'index.adminTitle': 'Panel Administratora',
            'index.adminDesc': 'Przeglądaj wszystkie recepty w bazie, filtruj po statusie i zarządzaj wpisami.',
            'index.adminBtn': 'Otwórz Panel Administratora',
            'index.dbStatus': 'Status bazy danych:',
            'index.activeLabel': 'aktywnych',
            'index.usedLabel': 'zrealizowanych',
            'index.refreshTitle': 'Odśwież statystyki',
            'index.clearBtn': '🗑️ Usuń zrealizowane',
            'index.deleting': 'Usuwanie...',
            'index.footer': '© 2026 MediFlow | Zadanie na przedmiot - Politechnika Poznańska',
            'index.noUsedAlert': 'Brak zrealizowanych recept do usunięcia.',
            'index.clearConfirm': 'Czy na pewno chcesz usunąć {count} zrealizowanych recept z bazy danych? Tej operacji nie można cofnąć.',
            'index.clearSuccess': 'Pomyślnie usunięto {count} zrealizowanych recept.',
            'index.clearError': 'Wystąpił błąd podczas usuwania recept.',

            'ui.confirmTitle': 'Potwierdzenie',
            'ui.cancel': 'Anuluj',
            'ui.confirm': 'Potwierdź',
            'ui.deleteConfirmBtn': 'Usuń',
            'ui.dispenseConfirmBtn': 'Wydaj leki',

            'admin.title': 'Panel Administratora | MediFlow',
            'admin.heading': '🛠️ Panel Administratora',
            'admin.filterAll': 'Wszystkie',
            'admin.filterActive': 'Aktywne',
            'admin.filterUsed': 'Zrealizowane',
            'admin.searchPlaceholder': 'Szukaj po PESEL, PIN lub nazwie leku...',
            'admin.empty': 'Brak recept do wyświetlenia.',
            'admin.statusActive': 'Aktywna',
            'admin.statusUsed': 'Zrealizowana',
            'admin.deleteOne': 'Usuń',
            'admin.deleteOneConfirm': 'Czy na pewno chcesz usunąć receptę dla PESEL {pesel} (PIN: {pin})?',
            'admin.deleteOneSuccess': 'Recepta została usunięta.',
            'admin.deleteOneError': 'Nie udało się usunąć recepty.',
            'admin.loadError': 'Nie udało się pobrać listy recept.',

            'doctor.title': 'Wystaw e-receptę | MediFlow',
            'doctor.creatorTitle': '👨‍⚕️ Kreator e-recepty',
            'doctor.peselLabel': 'PESEL pacjenta (11 cyfr)',
            'doctor.peselPlaceholder': 'Wpisz 11 cyfr',
            'doctor.peselError': 'Nieprawidłowy format PESEL (wymagane 11 cyfr)',
            'doctor.addMedHeading': 'Dodaj lek do recepty',
            'doctor.medNameLabel': 'Nazwa leku',
            'doctor.medNamePlaceholder': 'np. Amoksycylina, Ibuprofen...',
            'doctor.qtyLabel': 'Liczba opakowań',
            'doctor.priceLabel': 'Cena za szt. (PLN)',
            'doctor.dosageLabel': 'Zalecane dawkowanie',
            'doctor.dosagePlaceholder': 'np. 1-0-1 (rano i wieczorem)',
            'doctor.refundableLabel': 'Lek refundowany / objęty rabatami',
            'doctor.addMedBtn': 'Dodaj do recepty',
            'doctor.itemsTitle': '📋 Pozycje na recepcie',
            'doctor.emptyMsg': 'Brak dodanych leków.<br>Dodaj pozycje, aby wystawić e-receptę.',
            'doctor.saveBtn': 'Wystaw e-receptę (Generuj PIN)',
            'doctor.saving': 'Zapisywanie w bazie...',
            'doctor.removeBtn': 'Usuń',
            'doctor.issuedTitle': 'Recepta wystawiona!',
            'doctor.issuedDesc': 'Przekaż pacjentowi poniższy kod PIN:',
            'doctor.pinHeading': 'TWÓJ KOD PIN',
            'doctor.issueAnotherBtn': 'Wystaw kolejną receptę',
            'doctor.goPharmacyBtn': '💊 Przejdź do apteki',
            'doctor.errName': 'Proszę podać nazwę leku.',
            'doctor.errQty': 'Proszę podać prawidłową liczbę opakowań (minimum 1).',
            'doctor.errPrice': 'Proszę podać prawidłową cenę.',
            'doctor.errDosage': 'Proszę podać zalecane dawkowanie.',
            'doctor.errNoMeds': 'Recepta musi zawierać co najmniej jeden lek.',
            'doctor.errServer': 'Błąd połączenia z serwerem. Upewnij się, że serwer MediFlow jest uruchomiony.',

            'pharmacy.title': 'Realizacja recepty | MediFlow',
            'pharmacy.verifyTitle': '🔍 Weryfikacja pacjenta',
            'pharmacy.peselLabel': 'PESEL pacjenta',
            'pharmacy.peselPlaceholder': '11 cyfr',
            'pharmacy.pinLabel': 'Kod PIN',
            'pharmacy.pinPlaceholder': '4 cyfry',
            'pharmacy.fetchBtn': 'Pobierz dane recepty',
            'pharmacy.searching': 'Szukanie w bazie...',
            'pharmacy.productsTitle': '📦 Przepisane leki',
            'pharmacy.summaryTitle': '💰 Podsumowanie finansowe',
            'pharmacy.discountEngine': 'Silnik rabatowy MediFlow',
            'pharmacy.promoPlaceholder': 'Kod rabatowy (np. MEDI10)',
            'pharmacy.applyBtn': 'Zastosuj',
            'pharmacy.subtotal': 'Wartość początkowa',
            'pharmacy.discount': 'Naliczony rabat',
            'pharmacy.totalDue': 'Do zapłaty',
            'pharmacy.buyBtn': 'Zatwierdź i wydaj leki',
            'pharmacy.processing': 'Przetwarzanie...',
            'pharmacy.printBtn': '🖨️ Drukuj paragon',
            'pharmacy.statusDone': 'Wydano',
            'pharmacy.statusPending': 'Oczekuje',
            'pharmacy.allDoneTitle': 'Recepta w pełni zrealizowana',
            'pharmacy.allDoneDesc': 'Wszystkie leki z tej recepty zostały już wydane pacjentowi.',
            'pharmacy.errInvalidCreds': 'Podaj prawidłowy PESEL (11 cyfr) oraz kod PIN (4 cyfry).',
            'pharmacy.errNotFound': 'Nie znaleziono recepty lub dane są nieprawidłowe.',
            'pharmacy.tipSelect': 'Zaznacz leki, aby obliczyć cenę i rabaty.',
            'pharmacy.tipNotEligible': 'Wybrane leki nie podlegają refundacji - brak naliczonego rabatu.',
            'pharmacy.tipPromoActive': 'Kod rabatowy {code} aktywny ({bonus}%) - rabaty się nie łączą.',
            'pharmacy.tipAutoBetter': 'Rabat progowy {auto}% jest wyższy niż kod {code} ({bonus}%) - zastosowano {auto}%.',
            'pharmacy.tipTier1': 'Dodaj leki refundowane za jeszcze {amount} PLN, aby uzyskać 5% rabatu',
            'pharmacy.tipTier2': 'Rabat 5% aktywny! Dodaj jeszcze {amount} PLN, aby osiągnąć 15%',
            'pharmacy.tipTier3': 'Rabat 15% aktywny! Dodaj jeszcze {amount} PLN, aby osiągnąć 25%',
            'pharmacy.tipMax': 'Przyznano maksymalny rabat systemowy 25%!',
            'pharmacy.promoApplied10': 'Kod MEDI10 zastosowany (10% na leki refundowane, bez łączenia z rabatem progowym).',
            'pharmacy.promoApplied20': 'Kod RABAT20 zastosowany (20% na leki refundowane, bez łączenia z rabatem progowym).',
            'pharmacy.promoEmpty': 'Proszę wpisać kod rabatowy.',
            'pharmacy.promoInvalid': 'Kod rabatowy "{code}" jest nieprawidłowy lub wygasł.',
            'pharmacy.errSelectMed': 'Zaznacz co najmniej jeden lek do wydania.',
            'pharmacy.confirmFinalize': 'Czy na pewno chcesz zatwierdzić transakcję i wydać wybrane leki?',
            'pharmacy.successFinalize': 'Transakcja zakończona pomyślnie. Leki zostały wydane.',
            'pharmacy.errFinalize': 'Wystąpił błąd podczas finalizacji transakcji.'
        },
        en: {
            'nav.home': 'Home',
            'nav.doctor': 'Doctor',
            'nav.pharmacy': 'Pharmacist',
            'nav.admin': 'Admin',
            'badge.refundable': 'REFUNDABLE',
            'unit.pack': 'pack(s)',

            'index.title': 'MediFlow | E-Prescription Management System',
            'index.subtitle': 'Modern platform connecting doctors, patients, and pharmacists',
            'index.doctorTitle': 'Doctor Portal',
            'index.doctorDesc': 'Issue secure e-prescriptions in seconds. Automated PESEL validation and dosage recommendations.',
            'index.doctorBtn': 'Launch Doctor Portal',
            'index.pharmacyTitle': 'Pharmacist Portal',
            'index.pharmacyDesc': 'Fulfill prescriptions with an automated discount engine. Tiered rebates and promo code support.',
            'index.pharmacyBtn': 'Open Pharmacy Counter',
            'index.adminTitle': 'Admin Panel',
            'index.adminDesc': 'Browse all prescriptions in the database, filter by status, and manage records.',
            'index.adminBtn': 'Open Admin Panel',
            'index.dbStatus': 'Database Status:',
            'index.activeLabel': 'active',
            'index.usedLabel': 'fulfilled',
            'index.refreshTitle': 'Refresh statistics',
            'index.clearBtn': '🗑️ Delete Fulfilled',
            'index.deleting': 'Deleting...',
            'index.footer': '© 2026 MediFlow | Course Assignment - Poznan University of Technology',
            'index.noUsedAlert': 'No fulfilled prescriptions found to delete.',
            'index.clearConfirm': 'Are you sure you want to delete {count} fulfilled prescription(s) from the database? This action cannot be undone.',
            'index.clearSuccess': 'Successfully removed {count} fulfilled prescription(s).',
            'index.clearError': 'An error occurred while deleting prescriptions.',

            'ui.confirmTitle': 'Confirmation',
            'ui.cancel': 'Cancel',
            'ui.confirm': 'Confirm',
            'ui.deleteConfirmBtn': 'Delete',
            'ui.dispenseConfirmBtn': 'Dispense',

            'admin.title': 'Admin Panel | MediFlow',
            'admin.heading': '🛠️ Admin Panel',
            'admin.filterAll': 'All',
            'admin.filterActive': 'Active',
            'admin.filterUsed': 'Fulfilled',
            'admin.searchPlaceholder': 'Search by PESEL, PIN or medication...',
            'admin.empty': 'No prescriptions to display.',
            'admin.statusActive': 'Active',
            'admin.statusUsed': 'Fulfilled',
            'admin.deleteOne': 'Delete',
            'admin.deleteOneConfirm': 'Are you sure you want to delete the prescription for PESEL {pesel} (PIN: {pin})?',
            'admin.deleteOneSuccess': 'Prescription deleted.',
            'admin.deleteOneError': 'Failed to delete prescription.',
            'admin.loadError': 'Failed to load prescriptions.',

            'doctor.title': 'Issue E-Prescription | MediFlow',
            'doctor.creatorTitle': '👨‍⚕️ E-Prescription Creator',
            'doctor.peselLabel': 'Patient PESEL (11 digits)',
            'doctor.peselPlaceholder': 'Enter 11 digits',
            'doctor.peselError': 'Invalid PESEL format (11 digits required)',
            'doctor.addMedHeading': 'Add Medication to Prescription',
            'doctor.medNameLabel': 'Medication Name',
            'doctor.medNamePlaceholder': 'e.g., Amoxicillin, Ibuprofen...',
            'doctor.qtyLabel': 'Package Quantity',
            'doctor.priceLabel': 'Unit Price (PLN)',
            'doctor.dosageLabel': 'Prescribed Dosage',
            'doctor.dosagePlaceholder': 'e.g., 1-0-1 (morning and evening)',
            'doctor.refundableLabel': 'Product is reimbursed / eligible for discounts',
            'doctor.addMedBtn': 'Add to Prescription',
            'doctor.itemsTitle': '📋 Prescription Items',
            'doctor.emptyMsg': 'No medications added yet.<br>Add items to issue an e-prescription.',
            'doctor.saveBtn': 'Issue E-Prescription (Generate PIN)',
            'doctor.saving': 'Submitting to database...',
            'doctor.removeBtn': 'Remove',
            'doctor.issuedTitle': 'Prescription Issued!',
            'doctor.issuedDesc': 'Provide the patient with the access PIN below:',
            'doctor.pinHeading': 'YOUR ACCESS PIN',
            'doctor.issueAnotherBtn': 'Issue Another Prescription',
            'doctor.goPharmacyBtn': '💊 Go to Pharmacy',
            'doctor.errName': 'Please enter the medication name.',
            'doctor.errQty': 'Please enter a valid quantity (minimum 1).',
            'doctor.errPrice': 'Please enter a valid price.',
            'doctor.errDosage': 'Please enter the dosage instructions.',
            'doctor.errNoMeds': 'Prescription must contain at least one medication.',
            'doctor.errServer': 'Server connection error. Make sure the MediFlow server is running.',

            'pharmacy.title': 'Prescription Fulfillment | MediFlow',
            'pharmacy.verifyTitle': '🔍 Patient Verification',
            'pharmacy.peselLabel': 'Patient PESEL',
            'pharmacy.peselPlaceholder': '11 digits',
            'pharmacy.pinLabel': 'PIN Code',
            'pharmacy.pinPlaceholder': '4 digits',
            'pharmacy.fetchBtn': 'Fetch Prescription Data',
            'pharmacy.searching': 'Searching database...',
            'pharmacy.productsTitle': '📦 Prescribed Products',
            'pharmacy.summaryTitle': '💰 Financial Summary',
            'pharmacy.discountEngine': 'MediFlow Discount Engine',
            'pharmacy.promoPlaceholder': 'Promo code (e.g. MEDI10)',
            'pharmacy.applyBtn': 'Apply',
            'pharmacy.subtotal': 'Subtotal',
            'pharmacy.discount': 'Applied Discount',
            'pharmacy.totalDue': 'Total Due',
            'pharmacy.buyBtn': 'Finalize & Dispense Items',
            'pharmacy.processing': 'Processing...',
            'pharmacy.printBtn': '🖨️ Print Receipt',
            'pharmacy.statusDone': 'Dispensed',
            'pharmacy.statusPending': 'Pending',
            'pharmacy.allDoneTitle': 'Prescription Fully Dispensed',
            'pharmacy.allDoneDesc': 'All medications from this prescription have already been dispensed to the patient.',
            'pharmacy.errInvalidCreds': 'Please provide a valid PESEL (11 digits) and PIN (4 digits).',
            'pharmacy.errNotFound': 'Prescription not found or invalid credentials.',
            'pharmacy.tipSelect': 'Select items to calculate pricing and discounts.',
            'pharmacy.tipNotEligible': 'Selected items are not eligible for reimbursement - no discount applies.',
            'pharmacy.tipPromoActive': 'Promo code {code} active ({bonus}%) - discounts do not stack.',
            'pharmacy.tipAutoBetter': 'Tier discount ({auto}%) is higher than code {code} ({bonus}%) - {auto}% applied.',
            'pharmacy.tipTier1': 'Add {amount} PLN more of refundable items for a 5% discount',
            'pharmacy.tipTier2': '5% discount active! Reach 15% by adding {amount} PLN more',
            'pharmacy.tipTier3': '15% discount active! Reach 25% by adding {amount} PLN more',
            'pharmacy.tipMax': 'Maximum system discount of 25% granted!',
            'pharmacy.promoApplied10': 'Code MEDI10 applied (10% on refundable items, does not stack with tier discount).',
            'pharmacy.promoApplied20': 'Code RABAT20 applied (20% on refundable items, does not stack with tier discount).',
            'pharmacy.promoEmpty': 'Please enter a promo code.',
            'pharmacy.promoInvalid': 'Promo code "{code}" is invalid or expired.',
            'pharmacy.errSelectMed': 'Please select at least one medication to dispense.',
            'pharmacy.confirmFinalize': 'Are you sure you want to finalize this transaction and dispense selected medications?',
            'pharmacy.successFinalize': 'Transaction completed successfully. Medications have been dispensed.',
            'pharmacy.errFinalize': 'An error occurred while finalizing the transaction.'
        }
    };

    let currentLang = localStorage.getItem(STORAGE_KEY) || 'pl';
    if (!translations[currentLang]) currentLang = 'pl';

    function t(key, params = {}) {
        let text = (translations[currentLang] && translations[currentLang][key])
            || (translations.en && translations.en[key])
            || key;
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
        return text;
    }

    function applyTranslations() {
        document.documentElement.lang = currentLang;

        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            document.title = t(titleEl.dataset.i18n);
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (el.tagName === 'TITLE') return;
            el.textContent = t(el.dataset.i18n);
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            el.innerHTML = t(el.dataset.i18nHtml);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.dataset.i18nPlaceholder);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = t(el.dataset.i18nTitle);
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    function setLang(lang) {
        if (!translations[lang] || lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
        window.dispatchEvent(new CustomEvent('mediflow:langchange', { detail: { lang } }));
    }

    function init() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => setLang(btn.dataset.lang));
        });
        applyTranslations();
    }

    window.I18N = {
        get lang() { return currentLang; },
        t,
        setLang,
        applyTranslations
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
