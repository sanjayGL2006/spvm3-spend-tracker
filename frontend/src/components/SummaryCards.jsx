export default function SummaryCards({ summary }) {
  if (!summary) return null
  const fmt = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <span>Total Income</span>
        <strong>{fmt(summary.total_income)}</strong>
      </div>
      <div className="summary-card expense">
        <span>Total Expenses</span>
        <strong>{fmt(summary.total_expense)}</strong>
      </div>
      <div className={`summary-card balance ${summary.balance < 0 ? 'negative' : ''}`}>
        <span>Balance</span>
        <strong>{fmt(summary.balance)}</strong>
      </div>
    </div>
  )
}
