import React from 'react';
import { LayoutDashboard, PlusCircle, MapPin, Zap, Bookmark } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'entry', label: '日報登録', icon: PlusCircle, highlight: true },
    { id: 'map', label: 'エリアマップ', icon: MapPin },
    { id: 'offer', label: 'オファー判定', icon: Zap, disabled: true },
    { id: 'notes', label: '攻略メモ', icon: Bookmark, disabled: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setActiveTab(item.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isActive
                  ? 'text-rose-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.highlight ? (
                  <div className={`p-2 rounded-full mb-0.5 ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
                )}
                {isDisabled && (
                  <span className="absolute -top-1 -right-2 text-[9px] bg-slate-800 text-slate-400 px-1 rounded">
                    近々
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
