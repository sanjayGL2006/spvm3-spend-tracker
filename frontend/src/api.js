const API_BASE = '/api'

export async function fetchTransactions(params = {}) {
  const q = new URLSearchParams(params)
  const res = await fetch(`${API_BASE}/transactions?${q.toString()}`)
  return res.json()
}

export async function createTransaction(tx) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  })
  return res.json()
}

export async function deleteTransaction(id) {
  await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' })
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/summary`)
  return res.json()
}

export async function fetchMonthlyTrend() {
  const res = await fetch(`${API_BASE}/monthly-trend`)
  return res.json()
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`)
  return res.json()
}
