import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const DEFAULT_COLORS = [
  '#14532d',
  '#2563eb',
  '#22c55e',
  '#60a5fa',
  '#86efac',
  '#1d4ed8',
]

export default function DonutChart({
  data,
  nameKey,
  valueKey,
  totalLabel,
  total,
  colors = DEFAULT_COLORS,
}) {
  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey])
  const resolvedTotal =
    total ?? sorted.reduce((sum, item) => sum + item[valueKey], 0)

  return (
    <div>
      <div className="relative h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
            >
              {sorted.map((entry, index) => (
                <Cell
                  key={entry[nameKey]}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-primary">{resolvedTotal}</p>
          <p className="text-xs text-neutral-500">{totalLabel}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {sorted.map((item, index) => {
          const percent = resolvedTotal
            ? Math.round((item[valueKey] / resolvedTotal) * 100)
            : 0
          return (
            <li
              key={item[nameKey]}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-neutral-700">{item[nameKey]}</span>
              </span>
              <span className="font-medium text-neutral-600">
                {item[valueKey]} ({percent}%)
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
