import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  delta?: number
  icon: React.ReactNode
  iconBg?: string
}

export function KPICard({ title, value, delta, icon, iconBg = 'bg-blue-50' }: KPICardProps) {
  const positive = delta !== undefined && delta >= 0
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {delta !== undefined && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{Math.abs(delta)}% vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
