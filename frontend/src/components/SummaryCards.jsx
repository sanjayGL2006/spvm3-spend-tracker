import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank } from 'lucide-react'

export default function SummaryCards({ summary }) {
  if (!summary) return null

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  const savingsRate = summary.savings_rate ?? 0

  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <div className="card-header">
          <span className="card-title">Total Income</span>
          <div className="icon-wrapper income">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <strong className="card-amount">{fmt(summary.total_income)}</strong>
        <div className="card-footer">
          <span className="badge green">Earned</span>
        </div>
      </div>

      <div className="summary-card expense">
        <div className="card-header">
          <span className="card-title">Total Expenses</span>
          <div className="icon-wrapper expense">
            <ArrowDownRight size={20} />
          </div>
        </div>
        <strong className="card-amount">{fmt(summary.total_expense)}</strong>
        <div className="card-footer">
          <span className="badge red">Spent</span>
        </div>
      </div>

      <div className={`summary-card balance ${summary.balance < 0 ? 'negative' : ''}`}>
        <div className="card-header">
          <span className="card-title">Net Balance</span>
          <div className="icon-wrapper balance">
            <Wallet size={20} />
          </div>
        </div>
        <strong className="card-amount">{fmt(summary.balance)}</strong>
        <div className="card-footer">
          <span className={`badge ${summary.balance >= 0 ? 'purple' : 'red'}`}>
            {summary.balance >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      <div className="summary-card savings">
        <div className="card-header">
          <span className="card-title">Savings Rate</span>
          <div className="icon-wrapper savings">
            <PiggyBank size={20} />
          </div>
        </div>
        <strong className="card-amount">{savingsRate}%</strong>
        <div className="card-footer">
          <span className={`badge ${savingsRate >= 20 ? 'green' : 'amber'}`}>
            {savingsRate >= 20 ? 'Healthy' : 'Needs Attention'}
          </span>
        </div>
      </div>
    </div>
  )
}
