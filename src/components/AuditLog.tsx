import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  User, 
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'critical';
  ip?: string;
}

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    user: 'System',
    action: 'EMERGENCY_STOP',
    details: 'Emergency stop activated by user',
    type: 'critical',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    user: 'Admin',
    action: 'CONFIG_UPDATE',
    details: 'Risk parameters updated: maxExposure = 25%',
    type: 'warning',
    ip: '192.168.1.100'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    user: 'System',
    action: 'POSITION_CLOSE',
    details: 'EURUSD position closed automatically (SL triggered)',
    type: 'info'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 480000).toISOString(),
    user: 'Admin',
    action: 'BOT_START',
    details: 'Trading bot started in DEMO mode',
    type: 'info',
    ip: '192.168.1.100'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 720000).toISOString(),
    user: 'Admin',
    action: 'LOGIN',
    details: 'User authenticated successfully',
    type: 'info',
    ip: '192.168.1.100'
  }
];

export function AuditLog() {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-trading-loss" />;
      case 'warning':
        return <Activity className="h-3 w-3 text-yellow-500" />;
      default:
        return <CheckCircle className="h-3 w-3 text-trading-profit" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">CRITICAL</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">WARNING</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">INFO</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Audit Log</span>
        </CardTitle>
        <CardDescription>
          Recent system actions and user commands for compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {mockAuditEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(entry.type)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{entry.action}</span>
                        {getTypeBadge(entry.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{entry.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(entry.timestamp)}</span>
                        </div>
                        {entry.ip && (
                          <span className="font-mono">{entry.ip}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}