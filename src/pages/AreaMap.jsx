import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, TrendingUp, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function AreaMap({ logs }) {
  const [selectedPin, setSelectedPin] = useState(null);

  // デフォルトの中心位置（東京）
  const defaultCenter = { lat: 35.6812, lng: 139.7671 };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* 画面ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">🗺️ エリアマップ</h2>
          <p className="text-xs text-slate-400">稼働実績ピン ＆ 高効率エリア視覚化</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-rose-400 font-bold">{logs.length} 件のピン</span>
        </div>
      </div>

      {/* Google Maps 本体またはスマートフォールバック */}
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={12}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId="rocket_analyzer_map"
              className="w-full h-full"
            >
              {logs.map((log) => {
                const lat = log.latitude || 35.6580;
                const lng = log.longitude || 139.7016;
                const hourly = Math.round((log.total_earnings || 0) / (log.hours_worked || 1));

                return (
                  <AdvancedMarker
                    key={log.id}
                    position={{ lat, lng }}
                    onClick={() => setSelectedPin(log)}
                  >
                    <Pin
                      background={hourly > 2500 ? '#f43f5e' : '#eab308'}
                      borderColor={'#0f172a'}
                      glyphColor={'#ffffff'}
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedPin && (
                <InfoWindow
                  position={{ lat: selectedPin.latitude || 35.6580, lng: selectedPin.longitude || 139.7016 }}
                  onCloseClick={() => setSelectedPin(null)}
                >
                  <div className="p-2 text-slate-900 max-w-xs">
                    <div className="font-bold text-xs">{selectedPin.primary_area || '稼働エリア'}</div>
                    <div className="text-[11px] text-slate-600">{selectedPin.work_date} ({selectedPin.weather})</div>
                    <div className="mt-1 text-sm font-bold text-rose-600">
                      時給: ¥{Math.round(selectedPin.total_earnings / selectedPin.hours_worked).toLocaleString()}/h
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* API Key 未設定時のスマートプレースホルダー表示 */
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 flex flex-col justify-between">
            {/* SVGスタイリッシュ背景 */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f43f5e" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-950/80 border border-amber-800/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Google Maps デモ表示モード</span>
              </div>
              <span className="text-[10px] text-slate-500">Key未設定フォールバック</span>
            </div>

            {/* モック ピンカード */ }
            <div className="relative z-10 space-y-2 my-auto">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-200">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>高効率エリアスポット表示</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-semibold">時給最高 3,200円/h</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  登録された日報データ（緯度・経度）に基づき、最高時給の稼働エリア（渋谷・新宿等）をマップ上にピン表示します。
                </p>
              </div>
            </div>

            <div className="relative z-10 text-center">
              <p className="text-[10px] text-slate-500">
                ※ `.env` ファイルに `VITE_GOOGLE_MAPS_API_KEY` を設定すると、実地図が読み込まれます。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* エリア別パフォーマンスリスト */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">📍 エリア別 稼働パフォーマンス</span>
          <span className="text-[10px] text-slate-500">主要エリア集計</span>
        </div>

        <div className="space-y-2">
          {Array.from(new Set(logs.map(l => l.primary_area || 'その他'))).map((area) => {
            const areaLogs = logs.filter(l => (l.primary_area || 'その他') === area);
            const totalEarn = areaLogs.reduce((s, l) => s + (Number(l.total_earnings) || 0), 0);
            const totalHrs = areaLogs.reduce((s, l) => s + (Number(l.hours_worked) || 0), 0);
            const avgHourly = totalHrs > 0 ? Math.round(totalEarn / totalHrs) : 0;

            return (
              <div key={area} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{area}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{areaLogs.length} 回の稼働実績</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-rose-400">¥{avgHourly.toLocaleString()}/h</span>
                  <div className="text-[10px] text-slate-500">平均時給</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
