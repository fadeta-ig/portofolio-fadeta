<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';

const container = ref(null);
let scene, camera, renderer;
let pointsMesh, linesMesh;
let animationId;

const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();

const PARTICLE_COUNT = window.innerWidth < 768 ? 140 : 350;
const CONNECTION_DISTANCE = 2.8;
const SPREAD_X = 14;
const SPREAD_Y = 8;
const SPREAD_Z = 6;

onMounted(() => {
  initScene();
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
      if (child.isPoints || child.isLineSegments) {
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
};

const handleMouseMove = (event) => {
  targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const initScene = () => {
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.z = 14;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.value.appendChild(renderer.domElement);

  // Generate particle positions distributed across a wide rectangular volume
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    positions[idx] = (Math.random() - 0.5) * SPREAD_X;
    positions[idx + 1] = (Math.random() - 0.5) * SPREAD_Y;
    positions[idx + 2] = (Math.random() - 0.5) * SPREAD_Z;

    // Slow drift velocities
    velocities[idx] = (Math.random() - 0.5) * 0.004;
    velocities[idx + 1] = (Math.random() - 0.5) * 0.004;
    velocities[idx + 2] = (Math.random() - 0.5) * 0.002;
  }

  // Points (Nodes)
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
  pointsGeometry.userData.velocities = velocities;

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xa0f0ff,
    size: 0.06,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(pointsMesh);

  // Lines (Edges) - pre-allocate buffer for maximum possible connections
  const maxLines = PARTICLE_COUNT * 10;
  const linePositions = new Float32Array(maxLines * 6);
  const lineColors = new Float32Array(maxLines * 6);
  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(linesMesh);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  // Smooth mouse interpolation
  mouse.x += (targetMouse.x - mouse.x) * 0.03;
  mouse.y += (targetMouse.y - mouse.y) * 0.03;

  if (!pointsMesh || !linesMesh) return;

  // Update particle positions with drift
  const positions = pointsMesh.geometry.attributes.position;
  const velocities = pointsMesh.geometry.userData.velocities;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    let x = positions.array[idx] + velocities[idx];
    let y = positions.array[idx + 1] + velocities[idx + 1];
    let z = positions.array[idx + 2] + velocities[idx + 2];

    // Soft boundary - push back if too far from bounds
    const boundX = SPREAD_X * 0.55;
    const boundY = SPREAD_Y * 0.55;
    const boundZ = SPREAD_Z * 0.55;
    if (Math.abs(x) > boundX) x -= Math.sign(x) * 0.01;
    if (Math.abs(y) > boundY) y -= Math.sign(y) * 0.01;
    if (Math.abs(z) > boundZ) z -= Math.sign(z) * 0.01;

    positions.array[idx] = x;
    positions.array[idx + 1] = y;
    positions.array[idx + 2] = z;
  }
  positions.needsUpdate = true;

  // Rebuild line connections
  const linePositions = linesMesh.geometry.attributes.position;
  const lineColors = linesMesh.geometry.attributes.color;
  let lineIdx = 0;

  const icyR = 0.627;
  const icyG = 0.941;
  const icyB = 1.0;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const ix = i * 3;
      const jx = j * 3;

      const dx = positions.array[ix] - positions.array[jx];
      const dy = positions.array[ix + 1] - positions.array[jx + 1];
      const dz = positions.array[ix + 2] - positions.array[jx + 2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
        if (lineIdx >= linePositions.array.length / 6) break;

        const alpha = 1 - Math.sqrt(distSq) / CONNECTION_DISTANCE;
        const li = lineIdx * 6;

        linePositions.array[li] = positions.array[ix];
        linePositions.array[li + 1] = positions.array[ix + 1];
        linePositions.array[li + 2] = positions.array[ix + 2];
        linePositions.array[li + 3] = positions.array[jx];
        linePositions.array[li + 4] = positions.array[jx + 1];
        linePositions.array[li + 5] = positions.array[jx + 2];

        lineColors.array[li] = icyR * alpha;
        lineColors.array[li + 1] = icyG * alpha;
        lineColors.array[li + 2] = icyB * alpha;
        lineColors.array[li + 3] = icyR * alpha;
        lineColors.array[li + 4] = icyG * alpha;
        lineColors.array[li + 5] = icyB * alpha;

        lineIdx++;
      }
    }
  }

  // Zero out remaining line slots
  for (let k = lineIdx * 6; k < linePositions.array.length; k++) {
    linePositions.array[k] = 0;
    lineColors.array[k] = 0;
  }

  linePositions.needsUpdate = true;
  lineColors.needsUpdate = true;
  linesMesh.geometry.setDrawRange(0, lineIdx * 2);

  // Mouse-reactive rotation (subtle parallax)
  const group = scene;
  group.rotation.y = mouse.x * 0.3;
  group.rotation.x = mouse.y * 0.15;

  renderer.render(scene, camera);
};
</script>

<template>
  <div ref="container" class="network-canvas"></div>
</template>

<style scoped>
.network-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}
</style>
