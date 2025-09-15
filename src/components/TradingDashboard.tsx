import { useState, useEffect } from 'react';
import { TradingHeader } from './TradingHeader';
import { TradingOverview } from './TradingOverview';
import { PositionsTable } from './PositionsTable';
import { BotConfigPanel } from './BotConfigPanel';
import { TradingChart } from './TradingChart';
import { LogViewer } from './LogViewer';
import { ConnectionStatus } from './ConnectionStatus';
import { SafetyControls } from './SafetyControls';
import { AuditLog } from './AuditLog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockBotStatus,
  mockAccountInfo,
  mockPositions,
  mockBotConfig,
  mockRiskMetrics,
  mockTradingSignals,
  mockLogEntries
} from '@/data/mockData';
import { BotStatus, AccountInfo, Position, BotConfig } from '@/types/trading';

export function TradingDashboard() {
  const [botStatus, setBotStatus] = useState<BotStatus>(mockBotStatus);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>(mockAccountInfo);
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [config, setConfig] = useState<BotConfig>(mockBotConfig);
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update account info with small random changes
      setAccountInfo(prev => ({
        ...prev,
        equity: prev.balance + Math.random() * 1000 - 500,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 10
      }));

      // Update position prices with small random movements
      setPositions(prev => prev.map(pos => ({
        ...pos,
        currentPrice: pos.currentPrice + (Math.random() - 0.5) * 0.0010,
        pnl: pos.pnl + (Math.random() - 0.5) * 20
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleBot = () => {
    setBotStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
    toast({
      title: botStatus.isRunning ? "Bot Stopped" : "Bot Started",
      description: botStatus.isRunning 
        ? "Trading bot has been stopped safely" 
        : "Trading bot is now running",
    });
  };

  const handleEmergencyStop = () => {
    setBotStatus(prev => ({ ...prev, isRunning: false }));
    toast({
      title: "Emergency Stop Activated",
      description: "All trading activities have been halted immediately",
      variant: "destructive",
    });
  };

  const handleClosePosition = (id: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
    toast({
      title: "Position Closed",
      description: "Position has been closed successfully",
    });
  };

  const handleModifyPosition = (id: string) => {
    toast({
      title: "Position Modification",
      description: "Position modification panel would open here",
    });
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Bot configuration has been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TradingHeader
        botStatus={botStatus}
        accountInfo={accountInfo}
        onToggleBot={handleToggleBot}
        onEmergencyStop={handleEmergencyStop}
        user={user}
        profile={profile}
        onLogout={signOut}
      />
      
      <main className="container mx-auto p-6 space-y-8">
        {/* Overview Cards */}
        <TradingOverview
          accountInfo={accountInfo}
          riskMetrics={mockRiskMetrics}
          signals={mockTradingSignals}
        />

        {/* Connection & Safety Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConnectionStatus />
          <SafetyControls />
          <AuditLog />
        </div>

        {/* Charts and Positions Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TradingChart symbols={['EURUSD', 'GBPUSD', 'USDJPY']} />
          <PositionsTable
            positions={positions}
            onClosePosition={handleClosePosition}
            onModifyPosition={handleModifyPosition}
          />
        </div>

        {/* Configuration Panel */}
        <BotConfigPanel
          config={config}
          onConfigChange={setConfig}
          onSaveConfig={handleSaveConfig}
        />

        {/* Log Viewer */}
        <LogViewer logs={mockLogEntries} />
      </main>
    </div>
  );
}