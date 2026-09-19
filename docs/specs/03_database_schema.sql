-- ========================================================
-- ロケットアナライザー (Rocket Analyzer) Supabase Schema
-- ========================================================

-- 1. 拡張機能の有効化 (UUID生成用)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- テーブル1: delivery_logs (フェーズ1: 日報データ)
-- --------------------------------------------------------
-- テーブル1: delivery_logs (フェーズ1: 日報データ)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL,                                       -- 端末固有UUID (RLSデータ分離キー)
    work_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME WITHOUT TIME ZONE,
    end_time TIME WITHOUT TIME ZONE,
    hours_worked NUMERIC(4, 2) NOT NULL CHECK (hours_worked > 0), -- 稼働時間 (h)
    total_earnings INTEGER NOT NULL CHECK (total_earnings >= 0),   -- 総売上 (円)
    delivery_count INTEGER NOT NULL CHECK (delivery_count >= 0),   -- 配達件数 (件)
    distance_km NUMERIC(6, 2) DEFAULT 0,                           -- 走行距離 (km)
    weather VARCHAR(20) DEFAULT '晴れ',                             -- 晴れ/曇り/雨/大雨
    primary_area VARCHAR(100),                                     -- 主要稼働エリア
    latitude DOUBLE PRECISION,                                     -- 中心緯度 (マップ表示用)
    longitude DOUBLE PRECISION,                                    -- 中心経度 (マップ表示用)
    notes TEXT,                                                    -- メモ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------
-- テーブル2: offer_evaluations (フェーズ2拡張用: 案1 オファー即時判定ログ)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offer_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL,                   -- 端末固有UUID (RLSデータ分離キー)
    offered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reward_amount INTEGER NOT NULL,            -- 提示報酬 (円)
    estimated_distance_km NUMERIC(5, 2),        -- 推定距離 (km)
    estimated_duration_min INTEGER,            -- 推定所要時間 (分)
    calc_hourly_rate INTEGER,                  -- 換算時給 (円/h)
    calc_km_rate INTEGER,                      -- 換算km単価 (円/km)
    is_accepted BOOLEAN DEFAULT false,         -- 受諾したか
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- テーブル3: location_notes (フェーズ3拡張用: 案2 店舗・ドロップ攻略メモ)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.location_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL,                   -- 端末固有UUID (RLSデータ分離キー)
    title VARCHAR(150) NOT NULL,                -- 店舗名またはマンション名
    category VARCHAR(20) NOT NULL,             -- 'PICK' (店舗) または 'DROP' (配達先)
    address VARCHAR(255),                      -- 住所
    latitude DOUBLE PRECISION NOT NULL,        -- 緯度
    longitude DOUBLE PRECISION NOT NULL,       -- 経度
    wait_time_min INTEGER,                     -- 平均待ち時間 (分)
    parking_info TEXT,                         -- 駐輪場情報
    elevator_info TEXT,                        -- エレベーター・防災センター情報
    rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- おすすめ度
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- インデックスの作成 (検索高速化 & 端末データ絞り込み)
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_delivery_logs_device_id ON public.delivery_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_date ON public.delivery_logs(work_date DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_area ON public.delivery_logs(primary_area);
CREATE INDEX IF NOT EXISTS idx_location_notes_lat_lng ON public.location_notes(latitude, longitude);

-- --------------------------------------------------------
-- Row Level Security (RLS) 設定
-- 端末UUID (device_id) または Supabase Anonymous Auth によるデータ分離
-- (全開放 USING (true) は厳禁)
-- --------------------------------------------------------
ALTER TABLE public.delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_notes ENABLE ROW LEVEL SECURITY;

-- 端末UUID照合ポリシー (ヘッダー x-device-id または auth.uid() と一致する行のみアクセス可能)
CREATE POLICY "Device isolation delivery_logs" ON public.delivery_logs
    FOR ALL
    USING (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    )
    WITH CHECK (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    );

CREATE POLICY "Device isolation offer_evaluations" ON public.offer_evaluations
    FOR ALL
    USING (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    )
    WITH CHECK (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    );

CREATE POLICY "Device isolation location_notes" ON public.location_notes
    FOR ALL
    USING (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    )
    WITH CHECK (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')::uuid,
            auth.uid()
        )
    );
