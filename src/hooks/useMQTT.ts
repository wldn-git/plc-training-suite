import { useEffect, useRef } from 'react';
import mqtt, { type MqttClient } from 'mqtt';
import { useIOBrokerStore } from '@/store/ioBrokerStore';

// ============================================================
// useMQTT Hook — Logic Koneksi Hardware via MQTT/WebSockets
// ============================================================

export function useMQTT() {
  const { settings, updateSettings, setInputValue } = useIOBrokerStore();
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (settings.status === 'connecting' || settings.status === 'connected') return;

    try {
      updateSettings({ status: 'connecting' });
      
      const client = mqtt.connect(settings.url, {
        clientId: `plts_web_${Math.random().toString(16).slice(2, 8)}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      });

      client.on('connect', () => {
        updateSettings({ status: 'connected' });
        // Subscribe to PLC Outputs topic
        client.subscribe(`${settings.baseTopic}/outputs/#`);
        console.log('MQTT Connected to', settings.url);
      });

      client.on('message', (topic, message) => {
        const payload = message.toString();
        // Topic pattern: plts/lab-01/outputs/Q0.0
        const parts = topic.split('/');
        const address = parts[parts.length - 1];
        
        try {
          // Parse boolean or numbers
          const value = payload === 'true' ? true : payload === 'false' ? false : !isNaN(Number(payload)) ? Number(payload) : payload;
          setInputValue(address, value as any);
        } catch (e) {
          console.error('Failed to parse MQTT message', e);
        }
      });

      client.on('error', (err) => {
        console.error('MQTT Connection Error:', err);
        updateSettings({ status: 'error' });
        client.end();
      });

      client.on('close', () => {
        updateSettings({ status: 'disconnected' });
      });

      clientRef.current = client;

    } catch (e) {
      updateSettings({ status: 'error' });
      console.error('MQTT Bootstrap Error:', e);
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, [settings.url, settings.baseTopic]);

  // Function to publish command to PLC inputs
  const publishCommand = (address: string, value: boolean | number) => {
    if (clientRef.current && clientRef.current.connected) {
      const topic = `${settings.baseTopic}/inputs/${address}`;
      clientRef.current.publish(topic, String(value), { retain: true });
    }
  };

  return {
    status: settings.status,
    publishCommand,
  };
}
