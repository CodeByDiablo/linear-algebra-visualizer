// src/linAlg.cpp
// 2×2 matrix · 2D vector operations for WebAssembly (Emscripten)

extern "C" {
    // Multiply 2x2 matrix by 2D vector.
    // Inputs: a b
    //         c d
    // and vector (x, y)
    // Output written to out[0], out[1]
    void multiply2x2(double a, double b, double c, double d,
                     double x, double y, double* out) {
        const double nx = a * x + b * y;
        const double ny = c * x + d * y;
        out[0] = nx;
        out[1] = ny;
    }

    // Transform basis vectors e1=(1,0), e2=(0,1)
    // Returns [A*e1.x, A*e1.y, A*e2.x, A*e2.y] into out[0..3]
    void transformBasis(double a, double b, double c, double d, double* out) {
        // e1' = (a, c)
        out[0] = a;
        out[1] = c;
        // e2' = (b, d)
        out[2] = b;
        out[3] = d;
    }
}
