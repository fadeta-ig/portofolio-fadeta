<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const container = ref(null);
let scene, camera, renderer, mesh;
let animationId;
let noise3D = createNoise3D();

const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();

onMounted(() => {
  initThree();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  if (animationId) cancelAnimationFrame(animationId);
  
  if (renderer) {
    renderer.dispose();
  }
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
  }
});

const handleResize = () => {
  if (!container.value || !camera || !renderer) return;
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;
  
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const handleMouseMove = (event) => {
  // Normalize mouse coordinates to -1 to +1
  targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const initThree = () => {
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);

  // Environment and lighting for the glass material to reflect/refract
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  
  // Create a colorful abstract texture for the environment map to refract
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#0a0a0a'); // Background color matching our theme
  const colorSphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshBasicMaterial({ color: '#2a5b84', side: THREE.BackSide })
  );
  envScene.add(colorSphere);
  
  const dirLight1 = new THREE.DirectionalLight('#a0f0ff', 2);
  dirLight1.position.set(2, 2, 2);
  scene.add(dirLight1);
  
  const dirLight2 = new THREE.DirectionalLight('#e0e0e0', 1);
  dirLight2.position.set(-2, -2, -2);
  scene.add(dirLight2);
  
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
  scene.add(ambientLight);

  // Geometry: high segment count for smooth displacement
  const geometry = new THREE.SphereGeometry(1.5, 128, 128);
  
  // Save original positions for noise displacement
  geometry.userData.originalPositions = new Float32Array(geometry.attributes.position.array);

  // Material: MeshPhysicalMaterial for premium glass look
  const material = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 1.0,        // glass-like
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 2.0,
    specularIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.FrontSide,
    transparent: true,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const elapsedTime = performance.now() * 0.001;

  // Smoothly interpolate mouse position
  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  if (mesh) {
    // Rotate mesh slightly based on mouse
    mesh.rotation.x = mouse.y * 0.5;
    mesh.rotation.y = mouse.x * 0.5;

    // Organic noise displacement
    const positions = mesh.geometry.attributes.position;
    const originalPositions = mesh.geometry.userData.originalPositions;
    
    // Scale parameters
    const noiseFreq = 1.2;
    const noiseAmp = 0.2 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.1; // More distorted when mouse moves away from center
    
    for (let i = 0; i < positions.count; i++) {
      const idx = i * 3;
      const x = originalPositions[idx];
      const y = originalPositions[idx + 1];
      const z = originalPositions[idx + 2];
      
      // Calculate noise based on vertex position and time
      const noise = noise3D(
        x * noiseFreq + elapsedTime * 0.5,
        y * noiseFreq + elapsedTime * 0.3,
        z * noiseFreq
      );
      
      // Compute displacement vector
      const displacement = 1 + noise * noiseAmp;
      
      positions.setXYZ(i, x * displacement, y * displacement, z * displacement);
    }
    
    // Need to recompute normals after changing vertices for correct lighting
    mesh.geometry.computeVertexNormals();
    positions.needsUpdate = true;
  }

  renderer.render(scene, camera);
};
</script>

<template>
  <div ref="container" class="w-full h-full min-h-[600px] flex items-center justify-center pointer-events-none mix-blend-screen md:mix-blend-normal opacity-80 md:opacity-100"></div>
</template>

<style scoped>
/* Ensure canvas ignores pointer events but container can be styled */
div {
  z-index: -1;
}
</style>
