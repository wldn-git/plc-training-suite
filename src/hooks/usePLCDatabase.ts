import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/db';
import { DEFAULT_PLC_BRANDS } from '@/constants/defaultPLCBrands';
import type { PLCDevice } from '@/types/plc.types';
import { useEffect } from 'react';

export function usePLCDatabase() {
  // Ambil data secara live — otomatis re-render jika DB berubah
  const devices = useLiveQuery(() => db.plcCatalog.toArray()) || [];

  // Seed data awal jika kosong
  useEffect(() => {
    const seedInitialData = async () => {
      const count = await db.plcCatalog.count();
      if (count === 0) {
        console.log('🌱 Seeding initial PLC brands...');
        const initialData = DEFAULT_PLC_BRANDS.map(brand => ({
          ...brand,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        })) as PLCDevice[];
        
        await db.plcCatalog.bulkAdd(initialData);
      }
    };

    seedInitialData();
  }, []);

  const addDevice = async (device: Omit<PLCDevice, 'id' | 'createdAt'>) => {
    return await db.plcCatalog.add({
      ...device,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    } as PLCDevice);
  };

  const updateDevice = async (id: string, changes: Partial<PLCDevice>) => {
    return await db.plcCatalog.update(id, {
      ...changes,
      updatedAt: new Date(),
    });
  };

  const deleteDevice = async (id: string) => {
    return await db.plcCatalog.delete(id);
  };

  const getDeviceById = (id: string) => {
    return db.plcCatalog.get(id);
  };

  return {
    devices,
    addDevice,
    updateDevice,
    deleteDevice,
    getDeviceById,
    isLoading: !devices.length && devices === null,
  };
}
