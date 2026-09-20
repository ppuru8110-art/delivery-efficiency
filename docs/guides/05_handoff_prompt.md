# 05. 次回チャット用スタートアップ指示書 (Handoff Prompt)

本アプリの開発を新しいチャットで再開する際は、以下の枠内のテキストをそのままAI（Antigravity）に入力してください。すべての経緯とファイル構成を即座に認識し、スムーズにフェーズ1の現場UI改修および実装に入れます。

---

```markdown
# 【引き継ぎ指示書】フェーズ1 iPhone PWA現場UI改修 ＆ 堅牢性実装（セッション再開）

## 1. 概要
全プロジェクト共通「グローバル運用規約（GEMINI.md）」および「プロジェクト固有ルール（.gemini/rules/project_docs.md）」において資料間競合防止の恒久ガードレール（Single Source of Truth、仕様変更4大トリガー、ペア同期、管轄マップ明示）が確立され、技術資料群の正本完全化（実在ファイル追認、将来データモデル事前定義、.env.example実ファイル配置）が100%完了しています。
資料群の確定仕様に基づき、新セッションではいよいよ**「フェーズ1 iPhone PWA 現場UI改修および堅牢性実装」**に着手します。

## 2. 直近コミット
- コミット: 最新コミット `docs(specs): 技術資料の正本完全化および.env.exampleの配置 [skip ci]`
- リモート状態: `origin/main` と完全同期（ワーキングツリー Clean）

## 3. 合意事項・絶対運用ルール
- **Single Source of Truth の遵守**: 日報データモデルは `total_earnings`, `delivery_count`, `distance_km`, `primary_area`, `hours_worked`, `platform`, `work_date`, `device_id` で統一されており、後方互換性と型安全性を維持すること。
- **提案先行・合意必須**: 実装作業においても、独断での一括書き換えを禁じ、変更点・実装方針をピンポイントで提案して承認を得てからファイル反映すること。
- **現場UI・堅牢性基準の死守**:
  - `src/pages/LogEntry.jsx`: 入力欄 `text-base`（16px以上、iOSズーム封殺）、業務日（`work_date`）ピッカー、プラットフォーム選択チップ、下書き即時退避（`rocket_analyzer_draft_log`）＆復元/クリア。
  - `src/components/ErrorBoundary.jsx`: ホワイトアウト遮断フォールバック、再読み込み＆未同期データJSON救済導線。
  - `src/lib/storage.js`: 端末UUID（`device_id`）自動採番・RLSデータ分離基盤。
  - デモ投入/全リセット時の実データ誤爆防止2段階確認モーダル。
- **検証プロトコル**: 修正後は `npm run build` を実行して構文・型整合性を自己検証すること。
- **引き継ぎコピペの出力停止**: ユーザーから「引き継ぎを出して」等の明示指示があるまで、チャット末尾での引き継ぎ用コピペの提示は不要。
- **ファイル安全**: UTF-8 BOMなし / LF改行。

## 4. 参照doc
- 全体目次: `docs/README.md`
- 要件定義書: `docs/01_requirements_definition.md`
- アーキテクチャ・データモデル: `docs/specs/01_architecture_and_specs.md`
- 画面設計書: `docs/specs/02_ui_screen_design.md`
- DBスキーマ: `docs/specs/03_database_schema.sql`
- テスト仕様書: `docs/specs/04_test_plan_and_cases.md`
- 実装進捗表: `docs/guides/02_implementation_status.md`
- プロジェクト固有規約: `.gemini/rules/project_docs.md`
- グローバル運用規約: `C:\Users\81902\.gemini\config\GEMINI.md`

## 5. 次回タスク
最優先で `git pull` を行い、ブランチ・docを確認後、**「1. `src/pages/LogEntry.jsx` の現場UI改修（入力欄16px化、業務日work_date、配送元platform選択、下書き即時退避＆クリア）」** の実装提案を提示してユーザーの承認を待ってください。
```
