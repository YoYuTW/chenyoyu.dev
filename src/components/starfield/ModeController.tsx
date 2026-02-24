import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarfieldData } from '../../hooks/useStarData';
import { Stars, StarfieldFrameState } from './Stars';
import { ConstellationLines } from './ConstellationLines';
import { calculateGMST, calculateLST } from '../../lib/astronomy';
import { useGeolocation } from '../../hooks/useGeolocation';

interface ModeControllerProps {
  data: StarfieldData;
}

const SPHERE_RADIUS = 100.0;
const FLASHLIGHT_RADIUS = 25.0; 
const FADE_DURATION = 3.0; 

export function ModeController({ data }: ModeControllerProps) {
  const { camera, pointer } = useThree();
  const location = useGeolocation();
  
  // Set camera to look at zenith
  useEffect(() => {
    // We need to set the up vector because looking at (0, 100, 0) with default up (0, 1, 0) is a singularity.
    // Setting up to (0, 0, -1) means "North" (-Z) will be at the top of the screen.
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 100, 0); // Look toward zenith (y-axis is up)
    camera.updateProjectionMatrix();
  }, [camera]);
  
  // Create the shared state ref
  // We initialize with default values
  const stateRef = useRef<StarfieldFrameState>({
    lst: 0,
    cursorPos: new THREE.Vector3(0, 0, -SPHERE_RADIUS),
    flashlightRadius: FLASHLIGHT_RADIUS,
    opacities: new Float32Array(88),
    latitude: location.latitude,
  });
  
  const tempVec = useRef(new THREE.Vector3());
  
  // Track last active times for fading logic (CPU side only)
  const lastActiveTimes = useRef<Float32Array>(new Float32Array(88).fill(-999));
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const now = new Date();
    
    // 1. Update LST
    const gmst = calculateGMST(now);
    const lst = calculateLST(gmst, location.longitude);
    
    // Update ref
    stateRef.current.lst = lst;
    stateRef.current.latitude = location.latitude;
    
    // 2. Update Cursor Position
    const vector = tempVec.current.set(pointer.x, pointer.y, 0.5);
    vector.unproject(camera);
    vector.sub(camera.position).normalize().multiplyScalar(SPHERE_RADIUS);
    stateRef.current.cursorPos.copy(vector);
    
    // 3. Update Constellation Opacities
    const latRad = location.latitude * Math.PI / 180;
    const lstRad = lst * 15 * Math.PI / 180;
    
    const opacities = stateRef.current.opacities; // Ref to array
    
    for (let i = 0; i < 88; i++) {
      const meta = data.constellationMetadata[i];
      if (!meta) continue;
      
      // Recover RA/Dec from unit vector center
      const cx = meta.center.x;
      const cy = meta.center.y;
      const cz = meta.center.z;
      
      const decRad = Math.asin(cz);
      let raRad = Math.atan2(cy, cx);
      if (raRad < 0) raRad += 2 * Math.PI;
      
      const hRad = lstRad - raRad;
      
      const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(hRad);
      const altRad = Math.asin(sinAlt);
      
      const y = -Math.sin(hRad);
      const x = Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(hRad);
      const azRad = Math.atan2(y, x);
      
      const wx = Math.cos(altRad) * Math.sin(azRad);
      const wy = Math.sin(altRad);
      const wz = -Math.cos(altRad) * Math.cos(azRad);
      
      // Fast distance check (squared distance avoids sqrt if we square threshold, but distanceTo uses sqrt)
      // distanceToSquared is better
      const dx = wx * SPHERE_RADIUS - vector.x;
      const dy = wy * SPHERE_RADIUS - vector.y;
      const dz = wz * SPHERE_RADIUS - vector.z;
      const distSq = dx*dx + dy*dy + dz*dz;
      
      const radiusSq = FLASHLIGHT_RADIUS * FLASHLIGHT_RADIUS;
      
      if (distSq < radiusSq) {
        // NEW: Log when a constellation is newly activated
        if (lastActiveTimes.current[i] < time - 0.5) {
          // Was inactive (or faded significantly), now becoming active
          console.log(`✨ ${data.constellationMetadata[i]?.name ?? data.constellationMetadata[i]?.id}`);
        }
        lastActiveTimes.current[i] = time;
      }
      
      const timeSinceActive = time - lastActiveTimes.current[i];
      let opacity = 0;
      
      if (timeSinceActive < FADE_DURATION) {
        opacity = 1.0 - (timeSinceActive / FADE_DURATION);
        opacity = Math.pow(opacity, 1.5);
      }
      
      opacities[i] = opacity;
    }
  });

  return (
    <>
      <Stars 
        data={data} 
        stateRef={stateRef}
      />
      <ConstellationLines 
        data={data} 
        stateRef={stateRef}
      />
    </>
  );
}
