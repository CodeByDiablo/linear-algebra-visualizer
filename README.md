---

### ✅ **📌 COPY FROM BELOW (Start to End) AND PASTE INTO README.md**

```markdown
# 🎯 Linear Algebra Visualizer  
### *(2D & 3D Matrix Transformations using C++ + WebAssembly + Three.js)*

An interactive tool to visualize how **matrices transform vectors and coordinate systems** in both **2D and 3D space**, using:

- ✅ **C++ (compiled to WebAssembly) for fast math**
- ✅ **JavaScript (Canvas + Three.js) for visualization**
- ✅ **HTML5 + CSS3 for UI**

---

## 👨‍💻 Author

**Devesh Panwar**  
Student, Chandigarh University

---

## 🚀 Features

✔ Visualizes 2D and 3D matrix transformations  
✔ Uses C++ → WebAssembly for high-performance computation  
✔ 3D Mode with orbit camera using Three.js  
✔ Input any matrix & vector to see transformation instantly  
✔ Reset to Identity Matrix easily  
✔ Clean + modern UI (glassmorphism styling)

---

## 🧠 Understanding the Math

### ✅ 2D Matrix Transformation

A 2×2 matrix multiplies a 2D vector like this:

\[
A =
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix},\quad
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

📌 This changes direction, scale, orientation, or shears the vector.

---

### ✅ 3D Matrix Transformation

\[
A =
\begin{bmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{bmatrix},\quad
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

📌 Used for 3D **rotation, scaling, shearing, and perspective changes**

---

## 📁 Folder Structure

```

linear-algebra-visualizer/
├── public/
│   ├── home.html          # Mode selection (2D or 3D)
│   ├── index.html         # 2D Visualizer
│   ├── index-3d.html      # 3D Visualizer
│   ├── style.css          # Styling
│   ├── app.js             # 2D JavaScript & WASM interface
│   ├── app3d.js           # 3D JavaScript & WASM + Three.js
│   └── wasm/
│       ├── linAlg.js      # 2D WebAssembly loader
│       ├── linAlg.wasm    # 2D compiled WebAssembly
│       ├── linAlg3d.js    # 3D WebAssembly loader
│       └── linAlg3d.wasm  # 3D compiled WebAssembly
└── src/
├── linAlg.cpp         # C++ logic for 2D matrix ops
└── linAlg3d.cpp       # C++ logic for 3D matrix ops

````

---

## ⚙️ How to Run Locally

### ✅ 1. Open in Live Server (VS Code)
- Right-click `public/home.html` → **“Open with Live Server”**

---

### ✅ 2. Compile C++ to WebAssembly (Only if rebuilding)

**2D Compilation:**

```powershell
emcc src/linAlg.cpp -O3 -s WASM=1 `
  -s EXPORTED_FUNCTIONS='["_multiply2x2","_transformBasis","_malloc","_free"]' `
  -s EXPORTED_RUNTIME_METHODS='["cwrap","HEAPF64"]' `
  -o public/wasm/linAlg.js
````

**3D Compilation:**

```powershell
emcc src/linAlg3d.cpp -O3 -s WASM=1 `
  -s EXPORTED_FUNCTIONS='["_multiply3x3","_malloc","_free"]' `
  -s EXPORTED_RUNTIME_METHODS='["cwrap","HEAPF64"]' `
  -o public/wasm/linAlg3d.js
```

---

## 🛠️ Technologies Used

| Technology                | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| **C++**                   | Matrix math and vector transformations                |
| **WebAssembly (WASM)**    | Runs C++ code inside the browser at near-native speed |
| **JavaScript (ES6)**      | UI logic and WASM interaction                         |
| **HTML5 / CSS3**          | Layout and styling                                    |
| **Canvas API (2D)**       | Drawing vectors & axes                                |
| **Three.js (WebGL)**      | 3D scene, camera control, arrows                      |
| **Emscripten**            | Compiles C++ → WebAssembly                            |
| **VS Code + Live Server** | Local development and testing                         |

---

## 🚧 Future Improvements

* 🎛 Add preset matrices (rotation, reflection, shear buttons)
* 🎥 Animate vector transformations
* 📸 Export canvas as PNG/SVG
* 📐 Show determinant, eigenvalues, and basis deformation
* 🌐 Deploy using GitHub Pages / Vercel

---

## 📄 License

MIT License — Free to use for learning, research, or development.

---

💙 *Created with passion by* **Devesh Panwar**
*Student, Chandigarh University*

```

---
