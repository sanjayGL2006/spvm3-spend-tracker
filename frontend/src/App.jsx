import { useEffect, useState, useCallback } from 'react'
import {
  fetchTransactions, fetchSummary, fetchMonthlyTrend, fetchCategories,
  fetchAnalytics, fetchBudgets, setBudget, createTransaction,
  updateTransaction, deleteTransaction, downloadCSV, resetData
} from './api'
import SummaryCards from './components/SummaryCards'
import TrendChart from './components/TrendChart'
import CategoryBreakdown from './components/CategoryBreakdown'
import TransactionList from './components/TransactionList'
import AddTransactionModal from './components/AddTransactionModal'
import EditTransactionModal from './components/EditTransactionModal'
import BudgetTracker from './components/BudgetTracker'
import AnalyticsOverview from './components/AnalyticsOverview'
import { Plus, RotateCcw, LayoutDashboard, ListFilter, Target, Layers } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'transactions' | 'budget'
  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState({})
  const [analytics, setAnalytics] = useState(null)
  const [budgets, setBudgets] = useState([])
  
  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const loadData = useCallback(async () => {
    try {
      const [s, t, c, a, b] = await Promise.all([
        fetchSummary(),
        fetchMonthlyTrend(),
        fetchCategories(),
        fetchAnalytics(),
        fetchBudgets(),
      ])
      setSummary(s)
      setTrend(t)
      setCategories(c)
      setAnalytics(a)
      setBudgets(b)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    }
  }, [])

  const loadFilteredTransactions = useCallback(async () => {
    try {
      const res = await fetchTransactions({
        search: searchQuery,
        type: typeFilter,
        category: categoryFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit: 200,
      })
      setTransactions(res.items || [])
    } catch (err) {
      console.error('Error loading transactions:', err)
    }
  }, [searchQuery, typeFilter, categoryFilter, sortBy, sortOrder])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    loadFilteredTransactions()
  }, [loadFilteredTransactions])

  async function handleCreate(tx) {
    try {
      await createTransaction(tx)
      showToast('Transaction added successfully!')
      loadData()
      loadFilteredTransactions()
    } catch (err) {
      showToast('Failed to add transaction')
    }
  }

  async function handleUpdate(id, tx) {
    try {
      await updateTransaction(id, tx)
      showToast('Transaction updated successfully!')
      loadData()
      loadFilteredTransactions()
    } catch (err) {
      showToast('Failed to update transaction')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    try {
      await deleteTransaction(id)
      showToast('Transaction deleted')
      loadData()
      loadFilteredTransactions()
    } catch (err) {
      showToast('Failed to delete transaction')
    }
  }

  async function handleUpdateBudget(category, limit) {
    try {
      await setBudget(category, limit)
      showToast(`Budget limit for ${category} updated to ₹${limit}`)
      const b = await fetchBudgets()
      setBudgets(b)
    } catch (err) {
      showToast('Failed to update budget')
    }
  }

  async function handleResetData() {
    if (!window.confirm('Reset all transaction data to standard seed templates?')) return
    try {
      await resetData()
      showToast('Sample data reset successfully!')
      loadData()
      loadFilteredTransactions()
    } catch (err) {
      showToast('Failed to reset data')
    }
  }

  async function handleExportCSV() {
    try {
      await downloadCSV()
      showToast('CSV export started!')
    } catch (err) {
      showToast('Failed to export CSV')
    }
  }

  return (
    <div className="app">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* Header Bar */}
      <header className="app-header">
        <div className="brand">
          <img src="/logo.png" alt="SPVM3 Tech Solution" className="app-logo" />
          <div className="brand-text">
            <div className="brand-heading">
              <h1>SPVM3 Money Spend</h1>
              <span className="brand-tag">v2.0</span>
            </div>
            <span className="brand-subtitle">SPVM³ TECH SOLUTION · Sanjay GL</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <ListFilter size={16} /> History ({summary?.count || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <Target size={16} /> Budgets
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="header-actions-right">
          <button
            className="secondary-action-btn"
            onClick={handleResetData}
            title="Reset to initial sample transactions"
          >
            <RotateCcw size={15} /> Reset Data
          </button>
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      {activeTab === 'dashboard' && (
        <main className="dashboard-view">
          <SummaryCards summary={summary} />
          
          <AnalyticsOverview analytics={analytics} />

          <div className="charts-row">
            <TrendChart data={trend} />
            <CategoryBreakdown data={summary?.by_category} />
          </div>

          <div className="bottom-grid">
            <BudgetTracker budgets={budgets} onUpdateBudget={handleUpdateBudget} />
            
            <TransactionList
              transactions={transactions}
              categories={categories}
              onDelete={handleDelete}
              onEdit={(tx) => setEditingTx(tx)}
              onExportCSV={handleExportCSV}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </main>
      )}

      {activeTab === 'transactions' && (
        <main className="transactions-view">
          <TransactionList
            transactions={transactions}
            categories={categories}
            onDelete={handleDelete}
            onEdit={(tx) => setEditingTx(tx)}
            onExportCSV={handleExportCSV}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </main>
      )}

      {activeTab === 'budget' && (
        <main className="budget-view">
          <BudgetTracker budgets={budgets} onUpdateBudget={handleUpdateBudget} />
        </main>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddTransactionModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Edit Modal */}
      {editingTx && (
        <EditTransactionModal
          transaction={editingTx}
          categories={categories}
          onClose={() => setEditingTx(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
