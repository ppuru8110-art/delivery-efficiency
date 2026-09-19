# ロケットアナライザー (delivery-efficiency)

ロケットナウ（RocketNow）配達パートナー専用の稼ぎ分析・日報入力PWAアプリです。

---

## 📱 主な機能 (フェーズ1)

1. **簡単日報入力**
   - 稼働時間、売上、配達件数、走行距離を片手で素早く入力
   - 現在地の天候自動取得（Open-Meteo API連携）
2. **稼ぎ分析ダッシュボード**
   - 平均時給・件単価・km単価・平均配達時間のリアルタイム算出
   - 曜日別・天候別の平均時給グラフ表示 (Recharts)
   - 確定申告・経費試算カード
3. **データ管理 & 確定申告支援**
   - 過去の日報ログ編集・削除
   - CSV / JSON ワンタップエクスポート
4. **エリアマップ**
   - 稼働実績ピン表示（Google Maps API連携 / モック表示フォールバック対応）

---

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + Vite
- **UI / スタイル**: Tailwind CSS + Lucide Icons
- **グラフライブラリ**: Recharts
- **データベース**: Supabase (@supabase/supabase-js) + LocalStorage フォールバック
- **地図**: Google Maps JavaScript API (@vis.gl/react-google-maps)
- **天候API**: Open-Meteo API
- **動作環境**: iPhone PWA 最適化

---

## 🚀 ローカル起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```
