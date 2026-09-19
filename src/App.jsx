import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import LogEntry from './pages/LogEntry';
import AreaMap from './pages/AreaMap';
import {
  fetchDeliveryLogs,
  saveDeliveryLog,
  updateDeliveryLog,
  deleteDeliveryLog,
  loadDemoLogs,
  clearAllLogs
} from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // データ初期ロード
  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchDeliveryLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // 日報の新規登録
  const handleSaveLog = async (newLogData) => {
    const saved = await saveDeliveryLog(newLogData);
    await loadLogs();
    setActiveTab('dashboard'); // 保存後にダッシュボードへ自動遷移
    return saved;
  };

  // 日報の更新
  const handleUpdateLog = async (id, updatedFields) => {
    await updateDeliveryLog(id, updatedFields);
    await loadLogs();
  };

  // 日報の削除
  const handleDeleteLog = async (id) => {
    await deleteDeliveryLog(id);
    await loadLogs();
  };

  // デモデータ読み込み
  const handleResetDemo = () => {
    const demoData = loadDemoLogs();
    setLogs(demoData);
  };

  // データ全削除
  const handleClearAll = () => {
    if (window.confirm('すべての稼働データをクリアしてよろしいですか？')) {
      clearAllLogs();
      setLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ヘッダー */}
      <Header onResetDemo={handleResetDemo} onClearAll={handleClearAll} />

      {/* メインコンテンツエリア */}
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400">データ読み込み中...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                logs={logs}
                onUpdateLog={handleUpdateLog}
                onDeleteLog={handleDeleteLog}
              />
            )}

            {activeTab === 'entry' && (
              <LogEntry onSaveLog={handleSaveLog} />
            )}

            {activeTab === 'map' && (
              <AreaMap logs={logs} />
            )}
          </>
        )}
      </main>

      {/* iPhoneボトムナビゲーション */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
