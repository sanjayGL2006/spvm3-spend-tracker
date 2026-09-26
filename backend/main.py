"""
SPVM3 Money Spend - FastAPI Backend
Enhanced production-ready API with filtering, analytics, budgets, CSV export, and CRUD.
"""
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import date, timedelta
import itertools
import random
import csv
import io

app = FastAPI(
    title="SPVM3 Money Spend API",
    description="Backend service for SPVM³ TECH SOLUTION finance tracking system",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_id_counter = itertools.count(1)

CATEGORIES = {
    "income": ["Salary", "Freelance", "Investments", "Other Income"],
    "expense": [
        "Food", "Rent", "Transport", "Shopping", "Utilities", 
        "Entertainment", "Healthcare", "Subscriptions", "Other"
    ],
}

DEFAULT_BUDGETS = {
    "Food": 15000,
    "Rent": 20000,
    "Transport": 5000,
    "Shopping": 10000,
    "Utilities": 5000,
    "Entertainment": 4000,
    "Healthcare": 5000,
    "Subscriptions": 2000,
    "Other": 15000,
}

class TransactionCreate(BaseModel):
    type: str = Field(..., description="income or expense")
    category: str
    amount: float = Field(..., gt=0)
    description: str = ""
    date: Optional[str] = None

class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[str] = None

class BudgetSet(BaseModel):
    category: str
    limit: float = Field(..., ge=0)

TRANSACTIONS: Dict[int, dict] = {}
BUDGETS: Dict[str, float] = dict(DEFAULT_BUDGETS)

def seed_data():
    global TRANSACTIONS, _id_counter
    TRANSACTIONS.clear()
    _id_counter = itertools.count(1)
    random.seed(42)
    today = date.today()
    
    templates = [
        ("income", "Salary", 65000, "Monthly salary credited"),
        ("expense", "Rent", 18000, "Monthly house rent payment"),
        ("expense", "Food", 450, "Weekly grocery run at Supermarket"),
        ("expense", "Food", 280, "Dinner with colleagues"),
        ("expense", "Transport", 600, "Vehicle fuel top-up"),
        ("expense", "Utilities", 1200, "Electricity & Internet bill"),
        ("expense", "Shopping", 2200, "Clothing & Accessories"),
        ("expense", "Entertainment", 500, "Weekend movie tickets"),
        ("expense", "Other", 12000, "SPVM3 money spend - hardware update"),
        ("expense", "Healthcare", 800, "Medical checkup & pharmacy"),
        ("expense", "Food", 320, "Fresh fruits & organic snacks"),
        ("expense", "Transport", 150, "Metro pass recharge"),
        ("income", "Freelance", 18500, "UI/UX design project milestone"),
        ("expense", "Subscriptions", 699, "Cloud dev tools subscription"),
    ]
    
    for i in range(65):
        t = templates[i % len(templates)]
        day_offset = i
        tx_date = today - timedelta(days=day_offset)
        amount = round(t[2] * random.uniform(0.88, 1.12), 2)
        tid = next(_id_counter)
        TRANSACTIONS[tid] = {
            "id": tid,
            "type": t[0],
            "category": t[1],
            "amount": amount,
            "description": t[3],
            "date": str(tx_date),
        }

seed_data()

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "spvm3-money-spend-api",
        "version": "2.0.0",
        "total_transactions": len(TRANSACTIONS)
    }

@app.get("/api/categories")
def get_categories():
    return CATEGORIES

@app.get("/api/transactions")
def list_transactions(
    type: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("date", regex="^(date|amount|category)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$")
):
    results = list(TRANSACTIONS.values())
    
    if type and type != "all":
        results = [t for t in results if t["type"] == type]
    if category and category != "all":
        results = [t for t in results if t["category"] == category]
    if search:
        s = search.lower()
        results = [
            t for t in results 
            if s in t["description"].lower() or s in t["category"].lower() or s in str(t["amount"])
        ]
    if date_from:
        results = [t for t in results if t["date"] >= date_from]
    if date_to:
        results = [t for t in results if t["date"] <= date_to]
        
    reverse = (sort_order == "desc")
    if sort_by == "date":
        results.sort(key=lambda t: (t["date"], t["id"]), reverse=reverse)
    elif sort_by == "amount":
        results.sort(key=lambda t: t["amount"], reverse=reverse)
    elif sort_by == "category":
        results.sort(key=lambda t: t["category"].lower(), reverse=reverse)

    total_count = len(results)
    paginated = results[offset : offset + limit]
    
    return {
        "items": paginated,
        "total": total_count,
        "limit": limit,
        "offset": offset
    }

@app.post("/api/transactions")
def create_transaction(tx: TransactionCreate):
    tid = next(_id_counter)
    tx_date = tx.date or str(date.today())
    new_tx = {
        "id": tid,
        "type": tx.type,
        "category": tx.category,
        "amount": round(tx.amount, 2),
        "description": tx.description.strip(),
        "date": tx_date
    }
    TRANSACTIONS[tid] = new_tx
    return new_tx

