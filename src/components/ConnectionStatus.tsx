import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  Settings, 
  Activity,
  Timer,
  Zap
} from "lucide-react";
import { MT5LoginModal } from './MT5LoginModal';

interface ConnectionInfo {
  isConnected: boolean;
  account: string;
  balance: number;
  leverage: string;
  server: string;
  lastHeartbeat: string;
  latency: number;
  reconnectAttempts: number;
}

export function ConnectionStatus() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [connectionInfo] = useState<ConnectionInfo>({
    isConnected: true,
    account: "12345678",
    balance: 50000.00,
    leverage: "1:500",
    server: "MetaQuotes-Demo",
    lastHeartbeat: "2 seconds ago",
    latency: 12,
    reconnectAttempts: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">MT5 Connection</CardTitle>
            <CardDescription>Account & Server Status</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowLoginModal(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {connectionInfo.isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-trading-profit" />
                  <Badge variant="default" className="bg-trading-profit/10 text-trading-profit border-trading-profit/20">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-trading-loss" />
                  <Badge variant="destructive">Disconnected</Badge>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Account</p>
              <p className="font-mono text-sm">{connectionInfo.account}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Balance</p>
              <p className="font-semibold">{formatCurrency(connectionInfo.balance)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Leverage</p>
              <p className="font-semibold">{connectionInfo.leverage}</p>
            </div>
          </div>

          {/* Server & Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Server</span>
              <span className="font-mono">{connectionInfo.server}</span>
            </div>
            
            {connectionInfo.isConnected && (
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Heartbeat</span>
                  </div>
                  <span>{connectionInfo.lastHeartbeat}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Timer className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Latency</span>
                  </div>
                  <span className={connectionInfo.latency < 50 ? 'text-trading-profit' : 'text-yellow-500'}>
                    {connectionInfo.latency}ms
                  </span>
                </div>
                
                {connectionInfo.reconnectAttempts > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Reconnect Attempts</span>
                    </div>
                    <span className="text-yellow-500">{connectionInfo.reconnectAttempts}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MT5LoginModal 
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}