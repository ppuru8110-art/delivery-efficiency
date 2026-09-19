# 01. 外部サービス登録・セットアップ完全ガイド (Services Setup Guide)

本アプリを**完全無料（0円）**かつiPhone上で快適に動作させるために必要なサービスの設定手順です。実装時にスムーズに連携できるよう整理しています。

---

## 1. GitHub アカウント準備
- **目的**: ソースコードのオンライン管理およびVercel自動デプロイ用
- **手順**:
  1. [GitHub](https://github.com/) にアクセスし、無料アカウントを作成。
  2. 新規リポジトリ `delivery-efficiency` （Public または Private）を作成。

---

## 2. Supabase（データベース）準備
- **目的**: 配達日報データの保存・クラウド永久保管（PostgreSQL無料枠）
- **手順**:
  1. [Supabase公式](https://supabase.com/) にアクセスし、「Start your project」（GitHub連携でログイン可能）をクリック。
  2. 新しいプロジェクトを作成（例: `rocket-analyzer`）。
  3. 左メニューの **「SQL Editor」** を開き、`docs/specs/02_database_schema.sql` の内容を丸ごと貼り付けて **「Run」** を実行。
  4. 左メニューの **「Project Settings」 > 「API」** から以下をコピーして手元にメモしておく。
     - **Project URL** (`https://xxxx.supabase.co`)
     - **anon / public Key** (`eyJhbGci...`)

---

## 3. Google Maps API Key の取得 & セキュリティ防護
- **目的**: エリアマップ（配達実績ピン）の表示
- **手順**:
  1. [Google Cloud Console](https://console.cloud.google.com/) にログイン。
  2. 新しいプロジェクトを作成し、**「Maps JavaScript API」** を有効化。
  3. 「認証情報」から **APIキー（API Key）** を作成し、コピーしてメモ。
     *(※毎月$200分＝約3万円分の無料枠があるため、個人利用範囲では実質0円です)*
  4. **【必須・高額請求防止】HTTPリファラー制限（ウェブサイト制限）の設定**:
     - 作成したAPIキーの編集画面を開く。
     - **「アプリケーションの制限」** で **「ウェブサイト」** を選択。
     - **「ウェブサイトの制限」** に以下を追加して保存：
       - `https://*.vercel.app/*` （Vercel本番およびプレビューURL）
       - `http://localhost:*` （PC/スマホでのローカル開発用）
     - **「APIの制限」** で **「キーを制限」** を選択し、**「Maps JavaScript API」** のみを選択。
     *(※この制限により、キーがフロントエンドに露出しても第三者による悪用や想定外の課金を確実に防ぎます)*

---

## 4. Vercel（Webホスティング）準備
- **目的**: Webアプリの無料公開およびiPhone PWA化
- **手順**:
  1. [Vercel公式](https://vercel.com/) にアクセスし、GitHubアカウントでサインアップ。
  2. GitHubのリポジトリ `delivery-efficiency` をインポート。
  3. **「Environment Variables（環境変数）」** に以下を設定してデプロイ。

---

## 🔑 環境変数テンプレート (`.env`)

実装時にプロジェクト直下に作成する `.env` ファイルの設定値です。

```env
# Supabase接続情報
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Maps APIキー
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```
