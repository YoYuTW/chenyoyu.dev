import fs from 'node:fs';
import path from 'node:path';

// URLs
const HYG_URL = 'https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/CURRENT/hygdata_v41.csv';
const CONSTELLATIONS_URL = 'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/constellations.lines.json';

// Paths
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_STARS = path.join(PUBLIC_DIR, 'stars.json');
const OUTPUT_CONSTELLATIONS = path.join(PUBLIC_DIR, 'constellations.json');

// IAU Constellation Names
const CONSTELLATION_NAMES: Record<string, string> = {
  "And": "Andromeda", "Ant": "Antlia", "Aps": "Apus", "Aqr": "Aquarius", "Aql": "Aquila", "Ara": "Ara", "Ari": "Aries", "Aur": "Auriga",
  "Boo": "Boötes", "Cae": "Caelum", "Cam": "Camelopardalis", "Cnc": "Cancer", "CVn": "Canes Venatici", "CMa": "Canis Major", "CMi": "Canis Minor", "Cap": "Capricornus", "Car": "Carina", "Cas": "Cassiopeia", "Cen": "Centaurus", "Cep": "Cepheus", "Cet": "Cetus", "Cha": "Chamaeleon", "Cir": "Circinus", "Col": "Columba", "Com": "Coma Berenices", "CrA": "Corona Australis", "CrB": "Corona Borealis", "Crv": "Corvus", "Crt": "Crater", "Cru": "Crux", "Cyg": "Cygnus", "Del": "Delphinus", "Dor": "Dorado", "Dra": "Draco", "Equ": "Equuleus", "Eri": "Eridanus", "For": "Fornax", "Gem": "Gemini", "Gru": "Grus", "Her": "Hercules", "Hor": "Horologium", "Hya": "Hydra", "Hyi": "Hydrus", "Ind": "Indus", "Lac": "Lacerta", "Leo": "Leo", "LMi": "Leo Minor", "Lep": "Lepus", "Lib": "Libra", "Lup": "Lupus", "Lyn": "Lynx", "Lyr": "Lyra", "Men": "Mensa", "Mic": "Microscopium", "Mon": "Monoceros", "Mus": "Musca", "Nor": "Norma", "Oct": "Octans", "Oph": "Ophiuchus", "Ori": "Orion", "Pav": "Pavo", "Peg": "Pegasus", "Per": "Perseus", "Phe": "Phoenix", "Pic": "Pictor", "Psc": "Pisces", "PsA": "Piscis Austrinus", "Pup": "Puppis", "Pyx": "Pyxis", "Ret": "Reticulum", "Sge": "Sagitta", "Sgr": "Sagittarius", "Sco": "Scorpius", "Scl": "Sculptor", "Sct": "Scutum", "Ser": "Serpens", "Sex": "Sextans", "Tau": "Taurus", "Tel": "Telescopium", "Tri": "Triangulum", "TrA": "Triangulum Australe", "Tuc": "Tucana", "UMa": "Ursa Major", "UMi": "Ursa Minor", "Vel": "Vela", "Vir": "Virgo", "Vol": "Volans", "Vul": "Vulpecula"
};

// Types
interface Star {
  id: number;
  hip: number | null;
  ra: number;
  dec: number;
  mag: number;
  bv: number | null;
}

interface ConstellationFeature {
  id: string; 
  geometry: {
    type: "MultiLineString";
    coordinates: number[][][]; // [ra, dec]
  };
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 1. Fetch STARS
  console.log('Fetching HYG star data...');
  const starsResponse = await fetch(HYG_URL);
  if (!starsResponse.ok) throw new Error(`Failed to fetch stars: ${starsResponse.statusText}`);
  const csvText = await starsResponse.text();

  console.log('Processing stars...');
  const lines = csvText.split('\n');
  
  // Clean headers: remove quotes
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  console.log('Headers:', headers);
  
  const colMap = {
    id: headers.indexOf('id'),
    hip: headers.indexOf('hip'),
    ra: headers.indexOf('ra'),
    dec: headers.indexOf('dec'),
    mag: headers.indexOf('mag'),
    ci: headers.indexOf('ci'),
  };
  console.log('Column Map:', colMap);

  const allStars: Star[] = [];
  
