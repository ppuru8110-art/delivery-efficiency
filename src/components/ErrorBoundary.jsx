import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetCache = () => {
    if (window.confirm('ローカルキャッシュに不整合がある可能性があります。キャッシュをクリアして再読込しますか？（※クラウドに同期済みのデータは復元されます）')) {
      try {
        localStorage.removeItem('rocket_analyzer_delivery_logs');
      } catch (e) {
        console.error('Failed to clear cache:', e);
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                予期せぬエラーが発生しました
              </h1>
              <p className="text-sm text-slate-400">
                アプリケーションの実行中に問題が発生しました。再読込をお試しください。
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-[0.98] transition"
              >
                <RefreshCw className="w-4 h-4" />
                アプリを再読込する
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 border border-slate-700 active:scale-[0.98] transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                端末キャッシュを初期化して復旧
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 overflow-x-auto">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-400 select-none pb-1">
                  エラー詳細情報
                </summary>
                <p className="text-rose-400 mt-2">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}