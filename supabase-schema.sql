-- =========================================================================
-- Tradelense Backend Database Table Schema Setup for Supabase PostgreSQL
-- =========================================================================

-- Enable UUID generation extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if exists to allow clean recreate (un-comment if needed)
-- DROP TABLE IF EXISTS trades;

CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) DEFAULT 'default-user' NOT NULL,
    pair VARCHAR(100) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
    entry_price NUMERIC(20, 8) NOT NULL,
    exit_price NUMERIC(20, 8) NOT NULL,
    stop_loss NUMERIC(20, 8),
    take_profit NUMERIC(20, 8),
    rr_ratio NUMERIC(10, 2),
    pips NUMERIC(15, 2),
    risk_percent NUMERIC(5, 2),
    reward_percent NUMERIC(5, 2),
    session VARCHAR(50),
    weekday VARCHAR(20),
    holding_time VARCHAR(50),
    trade_outcome VARCHAR(50), -- estimates: TP_HIT, SL_HIT, TRAILING_SL, MANUAL_CLOSED
    setup_type VARCHAR(100), -- breakout, reversal, sweep etc
    market_structure TEXT,
    emotion VARCHAR(100) DEFAULT 'none',
    mistake_type VARCHAR(100) DEFAULT 'none',
    discipline_score INTEGER DEFAULT 95,
    execution_quality INTEGER DEFAULT 90,
    risk_management_quality INTEGER DEFAULT 90,
    confidence_score INTEGER DEFAULT 90,
    notes TEXT,
    image_url TEXT,
    pnl NUMERIC(20, 2) DEFAULT 0.00 NOT NULL, -- Added to track absolute returns securely
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =========================================================================
-- STORAGE BUCKETS SETUP GUIDE
-- =========================================================================
-- 1. Navigate to 'Storage' in your Supabase dashboard.
-- 2. Click 'New bucket'.
-- 3. Name the bucket EXACTLY "trade-screenshots" and make it "Public".
-- 4. Enable Read and Write permissions for the public or configure the following policies:
--
-- CREATE POLICY "Allow Public Access" ON storage.objects
-- FOR SELECT USING (bucket_id = 'trade-screenshots');
--
-- CREATE POLICY "Allow Public Insert" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'trade-screenshots');
-- =========================================================================

-- Create indices for high-performance searching and filtering
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_pair ON trades(pair);
CREATE INDEX IF NOT EXISTS idx_trades_session ON trades(session);
CREATE INDEX IF NOT EXISTS idx_trades_weekday ON trades(weekday);
CREATE INDEX IF NOT EXISTS idx_trades_outcome ON trades(trade_outcome);
