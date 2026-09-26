import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'

const COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', 
  '#3b82f6', '#ef4444', '#06b6d4', '#84cc16', '#a855f7'
]

export default function CategoryBreakdown({ data }) {
  if (!data || !Object.keys(data).length) {
    return (
      <div className="chart-card empty">
        <div className="chart-header">
          <div className="chart-title">
            <PieIcon size={18} className="icon-title" />
            <h3>Spending by Category</h3>
          </div>
        </div>
        <p className="empty-text">No category spending data yet.</p>
      </div>
    )
  }

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }))
  const totalSpend = chartData.reduce((acc, curr) => acc + curr.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const percentage = totalSpend > 0 ? ((item.value / totalSpend) * 100).toFixed(1) : 0
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label" style={{ color: item.payload.fill }}>
            {item.name}
          </p>
          <p className="tooltip-value">
            ₹{Number(item.value).toLocaleString('en-IN')} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <PieIcon size={18} className="icon-title" />
          <h3>Spending by Category</h3>
        </div>
        <span className="total-badge">Total: ₹{totalSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={92}
            paddingAngle={3}
            stroke="transparent"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '0.78rem', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
