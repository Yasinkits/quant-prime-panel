import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly', { ascending: true });
    
    if (!error) {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const handleSubscribe = async (planTier: string, isMonthly: boolean) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubscribing(planTier);
    
    try {
      // Mock subscription - in real app, integrate with Stripe
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (isMonthly ? 1 : 0.5));

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: planTier,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: endDate.toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Subscription activated!');
      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setSubscribing('');
    }
  };

  const handleStartTrial = async (planTier: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubscribing(`trial-${planTier}`);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: planTier,
          subscription_status: 'active',
          trial_count: (profile?.trial_count || 0) + 1,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Trial started!');
      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to start trial. Please try again.');
    } finally {
      setSubscribing('');
    }
  };

  const canStartTrial = (maxTrialSessions: number) => {
    return !profile || (profile.trial_count < maxTrialSessions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Prime AI Bot - Subscriptions</h1>
          {user && (
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </header>

      {/* Pricing Plans */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your Trading Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan: any) => (
              <Card key={plan.id} className={`relative ${plan.tier === 'pro' ? 'border-primary' : ''}`}>
                {plan.tier === 'pro' && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div>
                      <span className="text-3xl font-bold">${plan.price_monthly}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div>
                      <span className="text-xl font-semibold">${plan.price_biweekly}</span>
                      <span className="text-muted-foreground">/2 weeks</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {plan.features.manual_trades && <li>✓ Manual Trading</li>}
                      {plan.features.risk_management && <li>✓ Risk Management</li>}
                      {plan.features.trailing_stops && <li>✓ Trailing Stops & Breakeven</li>}
                      {plan.features.all_pairs && <li>✓ All Currency Pairs</li>}
                      {plan.features.ai_mode && <li>✓ AI Trading Mode</li>}
                      {plan.features.auto_lot_sizing && <li>✓ Automatic Lot Sizing</li>}
                      {plan.features.scalp_strategy && <li>✓ Scalping Strategy</li>}
                      {plan.features.custom_configs && <li>✓ Custom Configurations</li>}
                      {plan.features.smc_strategy && <li>✓ SMC Strategy</li>}
                      {plan.features.break_retest && <li>✓ Break & Retest</li>}
                      {plan.features.full_automation && <li>✓ Full Automation</li>}
                      {plan.features.unlimited_demos && <li>✓ Unlimited Demo Sessions</li>}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(plan.tier, true)}
                      disabled={!!subscribing}
                    >
                      {subscribing === plan.tier ? 'Processing...' : 'Subscribe Monthly'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSubscribe(plan.tier, false)}
                      disabled={!!subscribing}
                    >
                      {subscribing === plan.tier ? 'Processing...' : 'Subscribe Bi-weekly'}
                    </Button>
                    
                    {canStartTrial(plan.max_trial_sessions) && (
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => handleStartTrial(plan.tier)}
                        disabled={!!subscribing}
                      >
                        {subscribing === `trial-${plan.tier}` ? 'Starting...' : `Start Free Trial (${plan.max_trial_sessions - (profile?.trial_count || 0)} left)`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>All plans include 24/7 support and regular updates. Cancel anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;