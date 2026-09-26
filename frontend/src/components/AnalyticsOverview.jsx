import { Zap, Calendar, Award, Receipt, Layers } from 'lucide-react'

export default function AnalyticsOverview({ analytics }) {
  if (!analytics) return null

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  return (
    <div className="analytics-grid">
      <div className="analytics-card">
        <div className="analytics-icon font-purple">
          <Calendar size={18} />
        </div>
        <div className="analytics-info">
          <span className="analytics-label">Avg. Daily Expense</span>
          <strong className="analytics-value">{fmt(analytics.avg_daily_expense)}</strong>
          <span className="analytics-sub">Over last {analytics.day_span} days</span>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon font-amber">
          <Award size={18} />
        </div>
        <div className="analytics-info">
          <span className="analytics-label">Top Spending Category</span>
          <strong className="analytics-value">
            {analytics.top_spending_category?.category || 'N/A'}
          </strong>
          <span className="analytics-sub">
            {analytics.top_spending_category ? fmt(analytics.top_spending_category.amount) : 'No expenses'}
          </span>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon font-red">
          <Zap size={18} />
        </div>
        <div className="analytics-info">
          <span className="analytics-label">Largest Expense</span>
          <strong className="analytics-value">
            {analytics.largest_expense ? fmt(analytics.largest_expense.amount) : 'N/A'}
          </strong>
          <span className="analytics-sub">
            {analytics.largest_expense ? analytics.largest_expense.description || analytics.largest_expense.category : 'No transactions'}
          </span>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-icon font-green">
          <Receipt size={18} />
        </div>
        <div className="analytics-info">
          <span className="analytics-label">Total Transactions</span>
          <strong className="analytics-value">{analytics.total_transactions || 0}</strong>
          <span className="analytics-sub">
            {analytics.expense_count || 0} Expenses · {analytics.income_count || 0} Incomes
          </span>
        </div>
      </div>
    </div>
  )
}
