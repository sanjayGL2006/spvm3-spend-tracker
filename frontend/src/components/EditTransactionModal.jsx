import { useState } from 'react'
import { X, Save } from 'lucide-react'

export default function EditTransactionModal({ transaction, categories, onClose, onUpdate }) {
  const [type, setType] = useState(transaction.type)
  const [category, setCategory] = useState(transaction.category)
  const [amount, setAmount] = useState(transaction.amount)
  const [description, setDescription] = useState(transaction.description || '')
  const [date, setDate] = useState(transaction.date || '')

  function handleTypeChange(newType) {
    setType(newType)
    if (categories[newType] && !categories[newType].includes(category)) {
      setCategory(categories[newType][0] || '')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return
    onUpdate(transaction.id, {
      type,
      category,
      amount: parseFloat(amount),
      description,
      date: date || undefined,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal tx-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>Edit Transaction</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="type-toggle">
          <button
            type="button"
            className={type === 'expense' ? 'active expense' : ''}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? 'active income' : ''}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories[type]?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            placeholder="Note or description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
