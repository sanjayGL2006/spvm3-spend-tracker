<p align="center">
  <img src="logo.png" alt="SPVM3 Tech Solution Logo" width="160" />
</p>

# SPVM3 Money Spend

Full-stack personal finance and expense tracker built for **SPVM³ TECH SOLUTION** by Sanjay GL: FastAPI backend + React (Vite) dashboard using Recharts.

## Features
- Income / expense / balance summary cards
- Monthly income vs. expense trend line chart
- Spending-by-category pie chart
- Recent transactions list with delete
- Add new transactions via modal (auto-categorized by type: income or expense)
- Seeded with 60 realistic sample transactions (in Indian Rupees) spanning 3 months, including SPVM3 money spend tracking

## Tech Stack
- Backend: FastAPI (in-memory transaction store, server-side aggregation for summary/trend endpoints)
- Frontend: React 18 + Vite + Recharts

## Run it locally

### 1. Backend
```bash
cd backend
pip install -r requirements.txt --break-system-packages
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173.

### Production build
```bash
npm run build
```
Note: the production bundle is ~560KB due to Recharts. For a smaller bundle, consider code-splitting the charts with `React.lazy()`, or swap Recharts for a lighter charting library if bundle size is a priority for this client.

## Notes
- All amounts are in ₹ (INR). Change the `fmt()` currency prefix in `SummaryCards.jsx` and `TransactionList.jsx` if a different currency is needed.
- Transactions are in-memory — move to SQLite/Postgres for real persistence, and add user accounts if this needs to support multiple people.
