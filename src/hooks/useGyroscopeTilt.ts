import { useCallback, useEffect, useState } from 'react';
import { gammaToTargetTilt } from '../utils/fluidPhysics';

interface DeviceOrientationEventWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export function useGyroscopeTilt(onFeedback?: (message: string) => void) {
  const [enabled, setEnabled] = useState(false);
  const [tiltPx, setTiltPx] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setTiltPx(0);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.gamma === 'number') {
        setTiltPx(gammaToTargetTilt(event.gamma));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [enabled]);

  const toggleGyroscope = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      setTiltPx(0);
      onFeedback?.('Física por giroscópio desativada');
      return;
    }

    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      onFeedback?.('Sensor de movimento indisponível — arraste o frasco para balançar!');
      return;
    }

    try {
      const ctor = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;
      if (typeof ctor.requestPermission === 'function') {
        const result = await ctor.requestPermission();
        if (result !== 'granted') {
          onFeedback?.('Permissão do sensor negada — arraste o frasco com o dedo!');
          return;
        }
      }
      setEnabled(true);
      onFeedback?.('Giroscópio ativado! Incline o celular para balançar a poção.');
    } catch {
      onFeedback?.('Não foi possível ativar o sensor neste navegador.');
    }
  }, [enabled, onFeedback]);

  return {
    gyroEnabled: enabled,
    gyroTiltPx: tiltPx,
    toggleGyroscope,
  };
}
