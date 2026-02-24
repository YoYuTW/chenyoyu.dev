import { useState, useEffect } from 'react';
import * as THREE from 'three';

// Data types based on JSON structure
type StarRow = [
  number, // RA (hours)
  number, // Dec (degrees)
  number, // Magnitude
  number | null, // B-V Color Index
  number | null // HIP ID
];

interface StarsData {
  stars: StarRow[];
}

interface ConstellationData {
  id: string;
  name: string;
  lines: [number, number][]; // HIP IDs
}

export interface StarfieldData {
  starsCount: number;
  starRa: Float32Array;
  starDec: Float32Array;
  starMag: Float32Array;
  starColorIndex: Float32Array;
  
  // Line geometry attributes (non-indexed)
  lineRa: Float32Array;
  lineDec: Float32Array;
  lineConstellationIds: Float32Array;
  
  constellationMetadata: {
    id: string;
    name: string;
    center: THREE.Vector3;
  }[];
  
  loading: boolean;
}

export function useStarData(): StarfieldData {
  const [data, setData] = useState<StarfieldData>({
    starsCount: 0,
    starRa: new Float32Array(0),
    starDec: new Float32Array(0),
    starMag: new Float32Array(0),
    starColorIndex: new Float32Array(0),
    lineRa: new Float32Array(0),
    lineDec: new Float32Array(0),
    lineConstellationIds: new Float32Array(0),
    constellationMetadata: [],
    loading: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [starsRes, constellationsRes] = await Promise.all([
          fetch('/data/stars.json'),
          fetch('/data/constellations.json'),
        ]);

        const starsJson: StarsData = await starsRes.json();
        const constellationsRaw: { constellations: ConstellationData[] } = await constellationsRes.json();
        const constellationsJson = constellationsRaw.constellations;

        // 1. Process Stars
        // Filter out the Sun (index 0, usually mag < -26)
        const validStars = starsJson.stars.filter(s => s[2] > -2.0);
        
        const count = validStars.length;
        const starRa = new Float32Array(count);
        const starDec = new Float32Array(count);
        const starMag = new Float32Array(count);
        const starColorIndex = new Float32Array(count);
        
        // Map HIP ID -> Index in our validStars array
        const hipToIndex = new Map<number, number>();

        for (let i = 0; i < count; i++) {
          const star = validStars[i];
          starRa[i] = star[0];
          starDec[i] = star[1];
          starMag[i] = star[2];
          starColorIndex[i] = star[3] ?? 0.5; // Default to yellow/white
          
          if (star[4] !== null) {
            hipToIndex.set(star[4], i);
          }
        }

        // 2. Process Constellations
        // We build a non-indexed geometry for lines, duplicating vertices
        // This allows each vertex to carry the constellation ID attribute
        
        const lineRaArr: number[] = [];
        const lineDecArr: number[] = [];
        const lineConstIdArr: number[] = []; // 0 to 87

        const constellationMetadata: StarfieldData['constellationMetadata'] = [];

        constellationsJson.forEach((constellation, cIndex) => {
          // Calculate center for proximity check (average of star positions)
          const center = new THREE.Vector3();
          let points = 0;

          constellation.lines.forEach(([hip1, hip2]) => {
            const idx1 = hipToIndex.get(hip1);
            const idx2 = hipToIndex.get(hip2);

            if (idx1 !== undefined && idx2 !== undefined) {
              // Found both stars
              
              // Vertex 1
              lineRaArr.push(starRa[idx1]);
              lineDecArr.push(starDec[idx1]);
              lineConstIdArr.push(cIndex);

              // Vertex 2
              lineRaArr.push(starRa[idx2]);
              lineDecArr.push(starDec[idx2]);
              lineConstIdArr.push(cIndex);

              // Accumulate for center
              // Convert RA/Dec to Cartesian (Unit Sphere)
              // RA is in hours (0-24), Dec in degrees (-90 to 90)
              
              // Helper to get cartesian from star index
              const getPos = (ra: number, dec: number) => {
                const raRad = (ra * 15 * Math.PI) / 180;
                const decRad = (dec * Math.PI) / 180;
                // Standard math: Z up
                // But typically astronomy uses specific axes. 
                // Let's just use standard spherical to cartesian:
                // x = cos(dec) * cos(ra)
                // y = cos(dec) * sin(ra)
                // z = sin(dec)
                return new THREE.Vector3(
                  Math.cos(decRad) * Math.cos(raRad),
                  Math.cos(decRad) * Math.sin(raRad),
                  Math.sin(decRad)
                );
              };

              center.add(getPos(starRa[idx1], starDec[idx1]));
              center.add(getPos(starRa[idx2], starDec[idx2]));
              points += 2;
            }
          });

          if (points > 0) {
            center.divideScalar(points).normalize();
          }

          constellationMetadata.push({
            id: constellation.id,
            name: constellation.name,
            center
          });
        });

        setData({
          starsCount: count,
          starRa,
          starDec,
          starMag,
          starColorIndex,
          lineRa: new Float32Array(lineRaArr),
          lineDec: new Float32Array(lineDecArr),
          lineConstellationIds: new Float32Array(lineConstIdArr),
          constellationMetadata,
          loading: false,
        });

      } catch (err) {
        console.error('Failed to load star data', err);
      }
    }

    loadData();
  }, []);

  return data;
}
