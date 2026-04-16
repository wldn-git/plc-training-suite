import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIOBrokerStore } from '@/store/ioBrokerStore';
import { Box } from 'lucide-react';

// ============================================================
// Conveyor Sorting — Digital Twin Visualization
// ============================================================

export const ConveyorSorting: React.FC = () => {
  const { inputs, setOutputValue } = useIOBrokerStore();
  
  // PLC OUTPUTS (Simulator Inputs)
  const isConveyorRunning = !!inputs['Q0.0']?.value;
  const isPusher1Active = !!inputs['Q0.1']?.value;
  const isPusher2Active = !!inputs['Q0.2']?.value;

  // Local State for boxes on the belt
  const [boxes, setBoxes] = useState<{ id: string; x: number; type: 'A' | 'B' | 'C' }[]>([]);
  const requestRef = useRef<number>(null);

  // Box Spawning Logic
  useEffect(() => {
    if (!isConveyorRunning) return;

    const interval = setInterval(() => {
      if (boxes.length < 5) {
        const id = Math.random().toString(36).substr(2, 9);
        const type = (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)];
        setBoxes(prev => [...prev, { id, x: 0, type }]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isConveyorRunning, boxes.length]);

  // Animation Loop
  useEffect(() => {
    const update = () => {
      if (isConveyorRunning) {
        setBoxes(prev => {
          return prev.map(box => {
            let newX = box.x + 0.5; // Conveyor speed
            
            // Sensor Logic (Feedback to PLC)
            // Entry Sensor: I0.0 (x around 10-20)
            if (newX > 10 && newX < 15) setOutputValue('I0.0', true);
            else if (box.x <= 10 && newX >= 10) setOutputValue('I0.0', false); // Simple pulse

            // Middle Sensor for Pusher 1: I0.1 (x around 40-50)
            if (newX > 40 && newX < 45) {
                setOutputValue('I0.1', true);
                // If Pusher 1 is active, box is sorted
                if (isPusher1Active && box.type === 'A') {
                    return { ...box, x: 999 }; // Sorted
                }
            } else if (box.x <= 40 && newX >= 40) setOutputValue('I0.1', false);

            // End Sensor for Pusher 2: I0.2 (x around 70-80)
            if (newX > 75 && newX < 80) {
                setOutputValue('I0.2', true);
                if (isPusher2Active && box.type === 'B') {
                    return { ...box, x: 999 }; // Sorted
                }
            } else if (box.x <= 75 && newX >= 75) setOutputValue('I0.2', false);

            return { ...box, x: newX };
          }).filter(box => box.x < 100); // Remove if passed or sorted
        });
      }
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isConveyorRunning, isPusher1Active, isPusher2Active, setOutputValue]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00d4ff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative w-full max-w-4xl h-80 flex items-center">
        {/* The Conveyor Belt Base */}
        <div className="absolute w-full h-12 bg-neutral-800 rounded-full border-4 border-neutral-700 shadow-2xl overflow-hidden flex items-center">
           <motion.div 
             animate={isConveyorRunning ? { x: [-40, 0] } : {}}
             transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
             className="flex gap-4 opacity-30"
           >
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-10 h-10 border-r border-neutral-500 bg-neutral-900" />
             ))}
           </motion.div>
        </div>

        {/* Stations & Sensors */}
        <Station 
          label="Sensor Masuk" 
          address="I0.0" 
          x="15%" 
          active={!!inputs['I0.0']?.value} 
        />

        <Station 
          label="Pusher 1 (Tipe A)" 
          address="Q0.1" 
          x="45%" 
          active={isPusher1Active} 
          hasPiston 
        />
        
        <Station 
          label="Pusher 2 (Tipe B)" 
          address="Q0.2" 
          x="78%" 
          active={isPusher2Active} 
          hasPiston
        />

        {/* Dynamic Boxes */}
        {boxes.map(box => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-20"
            style={{ left: `${box.x}%`, top: box.x > 900 ? '120%' : '50%', marginTop: box.x > 900 ? 0 : '-30px' }}
          >
            <div className={`p-2 rounded bg-orange-800 border-2 border-orange-600 shadow-lg text-[8px] font-bold text-white flex flex-col items-center`}>
               <Box size={16} />
               {box.type}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-20 grid grid-cols-3 gap-8">
        <StatusLed label="MOTOR" active={isConveyorRunning} />
        <StatusLed label="PUSHER 1" active={isPusher1Active} />
        <StatusLed label="PUSHER 2" active={isPusher2Active} />
      </div>
    </div>
  );
};

const Station = ({ label, address, x, active, hasPiston }: any) => (
  <div className="absolute top-0 bottom-0 pointer-events-none z-10" style={{ left: x }}>
    {/* Sensor/Piston Head */}
    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1`}>
      <span className="text-[8px] font-mono font-black text-text-dim text-center leading-none">{label}<br/>{address}</span>
      <div className={`w-3 h-3 rounded-full border-2 ${active ? 'bg-accent border-accent shadow-[0_0_10px_#00d4ff]' : 'bg-bg-elevated border-border'}`} />
    </div>

    {/* Vertical Line */}
    <div className="absolute top-0 bottom-0 w-[1px] bg-white/5 border-l border-dashed border-white/10" />

    {/* Piston Visual */}
    {hasPiston && (
      <motion.div 
        animate={active ? { y: 20 } : { y: -10 }}
        className="absolute w-6 h-12 bg-neutral-700 rounded-t-lg left-1/2 -translate-x-1/2 border-x border-t border-white/10 shadow-lg"
      />
    )}
  </div>
);

const StatusLed = ({ label, active }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-success animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-white/10'}`} />
    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">{label}</span>
  </div>
);
