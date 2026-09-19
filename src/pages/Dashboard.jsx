import React, { useState, useMemo } from 'react';
import { DollarSign, Package, Navigation, Clock, Download, Edit3, TrendingUp, Sun, FileSpreadsheet, Calculator } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import MetricCard from '../components/MetricCard';
import EditLogModal from '../components/EditLogModal';
import { exportLogsToCSV, exportLogsToJSON } from '../lib/exportUtils';

export default function Dashboard({ logs, onUpdateLog, onDeleteLog }) {
  const [selectedLogForEdit, setSelectedLogForEdit] = useState(null);

  // 全体核心メトリクス計算
  const metrics = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { totalEarnings: 0, totalHours: 0, totalCount: 0, totalDist: 0, avgHourly: 0, avgPerCount: 0, avgPerKm: 0, avgMinPerOrder: 0 };
    }

    const totalEarnings = logs.reduce((sum, item) => sum + (Number(item.total_earnings) || 0), 0);
    const totalHours = logs.reduce((sum, item) => sum + (Number(item.hours_worked) || 0), 0);
    const totalCount = logs.reduce((sum, item) => sum + (Number(item.delivery_count) || 0), 0);
    const totalDist = logs.reduce((sum, item) => sum + (Number(item.distance_km) || 0), 0);

    const avgHourly = totalHours > 0 ? Math.round(totalEarnings / totalHours) : 0;
    const avgPerCount = totalCount > 0 ? Math.round(totalEarnings / totalCount) : 0;
    const avgPerKm = totalDist > 0 ? Math.round(totalEarnings / totalDist) : 0;
    const avgMinPerOrder = totalCount > 0 ? Math.round((totalHours * 60) / totalCount) : 0;

    return { totalEarnings, totalHours, totalCount, totalDist, avgHourly, avgPerCount, avgPerKm, avgMinPerOrder };
  }, [logs]);

  // 曜日別集計データ生成 (月〜日)
  const dayOfWeekChartData = useMemo(() => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const buckets = days.map(day => ({ day, totalEarnings: 0, totalHours: 0, avgHourly: 0 }));

    logs.forEach(log => {
      if (!log.work_date) return;
      const d = new Date(log.work_date);
      const dayIdx = d.getDay();
      const hours = Number(log.hours_worked) || 0;
      const earnings = Number(log.total_earnings) || 0;

      buckets[dayIdx].totalHours += hours;
      buckets[dayIdx].totalEarnings += earnings;
    });

    return buckets.map(b => ({
      name: b.day,
      時給: b.totalHours > 0 ? Math.round(b.totalEarnings / b.totalHours) : 0
    }));
  }, [logs]);

  // 天候別集計データ
  const weatherChartData = useMemo(() => {
    const map = { '晴れ': { earnings: 0, hours: 0 }, '曇り': { earnings: 0, hours: 0 }, '雨': { earnings: 0, hours: 0 }, '大雨': { earnings: 0, hours: 0 } };

    logs.forEach(log => {
      const w = log.weather || '晴れ';
      if (!map[w]) map[w] = { earnings: 0, hours: 0 };
      map[w].earnings += Number(log.total_earnings) || 0;
      map[w].hours += Number(log.hours_worked) || 0;
    });

    return Object.keys(map).map(w => ({
      name: w,
      時給: map[w].hours > 0 ? Math.round(map[w].earnings / map[w].hours) : 0
    }));
  }, [logs]);

  // 確定申告・経費試算 (ガソリン代・減価償却目安: 1kmあたり25円で計算)
  const estimatedExpense = Math.round(metrics.totalDist * 25);
  const estimatedTaxableIncome = Math.max(0, metrics.totalEarnings - estimatedExpense);

  return (
    <div className="space-y-5 pb-20 max-w-md mx-auto">
      {/* 画面ヘッダー ＆ CSVエクスポートボタン */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">📊 稼ぎアナライザー</h2>
          <p className="text-xs text-slate-400">リアルタイム時給 ＆ 効率分析</p>
        </div>
        
        <div className="flex space-x-1.5">
          <button
            onClick={() => exportLogsToCSV(logs)}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-700 transition-colors"
            title="CSV出力"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* 核心メトリクスカード 2×2 グリッド */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="平均時給"
          value={metrics.avgHourly}
          unit="円/h"
          icon={TrendingUp}
          color="rose"
          subtext={`累計売上: ¥${metrics.totalEarnings.toLocaleString()}`}
        />
        <MetricCard
          title="件単価"
          value={metrics.avgPerCount}
          unit="円/件"
          icon={Package}
          color="amber"
          subtext={`累計件数: ${metrics.totalCount}件`}
        />
        <MetricCard
          title="km単価"
          value={metrics.avgPerKm}
          unit="円/km"
          icon={Navigation}
          color="emerald"
          subtext={`累計距離: ${metrics.totalDist}km`}
        />
        <MetricCard
          title="平均所要時間"
          value={metrics.avgMinPerOrder}
          unit="分/件"
          icon={Clock}
          color="sky"
          subtext={`累計稼働: ${metrics.totalHours}時間`}
        />
      </div>

      {/* 曜日別平均時給 グラフ */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">📅 曜日別 平均時給（円/h）</span>
          <span className="text-[10px] text-slate-500">高効率な曜日を可視化</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayOfWeekChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`¥${value.toLocaleString()}/h`, '平均時給']}
              />
              <Bar dataKey="時給" radius={[6, 6, 0, 0]}>
                {dayOfWeekChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.時給 > metrics.avgHourly ? '#f43f5e' : '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 天候別平均時給 グラフ */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">☔ 天候別 平均時給比較</span>
          <span className="text-[10px] text-slate-500">雨インセンティブの効果</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weatherChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`¥${value.toLocaleString()}/h`, '平均時給']}
              />
              <Bar dataKey="時給" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 確定申告 経費概算カード */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
          <Calculator className="w-4 h-4" />
          <span>🧾 確定申告・経費補助試算</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">概算経費 (ガソリン・減価償却)</span>
            <span className="text-sm font-bold text-emerald-400">¥{estimatedExpense.toLocaleString()}</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">※25円/km での推計計算</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">概算所得 (売上 - 経費)</span>
            <span className="text-sm font-bold text-slate-100">¥{estimatedTaxableIncome.toLocaleString()}</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">課税対象額目安</span>
          </div>
        </div>
      </div>

      {/* 日報履歴一覧 */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">📋 直近の日報ログ (タップで編集)</span>
          <span className="text-[10px] text-slate-500">{logs.length}件</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {logs.map((log) => {
            const h = Number(log.hours_worked) || 1;
            const earn = Number(log.total_earnings) || 0;
            const hourly = Math.round(earn / h);

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLogForEdit(log)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">{log.work_date}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                      {log.weather || '晴れ'}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.primary_area}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {log.hours_worked}時間 / {log.delivery_count}件 / {log.distance_km}km
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-rose-400">¥{earn.toLocaleString()}</span>
                  <div className="text-[10px] text-slate-400">時給 ¥{hourly.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 編集モーダル */}
      <EditLogModal
        log={selectedLogForEdit}
        isOpen={Boolean(selectedLogForEdit)}
        onClose={() => setSelectedLogForEdit(null)}
        onSave={onUpdateLog}
        onDelete={onDeleteLog}
      />
    </div>
  );
}
