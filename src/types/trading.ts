// Trading Bot Types and Interfaces

export interface BotStatus {
  isRunning: boolean;
  mode: 'REAL' | 'DEMO';
  lastUpdate: string;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  uptime: number;
}

export interface AccountInfo {
  balance: number;
  equity: number;
  freeMargin: number;
  marginLevel: number;
  dailyPnL: number;
  totalPnL: number;
  currency: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPips: number;
  swap: number;
  commission: number;
  openTime: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  closePrice: number;
  pnl: number;
  pnlPips: number;
  commission: number;
  swap: number;
  openTime: string;
  closeTime: string;
  duration: number;
  strategy: string;
}

export interface BotConfig {
  tradingMode: 'REAL' | 'DEMO';
  symbols: string[];
  signalMode: 'indicator' | 'ai';
  lotSize: number;
  riskPerTrade: number;
  maxDailyTrades: number;
  maxConcurrentPositions: number;
  loopInterval: number;
  stopLoss: number;
  takeProfit: number;
  aiConfidenceThreshold: number;
  maxDrawdown: number;
  dailyLossLimit: number;
}

export interface PriceData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  timestamp: string;
}

export interface TradingSignal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: string;
  source: 'AI' | 'INDICATOR';
  reasoning?: string;
}

export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  latency: number;
  mt5ConnectionStatus: 'ONLINE' | 'OFFLINE';
  lastPingTime: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  message: string;
  module: string;
}