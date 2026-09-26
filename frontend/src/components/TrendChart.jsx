import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, BarChart2, Activity } from 'lucide-react'

export default function TrendChart({ data }) {
  const [chartType, setChartType] = useState('area') // 'area' | 'bar'

  if (!data || !data.length) {
    return (
      <div className="chart-card empty">
        <h3>Income vs Expenses Trend</h3>
        <p className="empty-text">No trend data available yet.</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: '4px 0', fontSize: '0.85rem' }}>
              <span className="tooltip-dot" style={{ background: entry.color }}></span>
              {entry.name}: <strong>₹{Number(entry.value).toLocaleString('en-IN')}</strong>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <Activity size={18} className="icon-title" />
          <h3>Income vs Expenses</h3>
        </div>
        <div className="chart-toggle">
          <button
            className={`toggle-btn ${chartType === 'area' ? 'active' : ''}`}
            onClick={() => setChartType('area')}
            title="Area Trend View"
          >
            <TrendingUp size={15} /> Area
          </button>
          <button
            className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            title="Bar Chart View"
          >
            <BarChart2 size={15} /> Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252538" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#4ade80"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f87171"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              name="Expense"
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252538" vertical={false} />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
