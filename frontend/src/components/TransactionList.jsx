import { useState } from 'react'
import {
  Search, ArrowUpRight, ArrowDownRight, Edit2, Trash2, 
  Download, Filter, ArrowUpDown, CreditCard
} from 'lucide-react'

export default function TransactionList({
  transactions,
  categories,
  onDelete,
  onEdit,
  onExportCSV,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const [limit, setLimit] = useState(15)

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const allCategoryOptions = [
    ...(categories?.income || []),
    ...(categories?.expense || [])
  ]
  const uniqueCategories = Array.from(new Set(allCategoryOptions))

  const displayed = transactions ? transactions.slice(0, limit) : []

  return (
    <div className="transaction-list-card">
      <div className="list-header">
        <div className="list-title">
          <CreditCard size={18} className="icon-title" />
          <h3>Transaction History</h3>
          <span className="count-pill">{transactions?.length || 0} Records</span>
        </div>

        <div className="header-actions">
          <button className="export-btn" onClick={onExportCSV} title="Export CSV">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="filter-controls">
          <div className="select-wrapper">
            <Filter size={14} className="filter-icon" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            className="sort-btn"
            onClick={() => handleSortToggle('date')}
            title="Toggle Date Sort"
          >
            <ArrowUpDown size={14} /> Date ({sortOrder.toUpperCase()})
          </button>
        </div>
      </div>

      {/* List Body */}
      {!transactions || transactions.length === 0 ? (
        <div className="empty-transactions">
          <p>No transactions found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="tx-table-container">
          <div className="tx-rows">
            {displayed.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>

                <div className="tx-info">
                  <span className="tx-desc">{tx.description || tx.category}</span>
                  <div className="tx-meta">
                    <span className="tx-category-badge">{tx.category}</span>
                    <span className="dot">•</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                </div>

                <div className="tx-right">
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                  <div className="tx-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(tx)}
                      title="Edit Transaction"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(tx.id)}
                      title="Delete Transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length > limit && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={() => setLimit((prev) => prev + 15)}>
                Load More Transactions ({transactions.length - limit} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