  // Parse CSV
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line preserving quotes
    const parts: string[] = [];
    let current = '';
    let inQuote = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current);

    if (parts.length < headers.length) continue;

    const clean = (s: string) => s ? s.trim().replace(/^"|"$/g, '') : '';

    const idStr = clean(parts[colMap.id]);
    const id = idStr ? parseInt(idStr) : NaN;
    
    const hipStr = clean(parts[colMap.hip]);
    const hip = hipStr ? parseInt(hipStr) : null;
    
    const raStr = clean(parts[colMap.ra]);
    const ra = raStr ? parseFloat(raStr) : NaN;
    
    const decStr = clean(parts[colMap.dec]);
    const dec = decStr ? parseFloat(decStr) : NaN;
    
    const magStr = clean(parts[colMap.mag]);
    const mag = magStr ? parseFloat(magStr) : NaN;
    
    const bvStr = clean(parts[colMap.ci]);
    const bv = bvStr ? parseFloat(bvStr) : null;

    if (isNaN(id) || isNaN(ra) || isNaN(dec) || isNaN(mag)) continue;

    allStars.push({ id, hip, ra, dec, mag, bv });
  }

  console.log(`Loaded ${allStars.length} stars.`);

  // 2. Fetch CONSTELLATIONS
  console.log('Fetching constellation lines...');
  const constResponse = await fetch(CONSTELLATIONS_URL);
  if (!constResponse.ok) throw new Error(`Failed to fetch constellations: ${constResponse.statusText}`);
  const constData = await constResponse.json() as { features: ConstellationFeature[] };

  // 3. Build Spatial Grid
  const GRID_W = 24;
  const GRID_H = 18;
  const grid: Star[][][] = Array(GRID_W).fill(null).map(() => Array(GRID_H).fill(null).map(() => []));

  for (const star of allStars) {
    // We only care about stars that have HIP IDs for constellations
    // But d3-celestial lines use position, so we match by position first.
    // However, if we match a star without HIP ID, we can't output it as HIP pair.
    // So only index stars with HIP.
    if (star.hip === null) continue;

    const raIdx = Math.floor(star.ra) % GRID_W;
    let decIdx = Math.floor((star.dec + 90) / 10);
    if (decIdx >= GRID_H) decIdx = GRID_H - 1;
    
    grid[raIdx][decIdx].push(star);
  }

  const findNearestStar = (raDeg: number, decDeg: number): Star | null => {
    let raHours = raDeg / 15.0;
    raHours = ((raHours % 24) + 24) % 24;

    const raIdx = Math.floor(raHours);
    let decIdx = Math.floor((decDeg + 90) / 10);
    if (decIdx >= GRID_H) decIdx = GRID_H - 1;

    let bestDist = Infinity;
    let bestStar: Star | null = null;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let cx = raIdx + dx;
            let cy = decIdx + dy;
            
            if (cx < 0) cx += GRID_W;
            if (cx >= GRID_W) cx -= GRID_W;
            
            if (cy < 0 || cy >= GRID_H) continue;

            for (const star of grid[cx][cy]) {
                let dRa = Math.abs(star.ra - raHours);
                if (dRa > 12) dRa = 24 - dRa;
                
                const dDec = star.dec - decDeg;
                
                const cosDec = Math.cos(star.dec * Math.PI / 180);
                const distSq = (dRa * 15 * cosDec) ** 2 + dDec ** 2;
                
                if (distSq < bestDist) {
                    bestDist = distSq;
                    bestStar = star;
                }
            }
        }
    }

    if (bestDist < 0.25) return bestStar;
    return null;
  };

  console.log('Matching constellation lines to stars...');
  const constellationOutput = [];
  const usedStarIds = new Set<number>();

  for (const feature of constData.features) {
    const lines: number[][] = [];
    
    for (const line of feature.geometry.coordinates) {
        for (let i = 0; i < line.length - 1; i++) {
            const p1 = line[i];
            const p2 = line[i+1];
            
            const s1 = findNearestStar(p1[0], p1[1]);
            const s2 = findNearestStar(p2[0], p2[1]);
            
            if (s1 && s2 && s1.hip !== null && s2.hip !== null) {
                if (s1.hip !== s2.hip) {
                    lines.push([s1.hip, s2.hip]);
                    usedStarIds.add(s1.id);
                    usedStarIds.add(s2.id);
                }
            }
        }
    }
    
    if (lines.length > 0) {
        constellationOutput.push({
            id: feature.id,
            name: CONSTELLATION_NAMES[feature.id] || feature.id,
            lines: lines
        });
    }
  }

  // 4. Output Data
  const finalStars = allStars.filter(s => s.mag <= 6.5 || usedStarIds.has(s.id));
  finalStars.sort((a, b) => a.mag - b.mag);

  const starsArray = finalStars.map(s => [
    Number(s.ra.toFixed(4)),
    Number(s.dec.toFixed(4)),
    Number(s.mag.toFixed(2)),
    s.bv !== null ? Number(s.bv.toFixed(2)) : null,
    s.hip
  ]);
  
  const starsJson = { stars: starsArray };
  
  console.log(`Writing ${starsArray.length} stars to ${OUTPUT_STARS}`);
  fs.writeFileSync(OUTPUT_STARS, JSON.stringify(starsJson));
  
  console.log(`Writing ${constellationOutput.length} constellations to ${OUTPUT_CONSTELLATIONS}`);
  fs.writeFileSync(OUTPUT_CONSTELLATIONS, JSON.stringify({ constellations: constellationOutput }));
}

main().catch(console.error);
