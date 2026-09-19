import React from 'react';

export default function MetricCard({ title, value, unit, icon: Icon, color = 'rose', subtext }) {
  const colorMap = {
    rose: {
      bg: 'bg-rose-950/30',
      border: 'border-rose-800/40',
      iconBg: 'bg-rose-500/20 text-rose-400',
      value: 'text-rose-400',
    },
    amber: {
      bg: 'bg-amber-950/30',
      border: 'border-amber-800/40',
      iconBg: 'bg-amber-500/20 text-amber-400',
      value: 'text-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-800/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      value: 'text-emerald-400',
    },
    sky: {
      bg: 'bg-sky-950/30',
      border: 'border-sky-800/40',
      iconBg: 'bg-sky-500/20 text-sky-400',
      value: 'text-sky-400',
    },
  };

  const style = colorMap[color] || colorMap.rose;

  return (
    <div className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} backdrop-blur-sm flex flex-col justify-between shadow-sm`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400 font-medium">{title}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1">
        <span className={`text-xl font-bold tracking-tight ${style.value}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>

      {subtext && (
        <span className="text-[10px] text-slate-500 mt-1 truncate">{subtext}</span>
      )}
    </div>
  );
}
