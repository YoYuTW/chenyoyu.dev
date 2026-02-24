# Technical Design: Real-time WebGL Starfield Hero

## 1. Executive Summary

This document outlines the technical design for replacing the current "Chaos to Order" hero animation on [chenyoyu.dev](https://chenyoyu.dev) with a scientifically accurate, real-time WebGL starfield. The system will render the night sky based on the user's geolocation and local time, featuring three distinct interaction modes (Explore, Reveal, Flashlight) that adapt to the site's context (Home, Blog, About).

**Key Goals:**
- **Visual Fidelity:** Realistic magnitude-based rendering of stars (limit ~9,000 visible stars).
- **Accuracy:** Real-time astronomical calculations (RA/Dec to Alt/Az) based on observer position.
- **Performance:** Target 60fps on mid-range devices using React Three Fiber (R3F) and custom shaders.
- **Interactivity:** Mouse-driven exploration and constellation discovery.

---

## 2. Architecture Overview

The system is built on **Next.js** and **React Three Fiber**. To ensure optimal performance and smooth navigation, the `StarfieldCanvas` will be a persistent background component, with its behavior controlled by a global state (Zustand or React Context).

### High-Level Stack
- **Framework:** Next.js (App Router)
- **WebGL:** Three.js + React Three Fiber (`@react-three/fiber`)
- **Shaders:** Custom GLSL for performant star rendering and flashlight effects
- **Math/Astronomy:** `astronomy-engine` (for precise coordinate transforms) + `three` (for 3D projection)
- **State Management:** React Context (for Interaction Mode switching)

---

## 3. Data Source & Pipeline

### 3.1. Star Catalog
We will use a subset of the **Harvard Revised (HR) Bright Star Catalogue** (specifically the **HYG Database** subset).

- **Source:** HYG Database (csv).
- **Filtering:** Filter for magnitude $\le 6.5$ (visible to naked eye).
- **Data Attributes Required:**
  - Right Ascension (RA)
  - Declination (Dec)
  - Apparent Magnitude (Mag)
  - Color Index (B-V) - optional, for star color tinting.
  - Constellation ID (if available, or mapped separately).

**Processing:**
A build script (`scripts/process-stars.ts`) will run at build time (or manually) to generate a minimized JSON file:
```json
// public/data/stars.min.json
[
  // [ra, dec, mag, color_index]
  [0.12, 1.23, 4.5, 0.5],
  ...
]
```
*Estimated Size:* ~9,000 stars * 4 floats * 4 bytes $\approx$ 144KB (gzipped). Highly cacheable.

### 3.2. Constellations
- **Source:** IAU 88 Constellations line data (pairs of stars).
- **Format:** JSON mapping constellation IDs to arrays of star index pairs (referencing the main star catalog).

---

## 4. Astronomical Calculations

We need to convert **Equatorial Coordinates** (Right Ascension $\alpha$, Declination $\delta$) to **Horizontal Coordinates** (Azimuth $A$, Altitude $h$) based on the observer's location and time.

### 4.1. Coordinate Transformation Pipeline
1.  **Inputs:**
    - Observer Latitude ($\phi$) & Longitude ($\lambda$)
    - Current UTC Time ($t$)
    - Star ($\alpha$, $\delta$)
2.  **Calculate Local Sidereal Time (LST):**
    - Using `astronomy-engine` or simplified formula (Greenwich Sidereal Time + Longitude).
3.  **Hour Angle ($H$):**
    - $H = LST - \alpha$
4.  **Equatorial to Horizontal (Alt/Az):**
    - $\sin(h) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(H)$
    - $\cos(A) = \frac{\sin(\delta) - \sin(\phi)\sin(h)}{\cos(\phi)\cos(h)}$
5.  **Projection:**
    - Map Alt/Az to 3D Cartesian coordinates on a sphere radius $R$.
    - $x = R \cos(h) \sin(A)$
    - $y = R \sin(h)$
    - $z = R \cos(h) \cos(A)$

### 4.2. implementation Strategy
- **Frequency:** Since Earth rotates $360^\circ$ in ~24h ($0.004^\circ$/sec), per-frame CPU calculation for 9,000 stars is wasteful.
- **Approach:**
    - **CPU:** Calculate the **Local Sidereal Time (LST)** every frame.
    - **GPU (Vertex Shader):** Pass `LST`, `Latitude` as uniforms. Pass `RA`, `Dec` as attributes. Perform the rotation and projection in the vertex shader.
    - **Result:** extremely smooth, 60fps rotation with zero CPU overhead for position updates.

---

## 5. WebGL Rendering Architecture

### 5.1. Star System (`Stars.tsx`)
- **Geometry:** `BufferGeometry` with attributes: `position` (derived from RA/Dec in shader), `size` (derived from magnitude), `color`.
- **Material:** `ShaderMaterial`.
  - **Vertex Shader:** Handles coordinate transform (Equatorial -> Horizontal). Calculates point size based on magnitude ($size \propto 10^{-0.4 \times mag}$).
  - **Fragment Shader:** Draws soft circular particle. Handles "Flashlight" effect (distance check from cursor uniform).
- **Uniforms:**
  - `uTime`: Sidereal time reference.
  - `uObserverLat`: Observer latitude.
  - `uCursor`: Mouse position (projected to sphere).
  - `uFlashlightRadius`: Size of the reveal circle.

### 5.2. Constellation Lines (`Constellations.tsx`)
- **Geometry:** `BufferGeometry` using `setIndex` for line segments.
- **Material:** Custom `ShaderMaterial` to match the coordinate transform of the stars so lines stay attached to stars.
- **Interactivity:**
  - Each constellation has a unique `id` attribute.
  - Uniform `uActiveConstellation`: ID of the currently hovered/revealed constellation.
  - Fragment shader boosts opacity if `vConstellationId == uActiveConstellation`.

---

## 6. Interaction Modes

The system switches modes based on the current Next.js route.

| Mode | Route | Behavior | Technical Implementation |
| :--- | :--- | :--- | :--- |
| **Explore** | `/` (Home) | Flashlight reveals stars + faint trace of constellation lines. | Uniform `uFlashlightRadius` > 0. Raycaster checks proximity for faint line fade-in. |
| **Reveal** | `/blog/*` | Clicking/Hovering a star fully lights up its constellation. | Raycaster on `mousemove`. If intersection with Star $S$ (part of Constellation $C$), set `uActiveConstellation = C`. Animate opacity. |
| **Flashlight** | `/about`, etc. | Simple flashlight circle. Constellations hidden. | `uFlashlightRadius` > 0. `uShowConstellations = false`. |

**Implementation:**
- `useStarfieldMode` hook: Detects route and returns the config object `{ radius, showLines, interactionType }`.
- **Raycasting:** Only needed for "Reveal" mode. Perform against a simplified visible set or using a spatial index (BVH) if raw loop is too slow (though 9k points is usually fine for raw distance check in JS if optimized).

---

## 7. Next.js Integration

### 7.1. Component Structure
```tsx
// src/components/starfield/StarfieldCanvas.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Stars } from './Stars'
import { Constellations } from './Constellations'
import { ModeController } from './ModeController'

export default function StarfieldCanvas() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
       <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
          <ModeController />
          <Stars />
          <Constellations />
       </Canvas>
    </div>
  )
}
```

### 7.2. Geolocation & Fallback
- **Hook:** `useGeolocation`.
- **Logic:**
  1. Try `navigator.geolocation.getCurrentPosition`.
  2. If denied/error/timeout, fallback to **Taipei** (25.033, 121.565).
  3. Store in `localStorage` to avoid asking repeatedly (if permission granted).

### 7.3. Theming & Reduced Motion
- **Dark/Light:**
  - Dark Mode: Opacity 1.0.
  - Light Mode: Opacity 0.2 (subtle) or hidden. Controlled via `next-themes`.
- **Reduced Motion:**
  - `useReducedMotion` hook.
  - If true: Disable time-based rotation (freeze time).

### 7.4. SSR Handling
Three.js is client-side only.
```tsx
const StarfieldCanvas = dynamic(() => import('./StarfieldCanvas'), {
  ssr: false
})
```

---

## 8. File Structure

```
src/
├── components/
│   └── starfield/
│       ├── StarfieldCanvas.tsx      # Main Entry (dynamic import)
│       ├── Stars.tsx                # R3F Stars Component
│       ├── Constellations.tsx       # R3F Lines Component
│       ├── ModeController.tsx       # Logic for route -> mode mapping
│       ├── useStarfield.ts          # State store (Zustand)
│       └── shaders/
│           ├── star.vert.glsl
│           ├── star.frag.glsl
│           ├── line.vert.glsl
│           └── line.frag.glsl
├── hooks/
│   ├── useGeolocation.ts
│   └── useStarData.ts               # Fetches/Parses JSON
└── utils/
    └── astronomy.ts                 # Coordinate math helpers
```

---

## 9. Implementation Phases

### Phase 1: Data & Math Foundation
- [ ] Create `scripts/generate-star-data.ts` to process HYG catalog to JSON.
- [ ] Implement `astronomy.ts` for RA/Dec -> Alt/Az conversion.
- [ ] Verify math with unit tests (compare against known star positions for Taipei).

### Phase 2: Basic WebGL Rendering
- [ ] Setup `StarfieldCanvas` with R3F.
- [ ] Implement `Stars.tsx` with static buffer geometry.
- [ ] Create Vertex Shader to handle coordinate rotation based on Time/Lat.

### Phase 3: Interaction & Modes
- [ ] Implement Flashlight effect in Fragment Shader.
- [ ] Implement "Reveal" mode (raycasting & constellation highlighting).
- [ ] Wire up `ModeController` to switch configs based on Route.

### Phase 4: Integration & Polish
- [ ] Integrate into `app/layout.tsx`.
- [ ] Add Geolocation hook with Taipei fallback.
- [ ] Handle window resize and mobile touch events.
- [ ] Optimize performance (ensure < 10ms frame time).
