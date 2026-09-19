# 05. 次回チャット用スタートアップ指示書 (Handoff Prompt)

別チャットを開いて本アプリの実装を開始する際、以下の枠内のテキストをそのままAI（Antigravity）に入力してください。一括して環境構築とコーディングが開始されます。

---

```markdown
ロケットナウ（RocketNow）配達パートナー向けのアプリ「ロケットアナライザー（delivery-efficiency）」の実装を開始してください。

【前提事項・設計ドキュメント】
前回のチャットにて以下の設計およびドキュメントが完了しています。
- 要件定義書: `docs/01_requirements_definition.md`
- システムアーキテクチャ: `docs/specs/01_architecture_and_specs.md`
- UI・画面設計書: `docs/specs/02_ui_screen_design.md`
- DBスキーマSQL: `docs/specs/03_database_schema.sql`
- テスト仕様書: `docs/specs/04_test_plan_and_cases.md`
- サービスガイド: `docs/guides/01_services_setup_guide.md`
- 実装ステータス: `docs/guides/02_implementation_status.md`
- ロードマップ: `docs/guides/03_roadmap_and_upcoming.md`
- トラブルシューティングFAQ: `docs/guides/04_troubleshooting_faq.md`

【技術スタック】
- フロントエンド: React (Vite) + Tailwind CSS + Lucide Icons + Recharts
- バックエンド/DB: Supabase (@supabase/supabase-js) （※環境変数未設定時はLocalStorageフォールバック動作）
- 地図: Google Maps JavaScript API (@vis.gl/react-google-maps)
- 実行環境: iPhone PWA最適化UI

【今回の実装ゴール（フェーズ1）】
1. Vite + React + Tailwind CSS のプロジェクト環境セットアップおよび依存ライブラリのインストール
2. iPhoneサイズに最適化したボトムナビゲーション付きレスポンシブUIコンポーネントの構築
3. 片手入力可能な「日報登録フォーム」コンポーネントの作成
4. 平均時給・件単価・km単価の自動計算カード、曜日/時間帯/天候別グラフ、確定申告経費試算を表示する「ダッシュボード」コンポーネントの作成
5. Google Maps連携「エリアマップ」コンポーネントの作成
6. Supabaseクライアント（`src/lib/supabaseClient.js`）およびデモデータ表示機能の実装
7. アプリのビルド確認（`npm run build`）

【ドキュメント保守ルール】
開発の進捗（タスクの完了）や仕様の変更が発生した際は、随時 `docs/guides/02_implementation_status.md` などのドキュメントを最新状態に更新・維持してください。

まずは `package.json` の作成および必要なライブラリのインストールから着手してください。
```
