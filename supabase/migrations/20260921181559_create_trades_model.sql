-- Establish Tradelense V2 Core Trade Model

-- CREATE TRADES TABLE
CREATE TABLE public.trades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Provenance & Metadata
    -- Allows distinction between manually entered trades and AI-scraped entries needing review
    entry_source text DEFAULT 'MANUAL' NOT NULL CHECK (entry_source IN ('MANUAL', 'AI_EXTRACTED', 'SYSTEM_DERIVED')),
    
    -- Trade Identity & Context
    symbol text NOT NULL,
    asset_class text,
    side text CHECK (side IN ('LONG', 'SHORT')),
    setup_type text,
    
    -- Execution / Timing
    entry_timestamp timestamp with time zone NOT NULL,
    exit_timestamp timestamp with time zone,
    
    -- Financial Fields (NUMERIC utilized enforcing exact decimal precision)
    entry_price numeric,
    exit_price numeric,
    stop_loss numeric,
    take_profit numeric,
    position_size numeric,
    
    -- Results
    -- pnl_realized is primarily system-derived in the application boundary.
    outcome text CHECK (outcome IN ('WIN', 'LOSS', 'BREAK_EVEN', 'OPEN')),
    pnl_realized numeric,
    fees numeric,
    currency text DEFAULT 'USD',
    
    -- Journal / Psychology
    notes text,
    mistakes text
);

-- INDICES
-- 1. Ownership boundary: Critical for all RLS filtering.
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
-- 2. Journal chronological sorting: Most common dashboard operational query.
CREATE INDEX idx_trades_user_entry_time ON public.trades(user_id, entry_timestamp DESC);
-- 3. Analytics outcome filtering
CREATE INDEX idx_trades_user_outcome ON public.trades(user_id, outcome);
-- 4. Analytics symbol grouping
CREATE INDEX idx_trades_user_symbol ON public.trades(user_id, symbol);

-- TRIGGERS
CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Select: Limit to exact owner
CREATE POLICY "Users can only select their own trades." 
  ON public.trades 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Insert: Prevent malicious user_id assignment overriding
CREATE POLICY "Users can insert their own trades." 
  ON public.trades 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update: Allow updates if owner, and strictly PREVENT updating user_id to someone else
CREATE POLICY "Users can update their own trades." 
  ON public.trades 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: Limit to exact owner
CREATE POLICY "Users can delete their own trades." 
  ON public.trades 
  FOR DELETE 
  USING (auth.uid() = user_id);
