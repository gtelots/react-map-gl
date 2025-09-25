export type ShaderLocations = {
  position?: number;
  texcoord?: number;
  resolution?: WebGLUniformLocation | null;
  image?: WebGLUniformLocation | null;
};

export type ShaderBuffers = {
  position?: WebGLBuffer | null;
  texcoord?: WebGLBuffer | null;
};

export class WebGLShaderManager {
  private program: WebGLProgram | null = null;
  private gl: WebGLRenderingContext;
  private locations: ShaderLocations = {};
  private buffers: ShaderBuffers = {};
  private texture: WebGLTexture | null = null;

  private get vertexShaderSource(): string {
    return `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_texCoord = a_texCoord;
      }
    `;
  }

  private get fragmentShaderSource(): string {
    return `
      #ifdef GL_ES
      precision mediump float;
      #endif
      
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `;
  }

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    // Create shaders
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    // Create program
    this.program = this.createProgram(vertexShader, fragmentShader);
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    // Get attribute and uniform locations
    this.locations.position = this.gl.getAttribLocation(this.program, 'a_position');
    this.locations.texcoord = this.gl.getAttribLocation(this.program, 'a_texCoord');
    this.locations.resolution = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.locations.image = this.gl.getUniformLocation(this.program, 'u_image');

    // Create buffers
    this.buffers.position = this.gl.createBuffer();
    this.buffers.texcoord = this.gl.createBuffer();

    // Create texture
    this.texture = this.gl.createTexture();

    // Clean up shaders (they're now part of the program)
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      console.error(`Shader compilation error: ${error}`);
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null {
    const program = this.gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return null;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      console.error(`Program linking error: ${error}`);
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  private setRectangle(x: number, y: number, width: number, height: number): void {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      this.gl.STATIC_DRAW,
    );
  }

  render(bloomContainer: HTMLCanvasElement, containerWidth: number, containerHeight: number): void {
    if (!this.program || !this.texture) {
      console.warn('WebGL shader not properly initialized');
      return;
    }

    // Use shader program
    this.gl.useProgram(this.program);

    // Setup position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position!);
    this.setRectangle(0, 0, containerWidth, containerHeight);

    // Setup texture coordinates (static)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texcoord!);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
      this.gl.STATIC_DRAW,
    );

    // Setup texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      bloomContainer,
    );

    // Setup vertex attributes
    this.gl.enableVertexAttribArray(this.locations.position!);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position!);
    this.gl.vertexAttribPointer(this.locations.position!, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.locations.texcoord!);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texcoord!);
    this.gl.vertexAttribPointer(this.locations.texcoord!, 2, this.gl.FLOAT, false, 0, 0);

    // Set uniforms
    this.gl.uniform2f(this.locations.resolution!, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform1i(this.locations.image!, 0); // Use texture unit 0

    // Setup blending
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Clean up
    this.gl.disableVertexAttribArray(this.locations.position!);
    this.gl.disableVertexAttribArray(this.locations.texcoord!);
    this.gl.disable(this.gl.BLEND);
  }

  dispose(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }

    if (this.buffers.position) {
      this.gl.deleteBuffer(this.buffers.position);
      this.buffers.position = null;
    }

    if (this.buffers.texcoord) {
      this.gl.deleteBuffer(this.buffers.texcoord);
      this.buffers.texcoord = null;
    }

    if (this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }
  }
}
