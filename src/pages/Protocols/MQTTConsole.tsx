import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Input, Label } from '@/components/ui';
import { 
  Send, Radio, Trash2, 
  Activity, Terminal 
} from 'lucide-react';
import mqtt, { type MqttClient } from 'mqtt';

interface Message {
  id: string;
  topic: string;
  payload: string;
  timestamp: Date;
  direction: 'in' | 'out';
}

export function MQTTConsole() {
  const [pubTopic, setPubTopic] = useState('plts/lab-01/command');
  const [pubPayload, setPubPayload] = useState('{"state": true}');
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');
  const [client, setClient] = useState<MqttClient | null>(null);
  const [role, setRole] = useState<'master' | 'slave'>('master');
  const subTopic = 'plts/lab-01/#';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connect = () => {
    if (client) client.end();
    
    setStatus('connecting');
    const newClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: `plts_console_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      connectTimeout: 5000,
    });

    newClient.on('connect', () => {
      setStatus('connected');
      newClient.subscribe(subTopic);
    });

    newClient.on('message', (topic, message) => {
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        payload: message.toString(),
        timestamp: new Date(),
        direction: 'in',
      };
      setMessages(prev => [newMessage, ...prev].slice(0, 50));
    });

    newClient.on('error', () => setStatus('error'));
    newClient.on('close', () => setStatus('disconnected'));

    setClient(newClient);
  };

  const publish = () => {
    if (client && status === 'connected') {
      client.publish(pubTopic, pubPayload);
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        topic: pubTopic,
        payload: pubPayload,
        timestamp: new Date(),
        direction: 'out',
      };
      setMessages(prev => [newMessage, ...prev].slice(0, 50));
    }
  };

  const clearLog = () => setMessages([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuration & Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Radio size={16} className="text-accent" /> Connection
            </h3>
            <Badge 
              variant={status === 'connected' ? 'success' : status === 'connecting' ? 'warning' : 'danger'}
              className="px-2 py-0.5 text-[10px]"
            >
              {status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-[10px] text-text-dim uppercase font-bold">Broker URL</Label>
              <div className="text-xs font-mono text-text-primary truncate p-2 bg-bg-elevated rounded-lg border border-border mt-1">
                wss://broker.emqx.io:8084/mqtt
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant={role === 'master' ? 'primary' : 'outline'}
              onClick={() => setRole('master')}
            >
              Master Mode
            </Button>
            <Button 
              size="sm" 
              variant={role === 'slave' ? 'primary' : 'outline'}
              onClick={() => setRole('slave')}
            >
              Slave Mode
            </Button>

            <Button 
              fullWidth 
              size="sm"
              onClick={connect}
              disabled={status === 'connecting'}
              variant={status === 'connected' ? 'outline' : 'primary'}
            >
              {status === 'connected' ? 'Reconnect' : 'Connect to Broker'}
            </Button>
          </div>
        </Card>

        {/* Publish Panel */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Send size={16} className="text-emerald-400" /> Publish Message
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-text-dim uppercase font-bold">Topic</Label>
              <Input 
                value={pubTopic} 
                onChange={e => setPubTopic(e.target.value)} 
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-text-dim uppercase font-bold">Payload</Label>
              <textarea 
                value={pubPayload}
                onChange={e => setPubPayload(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-xl p-3 text-xs font-mono h-24 focus:outline-none focus:border-accent"
              />
            </div>
            <Button 
              fullWidth 
              size="sm"
              onClick={publish}
              disabled={status !== 'connected'}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              Send Message
            </Button>
          </div>
        </Card>
      </div>

      {/* Messages Log */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col overflow-hidden border-border/40">
          <div className="bg-bg-elevated p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Terminal size={18} className="text-accent" />
               <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Protocol Traffic Log</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={clearLog} className="h-8 w-8 p-0">
              <Trash2 size={14} className="text-text-dim hover:text-danger" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-vibrant max-h-[600px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <Activity size={48} className="mb-4 animate-pulse" />
                <p className="text-xs font-mono uppercase tracking-widest">Awaiting traffic...</p>
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`
                    p-3 rounded-lg border animate-slide-up
                    ${msg.direction === 'out' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-accent/5 border-accent/20'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-mono font-bold uppercase ${msg.direction === 'out' ? 'text-emerald-400' : 'text-accent'}`}>
                      {msg.direction === 'out' ? '► PUBLISHED' : '◄ RECEIVED'}
                    </span>
                    <span className="text-[9px] text-text-dim font-mono">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted mb-1 font-mono">
                    TOPIC: <span className="text-text-primary">{msg.topic}</span>
                  </div>
                  <pre className="text-xs font-mono text-text-primary bg-black/40 p-2 rounded border border-white/5 overflow-x-auto">
                    {msg.payload}
                  </pre>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </Card>
      </div>
    </div>
  );
}
