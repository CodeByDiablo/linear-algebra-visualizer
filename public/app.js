// Ensure WASM Module is ready
let ModuleInstance = null;

const wasmReady = new Promise(resolve => {
    if (typeof Module !== 'undefined') {
        Module.onRuntimeInitialized = () => resolve(Module);
    } else {
        resolve(null);
    }
});

// Canvas Setup
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const origin = { x: W / 2, y: H / 2 };
const scale = 50; // 1 unit = 50 pixels

function toCanvasCoords(point) {
    return {
        x: origin.x + point.x * scale,
        y: origin.y - point.y * scale, // Inverted Y-axis in canvas
    };
}

function clearCanvas() {
    ctx.fillStyle = '#0a111d';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#1f2a3a';
    ctx.lineWidth = 1;
    for (let x = origin.x % scale; x < W; x += scale) {
        drawLine(x, 0, x, H);
    }
    for (let y = origin.y % scale; y < H; y += scale) {
        drawLine(0, y, W, y);
    }

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    drawLine(0, origin.y, W, origin.y); // X-axis
    drawLine(origin.x, 0, origin.x, H); // Y-axis
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawArrow(start, end, color) {
    const p1 = toCanvasCoords(start);
    const p2 = toCanvasCoords(end);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    // Main line
    drawLine(p1.x, p1.y, p2.x, p2.y);

    // Arrow head
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const size = 10;
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - size * Math.cos(angle - Math.PI / 6), p2.y - size * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(p2.x - size * Math.cos(angle + Math.PI / 6), p2.y - size * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

function getInputs() {
    return {
        a: parseFloat(document.getElementById('a').value),
        b: parseFloat(document.getElementById('b').value),
        c: parseFloat(document.getElementById('c').value),
        d: parseFloat(document.getElementById('d').value),
        x: parseFloat(document.getElementById('x').value),
        y: parseFloat(document.getElementById('y').value),
    };
}

async function main() {
    ModuleInstance = await wasmReady;

    const multiply = Module.cwrap('multiply2x2', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
    const transformBasis = Module.cwrap('transformBasis', null, ['number', 'number', 'number', 'number', 'number']);

    function applyMatrix(A, vec) {
        const ptr = Module._malloc(8 * 2);
        multiply(A.a, A.b, A.c, A.d, vec.x, vec.y, ptr);
        const result = {
            x: Module.HEAPF64[ptr / 8],
            y: Module.HEAPF64[ptr / 8 + 1],
        };
        Module._free(ptr);
        return result;
    }

    function getBasisTransformed(A) {
        const ptr = Module._malloc(8 * 4);
        transformBasis(A.a, A.b, A.c, A.d, ptr);
        const arr = [
            Module.HEAPF64[ptr / 8],
            Module.HEAPF64[ptr / 8 + 1],
            Module.HEAPF64[ptr / 8 + 2],
            Module.HEAPF64[ptr / 8 + 3],
        ];
        Module._free(ptr);
        return arr;
    }

    function render(A, v, resultV) {
        clearCanvas();

        const basis = getBasisTransformed(A);
        drawArrow({ x: 0, y: 0 }, { x: basis[0], y: basis[1] }, '#5aa9ff'); // A·e1
        drawArrow({ x: 0, y: 0 }, { x: basis[2], y: basis[3] }, '#6ff7a9'); // A·e2

        drawArrow({ x: 0, y: 0 }, v, '#c7d2fe'); // Original vector
        if (resultV) drawArrow({ x: 0, y: 0 }, resultV, '#fbbf24'); // Transformed vector
    }

    // Initial render
    const { a, b, c, d, x, y } = getInputs();
    render({ a, b, c, d }, { x, y });

    document.getElementById('applyBtn').addEventListener('click', () => {
        const { a, b, c, d, x, y } = getInputs();
        render({ a, b, c, d }, { x, y }, applyMatrix({ a, b, c, d }, { x, y }));
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('a').value = 1;
        document.getElementById('b').value = 0;
        document.getElementById('c').value = 0;
        document.getElementById('d').value = 1;
        document.getElementById('x').value = 1;
        document.getElementById('y').value = 1;
        render({ a: 1, b: 0, c: 0, d: 1 }, { x: 1, y: 1 });
    });
}

main();
