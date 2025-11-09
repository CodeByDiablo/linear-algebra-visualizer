// src/linAlg3d.cpp
// 3×3 matrix × 3D vector transformation for WebAssembly (Emscripten)

extern "C" {

    // Multiply 3×3 matrix by 3D vector.
    // Matrix:
    // | a  b  c |
    // | d  e  f |
    // | g  h  i |
    // Vector (x, y, z)
    // Output: out[0] = x', out[1] = y', out[2] = z'
    void multiply3x3(double a, double b, double c,
                     double d, double e, double f,
                     double g, double h, double i,
                     double x, double y, double z,
                     double* out) {
        out[0] = a*x + b*y + c*z;
        out[1] = d*x + e*y + f*z;
        out[2] = g*x + h*y + i*z;
    }
}
