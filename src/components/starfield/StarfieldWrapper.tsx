'use client';

import dynamic from 'next/dynamic';

const StarfieldCanvas = dynamic(() => import('./StarfieldCanvas'), { ssr: false });

export function StarfieldWrapper() {
  return <StarfieldCanvas />;
}
