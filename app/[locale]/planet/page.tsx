"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// OrbitControls implementation inline
class OrbitControls {
  object: THREE.Camera;
  domElement: HTMLElement;
  autoRotate: boolean = true;
  autoRotateSpeed: number = 1;
  enableRotate: boolean = true;
  enableZoom: boolean = true;
  enablePan: boolean = true;
  rotateSpeed: number = 1;
  zoomSpeed: number = 1;
  panSpeed: number = 0.5;
  target: THREE.Vector3 = new THREE.Vector3();
  minDistance: number = 10;
  maxDistance: number = 500;

  private spherical: THREE.Spherical = new THREE.Spherical();
  private sphericalDelta: THREE.Spherical = new THREE.Spherical();
  private scale: number = 1;
  private panOffset: THREE.Vector3 = new THREE.Vector3();
  private isRotating: boolean = false;
  private isPanning: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(object: THREE.Camera, domElement: HTMLElement) {
    this.object = object;
    this.domElement = domElement;
    this.update();

    domElement.addEventListener("mousedown", this.onMouseDown);
    domElement.addEventListener("mousemove", this.onMouseMove);
    domElement.addEventListener("mouseup", this.onMouseUp);
    domElement.addEventListener("wheel", this.onMouseWheel);
  }

  private onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) this.isRotating = true;
    if (event.button === 2) this.isPanning = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  };

  private onMouseMove = (event: MouseEvent) => {
    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    if (this.isRotating && this.enableRotate) {
      this.sphericalDelta.theta -= (deltaX * this.rotateSpeed) / 500;
      this.sphericalDelta.phi -= (deltaY * this.rotateSpeed) / 500;
    }

    if (this.isPanning && this.enablePan) {
      this.panOffset.x -= deltaX * this.panSpeed * 0.01;
      this.panOffset.y += deltaY * this.panSpeed * 0.01;
    }

    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  };

  private onMouseUp = () => {
    this.isRotating = false;
    this.isPanning = false;
  };

  private onMouseWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (this.enableZoom) {
      this.scale *= event.deltaY > 0 ? 1.1 : 0.9;
      this.scale = Math.max(
        this.minDistance,
        Math.min(this.maxDistance, this.scale),
      );
    }
  };

  update = () => {
    const position = this.object.position;
    position.subVectors(this.object.position, this.target);

    this.spherical.setFromVector3(position);
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    this.spherical.phi = Math.max(
      0.01,
      Math.min(Math.PI - 0.01, this.spherical.phi),
    );
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.spherical.radius),
    );

    position.setFromSpherical(this.spherical);
    position.add(this.target);

    this.object.lookAt(this.target);

    this.sphericalDelta.theta = 0;
    this.sphericalDelta.phi = 0;
    this.scale = 1;

    if (this.autoRotate && !this.isRotating) {
      this.sphericalDelta.theta +=
        (0.001 * this.autoRotateSpeed * Math.PI) / 180;
    }

    this.target.add(this.panOffset);
    this.panOffset.multiplyScalar(0.95);
  };

  dispose = () => {
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
    this.domElement.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("wheel", this.onMouseWheel);
  };
}

