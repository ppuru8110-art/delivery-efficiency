import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Package, Navigation, CloudRain, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCurrentLocationWeather } from '../lib/weatherApi';

export default function LogEntry({ onSaveLog }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    work_date: todayStr,
    start_time: '11:00',
    end_time: '15:00',
    hours_worked: 4.0,
    total_earnings: '',
    delivery_count: '',
    distance_km: '',
    weather: '晴れ',
    primary_area: '渋谷・恵比寿エリア',
    latitude: 35.6580,
    longitude: 139.7016,
    notes: ''
  });

  const [loadingWeather, setLoadingWeather] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const weatherOptions = [
    { label: '晴れ', icon: '☀️' },
    { label: '曇り', icon: '☁️' },
    { label: '雨', icon: '☔' },
    { label: '大雨', icon: '⛈️' }
  ];

  const areaPresetOptions = [
    '渋谷・恵比寿エリア',
    '新宿・代々木エリア',
    '池袋・目白エリア',
    '品川・五反田エリア',
    '銀座・新橋エリア',
    '横浜中央エリア'
  ];

  const handleFetchWeather = async () => {
    setLoadingWeather(true);
    try {
      const result = await getCurrentLocationWeather();
      setForm(prev => ({
        ...prev,
        weather: result.weather,
        latitude: result.latitude,
        longitude: result.longitude
      }));
    } catch (e) {
      console.warn('Weather fetch error:', e);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleQuickEarnAdd = (amount) => {
    const current = Number(form.total_earnings) || 0;
    setForm(prev => ({ ...prev, total_earnings: current + amount }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.total_earnings || !form.delivery_count || !form.hours_worked) {
      alert('売上、配達件数、稼働時間は必須項目です。');
      return;
    }

    const logItem = {
      ...form,
      hours_worked: Number(form.hours_worked),
      total_earnings: Number(form.total_earnings),
      delivery_count: Number(form.delivery_count),
      distance_km: Number(form.distance_km || 0)
    };

    await onSaveLog(logItem);
    setSuccessMsg('日報を保存しました！');
    setTimeout(() => setSuccessMsg(''), 3000);

    // フォーム初期化
    setForm({
      work_date: todayStr,
      start_time: '11:00',
      end_time: '15:00',
      hours_worked: 4.0,
      total_earnings: '',
      delivery_count: '',
      distance_km: '',
      weather: '晴れ',
      primary_area: form.primary_area,
      latitude: 35.6580,
      longitude: 139.7016,
      notes: ''
    });
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* タイトル */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">📝 本日の日報登録</h2>
          <p className="text-xs text-slate-400">稼働終了時に片手でサクッと入力</p>
        </div>
        {successMsg && (
          <div className="flex items-center space-x-1 text-xs bg-emerald-950 border border-emerald-700 text-emerald-400 px-2.5 py-1 rounded-full animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 日付・時間 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400">
            <Calendar className="w-4 h-4" />
            <span>稼働日時・時間</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">日付</label>
              <input
                type="date"
                value={form.work_date}
                onChange={e => setForm({ ...form, work_date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">稼働時間 (時間)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="4.0"
                value={form.hours_worked}
                onChange={e => setForm({ ...form, hours_worked: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-bold focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 売上・件数・走行距離 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400">
            <DollarSign className="w-4 h-4" />
            <span>成果・実績</span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">総売上 (円)</label>
            <input
              type="number"
              placeholder="例: 9800"
              value={form.total_earnings}
              onChange={e => setForm({ ...form, total_earnings: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg text-rose-400 font-bold focus:outline-none focus:border-rose-500"
              required
            />
            {/* クイックプラスボタン */}
            <div className="flex space-x-2 mt-2">
              {[1000, 3000, 5000, 10000].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickEarnAdd(val)}
                  className="flex-1 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50"
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">配達件数 (件)</label>
              <input
                type="number"
                placeholder="例: 14"
                value={form.delivery_count}
                onChange={e => setForm({ ...form, delivery_count: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-semibold focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">走行距離 (km)</label>
              <input
                type="number"
                step="0.1"
                placeholder="例: 32.5"
                value={form.distance_km}
                onChange={e => setForm({ ...form, distance_km: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-semibold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* 天候・エリア選択 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400">
              <CloudRain className="w-4 h-4" />
              <span>天候 ＆ 主要エリア</span>
            </div>
            {/* 天気自動取得ボタン */}
            <button
              type="button"
              onClick={handleFetchWeather}
              disabled={loadingWeather}
              className="flex items-center space-x-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30 transition-colors"
            >
              <Sparkles className={`w-3 h-3 ${loadingWeather ? 'animate-spin' : ''}`} />
              <span>{loadingWeather ? '取得中...' : '現在地天気を自動取得'}</span>
            </button>
          </div>

          {/* 天気選択ボタン */}
          <div className="grid grid-cols-4 gap-2">
            {weatherOptions.map(w => (
              <button
                type="button"
                key={w.label}
                onClick={() => setForm({ ...form, weather: w.label })}
                className={`py-2.5 rounded-xl border text-center transition-all ${
                  form.weather === w.label
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-lg leading-none mb-1">{w.icon}</div>
                <div className="text-[11px]">{w.label}</div>
              </button>
            ))}
          </div>

          {/* エリア選択 */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">主要稼働エリア</label>
            <select
              value={form.primary_area}
              onChange={e => setForm({ ...form, primary_area: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
            >
              {areaPresetOptions.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 自由メモ */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">自由メモ (任意)</label>
          <textarea
            placeholder="ロケット単価ボーナスあり、特定の店で30分ピック待ち発生 など"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows="2"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500 placeholder:text-slate-600"
          ></textarea>
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>日報を保存して分析に反映</span>
        </button>
      </form>
    </div>
  );
}
