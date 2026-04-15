import { useState } from 'react';
import { usePLCDatabase } from '@/hooks/usePLCDatabase';
import { Button, Card, Input, Badge } from '@/components/ui';
import { Plus, Search, Filter, Trash2, Edit2, Info, Cpu } from 'lucide-react';
import { PLCFormModal } from './PLCFormModal';
import type { PLCDevice } from '@/types/plc.types';

export default function PLCList() {
  const { devices, deleteDevice, addDevice, updateDevice } = usePLCDatabase();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<PLCDevice | null>(null);

  const filteredDevices = devices.filter(d => 
    d.brand.toLowerCase().includes(search.toLowerCase()) ||
    d.series.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (device: PLCDevice) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<PLCDevice, 'id' | 'createdAt'>) => {
    if (editingDevice) {
      updateDevice(editingDevice.id, data);
    } else {
      addDevice(data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold text-text-primary">Katalog Hardware PLC</h1>
          <p className="text-text-muted text-sm mt-1">Kelola daftar spesifikasi PLC untuk acuan simulasi dan wiring.</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={handleOpenAdd}>
          Tambah PLC Baru
        </Button>
      </div>

      {/* Control Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Cari merk atau seri PLC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter size={18} />}>Filter</Button>
          <Badge variant="accent" className="flex items-center">Total {devices.length}</Badge>
        </div>
      </Card>

      {/* List Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <Card key={device.id} hoverable className="flex flex-col group">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-border-accent flex items-center justify-center text-accent group-hover:shadow-accent transition-all">
                  <Cpu size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={device.supplyVoltage === '24VDC' ? 'success' : 'warning'}>
                    {device.supplyVoltage}
                  </Badge>
                  <span className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">
                    Added {new Date(device.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                  {device.brand}
                </h3>
                <p className="text-text-muted text-sm font-semibold">{device.series}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                  <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Digital I/O</p>
                  <p className="text-sm font-mono text-text-primary">
                    <span className="text-accent">{device.digitalInput}</span> / <span className="text-accent-dim">{device.digitalOutput}</span>
                  </p>
                </div>
                <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                  <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Analog I/O</p>
                  <p className="text-sm font-mono text-text-primary">
                   <span className="text-success">{device.analogInput}</span> / <span className="text-warning">{device.analogOutput}</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1">
                {device.communication.slice(0, 2).map(c => (
                  <Badge key={c} className="text-[9px] py-0 px-1.5 opacity-70">{c}</Badge>
                ))}
                {device.communication.length > 2 && <Badge className="text-[9px] py-0 px-1.5 opacity-70">+{device.communication.length - 2}</Badge>}
              </div>
            </div>

            <div className="px-4 py-3 bg-black/20 border-t border-border flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Detail">
                  <Info size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit" onClick={() => handleOpenEdit(device)}>
                  <Edit2 size={16} />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-danger hover:bg-danger/10" 
                title="Hapus"
                onClick={() => {
                  if(confirm(`Hapus ${device.brand} ${device.series}?`)) deleteDevice(device.id);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {filteredDevices.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="text-text-dim" size={32} />
            </div>
            <h3 className="font-mono text-lg font-bold">Tidak ada PLC ditemukan</h3>
            <p className="text-text-muted text-sm mt-1">Coba kata kunci pencarian lain atau tambah entri baru.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <PLCFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingDevice}
      />
    </div>
  );
}
