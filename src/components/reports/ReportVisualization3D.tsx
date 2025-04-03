
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface VisualizationData {
  cases: number[];
  recovered: number[];
  active: number[];
  labels: string[];
}

interface ReportVisualization3DProps {
  data: VisualizationData;
  height?: number;
}

const ReportVisualization3D: React.FC<ReportVisualization3DProps> = ({ 
  data, 
  height = 300 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize the scene
    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f9ff);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60, 
      container.clientWidth / height, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 5, 30);
    
    // Set up renderer with better settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true // Important for capturing canvas content
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Create visualization
    createVisualization(scene, data);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        const newWidth = containerRef.current.clientWidth;
        cameraRef.current.aspect = newWidth / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
      controls.dispose();
    };
  }, [height]);
  
  // Update visualization when data changes
  useEffect(() => {
    if (sceneRef.current) {
      // Clear previous visualization
      const scene = sceneRef.current;
      scene.children = scene.children.filter(child => 
        child instanceof THREE.AmbientLight || child instanceof THREE.DirectionalLight
      );
      
      // Create new visualization
      createVisualization(scene, data);
    }
  }, [data]);

  const createVisualization = (scene: THREE.Scene, data: VisualizationData) => {
    if (!data.cases || !data.cases.length) {
      console.warn("No visualization data provided");
      
      // Create placeholder visualization
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x999999,
        transparent: true,
        opacity: 0.5
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, 0);
      scene.add(cube);
      
      // Add text to indicate no data
      const textGeometry = new THREE.PlaneGeometry(10, 2);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 256, 64);
        context.font = '24px Arial';
        context.fillStyle = '#333333';
        context.textAlign = 'center';
        context.fillText('No data available', 128, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 7, 0);
        scene.add(textMesh);
      }
      
      return;
    }
    
    const maxValue = Math.max(
      ...data.cases,
      ...data.recovered,
      ...data.active
    ) || 1; // Prevent division by zero
    
    const barWidth = 1;
    const spacing = 0.5;
    const totalWidth = (barWidth * 3 + spacing * 2) * data.labels.length;
    const startX = -totalWidth / 2 + barWidth / 2;
    
    // Create floor grid
    const gridSize = Math.max(totalWidth * 1.5, 20);
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x888888, 0xcccccc);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);
    
    // Create groups
    data.labels.forEach((label, i) => {
      // Add group label
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 128;
      textCanvas.height = 32;
      const ctx = textCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 128, 32);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(label, 64, 20);
        
        const texture = new THREE.CanvasTexture(textCanvas);
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 0.6),
          material
        );
        plane.position.set(
          startX + i * (barWidth * 3 + spacing * 2) + barWidth,
          -0.3,
          2
        );
        plane.rotation.x = -Math.PI / 4;
        scene.add(plane);
      }
      
      // Cases bars (red)
      const casesHeight = (data.cases[i] / maxValue) * 10 || 0.1;
      createBar(
        scene,
        startX + i * (barWidth * 3 + spacing * 2),
        casesHeight,
        0xff4d4d,
        label + ": " + data.cases[i],
        true
      );
      
      // Recovered bars (green)
      const recoveredHeight = (data.recovered[i] / maxValue) * 10 || 0.1;
      createBar(
        scene,
        startX + barWidth + spacing + i * (barWidth * 3 + spacing * 2),
        recoveredHeight,
        0x4dff88,
        "Recovered: " + data.recovered[i],
        true
      );
      
      // Active bars (yellow)
      const activeHeight = (data.active[i] / maxValue) * 10 || 0.1;
      createBar(
        scene,
        startX + (barWidth + spacing) * 2 + i * (barWidth * 3 + spacing * 2),
        activeHeight,
        0xffca4d,
        "Active: " + data.active[i],
        true
      );
    });
    
    // Add legend
    const legendItems = [
      { color: 0xff4d4d, label: "Total Cases" },
      { color: 0x4dff88, label: "Recovered" },
      { color: 0xffca4d, label: "Active" }
    ];
    
    legendItems.forEach((item, i) => {
      // Create cube
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshPhongMaterial({ color: item.color })
      );
      cube.position.set(-totalWidth / 2 + i * 5, -5, 0);
      scene.add(cube);
      
      // Create label
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 128;
      labelCanvas.height = 32;
      const ctx = labelCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 128, 32);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, 64, 16);
        
        const texture = new THREE.CanvasTexture(labelCanvas);
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 0.6),
          material
        );
        plane.position.set(
          -totalWidth / 2 + i * 5,
          -5,
          1
        );
        scene.add(plane);
      }
    });
  };
  
  const createBar = (
    scene: THREE.Scene,
    x: number,
    height: number,
    color: number,
    tooltip: string,
    addValue: boolean = false
  ) => {
    // Ensure minimum height for visibility
    const finalHeight = Math.max(0.1, height);
    
    // Create bar
    const geometry = new THREE.BoxGeometry(0.8, finalHeight, 0.8);
    const material = new THREE.MeshPhongMaterial({ 
      color,
      transparent: true,
      opacity: 0.8
    });
    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(x, finalHeight / 2, 0);
    bar.userData.tooltip = tooltip;
    scene.add(bar);
    
    // Add value on top if requested
    if (addValue && height > 0.5) {
      const valueCanvas = document.createElement('canvas');
      valueCanvas.width = 64;
      valueCanvas.height = 32;
      const ctx = valueCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 64, 32);
        ctx.font = '10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        // Extract just the number from the tooltip
        const valueMatch = tooltip.match(/\d+$/);
        if (valueMatch) {
          ctx.fillText(valueMatch[0], 32, 16);
        }
        
        const texture = new THREE.CanvasTexture(valueCanvas);
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(0.8, 0.4),
          material
        );
        plane.position.set(x, finalHeight + 0.3, 0);
        plane.rotation.x = -Math.PI / 4;
        scene.add(plane);
      }
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-health-50 rounded-lg"
      style={{ height: `${height}px` }}
      data-html2canvas-capture="true"
    />
  );
};

export default ReportVisualization3D;
