export const vertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragment = /* glsl */ `
uniform vec3 colorA;
uniform vec3 colorB;
uniform float wallOpacity;
uniform float stripeCount;
uniform float time;
uniform float speed;
varying vec2 vUv;

void main() {
  // Invert UV.y so stripes animate from bottom to top
  float t = (1.0 - vUv.y) * stripeCount + time * speed;
  float band = fract(t);
  
  // Feather both ends using smoothstep
  float feather = 0.35;
  float edge = smoothstep(0.0, feather, band) * (1.0 - smoothstep(1.0 - feather, 1.0, band));
  vec3 color = mix(colorA, colorB, edge);
  gl_FragColor = vec4(color, wallOpacity);
}
`;
