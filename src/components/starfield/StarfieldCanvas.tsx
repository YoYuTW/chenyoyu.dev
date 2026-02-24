'use client';

import { Canvas } from '@react-three/fiber';
import { useStarData } from '../../hooks/useStarData';
import { ModeController } from './ModeController';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function StarfieldCanvas() {
  const { resolvedTheme } = useTheme();
  const starData = useStarData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (starData.loading) return null;

  const isDark = resolvedTheme === 'dark';
  
  return (
    <div 
      className={`fixed inset-0 -z-10 transition-opacity duration-1000 pointer-events-none ${isDark ? 'opacity-100' : 'opacity-0'}`}
    >
      <Canvas 
        dpr={[1, 1.5]} 
        camera={{ 
          position: [0, 0, 0], 
          fov: 90,
          near: 0.1,
          far: 200 
        }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        eventSource={document.body} // Listen to events on body so we get mouse movement even with pointer-events: none
        eventPrefix="client"
      >
        <ModeController data={starData} />
      </Canvas>
    </div>
  );
}
