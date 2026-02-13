import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three';

interface ThreeBackgroundProps {
  scrollY: number;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ scrollY }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create minimal particle system - much fewer for better performance
    const particleCount = 40;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 150;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 80;

      velocities[i] = (Math.random() - 0.5) * 0.3;
      velocities[i + 1] = (Math.random() - 0.5) * 0.3;
      velocities[i + 2] = (Math.random() - 0.5) * 0.3;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Performance variables
    let lastScrollY = scrollY;
    let targetRotationY = 0;
    let targetRotationX = 0;

    // Handle window resize
    const onWindowResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update particles position
      const positionAttribute = (particles.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
      const pos = positionAttribute.array as Float32Array;

      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += velocities[i] * 0.05;
        pos[i + 1] += velocities[i + 1] * 0.05;
        pos[i + 2] += velocities[i + 2] * 0.05;

        // Wrap around
        if (pos[i] > 75) pos[i] = -75;
        if (pos[i] < -75) pos[i] = 75;
        if (pos[i + 1] > 50) pos[i + 1] = -50;
        if (pos[i + 1] < -50) pos[i + 1] = 50;
        if (pos[i + 2] > 40) pos[i + 2] = -40;
        if (pos[i + 2] < -40) pos[i + 2] = 40;
      }
      positionAttribute.needsUpdate = true;

      // Slow particle rotation
      particles.rotation.y += 0.0001;
      particles.rotation.x += 0.00005;

      // Smooth scroll-based rotation
      if (lastScrollY !== scrollY) {
        targetRotationY = scrollY * 0.0004;
        targetRotationX = scrollY * 0.0002;
        lastScrollY = scrollY;
      }

      // Lerp to target rotation for smoothness
      particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.08;
      particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
