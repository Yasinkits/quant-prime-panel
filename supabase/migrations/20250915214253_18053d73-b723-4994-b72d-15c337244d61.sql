-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'basic', 'pro', 'premium')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'expired', 'cancelled')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  trial_count INTEGER DEFAULT 0,
  trial_sessions_used INTEGER DEFAULT 0,
  mt5_demo_only BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'premium')),
  price_monthly DECIMAL(10,2) NOT NULL,
  price_biweekly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL,
  max_trial_sessions INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create MT5 credentials table (encrypted storage)
CREATE TABLE public.mt5_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  server TEXT NOT NULL,
  is_demo BOOLEAN DEFAULT true,
  is_connected BOOLEAN DEFAULT false,
  last_connection TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user configurations table
CREATE TABLE public.user_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  config_name TEXT DEFAULT 'default',
  yaml_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, config_name)
);

-- Create trading sessions table
CREATE TABLE public.trading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('trial', 'live', 'demo')),
  bot_status TEXT DEFAULT 'stopped' CHECK (bot_status IN ('running', 'stopped', 'paused')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_trades INTEGER DEFAULT 0,
  profit_loss DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mt5_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscription_plans (public read)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Create RLS policies for mt5_credentials
CREATE POLICY "Users can manage own MT5 credentials" ON public.mt5_credentials
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_configs
CREATE POLICY "Users can manage own configs" ON public.user_configs
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for trading_sessions
CREATE POLICY "Users can manage own sessions" ON public.trading_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_biweekly, features, max_trial_sessions) VALUES
('Basic Plan', 'basic', 50.00, 35.00, '{"manual_trades": true, "risk_management": true, "trailing_stops": true, "all_pairs": true, "ai_mode": false}', 2),
('Pro Plan', 'pro', 99.00, 75.00, '{"manual_trades": true, "risk_management": true, "trailing_stops": true, "all_pairs": true, "ai_mode": true, "auto_lot_sizing": true, "scalp_strategy": true, "custom_configs": true}', 2),
('Premium Plan', 'premium', 199.00, 150.00, '{"manual_trades": true, "risk_management": true, "trailing_stops": true, "all_pairs": true, "ai_mode": true, "auto_lot_sizing": true, "scalp_strategy": true, "custom_configs": true, "smc_strategy": true, "break_retest": true, "full_automation": true, "unlimited_demos": true}', 999);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_user_configs_updated_at BEFORE UPDATE ON public.user_configs
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();