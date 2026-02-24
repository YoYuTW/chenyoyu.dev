import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarfieldData } from '../../hooks/useStarData';
import { StarfieldFrameState } from './Stars';

interface ConstellationLinesProps {
  data: StarfieldData;
  stateRef: React.MutableRefObject<StarfieldFrameState>;
}

export function ConstellationLines({ 
  data, 
  stateRef, 
}: ConstellationLinesProps) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uLST: { value: 0 },
        uLatitude: { value: 0 },
        uOpacities: { value: new Float32Array(88) },
        uCursorPos: { value: new THREE.Vector3() },
        uFlashlightRadius: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aRa;
        attribute float aDec;
        attribute float aConstellationId;
        
        uniform float uLST;
        uniform float uLatitude;
        uniform float uOpacities[88];
        
        varying float vOpacity;
        varying vec3 vWorldPos;
        
        const float PI = 3.14159265359;
        const float RADIUS = 100.0;
        
        void main() {
          int id = int(aConstellationId);
          if (id < 0 || id >= 88) vOpacity = 0.0;
          else vOpacity = uOpacities[id];
          
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
          
          if (pos.y < -0.05) {
             vOpacity = 0.0;
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vWorldPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vOpacity;
        varying vec3 vWorldPos;
        
        uniform vec3 uCursorPos;
        uniform float uFlashlightRadius;
        
        void main() {
          if (vOpacity <= 0.01) discard;
          
          vec3 color = vec3(0.6, 0.8, 1.0);
          
          float d = distance(vWorldPos, uCursorPos);
          float glow = smoothstep(uFlashlightRadius * 1.2, 0.0, d);
          
          vec3 finalColor = color + vec3(0.4) * glow;
          
          gl_FragColor = vec4(finalColor, vOpacity * 0.4 + glow * 0.6); 
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(() => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        const s = stateRef.current;
        mat.uniforms.uLST.value = s.lst;
        mat.uniforms.uLatitude.value = s.latitude;
        mat.uniforms.uOpacities.value = s.opacities;
        mat.uniforms.uCursorPos.value.copy(s.cursorPos);
        mat.uniforms.uFlashlightRadius.value = s.flashlightRadius;
      }
    }
  });
  
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  const vertexCount = data.lineRa.length;

  return (
    <lineSegments ref={linesRef} material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertexCount}
          args={[new Float32Array(vertexCount * 3), 3]}
        />
        <bufferAttribute
          attach="attributes-aRa"
          count={vertexCount}
          args={[data.lineRa, 1]}
        />
        <bufferAttribute
          attach="attributes-aDec"
          count={vertexCount}
          args={[data.lineDec, 1]}
        />
        <bufferAttribute
          attach="attributes-aConstellationId"
          count={vertexCount}
          args={[data.lineConstellationIds, 1]}
        />
      </bufferGeometry>
    </lineSegments>
  );
}
