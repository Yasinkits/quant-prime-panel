import React, { useState, useEffect } from 'react';
import { TradingHeader } from './TradingHeader';
import { TradingOverview } from './TradingOverview';
import { TradingChart } from './TradingChart';
import { PositionsTable } from './PositionsTable';
import { LogViewer } from './LogViewer';
import { AuditLog } from './AuditLog';
import { BotConfigPanel } from './BotConfigPanel';
import { SafetyControls } from './SafetyControls';
import { ConnectionStatus } from './ConnectionStatus';
import { MT5LoginModal } from './MT5LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockPositions, mockTrades, mockAccountInfo, mockRiskMetrics, mockTradingSignals, mockLogEntries } from '@/data/mockData';
import { Position, BotConfig, BotStatus } from '@/types/trading';

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TradingHeader 
        user={user} 
        profile={profile} 
        onSignOut={signOut}
        onMT5Connect={() => setShowMT5Modal(true)}
      />
      
      <div className="p-6 space-y-6">
        {/* Top Row - Status and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConnectionStatus 
            botStatus={botStatus}
            onStart={handleStartBot}
            onStop={handleStopBot}
          />
          <TradingOverview 
            accountInfo={mockAccountInfo}
            riskMetrics={mockRiskMetrics}
            signals={mockTradingSignals}
          />
          <SafetyControls />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingChart symbols={['EURUSD', 'GBPUSD', 'XAUUSD']} />
          <BotConfigPanel 
            config={botConfig}
            onChange={setBotConfig}
          />
        </div>

        {/* Positions and Trading Data */}
        <PositionsTable 
          positions={positions}
          onClosePosition={handleClosePosition}
          onModifyPosition={handleModifyPosition}
        />

        {/* Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LogViewer logs={mockLogEntries} />
          <AuditLog />
        </div>
      </div>

      <MT5LoginModal 
        open={showMT5Modal}
        onClose={() => setShowMT5Modal(false)}
      />
    </div>
  );
}