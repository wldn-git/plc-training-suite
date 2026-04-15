import React, { useEffect, useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import type { PLCDevice } from '@/types/plc.types';

interface PLCFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PLCDevice, 'id' | 'createdAt'>) => void;
  initialData?: PLCDevice | null;
}

export const PLCFormModal: React.FC<PLCFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<PLCDevice, 'id' | 'createdAt'>>({
    brand: '',
    series: '',
    digitalInput: 8,
    digitalOutput: 6,
    analogInput: 0,
    analogOutput: 0,
    supplyVoltage: '24VDC',
    communication: [],
    programming: ['Ladder'],
    notes: '',
  });

  const [commInput, setCommInput] = useState('');

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData({
        brand: '',
        series: '',
        digitalInput: 8,
        digitalOutput: 6,
        analogInput: 0,
        analogOutput: 0,
        supplyVoltage: '24VDC',
        communication: [],
        programming: ['Ladder'],
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addComm = () => {
    if (commInput && !formData.communication.includes(commInput)) {
      setFormData({ ...formData, communication: [...formData.communication, commInput] });
      setCommInput('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit PLC: ${initialData.brand}` : 'Tambah PLC Baru'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>{initialData ? 'Simpan Perubahan' : 'Tambah Ke Katalog'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Merk (Brand)"
            placeholder="Contoh: Siemens, Mitsubishi"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            required
          />
          <Input
            label="Seri / Model"
            placeholder="Contoh: S7-1200, FX3U"
            value={formData.series}
            onChange={(e) => setFormData({ ...formData, series: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Digital Input"
            type="number"
            value={formData.digitalInput}
            onChange={(e) => setFormData({ ...formData, digitalInput: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Digital Output"
            type="number"
            value={formData.digitalOutput}
            onChange={(e) => setFormData({ ...formData, digitalOutput: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Analog Input"
            type="number"
            value={formData.analogInput}
            onChange={(e) => setFormData({ ...formData, analogInput: parseInt(e.target.value) || 0 })}
          />
          <Input
            label="Analog Output"
            type="number"
            value={formData.analogOutput}
            onChange={(e) => setFormData({ ...formData, analogOutput: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-text-muted uppercase tracking-wider">
            Tegangan Supply
          </label>
          <div className="flex gap-4">
            {['24VDC', '220VAC'].map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="voltage"
                  checked={formData.supplyVoltage === v}
                  onChange={() => setFormData({ ...formData, supplyVoltage: v })}
                  className="accent-accent w-4 h-4"
                />
                <span className={`text-sm ${formData.supplyVoltage === v ? 'text-accent font-bold' : 'text-text-muted'}`}>
                  {v}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-text-muted uppercase tracking-wider">
            Protokol Komunikasi
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Contoh: Modbus RTU, Ethernet"
              value={commInput}
              onChange={(e) => setCommInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addComm())}
            />
            <Button type="button" variant="outline" onClick={addComm}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.communication.map((c) => (
              <span key={c} className="bg-bg-elevated border border-border px-2 py-1 rounded-lg text-xs flex items-center gap-2">
                {c}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, communication: formData.communication.filter(i => i !== c) })}
                  className="text-danger hover:text-danger/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-text-muted uppercase tracking-wider">
            Catatan Tambahan
          </label>
          <textarea
            className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent min-h-[100px]"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Spesifikasi khusus, kelebihan, atau limitasi..."
          />
        </div>
      </form>
    </Modal>
  );
};
