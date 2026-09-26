const API_BASE = '/api'

export async function fetchTransactions(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') {
      q.append(k, v)
    }
  })
  const res = await fetch(`${API_BASE}/transactions?${q.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export async function createTransaction(tx) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  })
  if (!res.ok) throw new Error('Failed to create transaction')
  return res.json()
}

export async function updateTransaction(id, tx) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  })
  if (!res.ok) throw new Error('Failed to update transaction')
  return res.json()
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete transaction')
  return res.json()
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/summary`)
  if (!res.ok) throw new Error('Failed to fetch summary')
  return res.json()
}

export async function fetchMonthlyTrend() {
  const res = await fetch(`${API_BASE}/monthly-trend`)
  if (!res.ok) throw new Error('Failed to fetch trend data')
  return res.json()
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export async function fetchBudgets() {
  const res = await fetch(`${API_BASE}/budgets`)
  if (!res.ok) throw new Error('Failed to fetch budgets')
  return res.json()
}

export async function setBudget(category, limit) {
  const res = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, limit: Number(limit) }),
  })
  if (!res.ok) throw new Error('Failed to update budget')
  return res.json()
}

export async function downloadCSV() {
  const res = await fetch(`${API_BASE}/transactions/export`)
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spvm3_transactions_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export async function resetData() {
  const res = await fetch(`${API_BASE}/reset-data`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to reset data')
  return res.json()
}
