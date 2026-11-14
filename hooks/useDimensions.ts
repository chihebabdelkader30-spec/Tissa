import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
export function useDimensions() {
  const [size, setSize] = useState({ width: 375, height: 667 });
  useEffect(() => { const update = () => { const current = Dimensions.get('window'); setSize({ width: Math.max(320, current.width || 375), height: Math.max(1, current.height || 667) }); }; update(); const listener = Dimensions.addEventListener('change', update); return () => listener.remove(); }, []);
  return { ...size, tablet: size.width >= 600 };
}
