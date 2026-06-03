import { TrendingUp } from 'lucide-react'

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

function StatCard({ label, value, change, icon: Icon, tone = 'emerald' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${toneClasses[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        <TrendingUp size={15} />
        {change}
      </p>
    </div>
  )
}

export default StatCard
