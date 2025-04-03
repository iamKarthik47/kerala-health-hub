
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
    camera.position.set(0, 0, 30);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, height);
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
    
    // Create bar chart visualization
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
    if (!data.cases.length) return;
    
    const maxValue = Math.max(
      ...data.cases,
      ...data.recovered,
      ...data.active
    );
    
    const barWidth = 1;
    const spacing = 0.5;
    const totalWidth = (barWidth * 3 + spacing * 2) * data.labels.length;
    const startX = -totalWidth / 2 + barWidth / 2;
    
    // Create groups
    data.labels.forEach((label, i) => {
      // Cases bars (red)
      createBar(
        scene,
        startX + i * (barWidth * 3 + spacing * 2),
        data.cases[i] / maxValue * 10,
        0xff4d4d,
        label + ": " + data.cases[i]
      );
      
      // Recovered bars (green)
      createBar(
        scene,
        startX + barWidth + spacing + i * (barWidth * 3 + spacing * 2),
        data.recovered[i] / maxValue * 10,
        0x4dff88,
        "Recovered: " + data.recovered[i]
      );
      
      // Active bars (yellow)
      createBar(
        scene,
        startX + (barWidth + spacing) * 2 + i * (barWidth * 3 + spacing * 2),
        data.active[i] / maxValue * 10,
        0xffca4d,
        "Active: " + data.active[i]
      );
      
      // Label
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
      const labelObj = new THREE.Mesh(
        new THREE.BoxGeometry(barWidth * 3 + spacing * 2, 0.5, 0.1),
        textMaterial
      );
      labelObj.position.set(
        startX + barWidth + spacing / 2 + i * (barWidth * 3 + spacing * 2),
        -1,
        0
      );
      scene.add(labelObj);
    });
    
    // Add legend
    const legendItems = [
      { color: 0xff4d4d, label: "Total Cases" },
      { color: 0x4dff88, label: "Recovered" },
      { color: 0xffca4d, label: "Active" }
    ];
    
    legendItems.forEach((item, i) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshPhongMaterial({ color: item.color })
      );
      cube.position.set(-totalWidth / 2 + i * 5, -5, 0);
      scene.add(cube);
    });
  };
  
  const createBar = (
    scene: THREE.Scene,
    x: number,
    height: number,
    color: number,
    tooltip: string
  ) => {
    const geometry = new THREE.BoxGeometry(0.8, height <= 0.1 ? 0.1 : height, 0.8);
    const material = new THREE.MeshPhongMaterial({ color });
    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(x, height / 2, 0);
    bar.userData.tooltip = tooltip;
    scene.add(bar);
  };
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-health-50 rounded-lg"
      style={{ height: `${height}px` }}
    />
  );
};

export default ReportVisualization3D;
