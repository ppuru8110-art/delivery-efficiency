# 04. トラブルシューティング＆運用FAQ (Troubleshooting & FAQ)

本ドキュメントは、アプリの開発中やiPhone実機での運用中に発生しやすい問題とその解決策をまとめたトラブルシューティングガイドです。

---

## ❓ トラブルと対処法一覧

### Q1. Supabase に接続できない / データが保存されない
* **原因**: `.env` の URL や API Key が間違っている、または RLS (Row Level Security) のポリシーが未設定。
* **対処手順**:
  1. `.env` ファイルに `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` が正しいか確認。
  2. Supabase の SQL Editor を開き、`docs/specs/03_database_schema.sql` を再実行して RLS ポリシー (`Device isolation delivery_logs`) を設定。
  3. 万が一接続できない場合、本アプリは自動的に **LocalStorage** に保存されるためデータは失われません。

---

### Q2. Google Maps が表示されない / 「For development purposes only」と出る
* **原因**: Google Maps API Key の未設定、有効化漏れ、またはアクセス制限の設定ミス。
* **対処手順**:
  1. [Google Cloud Console](https://console.cloud.google.com/) で **「Maps JavaScript API」** が有効になっているか確認。
  2. 請求先アカウント（無料枠使用時も必須）が紐付いているか確認（月200ドル相当までは無料）。
  3. APIキーの「ウェブの制限」にデプロイ先ドメイン（`*.vercel.app` や `localhost`）が登録されているか確認。

---

### Q3. iPhone で PWA（全画面表示）にならない / ブラウザのアドレスバーが残る
* **原因**: Safari 以外（Chrome や LINE内ブラウザなど）からホーム画面追加を行ったか、manifest設定の未読み込み。
* **対処手順**:
  1. 必ず **iPhone 標準の Safari ブラウザ** で Vercel の URL を開く。
  2. 画面下部中央の「共有アイコン（四角と上矢印）」をタップし、**「ホーム画面に追加」** を選択。
  3. ホーム画面に生成されたアイコンから起動してください。

---

### Q4. Vercel でデプロイ（Web公開）エラーが出る
* **原因**: 環境変数の未設定、またはビルドコマンド (`npm run build`) のエラー。
* **対処手順**:
  1. Vercel のダッシュボード ➔ **「Settings」 ➔ 「Environment Variables」** で Supabase と Google Maps の環境変数を登録。
  2. ローカル環境で `npm run build` を実行し、構文エラーがないか事前にチェック。
