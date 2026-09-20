# 05. 次回チャット用スタートアップ指示書 (Handoff Prompt)

本アプリの開発を新しいチャットで再開する際は、以下の枠内のテキストをそのままAI（Antigravity）に入力してください。すべての経緯とファイル構成を即座に認識し、スムーズにフェーズ1のブラッシュアップおよび開発に入れます。

---

```markdown
# 【引き継ぎ指示書】ロケットアナライザー（delivery-efficiency）フェーズ1ブラッシュアップ ＆ 現場堅牢化実装

前回のセッションからの文脈を引き継ぎます。
規約ブラッシュアップ（全6弾）が完了し、全プロジェクト共通の「グローバル運用規約（GEMINI.md）」および当リポジトリの「プロジェクト固有ルール（.gemini/rules/project_docs.md）」が極限まで洗練されました。
このチャットからは**「最新規約を絶対遵守した上で、フェーズ1の現場堅牢化・UI/UXブラッシュアップの実装」**を開始します。

---

## 1. 前提コンテキスト ＆ リポジトリ状態
- **現在地**: `c:\Users\81902\Desktop\アプリ開発\delivery-efficiency`
- **Git状態**: ブランチ `main`（`origin/main` と完全同期、最新コミット `7f4ba1b`、working tree clean）
- **直近コミット**: `docs(rules): DBスキーマ後方互換・公開鍵テンプレート同期・重複排除を反映 [skip ci]`
- **本番URL**: [https://delivery-efficiency.vercel.app](https://delivery-efficiency.vercel.app)
- **ルール状態**:
  - **グローバル運用規約（`GEMINI.md`）**: 言語弾力化、lockfile整合性、シェル仕様遵守、コンフリクト保護、環境分離・ハードコード禁止、後方互換データ保全、非同期ライフサイクル管理、無差別add禁止反映済み。
  - **プロジェクト固有ルール（`project_docs.md`）**: iPhone PWA（16px自動ズーム防止、100dvh、touch-action、44pxタップ領域、バウンス防止/内部スクロール保護、Wake Lock、ChunkLoadError）、長時間稼働リソース解除・未登録データ破棄厳禁、Sync Queue（単一実行排他制御、指数バックオフ、upsert冪等性、直近30日パージ）、Supabase（RLS device_id分離、DBスキーマ後方互換）、完全0円運用（Google Maps多重ロード/再生成防止、Placesセッショントークン、Open-Meteo、GPSタイムアウト/手動代替）反映済み。

---

## 2. 確定済みの合意事項 ＆ 審査基準
1. **リソース防護軸（通信・料金・端末リソースの極小化）**:
   - Supabase無料枠（DB 500MB / Egress 5GB）の厳格保護（全件取得禁止、Realtime常時接続禁止）。
   - Google Maps等のAPI従量課金ゼロ（0円維持、スクリプト単一ロード & インスタンス再利用）。
   - 現場モバイル回線配慮（Recharts遅延読込）および端末保護（LocalStorage 5MBパージ、長時間メモリリーク防止）。
2. **現場データ保全 ＆ 開発拡張性軸**:
   - 入力中の未登録データ・下書き・未同期キューの破棄・リセット絶対禁止。
   - 将来フェーズ（オファー判定、メモピン）や本認証（auth.uid()）への移行を妨げない設計。
   - 提案先行・合意必須（方針未合意の改修はテキスト提案のみで承認を待つ）。

---

## 3. 次回チャットの最優先実装タスク（進捗表準拠）
進捗管理表（`docs/guides/02_implementation_status.md`）に定義された最優先タスクから順に着手します：

1. **iPhone PWA 入力フォーム自動ズーム防止改修（最優先）**:
   - `src/pages/LogEntry.jsx` のすべての input / select / textarea を `text-base`（16px以上）へ修正し、iOS実機タップ時の画面強制ズームを解消。
2. **即死防止（ErrorBoundary導入）**:
   - `src/App.jsx` または `main.jsx` に例外遮断・フォールバックUIを設置し、想定外エラーによる白画面クラッシュを遮断。
3. **プライバシー ＆ RLS基盤整備**:
   - `src/lib/storage.js` に `device_id`（ブラウザ標準 `crypto.randomUUID()` による端末UUID）の自動採番・付与を実装し、Supabase連携時のデータ保護境界を構築。
4. **自己検証 ＆ 進捗表更新**:
   - `npm run build` による検証、進捗表更新、個別指定によるGitコミット・プッシュ。

---

## 4. 参照ドキュメント
- `docs/README.md`
- `docs/01_requirements_definition.md`
- `docs/guides/02_implementation_status.md`
- `.gemini/rules/project_docs.md`

---

## 5. 出力・行動ルール
- グローバル運用規約第10条（再開プロトコル）に従い、まずは `git pull` を行い、着手案を提示して承認を得てから実装を開始すること。
- 方針未合意の改修は独断実装を厳禁とし、変更系ツールを実行せずテキスト提案のみで承認を待つこと。
- すべて日本語で対応すること。
```
