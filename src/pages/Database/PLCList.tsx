import { Database } from 'lucide-react';

export default function PLCList() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-border-accent flex items-center justify-center shadow-accent">
        <Database className="w-8 h-8 text-accent" />
      </div>
      <h1 className="font-mono text-2xl font-bold text-text-primary">Katalog PLC</h1>
      <p className="text-text-muted font-sans text-sm max-w-sm">
        Database hardware PLC: Siemens, Mitsubishi, Schneider, Omron, dan lainnya.
      </p>
      <span className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-border-accent">
        🚧 Dalam Pembangunan
      </span>
    </div>
  );
}
