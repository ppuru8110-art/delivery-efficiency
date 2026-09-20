# 01. アーキテクチャ・技術仕様書 (Architecture & Specs)

## 1. システム構成・アーキテクチャ概要

本アプリ「ロケットアナライザー（Rocket Analyzer）」は、個人事業主のデリバリー配達パートナーがiPhoneで快適かつ完全無料（0円）で利用できるよう、**PWA（Progressive Web App）** および **サーバーレス・クラウドサービス** を組み合わせた構成となっています。

```mermaid
flowchart TD
    subgraph Client ["iPhone / PWA (Client Side)"]
        UI ["React (Vite) UI Layer\n(Tailwind CSS + Lucide)"]
        State ["Local State / Cache\n(LocalStorage Fallback)"]
    end

    subgraph Hosting ["Hosting Layer (Free)"]
        Vercel ["Vercel Edge Network\n(PWA Deployment)"]
    end

    subgraph CloudServices ["Cloud Services (Free Tier)"]
        Supabase [("Supabase PostgreSQL\n(Database & Auth)")]
        GoogleMaps ["Google Maps API\n(Maps JavaScript)"]
    end

    UI --> Vercel
    UI <--> State
    UI <--> Supabase
    UI <--> GoogleMaps
```

---

## 2. 技術スタック選定理由

| レイヤー | 採用技術 | 選定理由・特徴 |
| :--- | :--- | :--- |
| **フロントエンド** | **React 18 + Vite** | コンポーネント指向により画面パーツ（ダッシュボード、グラフ、マップ、フォーム）の分割・再利用が容易。Viteによる高速ビルド。 |
| **UIデザイン** | **Tailwind CSS** | クラス名ベースでの高速デザイン構築。レスポンシブ（iPhoneタテ持ち操作）およびダークモード対応が容易。 |
| **アイコン・グラフ** | **Lucide Icons / Recharts** | モバイルに適した軽量アイコン、および時給・単価推移を視覚化するシンプルなグラフライブラリ。 |
| **バックエンド / DB** | **Supabase** | PostgreSQLベースの無料クラウドDB。REST APIが自動生成され、JavaScript SDKで簡単にデータ保存が可能。 |
| **地図機能** | **Google Maps JS API** | 高精度な地図表示・ピン連携。月$200の無料枠内で利用可能。 |
| **ホスティング / PWA** | **Vercel** | GitHubリポジトリからの完全自動デプロイ、HTTPS（SSL）標準対応、iPhoneでのホーム画面追加（PWA）に最適。 |

---

## 3. コンポーネント構成とデータフロー

```text
src/
├── assets/             # アイコン・画像
├── components/         # 共通UIコンポーネント
│   ├── Navigation.jsx  # ボトムナビゲーションバー (iPhone固定)
│   ├── MetricCard.jsx  # 時給・単価等の数値表示カード
│   ├── Header.jsx      # アプリヘッダー
│   └── ErrorBoundary.jsx # 🛡️ 例外遮断・ホワイトアウト防止フォールバックUI
├── pages/              # 各画面コンポーネント
│   ├── Dashboard.jsx   # 📊 稼ぎアナライザー・グラフ・確定申告試算
│   ├── LogEntry.jsx    # 📝 片手日報入力フォーム
│   ├── AreaMap.jsx     # 🗺️ Google Maps エリアマップ
│   ├── OfferCalc.jsx   # ⚡ (将来拡張) 案1 オファー即時判定
│   └── LocationNotes.jsx# 📌 (将来拡張) 案2 店舗/マンションメモ
├── lib/
│   ├── supabaseClient.js # Supabase接続クライアント
│   └── storage.js      # 端末UUID管理 ＆ オフラインLocalStorage制御
└── App.jsx             # メインルーティング & モバイル枠組み
```

---

## 4. 堅牢性・例外遮断 ＆ プライバシー設計

1. **即死防止（ErrorBoundary ＆ PWA耐性）**:
   - レンダリング時や非同期処理の予期せぬエラー、デプロイ後の古いキャッシュ起因のチャンクエラー（ChunkLoadError）を `ErrorBoundary` で遮断。
   - 画面全体が真っ白になる障害を防ぎ、ワンタップで「再読み込み」または「未同期データのローカル退避/JSON保存（救済）」が可能なフォールバック画面を表示。
2. **端末UUID（`device_id`）によるプライバシー境界（RLS）**:
   - 端末ごとに初回起動時にUUIDを自動採番して LocalStorage に保持。
   - すべての日報データに `device_id` を付与して保存し、Supabase連携時も他人のデータと混ざらないRLS論理分離を実現。

---

## 5. データモデル ＆ ストレージ仕様（Single Source of Truth）

### 1. 日報データモデル (`DeliveryLog`) 標準スキーマ
深夜日跨ぎ稼働の集計破綻を防ぎ、マルチ稼働（複数社受託）に対応するための共通データ構造。

| フィールド名 | 型 | 必須 | 説明・制約 |
| :--- | :--- | :---: | :--- |
| `id` | `string` (UUID) | ○ | レコード固有UUID（`crypto.randomUUID()` 採番、主キー） |
| `device_id` | `string` (UUID) | ○ | 端末固有識別子（RLSデータ分離用） |
| `work_date` | `string` (YYYY-MM-DD) | ○ | **業務日付（稼働開始日基準）**。日またぎ集計の基準日。 |
| `start_time` | `string` (HH:mm) | ○ | 稼働開始時刻（例: "18:00"） |
| `end_time` | `string` (HH:mm) | ○ | 稼働終了時刻（例: "02:00"） |
| `sales` | `number` (整数) | ○ | 売上金額（円、`Math.round` 整数丸め） |
| `deliveries` | `number` (整数) | ○ | 配達完了件数（件） |
| `distance` | `number` (小数第1位) | ○ | 走行距離（km、例: 42.5） |
| `weather` | `string` | ○ | 天候（`sunny` / `cloudy` / `rain` / `heavy_rain`） |
| `area` | `string` | - | 主要稼働エリア（例: "渋谷・恵比寿"、最大50文字） |
| `platform` | `string` | - | 配送元（`uber` / `demae` / `menu` / `wolt` / `other`） |
| `notes` | `string` | - | 自由メモ（最大500文字、`maxLength` 制限） |
| `created_at` | `string` (ISO 8601 UTC) | ○ | レコード作成日時（`toISOString()`） |
| `updated_at` | `string` (ISO 8601 UTC) | ○ | レコード更新日時（`Last-Write-Wins` 判定用） |

### 2. LocalStorage 名前空間一覧
キー名の競合やデータ混入を防ぐため、プレフィックス `rocket_analyzer_` で統一管理。

- `rocket_analyzer_device_id`: 端末固有UUID（初回起動時に自動生成）
- `rocket_analyzer_delivery_logs`: 日報履歴配列（直近30日/100件上限でパージ）
- `rocket_analyzer_sync_queue`: Supabase未同期キュー配列（同期成功で即時削除）
- `rocket_analyzer_draft_log`: 入力中の日報下書きオブジェクト（登録成功で即時クリア）
- `rocket_analyzer_settings`: 経費試算単価（円/km）等の端末設定オブジェクト
