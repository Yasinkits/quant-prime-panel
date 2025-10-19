import { v4 as uuidv4 } from 'uuid';
import { Position, Trade, LogEntry } from '@/types/trading';

// Mock data for the trading bot application

export const mockPositions: Position[] = [
  {
    id: uuidv4(),
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.1,
    openPrice: 1.0875,
    currentPrice: 1.0890,
    pnl: 15.0,
    pnlPips: 1.5,
    swap: 0,
    commission: -2.5,
    openTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    stopLoss: 1.0825,
    takeProfit: 1.0925
  },
  {
    id: uuidv4(),
    symbol: 'GBPUSD',
    type: 'SELL',
    volume: 0.05,
    openPrice: 1.2634,
    currentPrice: 1.2620,
    pnl: 7.0,
    pnlPips: 1.4,
    swap: -1.2,
    commission: -1.25,
    openTime: new Date(Date.now() - 1.25 * 60 * 60 * 1000).toISOString(), // 1.25 hours ago
    stopLoss: 1.2684,
    takeProfit: 1.2584
  },
  {
    id: uuidv4(),
    symbol: 'XAUUSD',
    type: 'BUY',
    volume: 0.02,
    openPrice: 2024.50,
    currentPrice: 2031.20,
    pnl: 134.0,
    pnlPips: 6.7,
    swap: 0,
    commission: -4.0,
    openTime: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), // 30 minutes ago
    stopLoss: 2010.00,
    takeProfit: 2050.00
  }
];

export const mockTrades: Trade[] = [
  {
    id: uuidv4(),
    symbol: 'XAUUSD',
    type: 'BUY',
    volume: 0.01,
    openPrice: 2024.50,
    closePrice: 2036.80,
    pnl: 123.0,
    pnlPips: 12.3,
    commission: -5.0,
    swap: 0,
    openTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    closeTime: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
    duration: 2 * 60 * 60, // 2 hours in seconds
    strategy: 'AI_MOMENTUM'
  },
  {
    id: uuidv4(),
    symbol: 'EURUSD',
    type: 'SELL',
    volume: 0.1,
    openPrice: 1.0885,
    closePrice: 1.0870,
    pnl: 15.0,
    pnlPips: 1.5,
    commission: -2.5,
    swap: -0.5,
    openTime: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    closeTime: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    duration: 2 * 60 * 60,
    strategy: 'AI_REVERSAL'
  }
];

export const mockLogEntries: LogEntry[] = [
  {
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    level: 'INFO',
    message: 'Position EURUSD updated: P&L +$15.00',
    module: 'POSITIONS'
  },
  {
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'AI signal detected: BUY XAUUSD (confidence: 89%)',
    module: 'AI'
  },
  {
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    level: 'WARNING',
    message: 'High volatility detected in GBPUSD',
    module: 'RISK'
  },
  {
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'Connected to MT5 server: MetaQuotes-Demo',
    module: 'MT5'
  },
  {
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    level: 'INFO',
    message: 'Bot started successfully in DEMO mode',
    module: 'CORE'
  }
];

export const mockAuditEntries = [
  {
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    action: 'POSITION_OPEN',
    user: 'ai_engine',
    details: 'Opened BUY XAUUSD 0.02 lots at 2024.50'
  },
  {
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    action: 'POSITION_OPEN',
    user: 'ai_engine',
    details: 'Opened SELL GBPUSD 0.05 lots at 1.2634'
  },
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    action: 'POSITION_OPEN',
    user: 'ai_engine',
    details: 'Opened BUY EURUSD 0.1 lots at 1.0875'
  },
  {
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    action: 'CONFIG_UPDATE',
    user: 'john.doe@example.com',
    details: 'Updated risk per trade from 1% to 2%'
  },
  {
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    action: 'BOT_START',
    user: 'system',
    details: 'Bot started in DEMO mode'
  }
];

// Additional mock data
export const mockAccountInfo = {
  balance: 50000.00,
  equity: 52347.85,
  freeMargin: 48932.15,
  marginLevel: 2847.3,
  dailyPnL: 847.85,
  totalPnL: 2347.85,
  currency: 'USD',
  openPositions: 3,
  profit: 2347.85,
  profitPercentage: 4.70
};

export const mockRiskMetrics = {
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

export const mockTradingSignals = [
  {
    symbol: 'EURUSD',
    signal: 'BUY' as const,
    confidence: 87,
    price: 1.0876,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    source: 'AI' as const,
    reasoning: 'Strong bullish momentum with high volume confirmation'
  }
];

export const mockPriceData = {
  EURUSD: [
    { time: '09:00', price: 1.0854, volume: 1250 },
    { time: '10:00', price: 1.0876, volume: 2340 },
    { time: '11:00', price: 1.0887, volume: 1420 }
  ]
};