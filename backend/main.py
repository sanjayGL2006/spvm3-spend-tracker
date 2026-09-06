"""
SPVM3 Money Spend - FastAPI Backend
Run: pip install -r requirements.txt && uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta
import itertools
import random

app = FastAPI(title="SPVM3 Money Spend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_id_counter = itertools.count(1)

CATEGORIES = {
    "income": ["Salary", "Freelance", "Investments", "Other Income"],
    "expense": ["Food", "Rent", "Transport", "Shopping", "Utilities", "Entertainment", "Healthcare", "Other"],
}

class TransactionCreate(BaseModel):
    type: str  # income | expense
    category: str
    amount: float
    description: str = ""
    date: Optional[str] = None

TRANSACTIONS: dict[int, dict] = {}

def seed_data():
    random.seed(42)
    today = date.today()
    templates = [
        ("income", "Salary", 65000, "Monthly salary", 1),
        ("expense", "Rent", 18000, "Monthly rent", 2),
        ("expense", "Food", 450, "Groceries", None),
        ("expense", "Food", 280, "Restaurant", None),
        ("expense", "Transport", 600, "Fuel", None),
        ("expense", "Utilities", 1200, "Electricity bill", None),
        ("expense", "Shopping", 2200, "Clothing", None),
        ("expense", "Entertainment", 500, "Movies", None),
        ("expense", "Other", 12000, "SPVM3 money spend", None),
        ("expense", "Healthcare", 800, "Pharmacy", None),
        ("expense", "Food", 320, "Groceries", None),
        ("expense", "Transport", 150, "Auto fare", None),
    ]
    for i in range(60):
        t = templates[i % len(templates)]
        day_offset = i * 1
        tx_date = today - timedelta(days=day_offset)
        amount = t[2] * random.uniform(0.85, 1.15)
        tid = next(_id_counter)
        TRANSACTIONS[tid] = {
            "id": tid, "type": t[0], "category": t[1],
            "amount": round(amount, 2), "description": t[3],
            "date": str(tx_date),
        }

seed_data()

@app.get("/api/transactions")
def list_transactions(type: Optional[str] = None, category: Optional[str] = None, limit: int = 100):
    results = list(TRANSACTIONS.values())
    if type:
        results = [t for t in results if t["type"] == type]
    if category:
        results = [t for t in results if t["category"] == category]
    results = sorted(results, key=lambda t: t["date"], reverse=True)
    return results[:limit]

@app.post("/api/transactions")
def create_transaction(tx: TransactionCreate):
    tid = next(_id_counter)
    new_tx = {**tx.dict(), "id": tid, "date": tx.date or str(date.today())}
    TRANSACTIONS[tid] = new_tx
    return new_tx

@app.delete("/api/transactions/{tx_id}")
def delete_transaction(tx_id: int):
    if tx_id not in TRANSACTIONS:
        raise HTTPException(status_code=404, detail="Transaction not found")
    del TRANSACTIONS[tx_id]
    return {"status": "deleted"}

@app.get("/api/summary")
def get_summary():
    total_income = sum(t["amount"] for t in TRANSACTIONS.values() if t["type"] == "income")
    total_expense = sum(t["amount"] for t in TRANSACTIONS.values() if t["type"] == "expense")
    by_category = {}
    for t in TRANSACTIONS.values():
        if t["type"] == "expense":
            by_category[t["category"]] = by_category.get(t["category"], 0) + t["amount"]
    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "balance": round(total_income - total_expense, 2),
        "by_category": {k: round(v, 2) for k, v in sorted(by_category.items(), key=lambda x: -x[1])},
    }

@app.get("/api/monthly-trend")
def get_monthly_trend():
    from collections import defaultdict
    trend = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    for t in TRANSACTIONS.values():
        month = t["date"][:7]  # YYYY-MM
        trend[month][t["type"]] += t["amount"]
    result = [{"month": m, "income": round(v["income"], 2), "expense": round(v["expense"], 2)}
               for m, v in sorted(trend.items())]
    return result

@app.get("/api/categories")
def get_categories():
    return CATEGORIES

@app.get("/")
def root():
    return {"status": "ok", "service": "spvm3-money-spend-api"}
