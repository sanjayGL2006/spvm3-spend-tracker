import { useState } from 'react'
import { Target, AlertTriangle, CheckCircle, Edit2, Check } from 'lucide-react'

export default function BudgetTracker({ budgets, onUpdateBudget }) {
  const [editingCategory, setEditingCategory] = useState(null)
  const [newLimit, setNewLimit] = useState('')

  if (!budgets || !budgets.length) return null

  const handleStartEdit = (item) => {
    setEditingCategory(item.category)
    setNewLimit(item.limit)
  }

  const handleSaveEdit = (category) => {
    if (newLimit !== '' && !isNaN(newLimit)) {
      onUpdateBudget(category, parseFloat(newLimit))
    }
    setEditingCategory(null)
  }

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div className="budget-title">
          <Target size={18} className="icon-title" />
          <h3>Category Budgets & Monthly Goals</h3>
        </div>
        <span className="budget-subtitle">Track spend caps vs actuals</span>
      </div>

      <div className="budget-list">
        {budgets.map((b) => {
          const isExceeded = b.spent > b.limit
          const isWarning = !isExceeded && b.percentage >= 80
          const progressWidth = Math.min(b.percentage, 100)

          return (
            <div key={b.category} className="budget-item">
              <div className="budget-item-header">
                <div className="budget-category-info">
                  <span className="cat-name">{b.category}</span>
                  {isExceeded && (
                    <span className="status-tag red">
                      <AlertTriangle size={12} /> Over Limit
                    </span>
                  )}
                  {isWarning && (
                    <span className="status-tag amber">
                      <AlertTriangle size={12} /> 80%+ Used
                    </span>
                  )}
                  {!isExceeded && !isWarning && (
                    <span className="status-tag green">
                      <CheckCircle size={12} /> On Track
                    </span>
                  )}
                </div>

                <div className="budget-amounts">
                  <span className="spent-text">{fmt(b.spent)}</span>
                  <span className="divider">/</span>
                  {editingCategory === b.category ? (
                    <div className="edit-limit-inline">
                      <input
                        type="number"
                        className="inline-input"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="inline-save-btn"
                        onClick={() => handleSaveEdit(b.category)}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className="limit-text clickable"
                      onClick={() => handleStartEdit(b)}
                      title="Click to edit limit"
                    >
                      {fmt(b.limit)} <Edit2 size={12} className="edit-icon" />
                    </span>
                  )}
                </div>
              </div>

              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${
                    isExceeded ? 'red' : isWarning ? 'amber' : 'purple'
                  }`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>

              <div className="budget-item-footer">
                <span className="percentage-text">{b.percentage}% spent</span>
                <span className="remaining-text">
                  {isExceeded
                    ? `${fmt(b.spent - b.limit)} over budget`
                    : `${fmt(b.limit - b.spent)} remaining`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
