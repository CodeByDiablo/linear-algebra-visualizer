// Hardened 3D Visualizer: stable sizing, stable WASM init, safe runtime.

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("three-canvas");

/* ---------- Helpers ---------- */

// Wait until container has a non-zero size (CSS applied, layout ready)
function waitForContainerSize(el) {
  return new Promise((resolve) => {
    const check = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) return resolve();
      requestAnimationFrame(check);
    };
    check();
  });
}

// Wait for Emscripten Module from linAlg3d.js to be ready
function waitForWasmModule() {
  return new Promise((resolve, reject) => {
    // linAlg3d.js injects global "Module"
    if (typeof Module === "object" && Module.calledRun) {
      return resolve(Module);
    }
    if (typeof Module === "object") {
      Module.onRuntimeInitialized = () => resolve(Module);
      return;
    }
    // Fallback: wait a short moment if script loading is slightly delayed
    let tries = 0;
    const timer = setInterval(() => {
      if (typeof Module === "object") {
        clearInterval(timer);
        if (Module.calledRun) resolve(Module);
        else Module.onRuntimeInitialized = () => resolve(Module);
      }
      if (++tries > 200) { // ~10s
        clearInterval(timer);
        reject(new Error("WASM loader (linAlg3d.js) not found. Check script tag order."));
      }
    }, 50);
  });
}

/* ---------- Three.js Setup (after layout ready) ---------- */

let renderer, scene, camera, controls;
let originalArrow = null, transformedArrow = null;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0f14);

  const w = container.clientWidth;
  const h = container.clientHeight;

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
  camera.position.set(3.5, 3.0, 5.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  container.innerHTML = "";            // ensure clean mount
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Helpers
  scene.add(new THREE.AxesHelper(3));
  const grid = new THREE.GridHelper(10, 20, 0x233049, 0x1a2533);
  grid.rotation.x = Math.PI / 2;
  scene.add(grid);

  window.addEventListener("resize", onResize);
}

function onResize() {
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 520;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/* ---------- Arrows ---------- */

function makeArrow(vec3, color) {
  const dir = vec3.clone();
  const len = Math.max(0.0001, dir.length());
  dir.normalize();
  return new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), len, color, 0.18, 0.08);
}

function setVectors(v, tv) {
  if (originalArrow) scene.remove(originalArrow);
  if (transformedArrow) scene.remove(transformedArrow);

  originalArrow = makeArrow(new THREE.Vector3(v.x, v.y, v.z), 0x5aa9ff);
  scene.add(originalArrow);

  if (tv) {
    transformedArrow = makeArrow(new THREE.Vector3(tv.x, tv.y, tv.z), 0xfbbf24);
    scene.add(transformedArrow);
  }
}

/* ---------- Inputs ---------- */

function readInputs() {
  const val = (id) => parseFloat(document.getElementById(id).value);
  return {
    a: val("a"), b: val("b"), c: val("c"),
    d: val("d"), e: val("e"), f: val("f"),
    g: val("g"), h: val("h"), i: val("i"),
    x: val("x"), y: val("y"), z: val("z")
  };
}

/* ---------- Main ---------- */

(async function boot() {
  await waitForContainerSize(container); // layout first
  initThree();                           // then GL
  const M = await waitForWasmModule();   // then WASM

  const multiply3x3 = M.cwrap("multiply3x3", null, [
    "number","number","number",
    "number","number","number",
    "number","number","number",
    "number","number","number",
    "number"
  ]);

  function applyMatrix(A, v) {
    const out = M._malloc(8 * 3);
    multiply3x3(
      A.a, A.b, A.c,
      A.d, A.e, A.f,
      A.g, A.h, A.i,
      v.x, v.y, v.z,
      out
    );
    const res = {
      x: M.HEAPF64[out / 8 + 0],
      y: M.HEAPF64[out / 8 + 1],
      z: M.HEAPF64[out / 8 + 2]
    };
    M._free(out);
    return res;
  }

  const ids3 = ["a","b","c","d","e","f","g","h","i"];
  const identity = () => {
    ids3.forEach((id, k) => {
      document.getElementById(id).value = (k % 4 === 0) ? 1 : 0;
    });
    document.getElementById("x").value = 1;
    document.getElementById("y").value = 1;
    document.getElementById("z").value = 1;
  };

  // Initial frame
  identity();
  setVectors({ x:1, y:1, z:1 });

  // UI
  document.getElementById("applyBtn").addEventListener("click", () => {
    const A = readInputs();
    const v = { x: A.x, y: A.y, z: A.z };
    const tv = applyMatrix(A, v);
    setVectors(v, tv);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    identity();
    setVectors({ x:1, y:1, z:1 });
  });

  // Render loop
  const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
})().catch((e) => {
  console.error(e);
  const msg = document.createElement("div");
  msg.style.color = "#ff7b7b";
  msg.style.padding = "12px";
  msg.textContent = "Initialization error. Open DevTools Console for details.";
  container.appendChild(msg);
});
