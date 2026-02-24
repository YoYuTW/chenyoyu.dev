'use client';

import { Canvas } from '@react-three/fiber';
import { useStarData } from '../../hooks/useStarData';
import { ModeController, StarfieldMode } from './ModeController';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function getStarfieldMode(pathname: string | null): StarfieldMode {
  if (!pathname || pathname === '/') {
    return { flashlightRadius: 25, showConstellationLines: true, baseBrightness: 0.15 };
  }
  if (pathname.startsWith('/blog')) {
    return { flashlightRadius: 12, showConstellationLines: false, baseBrightness: 0.08 };
  }
  // /about and everything else
  return { flashlightRadius: 25, showConstellationLines: false, baseBrightness: 0.15 };
}

export default function StarfieldCanvas() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const starData = useStarData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (starData.loading) return null;

  const isDark = resolvedTheme === 'dark';
  const mode = getStarfieldMode(pathname);
  
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
        <ModeController data={starData} {...mode} />
      </Canvas>
    </div>
  );
}
