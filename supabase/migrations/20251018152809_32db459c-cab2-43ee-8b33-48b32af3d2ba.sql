-- Update subscription plans to match requirements

-- Update Basic plan (Free trial with 2 demo sessions)
UPDATE subscription_plans 
SET 
  price_monthly = 0,
  price_biweekly = 0,
  features = jsonb_build_object(
    'manual_trades', true,
    'risk_management', true,
    'trailing_stops', false,
    'all_pairs', true,
    'ai_mode', false,
    'auto_lot_sizing', false,
    'scalp_strategy', false,
    'custom_configs', false,
    'smc_strategy', false,
    'break_retest', false,
    'full_automation', false,
    'unlimited_demos', false
  ),
  max_trial_sessions = 2
WHERE tier = 'basic';

-- Update Pro plan 
UPDATE subscription_plans 
SET 
  price_monthly = 79,
  price_biweekly = 39,
  features = jsonb_build_object(
    'manual_trades', true,
    'risk_management', true,
    'trailing_stops', true,
    'all_pairs', true,
    'ai_mode', true,
    'auto_lot_sizing', true,
    'scalp_strategy', true,
    'custom_configs', true,
    'smc_strategy', false,
    'break_retest', false,
    'full_automation', true,
    'unlimited_demos', false
  ),
  max_trial_sessions = 0
WHERE tier = 'pro';

-- Update Premium plan (no bi-weekly option, no unlimited demos)
UPDATE subscription_plans 
SET 
  price_monthly = 300,
  price_biweekly = 0,
  features = jsonb_build_object(
    'manual_trades', true,
    'risk_management', true,
    'trailing_stops', true,
    'all_pairs', true,
    'ai_mode', true,
    'auto_lot_sizing', true,
    'scalp_strategy', true,
    'custom_configs', true,
    'smc_strategy', true,
    'break_retest', true,
    'full_automation', true,
    'unlimited_demos', false
  ),
  max_trial_sessions = 0
WHERE tier = 'premium';