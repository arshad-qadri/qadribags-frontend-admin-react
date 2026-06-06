import { TrendingUp } from 'lucide-react'

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

function StatCard({ label, value, change, icon: Icon, tone = 'emerald' }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 break-words text-lg leading-tight font-bold text-slate-950">
            {value}
          </p>
        </div>
        <div className={`shrink-0 rounded-lg p-3 ${toneClasses[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-4 flex min-w-0 items-start gap-1 text-sm font-semibold text-emerald-700">
        <TrendingUp size={15} className="mt-0.5 shrink-0" />
        <p className="min-w-0 break-words">{change}</p>
      </div>
    </div>
  )
}

export default StatCard
