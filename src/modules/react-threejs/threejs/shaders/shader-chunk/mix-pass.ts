export const vertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const fragment = /* glsl */ `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;

void main() {
  // Combine base texture and bloom texture
  vec4 base_color = texture2D(baseTexture, vUv);
  vec4 bloom_color = texture2D(bloomTexture, vUv);
  vec3 blendedColor = base_color.rgb + bloom_color.rgb;
  gl_FragColor = vec4(blendedColor, 1.0);
}
`;
