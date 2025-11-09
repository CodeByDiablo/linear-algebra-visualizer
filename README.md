# 🎯 Linear Algebra Visualizer (2D & 3D with WebAssembly)

An interactive tool to visualize how matrices transform vectors and basis in **2D and 3D space** — powered by **C++, WebAssembly (WASM), JavaScript, HTML, CSS, and Three.js**.

---

## 👨‍💻 **Author**
**Devesh Panwar**  
Student, Chandigarh University

---

## 🚀 **Features**

✔ Visualize matrix multiplication in **2D & 3D**  
✔ Live transformation of vectors using **C++ compiled to WebAssembly**  
✔ 3D visualization using **Three.js (WebGL)**  
✔ Interactive camera controls (rotate, zoom, pan)  
✔ Reset to Identity Matrix anytime  
✔ Built for learning & presentation — clean UI

---

## 🧠 **Mathematics Behind This**

### ✅ 2D Matrix Transformation
A 2×2 matrix transforms a 2D vector:

\[
A = 
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix},
\quad
v = 
\begin{bmatrix}
x \\
y
\end{bmatrix}
\Rightarrow
A \cdot v = 
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
\]

This changes:
- Size of the vector (scaling)
- Direction of the vector (rotation)
- Shape of grid (shear/reflection)


### ✅ 3D Matrix Transformation

\[
A = 
\begin{bmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{bmatrix},
\quad
v = 
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix}
\Rightarrow
A \cdot v =
\begin{bmatrix}
ax + by + cz \\
dx + ey + fz \\
gx + hy + iz
\end{bmatrix}
\]

This affects:
- Rotation in 3D spaces  
- Perspective changes  
- Shear, scaling, reflections  

All matrix computations are **executed in C++ → compiled to WebAssembly** for high performance.

---

## 🗂️ **Folder Structure**

linear-algebra-visualizer/
├─ public/
│ ├─ home.html # Mode Selection Page (2D or 3D)
│ ├─ index.html # 2D Visualizer
│ ├─ index-3d.html # 3D Visualizer
│ ├─ style.css # Styling
│ ├─ app.js # 2D Logic (Canvas + WASM)
│ ├─ app3d.js # 3D Logic (Three.js + WASM)
│ └─ wasm/
│ ├─ linAlg.js/linAlg.wasm # 2D WebAssembly
│ ├─ linAlg3d.js/linAlg3d.wasm # 3D WebAssembly (optional)
└─ src/
├─ linAlg.cpp # 2D C++ Code
└─ linAlg3d.cpp # 3D C++ Code

---

## ⚙️ **How to Run the Project Locally**

### ✅ Step 1 — Start Live Server

Open project in VS Code → Right-click `public/home.html` →  
✅ **"Open with Live Server"**

### ✅ Step 2 — Compile WebAssembly (if not already done)

In PowerShell (project root):

**For 2D:**
```powershell
emcc src/linAlg.cpp -O3 -s WASM=1 `
  -s EXPORTED_FUNCTIONS='["_multiply2x2","_transformBasis","_malloc","_free"]' `
  -s EXPORTED_RUNTIME_METHODS='["cwrap","HEAPF64"]' `
  -o public/wasm/linAlg.js

**For 3D:**
```powershell
emcc src/linAlg3d.cpp -O3 -s WASM=1 `
  -s EXPORTED_FUNCTIONS='["_multiply3x3","_malloc","_free"]' `
  -s EXPORTED_RUNTIME_METHODS='["cwrap","HEAPF64"]' `
  -o public/wasm/linAlg3d.js

technologies_used:
  - name: "C++"
    purpose: "Performs core matrix operations and vector transformations."
  
  - name: "WebAssembly (WASM)"
    purpose: "Runs compiled C++ code in the browser for high performance."
  
  - name: "JavaScript (ES6 Modules)"
    purpose: "Handles UI logic, communicates with WASM, draws on canvas."

  - name: "HTML5"
    purpose: "Builds the structure of the UI and canvas elements."
  
  - name: "CSS3"
    purpose: "Styles the UI and provides responsive, dark-themed layout."

  - name: "Canvas API (2D)"
    purpose: "Visualizes 2D vectors, axes, and matrix transformations."

  - name: "Three.js (WebGL)"
    purpose: "Renders 3D coordinate systems, vectors, and transformations."

  - name: "Emscripten"
    purpose: "Compiles C++ to WebAssembly and generates JavaScript bindings."

  - name: "VS Code + Live Server"
    purpose: "Local development environment and live reloading for testing."
