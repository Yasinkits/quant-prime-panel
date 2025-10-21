import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { MT5StatusIndicator } from './MT5StatusIndicator';
import { PositionsTable } from './PositionsTable';
import { BotConfigPanel } from './BotConfigPanel';
import { SafetyControls } from './SafetyControls';
import { ConnectionStatus } from './ConnectionStatus';
import { MT5LoginModal } from './MT5LoginModal';
import { ManualTradeExecution } from './ManualTradeExecution';
import { AccountDetailsCard } from './AccountDetailsCard';
import { PremiumStrategies } from './PremiumStrategies';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockPositions, mockAccountInfo } from '@/data/mockData';
import { Position, BotConfig, BotStatus } from '@/types/trading';

export function TradingDashboard() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [botStatus, setBotStatus] = useState<BotStatus>({
    isRunning: false,
    mode: 'DEMO',
    lastUpdate: new Date().toISOString(),
    connectionStatus: 'DISCONNECTED',
    uptime: 0
  });

  const [botConfig, setBotConfig] = useState<BotConfig>({
    tradingMode: 'DEMO',
    symbols: ['EURUSD', 'GBPUSD', 'XAUUSD'],
    signalMode: 'ai',
    lotSize: 0.01,
    riskPerTrade: 2,
    maxDailyTrades: 10,
    maxConcurrentPositions: 3,
    loopInterval: 5,
    stopLoss: 50,
    takeProfit: 100,
    aiConfidenceThreshold: 75,
    maxDrawdown: 10,
    dailyLossLimit: 100
  });

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prevPositions => 
        prevPositions.map(pos => ({
          ...pos,
          currentPrice: pos.currentPrice + (Math.random() - 0.5) * 0.0001,
          pnl: pos.pnl + (Math.random() - 0.5) * 10,
          pnlPips: pos.pnlPips + (Math.random() - 0.5) * 2
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClosePosition = (id: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
    toast({
      title: "Position Closed",
      description: `Position ${id} has been closed successfully`,
    });
  };

  const handleModifyPosition = (id: string) => {
    toast({
      title: "Modify Position",
      description: `Opening modification dialog for position ${id}`,
    });
  };

  const handleStartBot = () => {
    setBotStatus(prev => ({
      ...prev,
      isRunning: true,
      connectionStatus: 'CONNECTED',
      lastUpdate: new Date().toISOString()
    }));
    toast({
      title: "Bot Started",
      description: "Prime AI Bot is now running in " + botConfig.tradingMode + " mode",
    });
  };

  const handleStopBot = () => {
    setBotStatus(prev => ({
      ...prev,
      isRunning: false,
      connectionStatus: 'DISCONNECTED'
    }));
    toast({
      title: "Bot Stopped",
      description: "Prime AI Bot has been stopped",
      variant: "destructive"
    });
  };

  const canStartBot = profile?.subscription_tier === 'premium' || 
    (profile?.subscription_tier === 'pro');
  const isTrialExpired = (profile?.subscription_tier === 'trial' || profile?.subscription_tier === 'basic') && 
    (profile?.trial_sessions_used || 0) >= 2;
  const isPremium = profile?.subscription_tier === 'premium';
  const isPro = profile?.subscription_tier === 'pro';
  const isBasicOrTrial = profile?.subscription_tier === 'basic' || profile?.subscription_tier === 'trial';

  const DashboardView = () => (
    <div className="space-y-6">
      <AccountDetailsCard accountInfo={mockAccountInfo} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PositionsTable 
            positions={positions}
            onClosePosition={handleClosePosition}
            onModifyPosition={handleModifyPosition}
          />

          {isBasicOrTrial && <ManualTradeExecution />}
        </div>

        <div className="space-y-6">
          {(isPro || isPremium) && (
            <ConnectionStatus 
              botStatus={botStatus} 
              onStart={handleStartBot}
              onStop={handleStopBot}
              canStartBot={canStartBot}
              subscriptionTier={profile?.subscription_tier}
            />
          )}

          {isPro && (
            <BotConfigPanel 
              config={botConfig}
              onChange={setBotConfig}
            />
          )}

          {isPremium && <PremiumStrategies />}
          
          <SafetyControls />
        </div>
      </div>
    </div>
  );

  const mt5AccountElement = useMemo(() => (
    <div className="space-y-6">
      <MT5LoginModal open={true} onClose={() => {}} />
    </div>
  ), []);

  const performanceElement = useMemo(() => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Performance Analytics</h2>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        user={user}
        profile={profile}
        onSignOut={signOut}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* MT5 Status Indicator */}
          <MT5StatusIndicator isConnected={botStatus.connectionStatus === 'CONNECTED'} />

          {/* Dashboard Content with Routes */}
          <Routes>
            <Route index element={<DashboardView />} />
            <Route path="mt5-account" element={mt5AccountElement} />
            <Route path="performance" element={performanceElement} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </div>

      {isTrialExpired && (
        <div className="fixed bottom-4 right-4 bg-trading-warning text-black p-4 rounded-lg shadow-lg max-w-sm z-50">
          <h3 className="font-semibold mb-2">Trial Expired</h3>
          <p className="text-sm mb-3">Your 2 trial sessions have been used. Upgrade to continue trading.</p>
          <Button onClick={() => window.location.href = '/subscriptions'} size="sm">
            View Plans
          </Button>
        </div>
      )}
    </div>
  );
}