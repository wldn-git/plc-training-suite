import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { 
  Share2, Zap, Database
} from 'lucide-react';
import { MQTTConsole } from './MQTTConsole';
import { ModbusSim } from './ModbusSim';

export default function ProtocolCenter() {
  const [activeTab, setActiveTab] = useState<'mqtt' | 'modbus'>('mqtt');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
               <Share2 size={18} />
            </div>
            <Badge variant="accent" className="text-[10px] uppercase font-black tracking-widest px-2">Comm Interface</Badge>
          </div>
          <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">
            Protocol <span className="text-accent">Center</span>
          </h1>
          <p className="text-text-dim text-sm font-medium">Monitoring & Simulasi Interaktif Protokol Industri.</p>
        </div>

        <div className="flex bg-bg-surface border border-border p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setActiveTab('mqtt')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
              ${activeTab === 'mqtt' ? 'bg-accent text-bg shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'}
            `}
          >
            <Zap size={14} /> MQTT PRO
          </button>
          <button
            onClick={() => setActiveTab('modbus')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
              ${activeTab === 'modbus' ? 'bg-accent text-bg shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'}
            `}
          >
            <Database size={14} /> MODBUS TCP
          </button>
        </div>
      </header>

      {/* Main content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'mqtt' ? (
            <motion.div
              key="mqtt"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MQTTConsole />
            </motion.div>
          ) : (
            <motion.div
              key="modbus"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ModbusSim />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