// 3D Simplex Noise GLSL implementation
const SIMPLEX_NOISE_GLSL = `
  //
  // Description : Array and textureless GLSL 2D/3D/4D Simplex 
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : ijm
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the BSD 2-Clause License, which is
  //               available at: https://opensource.org/licenses/BSD-2-Clause
  //

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  float simplex3d(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a cube, mapped onto an octahedron.
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

// Terrain Vertex Shader
const terrainVertexShader = `
  ${SIMPLEX_NOISE_GLSL}

  uniform float uTime;
  uniform float uRadius;
  uniform vec3 uNoiseOffset;
  uniform float uTerrainDisplacement;
  uniform float uContinentCoverage;
  uniform float uContinentFrequency;
  uniform float uPlanetOblateness;
  
  varying float vElevation;
  varying float vContinentMask;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vLatitude;

  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;
    
    for(int i = 0; i < octaves; i++) {
      value += amplitude * simplex3d(p * frequency + uNoiseOffset);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value / maxValue;
  }

  void main() {
    vec3 pos = normalize(position);
    
    // Latitude for biome calculation
    vLatitude = abs(pos.y);
    
    // Two-layer continent generation
    // Layer 1: Low-frequency continent mask (defines continents vs ocean)
    float continentNoise1 = simplex3d(pos * uContinentFrequency + uNoiseOffset);
    float continentNoise2 = simplex3d(pos * (uContinentFrequency + 0.3) + uNoiseOffset * 0.7);
    float continentMask = continentNoise1 * 0.6 + continentNoise2 * 0.4;
    continentMask = smoothstep(1.0 - uContinentCoverage, 1.0 - uContinentCoverage + 0.15, continentMask);
    vContinentMask = continentMask;
    
    // Layer 2: High-frequency terrain detail (only on land)
    float terrainDetail = fbm(pos * 4.0, 5) * 0.5 + fbm(pos * 8.0, 3) * 0.25;
    terrainDetail = mix(terrainDetail * 0.3, terrainDetail * 0.8, continentMask);
    
    // Ocean floor has subtle noise variation
    float oceanFloor = simplex3d(pos * 2.5 + uNoiseOffset * 0.5) * 0.1 + 0.05;
    
    // Combine elevation: continents rise above sea level, oceans below
    float elevation = mix(oceanFloor - 0.3, continentMask + terrainDetail, continentMask);
    elevation = elevation * 0.5 + 0.5;
    vElevation = elevation;
    
    // Displace vertex with randomized terrain amplitude
    float displacement = mix(-uTerrainDisplacement * 0.5, uTerrainDisplacement, elevation);
    vec3 displaced = pos * (uRadius + displacement);
    
    // Apply subtle planet oblateness (equatorial bulge)
    displaced.y *= uPlanetOblateness;
    
    vNormal = normalize(displaced);
    vPosition = displaced;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// Terrain Fragment Shader
const terrainFragmentShader = `
  ${SIMPLEX_NOISE_GLSL}
  
  uniform float uPolarIceThreshold;
  varying float vElevation;
  varying float vContinentMask;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vLatitude;

  void main() {
    vec3 normalizedPos = normalize(vPosition);
    float latitude = vLatitude;
    
    // Natural ice cap boundary with noise perturbation
    float iceBoundaryNoise = simplex3d(normalizedPos * 3.0) * 0.15;
    float noisyLatitude = latitude + iceBoundaryNoise;
    float iceCover = smoothstep(uPolarIceThreshold - 0.05, uPolarIceThreshold + 0.1, noisyLatitude);
    
    vec3 color;
    
    // Polar ice caps (override all other coloring)
    if (iceCover > 0.1) {
      color = mix(vec3(0.85, 0.90, 1.0), vec3(1.0, 1.0, 1.0), min(iceCover, 1.0));
    }
    // Deep ocean (always below certain elevation regardless of latitude)
    else if (vElevation < 0.25) {
      color = mix(vec3(0.0, 0.1, 0.3), vec3(0.05, 0.15, 0.4), vElevation / 0.25);
    }
    // Shallow coastal water
    else if (vElevation < 0.35) {
      float coastFade = (vElevation - 0.25) / 0.1;
      vec3 shallowWater = mix(vec3(0.2, 0.5, 0.7), vec3(0.3, 0.6, 0.8), coastFade);
      color = shallowWater;
    }
    // Equatorial land (hot regions: latitude < 0.3)
    else if (latitude < 0.3) {
      if (vElevation < 0.45) {
        // Tropical sandy/desert
        color = mix(vec3(0.8, 0.75, 0.6), vec3(0.85, 0.80, 0.65), (vElevation - 0.35) / 0.1);
      } else if (vElevation < 0.6) {
        // Tropical jungle/forest
        color = mix(vec3(0.2, 0.5, 0.15), vec3(0.15, 0.45, 0.1), (vElevation - 0.45) / 0.15);
      } else {
        // Equatorial mountains
        color = mix(vec3(0.5, 0.45, 0.4), vec3(0.9, 0.88, 0.85), (vElevation - 0.6) / 0.2);
      }
    }
    // Temperate land (mid latitudes: 0.3-0.6)
    else if (latitude < 0.6) {
      if (vElevation < 0.45) {
        // Rolling plains and grasslands
        color = mix(vec3(0.35, 0.55, 0.2), vec3(0.4, 0.5, 0.15), (vElevation - 0.35) / 0.1);
      } else if (vElevation < 0.7) {
        // Forests and highlands
        color = mix(vec3(0.25, 0.45, 0.15), vec3(0.4, 0.4, 0.35), (vElevation - 0.45) / 0.25);
      } else {
        // Mountain peaks
        color = mix(vec3(0.5, 0.5, 0.48), vec3(0.95, 0.93, 0.92), (vElevation - 0.7) / 0.2);
      }
    }
    // Cold land (high latitudes: 0.6-0.8)
    else {
      if (vElevation < 0.45) {
        // Tundra
        color = mix(vec3(0.45, 0.40, 0.35), vec3(0.55, 0.48, 0.42), (vElevation - 0.35) / 0.1);
      } else if (vElevation < 0.65) {
        // Subarctic terrain
        color = mix(vec3(0.35, 0.35, 0.3), vec3(0.5, 0.45, 0.4), (vElevation - 0.45) / 0.2);
      } else {
        // Arctic peaks and ice-covered mountains
        color = mix(vec3(0.65, 0.65, 0.7), vec3(0.98, 0.98, 1.0), (vElevation - 0.65) / 0.2);
      }
    }
    
    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    color *= diffuse * 0.8 + 0.2;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Ocean Vertex Shader
const oceanVertexShader = `
  ${SIMPLEX_NOISE_GLSL}

  uniform float uTime;
  uniform float uRadius;
  uniform vec3 uNoiseOffset;
  uniform float uPlanetOblateness;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vLatitude;

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;
    
    for(int i = 0; i < 3; i++) {
      value += amplitude * simplex3d(p * frequency + uTime * 0.1 + uNoiseOffset);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value / maxValue;
  }

  void main() {
    vec3 pos = normalize(position);
    
    // Wave animation
    float wave = fbm(pos * 5.0);
    
    vec3 displaced = pos * (uRadius * 1.02 + wave * 0.01);
    
    vNormal = normalize(displaced);
    vPosition = displaced;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// Ocean Fragment Shader
const oceanFragmentShader = `
  ${SIMPLEX_NOISE_GLSL}
  
  uniform float uPolarIceThreshold;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vLatitude;

  void main() {
    vec3 normalizedPos = normalize(vPosition);
    float latitude = vLatitude;
    
    // Natural ice cap boundary with noise perturbation
    float iceBoundaryNoise = simplex3d(normalizedPos * 3.0) * 0.15;
    float noisyLatitude = latitude + iceBoundaryNoise;
    float iceCover = smoothstep(uPolarIceThreshold - 0.05, uPolarIceThreshold + 0.1, noisyLatitude);
    
    // View direction for Fresnel effect
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.0);
    
    vec3 oceanColor;
    float oceanAlpha = 0.6;
    
    // Polar ice on ocean
    if (iceCover > 0.1) {
      oceanColor = mix(vec3(0.85, 0.90, 1.0), vec3(1.0, 1.0, 1.0), min(iceCover, 1.0));
      oceanAlpha = mix(0.6, 0.85, iceCover);
    }
    // Temperature-based ocean coloring
    else if (latitude < 0.3) {
      // Equatorial oceans: warm, turquoise-green
      oceanColor = mix(vec3(0.2, 0.5, 0.7), vec3(0.3, 0.6, 0.6), 0.5);
    } else if (latitude < 0.6) {
      // Temperate oceans: medium blue
      oceanColor = mix(vec3(0.1, 0.35, 0.65), vec3(0.15, 0.45, 0.75), 0.5);
    } else {
      // Polar oceans: deep cold blue
      oceanColor = mix(vec3(0.05, 0.15, 0.4), vec3(0.1, 0.25, 0.5), 0.5);
    }
    
    // Add shimmer based on fresnel
    vec3 color = oceanColor + vec3(0.3, 0.5, 0.7) * fresnel * 0.4;
    
    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.2);
    color *= diffuse;
    
    gl_FragColor = vec4(color, oceanAlpha);
  }
`;

// Cloud Vertex Shader
const cloudVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Cloud Fragment Shader
const cloudFragmentShader = `
  ${SIMPLEX_NOISE_GLSL}

  uniform float uTime;
  uniform float uRadius;
  uniform vec3 uNoiseOffset;
  
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vec3 pos = normalize(vPosition);
    
    // Animated cloud pattern
    float cloud1 = simplex3d(pos * 3.0 + vec3(uTime * 0.05, 0.0, 0.0) + uNoiseOffset);
    float cloud2 = simplex3d(pos * 6.0 + vec3(uTime * 0.03, 0.0, uTime * 0.05) + uNoiseOffset);
    
    float cloudPattern = cloud1 * 0.6 + cloud2 * 0.4;
    cloudPattern = smoothstep(0.2, 0.8, cloudPattern * 0.5 + 0.5);
    
    vec3 cloudColor = vec3(1.0, 1.0, 1.0);
    
    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.3);
    cloudColor *= diffuse;
    
    gl_FragColor = vec4(cloudColor, cloudPattern * 0.7);
  }
`;

// Atmosphere Vertex Shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Atmosphere Fragment Shader
const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    
    // Rayleigh scattering approximation
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
    
    // Blue atmosphere glow
    vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
    
    gl_FragColor = vec4(atmosphereColor, fresnel * 0.5);
  }
`;

// Helper function to generate deterministic random values from seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface PlanetParams {
  radius: number;
  terrainDisplacement: number;
  continentCoverage: number;
  continentFrequency: number;
  polarIceThreshold: number;
  planetOblateness: number;
}

function generatePlanetParams(seed: [number, number, number]): PlanetParams {
  const baseSeed = seed[0] + seed[1] * 1000 + seed[2] * 1000000;
  
  return {
    radius: 2.2 + seededRandom(baseSeed) * 1.0,
    terrainDisplacement: 0.06 + seededRandom(baseSeed + 1) * 0.08,
    continentCoverage: 0.25 + seededRandom(baseSeed + 2) * 0.25,
    continentFrequency: 0.7 + seededRandom(baseSeed + 3) * 0.7,
    polarIceThreshold: 0.65 + seededRandom(baseSeed + 4) * 0.2,
    planetOblateness: 0.96 + seededRandom(baseSeed + 5) * 0.03,
  };
}

export default function PlanetPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<[number, number, number]>(() => [
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
  ]);

  const generateNewPlanet = () => {
    setSeed([Math.random() * 100, Math.random() * 100, Math.random() * 100]);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Generate planet parameters from seed
    const planetParams = generatePlanetParams(seed);
    const terrainRadius = planetParams.radius;
    
    // Position camera relative to planet size
    const cameraDistance = terrainRadius * 3.5;
    camera.position.set(0, 0, cameraDistance);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.minDistance = terrainRadius * 1.5;
    controls.maxDistance = terrainRadius * 15;

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = Math.random() * 500 + 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.cos(phi);
      starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const noiseOffset = new THREE.Vector3(seed[0], seed[1], seed[2]);

    // Terrain sphere
    const terrainGeometry = new THREE.IcosahedronGeometry(terrainRadius, 60);
    const terrainMaterial = new THREE.ShaderMaterial({
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: terrainRadius },
        uNoiseOffset: { value: noiseOffset },
        uTerrainDisplacement: { value: planetParams.terrainDisplacement },
        uContinentCoverage: { value: planetParams.continentCoverage },
        uContinentFrequency: { value: planetParams.continentFrequency },
        uPolarIceThreshold: { value: planetParams.polarIceThreshold },
        uPlanetOblateness: { value: planetParams.planetOblateness },
      },
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    scene.add(terrain);

    // Ocean sphere
    const oceanRadius = terrainRadius * 1.02;
    const oceanGeometry = new THREE.IcosahedronGeometry(oceanRadius, 40);
    const oceanMaterial = new THREE.ShaderMaterial({
      vertexShader: oceanVertexShader,
      fragmentShader: oceanFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: oceanRadius },
        uNoiseOffset: { value: noiseOffset },
        uPolarIceThreshold: { value: planetParams.polarIceThreshold },
        uPlanetOblateness: { value: planetParams.planetOblateness },
      },
      blending: THREE.NormalBlending,
      transparent: true,
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    scene.add(ocean);

    // Cloud sphere
    const cloudRadius = terrainRadius * 1.05;
    const cloudGeometry = new THREE.IcosahedronGeometry(cloudRadius, 30);
    const cloudMaterial = new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: cloudRadius },
        uNoiseOffset: { value: noiseOffset },
      },
      blending: THREE.NormalBlending,
      transparent: true,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // Atmosphere sphere
    const atmosphereRadius = terrainRadius * 1.05;
    const atmosphereGeometry = new THREE.IcosahedronGeometry(atmosphereRadius, 20);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // Clock for animation
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update uniforms
      terrainMaterial.uniforms.uTime.value = elapsedTime;
      oceanMaterial.uniforms.uTime.value = elapsedTime;
      cloudMaterial.uniforms.uTime.value = elapsedTime;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      terrainGeometry.dispose();
      terrainMaterial.dispose();
      oceanGeometry.dispose();
      oceanMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [seed]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={generateNewPlanet}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: "#000",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          zIndex: 10,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(255, 255, 255, 1)";
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(255, 255, 255, 0.9)";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        Generate New Planet
      </button>
    </div>
  );
}
