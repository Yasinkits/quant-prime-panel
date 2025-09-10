import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ScrollArea 
} from "@/components/ui/scroll-area";
import { 
  Terminal, 
  Search, 
  Download, 
  Filter,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug
} from "lucide-react";
import { LogEntry } from '@/types/trading';

interface LogViewerProps {
  logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-status-error" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      case 'DEBUG':
        return <Bug className="w-4 h-4 text-trading-info" />;
      default:
        return <Info className="w-4 h-4 text-trading-neutral" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-status-error';
      case 'WARNING':
        return 'text-status-warning';
      case 'DEBUG':
        return 'text-trading-info';
      default:
        return 'text-foreground';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    
    return matchesSearch && matchesLevel && matchesModule;
  });

  const uniqueModules = Array.from(new Set(logs.map(log => log.module)));

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="w-5 h-5" />
            <span>System Logs</span>
            <Badge variant="secondary">{filteredLogs.length}</Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="DEBUG">Debug</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Modules</SelectItem>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-80 w-full">
          <div className="space-y-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No logs match the current filters
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-2 rounded-sm hover:bg-muted/50 transition-colors font-mono text-sm"
                >
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground min-w-24">
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-16">
                    {getLogIcon(log.level)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getLogLevelColor(log.level)} border-current`}
                    >
                      {log.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center min-w-32">
                    <Badge variant="secondary" className="text-xs">
                      {log.module}
                    </Badge>
                  </div>
                  
                  <div className={`flex-1 ${getLogLevelColor(log.level)}`}>
                    {log.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Log Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Total: {logs.length} entries</span>
            <span>Filtered: {filteredLogs.length} entries</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-status-error"></div>
              <span>{logs.filter(l => l.level === 'ERROR').length} Errors</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-status-warning"></div>
              <span>{logs.filter(l => l.level === 'WARNING').length} Warnings</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}