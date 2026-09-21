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
  3. 左メニューの **「SQL Editor」** を開き、`docs/specs/03_database_schema.sql` の内容を丸ごと貼り付けて **「Run」** を実行。
  4. 左メニューの **「Project Settings」 > 「API」** から以下をコピーして手元にメモしておく。
     - **Project URL** (`https://xxxx.supabase.co`)
     - **anon / public Key** (`eyJhbGci...`)

---

## 3. Google Maps API Key の取得
- **目的**: エリアマップ（配達実績ピン）の表示
- **手順**:
  1. [Google Cloud Console](https://console.cloud.google.com/) にログイン。
  2. 新しいプロジェクトを作成し、**「Maps JavaScript API」** を有効化。
  3. 「認証情報」から **APIキー（API Key）** を作成し、コピーしてメモ。
     *(※毎月$200分＝約3万円分の無料枠があるため、個人利用範囲では実質0円です)*
  4. **APIキーのセキュリティ制限（必須・課金事故封殺）**:
     - **アプリケーションの制限**: 「ウェブサイト」を選択し、以下の許可ドメインを追加：
       - 本番用キー: `https://*.vercel.app/*` （Vercel環境変数に設定）
       - 開発用キー: `http://localhost:*` （ローカル `.env` 用にキーを分けることを推奨）
     - **APIの制限**: 「キーを制限」を選択し、**「Maps JavaScript API」** のみに限定（他の有料APIの不正利用を遮断）。
  5. **課金事故を物理遮断するハードリミット設定（絶対推奨・0円保証）**:
     - 左メニュー **「APIとサービス」 > 「有効なAPIとサービス」 > 「Maps JavaScript API」** をクリック。
     - 上部タブ **「割り当て（Quotas）」** を開く。
     - **「1日あたりのマップ読み込み数（Map Loads per day）」** の編集をクリックし、上限を **`500`** または **`1,000`** 件/日に設定。
       *(※毎月の無料枠は約28,500件＝1日約950件のため、この上限設定により万が一キーが流出してもGoogle側で自動遮断され、課金発生が物理的に100%防止されます)*
  6. **予算アラート（0円超過監視）の設定**:
     - 左メニュー **「お支払い」 > 「予算とアラート」** を開く。
     - 予算額を **`1円`**（または `100円`）で作成し、無料枠超過時に即時メール通知されるよう設定。

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
