# MediFlow

Aplikacja webowa do wystawiania i realizacji e-recept, stworzona jako zadanie na przedmiot *Organizacja usług komercyjnych w Internecie* (Politechnika Poznańska).

System składa się z trzech głównych widoków: **Portalu Lekarza** (tworzenie e-recept i generowanie 4-cyfrowego kodu PIN), **Portalu Farmaceuty** (wyszukiwanie recept po PESEL + PIN, częściowa lub pełna realizacja oraz obliczanie rabatów) oraz **Panelu Administratora** (podgląd i zarządzanie wszystkimi receptami w bazie).

## Funkcjonalności

- **Przełącznik języka (PL / EN)** dostępny na każdej stronie, z zapamiętywaniem wyboru w `localStorage`.
- **Portal Lekarza (`doctor.html`)**:
  - dodawanie leków z nazwą, liczbą opakowań, ceną i dawkowaniem,
  - walidacja numeru PESEL (11 cyfr),
  - oznaczanie leków jako refundowane,
  - generowanie 4-cyfrowego kodu PIN po zapisaniu recepty.
- **Portal Farmaceuty (`pharmacy.html`)**:
  - wyszukiwanie recepty po numerze PESEL i kodzie PIN,
  - możliwość realizacji wybranych pozycji (częściowy wykup),
  - automatyczne progi rabatowe dla leków refundowanych:
    - od 200 PLN: **5%**
    - od 500 PLN: **15%**
    - od 1000 PLN: **25%**
  - obsługa kodów rabatowych (nie łączą się z rabatem progowym - automatycznie wybierany jest wyższy rabat):
    - `MEDI10` (10%)
    - `RABAT20` (20%)
  - podgląd paska postępu do kolejnego progu oraz wydruk paragonu.
- **Panel Administratora (`admin.html`)**:
  - licznik aktywnych i zrealizowanych recept w bazie,
  - podgląd listy wszystkich recept (PESEL, PIN, data, leki i statusy) z filtrowaniem i wyszukiwaniem,
  - usuwanie pojedynczych recept lub wszystkich zrealizowanych jednym przyciskiem.

## Wymagania

- Node.js (wersja 18 lub nowsza)
- MongoDB (lokalna instancja lub baza w MongoDB Atlas)

## Uruchomienie projektu

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj plik `.env.example` do `.env` i uzupełnij dane połączenia z MongoDB (jeśli korzystasz z domyślnej lokalnej bazy, krok ten jest opcjonalny):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mediflow
```

3. Uruchom serwer:

```bash
# Tryb standardowy
npm start

# Tryb deweloperski (nodemon)
npm run dev
```

Na Windowsie dostępne są też skrypty `npm run win-start` oraz `npm run win-dev`, które przed startem zamykają ewentualny proces zajmujący port `3000`.

Po uruchomieniu aplikacja działa pod adresem `http://localhost:3000`.

## API

| Metoda | Endpoint | Opis |
| --- | --- | --- |
| `GET` | `/api/prescriptions` | Pobranie listy wszystkich recept (od najnowszych) |
| `POST` | `/api/prescriptions` | Wystawienie nowej e-recepty i zwrot kodu PIN |
| `GET` | `/api/prescriptions/:pesel/:pin` | Pobranie recepty po PESEL i PIN |
| `POST` | `/api/prescriptions/buy` | Oznaczenie wybranych leków jako wydane |
| `GET` | `/api/prescriptions/stats/active` | Liczba aktywnych recept |
| `GET` | `/api/prescriptions/stats/used` | Liczba zrealizowanych recept |
| `DELETE` | `/api/prescriptions/used` | Usunięcie wszystkich zrealizowanych recept |
| `DELETE` | `/api/prescriptions/:id` | Usunięcie pojedynczej recepty po ID |

## Model danych (MongoDB)

Kolekcja `prescriptions` w bazie `mediflow`:

```json
{
  "pesel": "95010112345",
  "pin": "1111",
  "status": "active",
  "medications": [
    {
      "name": "Xarelto 20mg",
      "dosage": "1-0-0",
      "quantity": 2,
      "price": 180.00,
      "canDiscount": true,
      "status": "pending"
    }
  ],
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

- `status` recepty: `active` lub `used`
- `status` leku: `pending` lub `done`

## Struktura katalogów

```text
MediFlow/
├── public/
│   ├── index.html          # Pulpit (wybór portalu)
│   ├── doctor.html         # Portal lekarza
│   ├── pharmacy.html       # Portal farmaceuty
│   ├── admin.html          # Panel administratora
│   ├── css/style.css       # Style aplikacji
│   └── js/
│       ├── i18n.js         # Tłumaczenia PL / EN
│       ├── ui.js           # Powiadomienia (toast) i okna potwierdzeń
│       ├── doctor.js       # Logika wystawiania recept
│       ├── pharmacy.js     # Logika realizacji i obliczania rabatów
│       └── admin.js        # Logika panelu administratora
├── server/
│   ├── server.js           # Serwer Express i endpointy API
│   └── models/
│       └── Prescription.js # Schemat Mongoose
├── .env.example
├── package.json
└── README.md
```

## Technologie

- **Backend:** Node.js, Express.js
- **Baza danych:** MongoDB, Mongoose
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
