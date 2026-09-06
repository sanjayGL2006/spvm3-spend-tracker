import { useEffect, useState } from 'react'
import { fetchTransactions, fetchSummary, fetchMonthlyTrend, fetchCategories, createTransaction, deleteTransaction } from './api'
import SummaryCards from './components/SummaryCards'
import TrendChart from './components/TrendChart'
import CategoryBreakdown from './components/CategoryBreakdown'
import TransactionList from './components/TransactionList'
import AddTransactionModal from './components/AddTransactionModal'

export default function App() {
  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState({})
  const [showModal, setShowModal] = useState(false)

  async function loadAll() {
    const [s, t, tx, c] = await Promise.all([
      fetchSummary(), fetchMonthlyTrend(), fetchTransactions({ limit: 15 }), fetchCategories(),
    ])
    setSummary(s)
    setTrend(t)
    setTransactions(tx)
    setCategories(c)
  }

  useEffect(() => { loadAll() }, [])

  async function handleCreate(tx) {
    await createTransaction(tx)
    loadAll()
  }

  async function handleDelete(id) {
    await deleteTransaction(id)
    loadAll()
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src="/logo.png" alt="SPVM3 Logo" className="app-logo" />
          <div className="brand-text">
            <h1>SPVM3 Money Spend</h1>
            <span className="brand-subtitle">SPVM³ TECH SOLUTION</span>
          </div>
        </div>
        <button className="primary" onClick={() => setShowModal(true)}>+ Add Transaction</button>
      </header>

      <SummaryCards summary={summary} />

      <div className="charts-row">
        <TrendChart data={trend} />
        <CategoryBreakdown data={summary?.by_category} />
      </div>

      <TransactionList transactions={transactions} onDelete={handleDelete} />

      {showModal && (
        <AddTransactionModal categories={categories} onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}
