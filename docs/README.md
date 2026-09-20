# ロケットアナライザー（Rocket Analyzer / delivery-efficiency）ドキュメント集

個人事業主のロケットナウ（RocketNow）配達パートナー向けに、効率よく・楽して稼ぐための自分専用PWAアプリの設計・仕様ドキュメント群です。

---

## 📂 ドキュメント構成（重複なし完全ナンバリング）

### 📌 全体方針
- 📄 [01_requirements_definition.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/01_requirements_definition.md)
  - システム全体概要、目的、ロケットナウ対応機能、フェーズ1（案3）および将来フェーズ（案1・案2）の要件定義。

---

### 📐 設計・仕様グループ (`docs/specs/`)
- 🏗️ [specs/01_architecture_and_specs.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/specs/01_architecture_and_specs.md)
  - システム構成図、技術スタック選定理由、コンポーネント構成およびデータフロー。
- 📱 [specs/02_ui_screen_design.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/specs/02_ui_screen_design.md)
  - iPhone（390×844px）向けPWA画面構成、ボトムナビゲーション、各画面レイアウト詳細。
- 🗄️ [specs/03_database_schema.sql](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/specs/03_database_schema.sql)
  - Supabaseで実行可能なSQLスクリプト。`delivery_logs` (日報・マルチ稼働 `platform` 対応) テーブル、および将来拡張用 (`offer_evaluations`, `location_notes`) テーブル定義。
- 🧪 [specs/04_test_plan_and_cases.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/specs/04_test_plan_and_cases.md)
  - 実装後の機能・計算精度・iPhone表示・オフライン動作を検証するためのテスト仕様書。

---

### ⚙️ マニュアル・運用・進捗グループ (`docs/guides/`)
- 🛠️ [guides/01_services_setup_guide.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/guides/01_services_setup_guide.md)
  - 完全無料（0円）で運用するための GitHub, Supabase, Vercel, Google Maps API Key の登録・設定手順書および環境変数テンプレート。
- 📊 [guides/02_implementation_status.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/guides/02_implementation_status.md)
  - 実装直前準備の完了状況および次回チャットで実施する実装タスクチェックリスト。
- 🗺️ [guides/03_roadmap_and_upcoming.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/guides/03_roadmap_and_upcoming.md)
  - フェーズ1（アナライザー）、フェーズ2（オファー判定）、フェーズ3（攻略メモ）のマイルストーン・ロードマップ。
- ❓ [guides/04_troubleshooting_faq.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/guides/04_troubleshooting_faq.md)
  - Supabase/Google Maps/Vercel/iPhone PWAに関するトラブルシューティングと解決策。
- 🚀 [guides/05_handoff_prompt.md](file:///c:/Users/81902/Desktop/%E3%82%A2%E3%83%97%E3%83%AA%E9%96%8B%E7%99%BA/delivery-efficiency/docs/guides/05_handoff_prompt.md)
  - 新しいチャットを開いて即座にコーディング・実装を開始するための引き継ぎ指示書（コピペ用）。

---

### 🎯 各ドキュメントの管轄領域（Single Source of Truth）
重複定義による記述競合を防ぐため、各情報の正本（Truth）を以下のように定めます：
- **データモデル・LocalStorage名前空間**: `docs/specs/01_architecture_and_specs.md`
- **PostgreSQL DDL・RLSポリシー**: `docs/specs/03_database_schema.sql`
- **画面レイアウト・操作性・コントラスト基準**: `docs/specs/02_ui_screen_design.md`
- **受入テスト手順・検証期待値**: `docs/specs/04_test_plan_and_cases.md`
- **外部キー設定・セキュリティ制限（リファラー）**: `docs/guides/01_services_setup_guide.md`
- **タスク進捗・完了チェックリスト**: `docs/guides/02_implementation_status.md`
- **次回開発スタートアップ指示**: `docs/guides/05_handoff_prompt.md`

---

## 🛠️ 技術スタック
- **画面 (PWA)**: React + Vite + Tailwind CSS + Lucide Icons + Recharts
- **DB/バックエンド**: Supabase (PostgreSQL)
- **地図**: Google Maps JavaScript API
- **気象API**: Open-Meteo API (完全無料・登録不要)
- **ホスティング**: Vercel
