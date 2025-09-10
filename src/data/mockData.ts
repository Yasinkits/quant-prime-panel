// Mock data for the trading bot interface

import { 
  BotStatus, 
  AccountInfo, 
  Position, 
  Trade, 
  BotConfig, 
  RiskMetrics, 
  TradingSignal,
  SystemMetrics,
  LogEntry
} from "@/types/trading";

export const mockBotStatus: BotStatus = {
  isRunning: true,
  mode: 'DEMO',
  lastUpdate: new Date().toISOString(),
  connectionStatus: 'CONNECTED',
  uptime: 14523
};

export const mockAccountInfo: AccountInfo = {
  balance: 50000.00,
  equity: 52347.85,
  freeMargin: 48932.15,
  marginLevel: 2847.3,
  dailyPnL: 847.85,
  totalPnL: 2347.85,
  currency: 'USD'
};

export const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.10,
    openPrice: 1.0876,
    currentPrice: 1.0892,
    pnl: 160.00,
    pnlPips: 16.0,
    swap: -2.50,
    commission: -7.00,
    openTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    stopLoss: 1.0826,
    takeProfit: 1.0926
  },
  {
    id: '2',
    symbol: 'GBPUSD',
    type: 'SELL',
    volume: 0.15,
    openPrice: 1.2654,
    currentPrice: 1.2638,
    pnl: 240.00,
    pnlPips: 16.0,
    swap: -1.20,
    commission: -10.50,
    openTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    stopLoss: 1.2704,
    takeProfit: 1.2604
  },
  {
    id: '3',
    symbol: 'USDJPY',
    type: 'BUY',
    volume: 0.08,
    openPrice: 149.32,
    currentPrice: 149.18,
    pnl: -112.00,
    pnlPips: -14.0,
    swap: 3.50,
    commission: -5.60,
    openTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    stopLoss: 148.82,
    takeProfit: 149.82
  }
];

export const mockTrades: Trade[] = [
  {
    id: 't1',
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.10,
    openPrice: 1.0854,
    closePrice: 1.0879,
    pnl: 250.00,
    pnlPips: 25.0,
    commission: -7.00,
    swap: -1.50,
    openTime: new Date(Date.now() - 86400000).toISOString(),
    closeTime: new Date(Date.now() - 82800000).toISOString(),
    duration: 3600,
    strategy: 'AI_TREND'
  },
  {
    id: 't2',
    symbol: 'GBPUSD',
    type: 'SELL',
    volume: 0.12,
    openPrice: 1.2678,
    closePrice: 1.2642,
    pnl: 432.00,
    pnlPips: 36.0,
    commission: -8.40,
    swap: -2.10,
    openTime: new Date(Date.now() - 172800000).toISOString(),
    closeTime: new Date(Date.now() - 169200000).toISOString(),
    duration: 3600,
    strategy: 'AI_REVERSAL'
  }
];

export const mockBotConfig: BotConfig = {
  tradingMode: 'DEMO',
  symbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
  signalMode: 'ai',
  lotSize: 0.10,
  riskPerTrade: 2.0,
  maxDailyTrades: 10,
  maxConcurrentPositions: 5,
  loopInterval: 30,
  stopLoss: 50,
  takeProfit: 100,
  aiConfidenceThreshold: 75,
  maxDrawdown: 15,
  dailyLossLimit: 5
};

export const mockRiskMetrics: RiskMetrics = {
  currentDrawdown: 3.2,
  maxDrawdown: 8.7,
  winRate: 68.5,
  profitFactor: 1.85,
  sharpeRatio: 2.14,
  totalTrades: 247,
  winningTrades: 169,
  losingTrades: 78,
  averageWin: 127.50,
  averageLoss: -68.20
};

export const mockTradingSignals: TradingSignal[] = [
  {
    symbol: 'EURUSD',
    signal: 'BUY',
    confidence: 87,
    price: 1.0876,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    source: 'AI',
    reasoning: 'Strong bullish momentum with high volume confirmation'
  },
  {
    symbol: 'GBPUSD',
    signal: 'SELL',
    confidence: 82,
    price: 1.2654,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    source: 'AI',
    reasoning: 'Bearish divergence detected with overbought conditions'
  },
  {
    symbol: 'USDJPY',
    signal: 'HOLD',
    confidence: 45,
    price: 149.32,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    source: 'INDICATOR',
    reasoning: 'Consolidation phase, waiting for clear direction'
  }
];

export const mockSystemMetrics: SystemMetrics = {
  cpuUsage: 15.2,
  memoryUsage: 342.5,
  latency: 12,
  mt5ConnectionStatus: 'ONLINE',
  lastPingTime: 8
};

export const mockLogEntries: LogEntry[] = [
  {
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'AI model prediction: EURUSD BUY signal with 87% confidence',
    module: 'AI_ENGINE'
  },
  {
    timestamp: new Date(Date.now() - 60000).toISOString(),
    level: 'INFO',
    message: 'Position opened: GBPUSD SELL 0.15 lots at 1.2654',
    module: 'TRADING_ENGINE'
  },
  {
    timestamp: new Date(Date.now() - 120000).toISOString(),
    level: 'WARNING',
    message: 'High spread detected on USDJPY: 2.1 pips',
    module: 'MARKET_MONITOR'
  },
  {
    timestamp: new Date(Date.now() - 180000).toISOString(),
    level: 'INFO',
    message: 'Daily risk check: 2.3% of daily limit used',
    module: 'RISK_MANAGER'
  },
  {
    timestamp: new Date(Date.now() - 240000).toISOString(),
    level: 'INFO',
    message: 'MT5 connection established successfully',
    module: 'CONNECTION'
  }
];

// Chart data for price visualization
export const mockPriceData = {
  EURUSD: [
    { time: '09:00', price: 1.0854, volume: 1250 },
    { time: '09:30', price: 1.0867, volume: 1890 },
    { time: '10:00', price: 1.0876, volume: 2340 },
    { time: '10:30', price: 1.0892, volume: 1670 },
    { time: '11:00', price: 1.0887, volume: 1420 }
  ],
  GBPUSD: [
    { time: '09:00', price: 1.2678, volume: 980 },
    { time: '09:30', price: 1.2665, volume: 1230 },
    { time: '10:00', price: 1.2654, volume: 1560 },
    { time: '10:30', price: 1.2638, volume: 1890 },
    { time: '11:00', price: 1.2642, volume: 1340 }
  ],
  USDJPY: [
    { time: '09:00', price: 149.45, volume: 1120 },
    { time: '09:30', price: 149.38, volume: 1450 },
    { time: '10:00', price: 149.32, volume: 1680 },
    { time: '10:30', price: 149.18, volume: 1290 },
    { time: '11:00', price: 149.25, volume: 1010 }
  ]
};