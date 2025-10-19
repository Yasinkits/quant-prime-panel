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

  const handleStartTrial = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const trialSessionsUsed = profile?.trial_sessions_used || 0;
    if (trialSessionsUsed >= 2) {
      toast.error("You've already used your 2 trial sessions");
      return;
    }

    setSubscribing('trial');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'trial',
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Trial started! You have 2 demo sessions.');
      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to start trial. Please try again.');
    } finally {
      setSubscribing('');
    }
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Trading Plan</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Select the perfect plan for your trading needs
            </p>
            {user && profile && (
              <p className="text-sm text-muted-foreground">
                Current plan: <span className="font-semibold capitalize">{profile.subscription_tier || 'None'}</span>
                {profile.subscription_tier === 'trial' && ` (${2 - (profile.trial_sessions_used || 0)} demo sessions left)`}
              </p>
            )}
          </div>
          
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
                  {plan.price_monthly === 0 ? (
                    <div className="py-4">
                      <span className="text-3xl font-bold">Free</span>
                      <p className="text-sm text-muted-foreground mt-2">2 Demo Sessions</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <span className="text-3xl font-bold">${plan.price_monthly}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {plan.price_biweekly > 0 && plan.tier !== 'premium' && (
                        <div>
                          <span className="text-xl font-semibold">${plan.price_biweekly}</span>
                          <span className="text-muted-foreground">/2 weeks</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.tier === 'basic' && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Manual Trade Execution</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Account Details & Charts</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Safety Controls</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">2 Demo Trial Sessions</span>
                        </div>
                      </>
                    )}

                    {plan.tier === 'pro' && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm font-medium">Everything in Basic</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">AutoLot Sizing of Trades</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Scalp Trading Mode</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Day Trading Model</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">AI Trading</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Custom Configuration</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Connect 1 MT5 Account</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Bot with Configuration</span>
                        </div>
                      </>
                    )}

                    {plan.tier === 'premium' && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm font-medium">Everything in Basic & Pro</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Advanced Trading Strategies</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Smart Money Concepts</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Break and Retest Strategy</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Full Automation</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Priority Support</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">Auto Risk Management</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-trading-profit">✓</span>
                          <span className="text-sm">10 Demo Trial Sessions</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {plan.tier === 'basic' && plan.price_monthly === 0 ? (
                      <Button 
                        onClick={handleStartTrial}
                        disabled={subscribing === 'trial' || (profile?.trial_sessions_used || 0) >= 2}
                        className="w-full"
                      >
                        {subscribing === 'trial' ? 'Starting...' : 'Start Free Trial'}
                      </Button>
                    ) : (
                      <>
                        <Button 
                          className="w-full" 
                          onClick={() => handleSubscribe(plan.tier, true)}
                          disabled={!!subscribing}
                        >
                          {subscribing === plan.tier ? 'Processing...' : `Subscribe - $${plan.price_monthly}/month`}
                        </Button>
                        {plan.price_biweekly > 0 && plan.tier !== 'premium' && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleSubscribe(plan.tier, false)}
                            disabled={!!subscribing}
                          >
                            {subscribing === plan.tier ? 'Processing...' : `Subscribe - $${plan.price_biweekly}/2 weeks`}
                          </Button>
                        )}
                      </>
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