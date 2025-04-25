import { useEffect, useState, useRef } from "react";

type CodeEditorProps = {
  fileId: string;
  filename: string;
  content?: string;
};

const CodeEditor = ({ fileId, filename, content }: CodeEditorProps) => {
  const [code, setCode] = useState("");
  const [highlightedCode, setHighlightedCode] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightedCodeRef = useRef<HTMLDivElement>(null);
  
  // Get file type/language from extension
  const getLanguage = (filename: string): string => {
    if (filename.endsWith('.jsx')) return 'jsx';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.tsx')) return 'tsx';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'html';
    return 'plaintext';
  };
  
  useEffect(() => {
    // Use provided content if available, otherwise load default content based on extension
    if (content) {
      setCode(content);
    } else {
      // Load different code based on file extension
      if (filename.endsWith('.jsx')) {
        setCode(solarSystemCode);
      } else if (filename.endsWith('.js')) {
        setCode(`// JavaScript code for ${filename}\n\nconst main = () => {\n  console.log("Hello from ${filename}");\n};\n\nmain();`);
      } else if (filename.endsWith('.json')) {
        setCode(`{\n  "name": "solar-system-simulator",\n  "version": "1.0.0",\n  "description": "An educational solar system simulator",\n  "main": "index.js",\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build"\n  }\n}`);
      } else if (filename.endsWith('.ts')) {
        setCode(`// TypeScript code for ${filename}\n\nconst main = (): void => {\n  console.log("Hello from ${filename}");\n};\n\nmain();`);
      } else if (filename.endsWith('.tsx')) {
        setCode(`// TSX code for ${filename}\n\nimport React from 'react';\n\ninterface Props {\n  name: string;\n}\n\nconst Component: React.FC<Props> = ({ name }) => {\n  return <div>Hello, {name}!</div>;\n};\n\nexport default Component;`);
      } else if (filename.endsWith('.css')) {
        setCode(`/* CSS for ${filename} */\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 1rem;\n}`);
      } else {
        setCode(`// Code for ${filename}\n`);
      }
    }
  }, [filename, content, fileId]);
  
  // Apply basic syntax highlighting
  useEffect(() => {
    updateLineNumbers();
    
    const language = getLanguage(filename);
    
    // This is a simple regex-based syntax highlighter
    let highlighted = code
      // Replace HTML special characters first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|((#|--).*)$/gm, 
      '<span class="comment">$&</span>'
    );
    
    // Strings
    highlighted = highlighted.replace(
      /(["'`])(.*?)\1/g, 
      '<span class="string">$&</span>'
    );
    
    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+(\.\d+)?)\b/g, 
      '<span class="number">$&</span>'
    );
    
    // Keywords (common for JS/TS)
    if (language.includes('javascript') || language.includes('typescript') || language.includes('jsx') || language.includes('tsx')) {
      const keywords = [
        'const', 'let', 'var', 'function', 'class', 'extends', 'implements',
        'interface', 'type', 'enum', 'return', 'if', 'else', 'for', 'while',
        'switch', 'case', 'break', 'continue', 'import', 'export', 'from',
        'default', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this'
      ];
      
      const keywordPattern = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
      highlighted = highlighted.replace(
        keywordPattern,
        '<span class="keyword">$&</span>'
      );
      
      // Function detection
      highlighted = highlighted.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        '<span class="function">$1</span>('
      );
    }
    
    // Replace newlines with <br> after all other replacements
    highlighted = highlighted.replace(/\n/g, '<br>');
    
    setHighlightedCode(highlighted);
  }, [code, filename]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const updateLineNumbers = () => {
    if (!lineNumbersRef.current) return;
    
    const lines = code.split('\n');
    lineNumbersRef.current.innerHTML = Array(lines.length)
      .fill(0)
      .map((_, i) => `<div>${i + 1}</div>`)
      .join('');
  };
  
  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newText = code.substring(0, start) + "  " + code.substring(end);
      setCode(newText);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
    
    if (highlightedCodeRef.current) {
      highlightedCodeRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightedCodeRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-0 code-editor bg-[#1e1e1e] flex">
      <div 
        ref={lineNumbersRef} 
        className="line-numbers text-gray-500 p-2 text-right pr-3 border-r border-gray-700 bg-[#252525] overflow-hidden"
        style={{ minWidth: '3rem' }}
      />
      <div className="relative flex-1">
        {/* Highlighted code display behind the textarea */}
        <div
          ref={highlightedCodeRef}
          className="absolute inset-0 p-2 font-mono text-sm overflow-auto whitespace-pre pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          style={{ lineHeight: '1.6', tabSize: 2 }}
        />
        
        {/* Transparent textarea for editing */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleTabKey}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white p-2 resize-none border-none outline-none font-mono text-sm"
          spellCheck="false"
          style={{
            lineHeight: '1.6',
            tabSize: 2,
            caretColor: 'white',
          }}
        />
      </div>
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
