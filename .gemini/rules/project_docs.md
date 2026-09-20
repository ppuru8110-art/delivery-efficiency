# プロジェクト固有開発・設計規約（ロケットアナライザー）

本プロジェクトにおいて、AIエージェントはグローバル運用規約に加え、以下の現場固有要件を厳守してください。

1. **技術資料の具象マッピング（Single Source of Truth）**:
   - 参照優先度: `docs/README.md`（全体概要）→ `docs/01_requirements_definition.md`（要件）→ `docs/specs/`（設計）→ `docs/guides/`（運用）。
   - グローバル第8条の「進捗表」対象ファイルは `docs/guides/02_implementation_status.md` とし、タスク完了時の更新はこれに限定する（`docs/specs/` の同期は仕様変更時のみ）。

2. **iPhone PWA / モバイル操作性基準（配達現場向け絶対要件）**:
   - **フォーム自動ズーム防止**: すべての input / select / textarea はフォントサイズ最小 16px（Tailwind: `text-base`）以上を必須とする（iOS Safariズーム封殺）。
   - **画面高・バウンス・連打制御**: 全画面配置は `100dvh` 基準。最上位画面は引っ張りリロード防止のため `overscroll-behavior-y: none` を適用（内部スクロール領域の正常動作を阻害しない設計）。操作要素は連打誤拡大防止のため `touch-action: manipulation` を適用。
   - **セーフエリア & タップ領域**: 下部ナビ・操作ボタンは `env(safe-area-inset-bottom)` を確保し、片手操作のため最小 44×44px のタップ領域を維持。
   - **長時間稼働 & 障害耐性**: Screen Wake Lock（非対応安全無視）、ChunkLoadError境界（自動再読込）を常設。WebKitメモリ保護のため `useEffect` 内のリソース購読解除（`clearInterval`, `removeEventListener`, Wake Lock解放）を徹底する。
   - **現場入力データ絶対保護**: iOS端スワイプ戻る誤爆やアンマウントに伴う入力中データ・下書き・未同期キューの破棄・リセットは厳禁（入力値のLocalStorage即時下書き退避を徹底）。書き込み例外（`QuotaExceededError`）やパース異常時もインメモリ退避・エラー境界によりアプリクラッシュを遮断する。
   - **UIスタック統一**: アイコンは `lucide-react`、スタイルは Tailwind CSS を厳守（無断の外部UIライブラリ追加禁止）。

3. **オフラインファースト ＆ データ同期設計（現場データ保全）**:
   - **先行保存 ＆ 採番**: 入力データは即座にLocalStorageへ先行保存しUI即時反映（ブラウザ標準 `crypto.randomUUID()` で採番）。通信復帰時にSupabaseへSync Queueでバックグラウンド同期する。
   - **ストレージ名前空間 ＆ 拡張性**: キーはプレフィックス `rocket_analyzer_` を必須とし、端末識別（`..._device_id`）、未同期キュー（`..._sync_queue`）、日報（`..._delivery_logs`）を共通基盤とする。将来データ（メモピン、オファー履歴、設定等）の追加も同プレフィックス配下で担保する。
   - **冪等性 ＆ タイムスタンプ規約**: 同期はUUID主キーの `upsert` を徹底（二重計上防止）。時刻は端末時計のズレ（Clock Drift）に備え ISO 8601 UTC（`toISOString()`）で統一保存し表示時のみJST変換。競合時は更新日時準拠の `Last-Write-Wins` で現場入力を最優先する（深夜稼働の日またぎ集計を阻害しない設計）。
   - **スキーマ進化 ＆ 計算精度・CSV規約**: 端末キャッシュ破損を防ぐLocalStorageデフォルト値マージを必須化（キー変更時は安全な移行関数を通す）。Supabase変更時も新カラムはNULL許容/DEFAULT値を死守。JS浮動小数誤差を防ぐため金額（売上・時給・単価）は整数丸め（`Math.round`）、距離は小数第1位で統一する。確定申告CSV出力時はExcel文字化けを防ぐUTF-8 BOM（`\uFEFF`）付与とカンマ・改行のエスケープ（RFC 4180）を徹底する。
   - **無料枠 ＆ 端末容量保護**: Supabase無料枠（Egress 5GB）保護のため全件取得を禁止し（期間絞り込み/`limit`必須）、常時WebSocket接続を禁止して一発オンデマンドフェッチを徹底する。LocalStorage（5MB制限）枯渇防止のため未同期キューは同期完了時に即時削除し、同期済データは直近30日（または100件）上限で古い順に安全パージする（未同期データは同期完了まで絶対保護）。
   - **排他制御 ＆ 通信堅牢性**: 再同期は指数バックオフを適用（連打禁止）。複数タブ・PWA二重起動対策としてWeb Locks API（`navigator.locks`）またはストレージ排他制御による単一実行保証を徹底する。微弱電波（Lie-Fi）ハング防止のため通信タイムアウト（`AbortSignal`）を設定し、ポイズンピルは上限3回リトライ超過でDead Letter隔離退避する。未同期インジケーターにより記録完了状態を可視化する縮退運転UXを維持する。

4. **プライバシー & 認証境界（Supabase RLS & 環境変数保護）**:
   - **RLS分離 ＆ 認証移行性**: 匿名利用時は端末UUIDまたはSupabase匿名認証（Anonymous Auth）でRLS分離を必須化（`USING (true)` 全開放厳禁）。将来の本認証（メール/OAuth）導入時は `auth.uid()` への移行・統合を妨げない設計とする。
   - **環境変数 ＆ オリジン保護**: Supabase管理者鍵（`service_role`）のフロント露出を厳禁とし、公開キー（`VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_MAPS_API_KEY` 等）は `.env.example` を同期維持する。Google Mapsキーは本番（Vercel）およびローカルに限定したHTTPリファラー制限を必須とする。

5. **完全0円 & 省リソース運用の徹底（通信・バッテリー・API保護）**:
   - **完全無料API優先**: 天気はクレカ不要の Open-Meteo を最優先。地図・住所検索の従量課金API利用時はローカルキャッシュおよび無料代替（国土地理院API・OpenStreetMap）へのフォールバック導線を常設する。
   - **Google Maps課金事故封殺**: スクリプトの単一ロード管理を徹底し、アンマウント時のクリーンアップ・インスタンス再利用により再生成課金（Map Loads）を完全防止する。住所・建物名検索（Places API等）はセッショントークン（Session Token）適用を必須とする。
   - **GPSシングルショット ＆ 手動代替**: 常時監視（`watchPosition`）を禁止し、記録時のシングルショット取得（`getCurrentPosition`、`timeout`・`maximumAge` 指定）を徹底。地下・屋内等の取得失敗時でも手動入力可能なフォールバックを常設する。
   - **バンドル遅延読み込み**: 巨大ライブラリ（`Recharts` 等）は遅延読み込み（`React.lazy`）を適用し、現場モバイル回線の初期通信量を極小化する。

6. **自己検証コマンド ＆ テストスコープ規約（グローバル第5条準拠）**:
   - **コマンド実行基準**: `package.json` の `scripts` 定義に厳格準拠。未定義コマンド（現時点の `npm test` 等）の推測実行は厳禁とし、現状の検証は `npm run build` のみに限定する。
   - **将来のテストスコープ**: 単体テスト導入時は `vitest` を採用し、対象はUI描画ではなく「純粋ロジック層（時給・経費・オファー判定計算、Sync Queue冪等性・指数バックオフ）」に限定する（`npm test` 定義後はビルド前の自動実行を必須化）。
