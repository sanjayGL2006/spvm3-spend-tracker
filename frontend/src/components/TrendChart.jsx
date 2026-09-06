import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

export default function TrendChart({ data }) {
  if (!data?.length) return null
  return (
    <div className="chart-card">
      <h3>Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis dataKey="month" stroke="#8b8fa3" fontSize={12} />
          <YAxis stroke="#8b8fa3" fontSize={12} />
          <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #33334a', borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
