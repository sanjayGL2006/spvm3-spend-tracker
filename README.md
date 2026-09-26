<p align="center">
  <img src="logo.png" alt="SPVM3 Tech Solution Logo" width="160" />
</p>

# SPVM3 Money Spend (v2.0)

Full-stack personal finance, budgeting, and expense tracker built for **SPVM³ TECH SOLUTION** by **Sanjay GL**.
Engineered with a high-performance **FastAPI (Python)** backend and an ultra-modern **React 18 + Vite** dark glassmorphism dashboard powered by **Recharts** & **Lucide React**.

---

## 🚀 What's New in v2.0

- 📊 **Enhanced Analytics & Insights**: Track daily average expense, top spending category, largest single transaction, net savings rate (%), and total transaction metrics.
- 🎯 **Category Budgets & Goal Tracking**: Real-time spending progress bars per category with over-budget alerts and interactive inline limit editing.
- 📈 **Interactive Multi-Chart View**: Toggle seamlessly between gradient **Area Trend** charts and monthly comparison **Bar Charts**.
- 🍩 **Donut Category Breakdown**: Outer/inner donut breakdown with hover percentages and total spend badges.
- 🔍 **Real-Time Filtering & Search**: Instant searching across descriptions, categories, and amounts with type, category, and date sorting filters.
- ✏️ **Full Transaction CRUD**: Create, view, edit, and delete transactions with dynamic form validation and date selectors.
- 📥 **CSV Export**: Download transactions as structured CSV files with a single click.
- 🔄 **Sample Data Reset**: One-click restore to standard realistic sample transactions spanning 60+ days in Indian Rupees (₹).
- 🎨 **Dark Glassmorphism Design**: High-definition HSL color system, smooth backdrop blurs, Google Plus Jakarta Sans fonts, micro-animations, and toast feedback.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+ · FastAPI · Pydantic v2 · Uvicorn · CORS Middleware
- **Frontend**: React 18 · Vite · Recharts · Lucide React · CSS3 Design System

---

## 📁 Repository Structure

```
08-finance-tracker/
├── backend/
│   ├── main.py              # FastAPI endpoints (CRUD, analytics, budgets, CSV export, seed data)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/              # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── SummaryCards.jsx          # Income, Expense, Balance, Savings Rate cards
│   │   │   ├── AnalyticsOverview.jsx     # Daily spend avg, top category, largest expense
│   │   │   ├── TrendChart.jsx            # Switchable Area / Bar trend chart
│   │   │   ├── CategoryBreakdown.jsx     # Interactive Donut chart
│   │   │   ├── BudgetTracker.jsx         # Goal progress bars & limit controls
│   │   │   ├── TransactionList.jsx       # Filterable history table with search & export
│   │   │   ├── AddTransactionModal.jsx   # Quick-pill transaction creation modal
│   │   │   └── EditTransactionModal.jsx  # Edit existing transaction modal
│   │   ├── api.js           # API client methods
│   │   ├── App.jsx          # Main dashboard layout & tab state manager
│   │   ├── App.css          # Glassmorphic dark design system
│   │   └── main.jsx         # React application entry point
│   ├── index.html           # HTML template with Google Fonts
│   └── package.json         # Frontend npm configuration
├── logo.png
└── README.md
```

---

## ⚙️ Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt --break-system-packages
python -m uvicorn main:app --reload --port 8000
```
Backend API will run at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Dashboard will open at `http://localhost:5173`.

---

## 📡 API Endpoints Summary

- `GET /api/summary`: Overview totals, net balance, savings rate %, category breakdown
- `GET /api/analytics`: Daily spend velocity, top expense, largest expense, transaction stats
- `GET /api/monthly-trend`: Monthly aggregated income vs expense trends
- `GET /api/transactions`: Filtered transaction history (search, type, category, date, sorting, limit)
- `POST /api/transactions`: Add a new transaction
- `PUT /api/transactions/{id}`: Update an existing transaction
- `DELETE /api/transactions/{id}`: Remove a transaction
- `GET /api/budgets`: Retrieve budget limits vs actual category spending
- `POST /api/budgets`: Set/update a category budget limit
- `GET /api/transactions/export`: Export transactions as a CSV file
- `POST /api/reset-data`: Reset in-memory database to initial sample dataset

---

## 📝 Notes & Persistence

- All financial values are formatted in **₹ (INR)** by default.
- Data is maintained in-memory for instant responsiveness. For persistent database storage, replace the `TRANSACTIONS` dictionary in `backend/main.py` with SQLite or PostgreSQL via SQLAlchemy.
