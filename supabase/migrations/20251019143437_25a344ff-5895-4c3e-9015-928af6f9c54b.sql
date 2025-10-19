-- Update subscription plans with new feature sets

-- Update Basic plan (Free trial - Manual trading only)
UPDATE subscription_plans 
SET 
  features = jsonb_build_object(
    'manual_trades', true,
    'account_details', true,
    'charts', true,
    'safety_controls', true
  ),
  max_trial_sessions = 2
WHERE tier = 'basic';

-- Update Pro plan ($79/month, $39/bi-weekly)
UPDATE subscription_plans 
SET 
  features = jsonb_build_object(
    'manual_trades', true,
    'account_details', true,
    'charts', true,
    'safety_controls', true,
    'auto_lot_sizing', true,
    'scalp_trading', true,
    'day_trading', true,
    'ai_trading', true,
    'custom_config', true,
    'mt5_connections', 1,
    'bot_with_config', true
  ),
  max_trial_sessions = 0
WHERE tier = 'pro';

-- Update Premium plan ($300/month, 10 demo trials)
UPDATE subscription_plans 
SET 
  features = jsonb_build_object(
    'manual_trades', true,
    'account_details', true,
    'charts', true,
    'safety_controls', true,
    'auto_lot_sizing', true,
    'scalp_trading', true,
    'day_trading', true,
    'ai_trading', true,
    'custom_config', true,
    'mt5_connections', 1,
    'bot_with_config', true,
    'advanced_strategies', true,
    'smart_money_concepts', true,
    'break_retest', true,
    'full_automation', true,
    'priority_support', true,
    'auto_risk_management', true
  ),
  max_trial_sessions = 10
WHERE tier = 'premium';