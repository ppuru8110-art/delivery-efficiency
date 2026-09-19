# 05. 次回チャット用スタートアップ指示書 (Handoff Prompt)

本アプリの開発を新しいチャットで再開する際は、以下の枠内のテキストをそのままAI（Antigravity）に入力してください。すべての経緯とファイル構成を即座に認識し、スムーズにフェーズ1のブラッシュアップおよび開発に入れます。

---

```markdown
ロケットナウ（RocketNow）配達パートナー向けアプリ「ロケットアナライザー（delivery-efficiency）」のフェーズ1ブラッシュアップおよび開発を再開してください。

【現状のステータス ＆ 完了事項】
フェーズ1（コア機能実装・GitHub連携・Vercel本番公開）が完了しています。
- 本番公開URL: https://delivery-efficiency.vercel.app
- GitHubリポジトリ: https://github.com/ppuru8110-art/delivery-efficiency
- 技術スタック: React 18 (Vite) + Tailwind CSS + Lucide Icons + Recharts + PWA (iPhone最適化)
- データ層: Supabaseクライアント (@supabase/supabase-js) + LocalStorage自動フォールバック + Open-Meteo天気連携
- 未導入外部サービス: Supabase（クラウドDB同期）、Google Maps API（実地図ピン）※現在はLocalStorageとモック表示で安定稼働中
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

【次回チャットの最優先タスク】
ユーザーの意向に基づき、まずは**「フェーズ1の内容のブラッシュアップ」**を最優先で実施します。
1. **フェーズ1 機能・UI/UXのブラッシュアップ**:
   - **入力フォーム（片手操作UX）の改善**: 入力値バリデーション、タップ感向上、エリア選択の充実
   - **分析ダッシュボードの強化**: 期間絞り込みフィルター（全期間 / 今月 / 今週）、目標時給との達成率比較、グラフ視認性向上
   - **確定申告・経費試算の高度化**: 経費単価設定（ガソリン/km）のカスタム変更機能
2. **未導入外部サービスの導入支援（ユーザーの希望に応じて）**:
   - Supabase（クラウドDB同期）のセットアップ
   - Google Maps APIキーの設定
3. **将来機能（フェーズ2: オファー即時判定、フェーズ3: 攻略メモ）の準備**

【開発ルール】
- AIエージェントの返答・コードコメントはすべて日本語で行ってください。
- 新しい機能や技術を追加・変更する際は、事前に提案し承認を得てから実装を進めてください。
- 開発の進捗（タスク完了）や仕様変更時は、随時 `docs/guides/02_implementation_status.md` などのドキュメントを最新状態に更新・維持してください。

現在のリポジトリ状態を確認し、まずはフェーズ1のどこからブラッシュアップを進めるか、具体的な改善案を提案してください。
```
