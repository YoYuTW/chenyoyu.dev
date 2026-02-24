/**
 * Calculate Greenwich Mean Sidereal Time (GMST) in hours
 * @param date - JavaScript Date object (UTC)
 * @returns GMST in hours (0-24)
 */
export function calculateGMST(date: Date): number {
  // Calculate Julian Date
  // Formula from: http://aa.usno.navy.mil/faq/docs/JD_Formula.php
  // But a simpler one for JS Date (which is ms since 1970-01-01) is:
  // JD = (time / 86400000) + 2440587.5
  const jd = (date.getTime() / 86400000.0) + 2440587.5;
  
  // D = Days since J2000.0 (JD 2451545.0)
  const D = jd - 2451545.0;
  
  // GMST calculation
  // GMST = 18.697374558 + 24.06570982441908 * D
  let gmst = 18.697374558 + 24.06570982441908 * D;
  
  // Normalize to 0-24
  gmst = gmst % 24;
  if (gmst < 0) gmst += 24;
  
  return gmst;
}

/**
 * Calculate Local Sidereal Time (LST) in hours
 * @param gmst - Greenwich Mean Sidereal Time in hours
 * @param longitudeDeg - Observer longitude in degrees (East positive)
 * @returns LST in hours (0-24)
 */
export function calculateLST(gmst: number, longitudeDeg: number): number {
  // Convert longitude to hours (15 degrees = 1 hour)
  const longHours = longitudeDeg / 15.0;
  
  let lst = gmst + longHours;
  
  // Normalize to 0-24
  lst = lst % 24;
  if (lst < 0) lst += 24;
  
  return lst;
}

/**
 * Convert equatorial coordinates (RA/Dec) to horizontal (Alt/Az)
 * This is for CPU-side calculations (e.g., constellation bounding box checks).
 * The main star rendering will do this in the vertex shader.
 * 
 * @param raHours - Right Ascension in hours
 * @param decDeg - Declination in degrees
 * @param lstHours - Local Sidereal Time in hours
 * @param latDeg - Observer latitude in degrees
 * @returns { altitude: number, azimuth: number } in degrees
 */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  lstHours: number,
  latDeg: number
): { altitude: number; azimuth: number } {
  // Convert all to radians
  const raRad = (raHours * 15.0 * Math.PI) / 180.0;
  const decRad = (decDeg * Math.PI) / 180.0;
  const lstRad = (lstHours * 15.0 * Math.PI) / 180.0;
  const latRad = (latDeg * Math.PI) / 180.0;
  
  // Hour Angle (H) = LST - RA
  let hRad = lstRad - raRad;
  
  // Altitude (a)
  // sin(a) = sin(dec) * sin(lat) + cos(dec) * cos(lat) * cos(H)
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + 
                 Math.cos(decRad) * Math.cos(latRad) * Math.cos(hRad);
  const altRad = Math.asin(sinAlt);
  
  // Azimuth (A)
  // cos(A) = (sin(dec) - sin(alt) * sin(lat)) / (cos(alt) * cos(lat))
  // However, simpler using atan2 for correct quadrant
  // sin(A) = - sin(H) * cos(dec) / cos(alt)
  // cos(A) = (sin(dec) - sin(lat) * sin(alt)) / (cos(lat) * cos(alt))
  
  // Standard formula using atan2(y, x):
  // y = -sin(H)
  // x = tan(dec) * cos(lat) - sin(lat) * cos(H)
  // A = atan2(y, x)
  const y = -Math.sin(hRad);
  const x = Math.tan(decRad) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(hRad);
  let azRad = Math.atan2(y, x);
  
  // Normalize to 0-2PI
  if (azRad < 0) azRad += 2 * Math.PI;
  
  // Convert back to degrees
  const altDeg = (altRad * 180.0) / Math.PI;
  const azDeg = (azRad * 180.0) / Math.PI;
  
  return { altitude: altDeg, azimuth: azDeg };
}

/**
 * Convert horizontal coordinates to a 3D point on a unit sphere
 * @returns { x, y, z } position on unit sphere
 * y is up (Zenith)
 */
export function horizontalToCartesian(
  altitudeDeg: number,
  azimuthDeg: number
): { x: number; y: number; z: number } {
  const altRad = (altitudeDeg * Math.PI) / 180.0;
  const azRad = (azimuthDeg * Math.PI) / 180.0;
  
  // In standard math (z up):
  // x = cos(alt) * cos(az)
  // y = cos(alt) * sin(az)
  // z = sin(alt)
  
  // But usually in 3D graphics (y up):
  // We need to map Azimuth (0 = North, 90 = East, 180 = South, 270 = West)
  // to 3D world space.
  // Let's assume North is -Z, East is +X.
  // Azimuth 0 (North) -> (0, 0, -1)
  // Azimuth 90 (East) -> (1, 0, 0)
  
  // x = cos(alt) * sin(az)
  // y = sin(alt)
  // z = -cos(alt) * cos(az)
  
  const cosAlt = Math.cos(altRad);
  const sinAlt = Math.sin(altRad);
  const cosAz = Math.cos(azRad);
  const sinAz = Math.sin(azRad);
  
  return {
    x: cosAlt * sinAz,
    y: sinAlt,
    z: -cosAlt * cosAz
  };
}
