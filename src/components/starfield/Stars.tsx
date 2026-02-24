import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarfieldData } from '../../hooks/useStarData';

// Shared state interface (defined here or imported)
export interface StarfieldFrameState {
  lst: number;
  cursorPos: THREE.Vector3;
  flashlightRadius: number;
  baseBrightness: number;
  opacities: Float32Array;
  latitude: number;
}

interface StarsProps {
  data: StarfieldData;
  stateRef: React.MutableRefObject<StarfieldFrameState>;
}

export function Stars({ data, stateRef }: StarsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uLST: { value: 0 },
        uLatitude: { value: 0 },
        uCursorPos: { value: new THREE.Vector3() },
        uFlashlightRadius: { value: 0 },
        uBaseBrightness: { value: 0.15 },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute float aRa;
        attribute float aDec;
        attribute float aMag;
        attribute float aColorIndex;
        
        uniform float uLST;
        uniform float uLatitude;
        uniform float uPixelRatio;
        
        varying float vMag;
        varying float vColorIndex;
        varying vec3 vWorldPos;
        
        const float PI = 3.14159265359;
        const float RADIUS = 100.0;
        
        void main() {
          vMag = aMag;
          vColorIndex = aColorIndex;
          
          float raRad = aRa * 15.0 * PI / 180.0;
          float decRad = aDec * PI / 180.0;
          float lstRad = uLST * 15.0 * PI / 180.0;
          float latRad = uLatitude * PI / 180.0;
          
          float hRad = lstRad - raRad;
          
          float sinAlt = sin(decRad) * sin(latRad) + cos(decRad) * cos(latRad) * cos(hRad);
          float altRad = asin(sinAlt);
          
          float y = -sin(hRad);
          float x = tan(decRad) * cos(latRad) - sin(latRad) * cos(hRad);
          float azRad = atan(y, x);
          
          vec3 pos = vec3(
            cos(altRad) * sin(azRad),
            sin(altRad),
            -cos(altRad) * cos(azRad)
          );
          
          vWorldPos = pos * RADIUS;
          
          float baseSize = 4.0 * uPixelRatio; 
          float size = baseSize * pow(1.4, (6.5 - aMag)); 
          
          gl_PointSize = clamp(size, 2.0 * uPixelRatio, 15.0 * uPixelRatio);
          
          if (pos.y < -0.05) { 
             gl_PointSize = 0.0;
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vWorldPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vMag;
        varying float vColorIndex;
        varying vec3 vWorldPos;
        
        uniform vec3 uCursorPos;
        uniform float uFlashlightRadius;
        uniform float uBaseBrightness;
        
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          
          vec3 color = vec3(1.0);
          if (vColorIndex < 0.0) {
             color = mix(vec3(0.5, 0.6, 1.0), vec3(1.0), smoothstep(-0.3, 0.0, vColorIndex));
          } else if (vColorIndex < 0.5) {
             color = mix(vec3(1.0), vec3(1.0, 1.0, 0.9), smoothstep(0.0, 0.5, vColorIndex));
          } else if (vColorIndex < 1.0) {
             color = mix(vec3(1.0, 1.0, 0.9), vec3(1.0, 0.9, 0.5), smoothstep(0.5, 1.0, vColorIndex));
          } else {
             color = mix(vec3(1.0, 0.9, 0.5), vec3(1.0, 0.6, 0.4), smoothstep(1.0, 2.0, vColorIndex));
          }
          
          float d = distance(vWorldPos, uCursorPos);
          float flashlight = smoothstep(uFlashlightRadius * 1.5, uFlashlightRadius * 0.5, d);
          float brightness = uBaseBrightness + (1.0 - uBaseBrightness) * flashlight;
          if (vMag < 1.0) brightness += 0.1;
          
          gl_FragColor = vec4(color, alpha * brightness);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        const s = stateRef.current;
        mat.uniforms.uLST.value = s.lst;
        mat.uniforms.uLatitude.value = s.latitude;
        mat.uniforms.uCursorPos.value.copy(s.cursorPos);
        mat.uniforms.uFlashlightRadius.value = s.flashlightRadius;
        mat.uniforms.uBaseBrightness.value = s.baseBrightness;
        mat.uniforms.uPixelRatio.value = state.viewport.dpr;
      }
    }
  });
  
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <points ref={pointsRef} material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={data.starsCount}
          args={[new Float32Array(data.starsCount * 3), 3]} 
        />
        <bufferAttribute
          attach="attributes-aRa"
          count={data.starsCount}
          args={[data.starRa, 1]}
        />
        <bufferAttribute
          attach="attributes-aDec"
          count={data.starsCount}
          args={[data.starDec, 1]}
        />
        <bufferAttribute
          attach="attributes-aMag"
          count={data.starsCount}
          args={[data.starMag, 1]}
        />
        <bufferAttribute
          attach="attributes-aColorIndex"
          count={data.starsCount}
          args={[data.starColorIndex, 1]}
        />
      </bufferGeometry>
    </points>
  );
}