@app.put("/api/transactions/{tx_id}")
def update_transaction(tx_id: int, tx: TransactionUpdate):
    if tx_id not in TRANSACTIONS:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    current = TRANSACTIONS[tx_id]
    if tx.type is not None:
        current["type"] = tx.type
    if tx.category is not None:
        current["category"] = tx.category
    if tx.amount is not None:
        current["amount"] = round(tx.amount, 2)
    if tx.description is not None:
        current["description"] = tx.description.strip()
    if tx.date is not None:
        current["date"] = tx.date

    TRANSACTIONS[tx_id] = current
    return current

@app.delete("/api/transactions/{tx_id}")
def delete_transaction(tx_id: int):
    if tx_id not in TRANSACTIONS:
        raise HTTPException(status_code=404, detail="Transaction not found")
    deleted = TRANSACTIONS.pop(tx_id)
    return {"status": "deleted", "id": tx_id, "deleted_item": deleted}

@app.get("/api/summary")
def get_summary():
    total_income = sum(t["amount"] for t in TRANSACTIONS.values() if t["type"] == "income")
    total_expense = sum(t["amount"] for t in TRANSACTIONS.values() if t["type"] == "expense")
    balance = total_income - total_expense
    savings_rate = round((balance / total_income * 100), 1) if total_income > 0 else 0.0

    by_category = {}
    for t in TRANSACTIONS.values():
        if t["type"] == "expense":
            by_category[t["category"]] = by_category.get(t["category"], 0) + t["amount"]

    sorted_categories = {k: round(v, 2) for k, v in sorted(by_category.items(), key=lambda x: -x[1])}

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "balance": round(balance, 2),
        "savings_rate": savings_rate,
        "count": len(TRANSACTIONS),
        "by_category": sorted_categories,
    }

@app.get("/api/monthly-trend")
def get_monthly_trend():
    from collections import defaultdict
    trend = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    for t in TRANSACTIONS.values():
        month = t["date"][:7]
        trend[month][t["type"]] += t["amount"]
    
    result = [
        {
            "month": m,
            "income": round(v["income"], 2),
            "expense": round(v["expense"], 2),
            "net": round(v["income"] - v["expense"], 2)
        }
        for m, v in sorted(trend.items())
    ]
    return result

@app.get("/api/analytics")
def get_analytics():
    expenses = [t for t in TRANSACTIONS.values() if t["type"] == "expense"]
    incomes = [t for t in TRANSACTIONS.values() if t["type"] == "income"]
    
    total_exp = sum(t["amount"] for t in expenses)
    total_inc = sum(t["amount"] for t in incomes)
    
    dates = [t["date"] for t in TRANSACTIONS.values()]
    day_span = 1
    if dates:
        d_min = date.fromisoformat(min(dates))
        d_max = date.fromisoformat(max(dates))
        day_span = max((d_max - d_min).days + 1, 1)

    avg_daily_expense = round(total_exp / day_span, 2)
    largest_expense = max(expenses, key=lambda x: x["amount"]) if expenses else None
    
    top_category = None
    by_cat = {}
    for t in expenses:
        by_cat[t["category"]] = by_cat.get(t["category"], 0) + t["amount"]
    if by_cat:
        top_cat_name = max(by_cat, key=by_cat.get)
        top_category = {"category": top_cat_name, "amount": round(by_cat[top_cat_name], 2)}

    return {
        "day_span": day_span,
        "avg_daily_expense": avg_daily_expense,
        "largest_expense": largest_expense,
        "top_spending_category": top_category,
        "total_transactions": len(TRANSACTIONS),
        "expense_count": len(expenses),
        "income_count": len(incomes),
    }

@app.get("/api/budgets")
def get_budgets():
    expense_totals = {}
    for t in TRANSACTIONS.values():
        if t["type"] == "expense":
            expense_totals[t["category"]] = expense_totals.get(t["category"], 0) + t["amount"]

    items = []
    all_categories = sorted(set(list(BUDGETS.keys()) + list(expense_totals.keys())))
    for cat in all_categories:
        spent = round(expense_totals.get(cat, 0), 2)
        limit = BUDGETS.get(cat, 10000.0)
        percentage = round((spent / limit * 100), 1) if limit > 0 else 0.0
        items.append({
            "category": cat,
            "spent": spent,
            "limit": round(limit, 2),
            "percentage": percentage,
            "status": "exceeded" if spent > limit else ("warning" if percentage >= 80 else "ok")
        })

    return items

@app.post("/api/budgets")
def set_budget(budget: BudgetSet):
    BUDGETS[budget.category] = budget.limit
    return {"status": "updated", "category": budget.category, "limit": budget.limit}

@app.get("/api/transactions/export")
def export_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Type", "Category", "Amount (INR)", "Description"])
    
    sorted_txs = sorted(TRANSACTIONS.values(), key=lambda t: t["date"], reverse=True)
    for t in sorted_txs:
        writer.writerow([t["id"], t["date"], t["type"], t["category"], t["amount"], t["description"]])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=spvm3_transactions_export.csv"}
    )

@app.post("/api/reset-data")
def reset_data():
    seed_data()
    return {"status": "reset", "message": "Successfully re-seeded default transactions data"}
