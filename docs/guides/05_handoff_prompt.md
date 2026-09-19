# 05. 次回チャット用スタートアップ指示書 (Handoff Prompt)

本アプリの開発を新しいチャットで再開する際は、以下の枠内のテキストをそのままAI（Antigravity）に入力してください。すべての経緯とファイル構成を即座に認識し、スムーズに次の開発に入れます。

---

```markdown
ロケットナウ（RocketNow）配達パートナー向けアプリ「ロケットアナライザー（delivery-efficiency）」の機能拡張・継続開発を再開してください。

【現状のステータス ＆ 完了事項】
フェーズ1（コア機能実装・GitHub連携・Vercel本番公開）が完了しています。
- 本番公開URL: https://delivery-efficiency.vercel.app
- GitHubリポジトリ: https://github.com/ppuru8110-art/delivery-efficiency
- 技術スタック: React 18 (Vite) + Tailwind CSS + Lucide Icons + Recharts + PWA (iPhone最適化)
- データ層: Supabaseクライアント (@supabase/supabase-js) + LocalStorage自動フォールバック + Open-Meteo天気連携
- 実装ステータス管理表: `docs/guides/02_implementation_status.md`

【設計・仕様ドキュメント一覧】
- 要件定義書: `docs/01_requirements_definition.md`
- システムアーキテクチャ: `docs/specs/01_architecture_and_specs.md`
- UI・画面設計書: `docs/specs/02_ui_screen_design.md`
- DBスキーマSQL: `docs/specs/03_database_schema.sql`
- テスト仕様書: `docs/specs/04_test_plan_and_cases.md`
- サービスガイド: `docs/guides/01_services_setup_guide.md`
- ロードマップ: `docs/guides/03_roadmap_and_upcoming.md`
- トラブルシューティングFAQ: `docs/guides/04_troubleshooting_faq.md`

【次回の開発候補タスク】
ユーザーの指示に応じて以下のいずれかの開発・設定を進めてください：
1. **フェーズ2（案1統合）**: オファー受諾即時判定シミュレーター（1km単価・換算時給・受諾推奨判定）
2. **フェーズ3（案2統合）**: 店舗・マンション攻略メモ機能（ピック待ち時間・駐輪場・エレベーター情報）
3. **Supabase / Google Maps API 本番キー接続設定**（必要に応じて）

【開発ルール】
- AIエージェントの返答・コードコメントはすべて日本語で行ってください。
- 新しい機能や技術を追加・変更する際は、事前に提案し承認を得てから実装を進めてください。
- 開発の進捗（タスク完了）や仕様変更時は、随時 `docs/guides/02_implementation_status.md` などのドキュメントを最新状態に更新・維持してください。

現在のリポジトリ状態を確認し、次回何から進めるか提案・質問してください。
```
