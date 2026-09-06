import { useState } from 'react'

export default function AddTransactionModal({ categories, onClose, onCreate }) {
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState(categories.expense?.[0] || '')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  function handleTypeChange(newType) {
    setType(newType)
    setCategory(categories[newType]?.[0] || '')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    onCreate({ type, category, amount: parseFloat(amount), description })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal tx-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Add Transaction</h3>
        <div className="type-toggle">
          <button type="button" className={type === 'expense' ? 'active' : ''} onClick={() => handleTypeChange('expense')}>Expense</button>
          <button type="button" className={type === 'income' ? 'active' : ''} onClick={() => handleTypeChange('income')}>Income</button>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories[type]?.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  )
}
