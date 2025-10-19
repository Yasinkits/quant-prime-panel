import React, { useState, useEffect } from 'react';
import { TradingHeader } from './TradingHeader';
import { TradingChart } from './TradingChart';
import { PositionsTable } from './PositionsTable';
import { BotConfigPanel } from './BotConfigPanel';
import { SafetyControls } from './SafetyControls';
import { ConnectionStatus } from './ConnectionStatus';
import { MT5LoginModal } from './MT5LoginModal';
import { ManualTradeExecution } from './ManualTradeExecution';
import { AccountDetailsCard } from './AccountDetailsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockPositions, mockAccountInfo } from '@/data/mockData';
import { Position, BotConfig, BotStatus } from '@/types/trading';
import { LayoutDashboard, Link as LinkIcon, TrendingUp } from 'lucide-react';

export function TradingDashboard() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [showMT5Modal, setShowMT5Modal] = useState(false);
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
  const isTrialExpired = profile?.subscription_tier === 'basic' && 
    (profile?.trial_sessions_used || 0) >= 2;
  const isPremium = profile?.subscription_tier === 'premium';
  const isPro = profile?.subscription_tier === 'pro';
  const isBasic = profile?.subscription_tier === 'basic';

  return (
    <div className="min-h-screen bg-background">
      <TradingHeader 
        user={user}
        profile={profile}
        onSignOut={signOut}
        onMT5Connect={() => setShowMT5Modal(true)}
      />
      
      <div className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="mt5" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">MT5 Account</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <AccountDetailsCard accountInfo={mockAccountInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PositionsTable 
                  positions={positions}
                  onClosePosition={handleClosePosition}
                  onModifyPosition={handleModifyPosition}
                />

                <TradingChart symbols={['EURUSD', 'GBPUSD', 'XAUUSD']} />

                {isBasic && <ManualTradeExecution />}
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
                
                <SafetyControls />
              </div>
            </div>
          </TabsContent>

          {/* MT5 Account Tab */}
          <TabsContent value="mt5" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ConnectionStatus 
                  botStatus={botStatus} 
                  onStart={handleStartBot}
                  onStop={handleStopBot}
                  canStartBot={canStartBot}
                  subscriptionTier={profile?.subscription_tier}
                />
              </div>
              
              <div>
                <SafetyControls />
              </div>
            </div>

            <Button 
              onClick={() => setShowMT5Modal(true)}
              className="w-full sm:w-auto"
            >
              Configure MT5 Connection
            </Button>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <AccountDetailsCard accountInfo={mockAccountInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingChart symbols={['EURUSD', 'GBPUSD', 'XAUUSD']} />

              <PositionsTable 
                positions={positions}
                onClosePosition={handleClosePosition}
                onModifyPosition={handleModifyPosition}
              />
            </div>

            {(isPro || isPremium) && (
              <BotConfigPanel 
                config={botConfig}
                onChange={setBotConfig}
              />
            )}
          </TabsContent>
        </Tabs>

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

      <MT5LoginModal 
        open={showMT5Modal}
        onClose={() => setShowMT5Modal(false)}
      />
    </div>
  );
}