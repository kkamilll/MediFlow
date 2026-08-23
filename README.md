# 🌊 MediFlow - E-Prescription Management System

> **Course Assignment — Poznan University of Technology (Politechnika Poznańska)**  
> Course: Organization of Commercial Services on the Internet (Organizacja usług komercyjnych w Internecie)

MediFlow is a modern, responsive web application for comprehensive e-prescription handling. The system simulates electronic prescription lifecycle workflows in digital healthcare, connecting a Doctor Portal (prescription issuance) and a Pharmacy Portal (fulfillment with an automated discount engine).

![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20MongoDB-blue?style=for-the-badge)

---

## ✨ Key Features

- **👨‍⚕️ Doctor Portal**:
  - Issue e-prescriptions with PESEL validation (11 digits).
  - Automatically generate unique 4-digit security PIN codes.
  - Mark medications as reimbursed / eligible for refund (influences discount calculation).
  - Support for partial fulfillment (patients don't have to buy all prescribed medications at once).

- **💊 Pharmacist Portal**:
  - Fetch prescription details securely via PESEL + PIN.
  - **Automated Discount Engine** — applies tier-based discounts exclusively to eligible/reimbursed medications:
    | Reimbursed Medications Value | System Discount |
    |------------------------------|-----------------|
    | ≥ 200 PLN                    | 5%              |
    | ≥ 500 PLN                    | 15%             |
    | ≥ 1000 PLN                   | 25%             |
  - **Promo Codes** (adds a bonus discount on top of the refund discount):
    | Promo Code | Additional Discount |
    |------------|---------------------|
    | `MEDI10`   | +10%                |
    | `RABAT20`  | +20%                |
  - Real-time progress bar towards the next discount tier.
  - Print / download transaction receipt.
  - Visual status updates for pending vs. dispensed items.

- **🛠️ Administrative Panel** (Home Page):
  - Real-time database metrics (active vs. fulfilled prescriptions).
  - Clean up fulfilled prescriptions with a single click.

- **🎨 Premium UI/UX**: Clean aesthetic typography (*Outfit*), smooth micro-interactions, card layouts, and full mobile responsiveness.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Docker & Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
- OR [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/try/download/community) (for running without Docker)

---

### 2. Quick Run with Docker 🐳 (Recommended)

This is the easiest way. Docker automatically spins up MongoDB and the Node.js application in an isolated environment.

```bash
docker-compose up --build
```
The app will be immediately available at: `http://localhost:3000`

---

### 3. Traditional Local Setup

If you prefer running directly on your machine with a local MongoDB instance:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional, defaults to local MongoDB)
# Copy .env.example to .env if you need custom database credentials
cp .env.example .env

# 3. Start production server (auto-opens browser)
npm start

# OR Start development server with auto-reload
npm run dev
```

---

## 🗄️ Database Structure (MongoDB)

**Collection:** `mediflow` → `prescriptions`

Each prescription document follows this schema:
```json
{
  "pesel": "95010112345",
  "pin": "1111",
  "status": "active", // "active" | "used"
  "medications": [
    {
      "name": "Xarelto 20mg",
      "dosage": "1-0-0",
      "quantity": 2,
      "price": 180.00,
      "canDiscount": true,
      "status": "pending" // "pending" | "done"
    }
  ],
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

---

## 📡 API Endpoints

| Method   | Endpoint                             | Description                                  |
|----------|--------------------------------------|----------------------------------------------|
| `POST`   | `/api/prescriptions`                 | Create and issue a new prescription          |
| `GET`    | `/api/prescriptions/:pesel/:pin`     | Retrieve prescription by PESEL & PIN         |
| `POST`   | `/api/prescriptions/buy`             | Finalize medication dispensing & fulfillment |
| `GET`    | `/api/prescriptions/stats/active`    | Count of active prescriptions                |
| `GET`    | `/api/prescriptions/stats/used`      | Count of fulfilled prescriptions             |
| `DELETE` | `/api/prescriptions/used`            | Purge all completed prescriptions           |

---

## 📂 Project Structure

```
MediFlow/
├── public/
│   ├── index.html       # Home page & Admin Dashboard
│   ├── doctor.html      # Doctor Portal
│   ├── pharmacy.html    # Pharmacy Portal
│   ├── css/style.css    # Unified design system & stylesheets
│   └── js/
│       ├── doctor.js    # Prescription creation logic & validation
│       └── pharmacy.js  # Dispensing logic & discount calculation engine
├── server/
│   ├── server.js        # Express.js REST API & static file server
│   └── models/
│       └── Prescription.js  # Mongoose Data Model
├── .dockerignore        # Docker build exclusions
├── .env.example         # Template for environment variables
├── .gitignore           # Git ignore list
├── docker-compose.yml   # Multi-container orchestration (Node + Mongo)
├── Dockerfile           # Node.js production image configuration
├── package.json         # Dependencies & execution scripts
└── README.md            # Project documentation
```

---

## 🛠️ Technology Stack

| Layer       | Technology                                            |
|-------------|-------------------------------------------------------|
| Backend     | Node.js, Express.js                                   |
| Database    | MongoDB (Mongoose ODM)                                |
| Frontend    | Vanilla HTML5, CSS3, JavaScript ES6+                  |
| Typography  | Google Fonts (Outfit), CSS Variables, Animations      |
| DevOps / CI | Docker, Docker Compose, Nodemon                       |

---

*© 2026 MediFlow — Course assignment for Poznan University of Technology.*
