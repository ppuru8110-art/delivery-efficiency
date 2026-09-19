import React from 'react';
import { Rocket, Database, RefreshCw, Trash2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Header({ onResetDemo, onClearAll }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between safe-area-top">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 leading-none">ロケットアナライザー</h1>
          <p className="text-[10px] text-slate-400 mt-0.5">RocketNow 配達パートナー専用</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* DBステータス表示バッジ */}
        <div 
          className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full border ${
            isSupabaseConfigured 
              ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400' 
              : 'bg-amber-950/60 border-amber-700/50 text-amber-400'
          }`}
          title={isSupabaseConfigured ? 'Supabase クラウド同期中' : 'LocalStorage ローカル保存中'}
        >
          <Database className="w-3 h-3" />
          <span className="font-medium">{isSupabaseConfigured ? 'Supabase' : 'Local'}</span>
        </div>

        {/* デモデータ復元ボタン */}
        <button
          onClick={onResetDemo}
          title="デモデータを読み込む"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* データクリアボタン */}
        <button
          onClick={onClearAll}
          title="データを全削除"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
