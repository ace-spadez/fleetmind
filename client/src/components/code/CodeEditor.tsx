import { useEffect, useState } from "react";

type CodeEditorProps = {
  fileName: string;
};

const CodeEditor = ({ fileName }: CodeEditorProps) => {
  const [code, setCode] = useState("");
  
  useEffect(() => {
    // Load different code based on file extension
    if (fileName.endsWith('.jsx')) {
      setCode(solarSystemCode);
    } else if (fileName.endsWith('.js')) {
      setCode(`// JavaScript code for ${fileName}\n\nconst main = () => {\n  console.log("Hello from ${fileName}");\n};\n\nmain();`);
    } else if (fileName.endsWith('.json')) {
      setCode(`{\n  "name": "solar-system-simulator",\n  "version": "1.0.0",\n  "description": "An educational solar system simulator",\n  "main": "index.js",\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build"\n  }\n}`);
    } else {
      setCode(`// Code for ${fileName}\n`);
    }
  }, [fileName]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 code-editor">
      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full h-full bg-transparent text-[hsl(var(--dark-1))] text-sm font-mono focus:outline-none resize-none"
        spellCheck="false"
      />
    </div>
  );
};

const solarSystemCode = `import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import planetData from '../data/planetData';

/**
 * SolarSystem component that renders an interactive 3D solar system
 * @returns {JSX.Element} The solar system visualization
 */
const SolarSystem = () => {
  const containerRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const planetsRef = useRef({});

  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add point light (sun)
    const sunLight = new THREE.PointLight(0xFFFFFF, 1.5);
    scene.add(sunLight);

    // Add background stars
    createStarBackground(scene);

    // Create sun and planets
    createCelestialBodies(scene);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (isRotating && planetsRef.current) {
        updatePlanetPositions();
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js objects
      if (sceneRef.current) {
        disposeScene(sceneRef.current);
      }
    };
  }, []);

  /**
   * Creates a starry background for the scene
   * @param {THREE.Scene} scene - The Three.js scene
   */
  const createStarBackground = (scene) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  };

  // More implementation details would follow...

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full"></div>
      
      <div className="absolute top-4 left-4 bg-dark-800 bg-opacity-70 p-2 rounded">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-3 py-1 bg-primary text-white rounded text-sm"
        >
          {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        </button>
      </div>
      
      {selectedPlanet && (
        <div className="absolute bottom-4 right-4 bg-dark-800 bg-opacity-80 p-4 rounded max-w-md">
          <h3 className="text-lg font-bold text-white mb-2">{selectedPlanet.name}</h3>
          <p className="text-dark-100 mb-2">{selectedPlanet.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-dark-200">Diameter:</span> {selectedPlanet.diameter} km
            </div>
            <div>
              <span className="text-dark-200">Distance from Sun:</span> {selectedPlanet.distanceFromSun} million km
            </div>
            <div>
              <span className="text-dark-200">Day Length:</span> {selectedPlanet.dayLength} hours
            </div>
            <div>
              <span className="text-dark-200">Year Length:</span> {selectedPlanet.yearLength} days
            </div>
          </div>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="mt-3 px-3 py-1 bg-primary text-white rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SolarSystem;`;

export default CodeEditor;
