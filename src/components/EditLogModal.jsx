import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, DollarSign, Package, Navigation, CloudRain } from 'lucide-react';

export default function EditLogModal({ log, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    work_date: '',
    start_time: '',
    end_time: '',
    hours_worked: 0,
    total_earnings: 0,
    delivery_count: 0,
    distance_km: 0,
    weather: '晴れ',
    primary_area: '',
    notes: ''
  });

  useEffect(() => {
    if (log) {
      setFormData({
        work_date: log.work_date || '',
        start_time: log.start_time || '',
        end_time: log.end_time || '',
        hours_worked: log.hours_worked || 0,
        total_earnings: log.total_earnings || 0,
        delivery_count: log.delivery_count || 0,
        distance_km: log.distance_km || 0,
        weather: log.weather || '晴れ',
        primary_area: log.primary_area || '',
        notes: log.notes || ''
      });
    }
  }, [log]);

  if (!isOpen || !log) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours_worked' || name === 'total_earnings' || name === 'delivery_count' || name === 'distance_km'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(log.id, formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('この日報データを削除してよろしいですか？')) {
      onDelete(log.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 className="text-base font-bold text-slate-100">日報データの編集</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">日付</label>
              <input
                type="date"
                name="work_date"
                value={formData.work_date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">稼働時間(h)</label>
              <input
                type="number"
                step="0.5"
                name="hours_worked"
                value={formData.hours_worked}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">総売上 (円)</label>
              <input
                type="number"
                name="total_earnings"
                value={formData.total_earnings}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-rose-400 font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">配達件数 (件)</label>
              <input
                type="number"
                name="delivery_count"
                value={formData.delivery_count}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">走行距離 (km)</label>
              <input
                type="number"
                step="0.1"
                name="distance_km"
                value={formData.distance_km}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">天候</label>
              <select
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
              >
                <option value="晴れ">晴れ ☀️</option>
                <option value="曇り">曇り ☁️</option>
                <option value="雨">雨 ☔</option>
                <option value="大雨">大雨 ⛈️</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">主要稼働エリア</label>
            <input
              type="text"
              name="primary_area"
              value={formData.primary_area}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">メモ</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-950/80 border border-rose-800/50 text-rose-400 text-xs font-semibold hover:bg-rose-900 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>削除</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
