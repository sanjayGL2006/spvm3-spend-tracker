export default function TransactionList({ transactions, onDelete }) {
  return (
    <div className="transaction-list">
      <h3>Recent Transactions</h3>
      {transactions.map((tx) => (
        <div key={tx.id} className="tx-row">
          <div className={`tx-icon ${tx.type}`}>{tx.type === 'income' ? '↑' : '↓'}</div>
          <div className="tx-info">
            <span className="tx-desc">{tx.description || tx.category}</span>
            <span className="tx-meta">{tx.category} · {tx.date}</span>
          </div>
          <span className={`tx-amount ${tx.type}`}>
            {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <button className="tx-delete" onClick={() => onDelete(tx.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
