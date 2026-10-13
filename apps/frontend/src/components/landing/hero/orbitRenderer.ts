type Knot = readonly [number, number];
type Pointer = { x: number; y: number; strength: number };

const STRANDS = 240;
const SAMPLES = 400;
const DOTS = 8000;
const TAU = Math.PI * 2;

// Monotone cubic interpolation keeps the flared profile free of overshoot.
function curve(knots: readonly Knot[]) {
  const slopes = knots
    .slice(1)
    .map(
      (knot, index) =>
        (knot[1] - knots[index][1]) / (knot[0] - knots[index][0]),
    );
  const tangents = knots.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === knots.length - 1) return slopes[index - 1];
    const before = slopes[index - 1];
    const after = slopes[index];
    return before * after <= 0 ? 0 : (before + after) / 2;
  });
  slopes.forEach((slope, index) => {
    if (!slope) {
      tangents[index] = tangents[index + 1] = 0;
      return;
    }
    const magnitude = Math.hypot(
      tangents[index] / slope,
      tangents[index + 1] / slope,
    );
    if (magnitude > 3) {
      tangents[index] *= 3 / magnitude;
      tangents[index + 1] *= 3 / magnitude;
    }
  });
  return (progress: number) => {
    let index = 0;
    while (index < knots.length - 2 && progress > knots[index + 1][0]) index++;
    const [start, value] = knots[index];
    const [end, next] = knots[index + 1];
    const span = end - start;
    const t = Math.max(0, Math.min(1, (progress - start) / span));
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * value +
      (t3 - 2 * t2 + t) * span * tangents[index] +
      (-2 * t3 + 3 * t2) * next +
      (t3 - t2) * span * tangents[index + 1]
    );
  };
}

const radius = curve([
  [0, 1150 / 60],
  [0.12, 12.784],
  [0.25, 5.75],
  [0.38, 1.533],
  [0.5, 53 / 60],
  [0.65, 1.267],
  [0.8, 2.787],
  [1, 380 / 60],
]);
const elevation = curve([
  [0, 0],
  [0.1, 0.2],
  [0.2, 0.8],
  [0.35, 2],
  [0.5, 3.8],
  [0.75, 7],
  [1, 10],
]);
const winding = curve([
  [0, 0],
  [0.15, 0.15],
  [0.25, 0.25],
  [0.45, 0.55],
  [0.6, 0.7],
  [0.8, 0.88],
  [1, 1],
]);

function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function writeVertex(
  data: Float32Array,
  offset: number,
  progress: number,
  strand: number,
) {
  data.set(
    [
      radius(progress),
      elevation(progress),
      winding(progress) * 3 * TAU,
      progress,
      (strand / STRANDS) * TAU,
      0.095 + random(strand + 1) * 0.01,
      random(strand + 401) * TAU,
      random(strand + 809) * TAU,
    ],
    offset,
  );
}

const vertexShader = `
  precision highp float;
  attribute vec4 a_profile;
  attribute vec4 a_motion;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_dots;
  uniform vec3 u_pointer;
  uniform float u_pointerRadius;
  varying float v_alpha;
  void main() {
    float progress = a_profile.w;
    float angle = a_profile.z + a_motion.x + u_time * a_motion.y;
    float r = a_profile.x * (1.0 + 0.008 * sin(progress * 25.0 + a_motion.z + u_time * 0.3));
    vec3 position = vec3(cos(angle) * r, a_profile.y, sin(angle) * r);

    // A lowered, off-axis camera creates the asymmetric upper opening.
    vec3 back = normalize(vec3(3.4, -0.6, 10.0));
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), back));
    vec3 up = cross(back, right);
    float cameraDistance = 5.0 / tan(radians(33.5));
    vec3 camera = vec3(0.0, 5.0, 0.0) + back * cameraDistance;
    vec3 relative = position - camera;
    float depth = -dot(relative, back);
    float focal = 1.0 / tan(radians(29.5));
    float aspect = u_resolution.x / u_resolution.y;
    gl_Position = vec4(dot(relative, right) * focal / aspect,
      dot(relative, up) * focal, 1.0004 * depth - 0.20004, depth);

    if (depth > 0.0 && u_pointer.z > 0.0) {
      vec2 projected = gl_Position.xy / depth;
      vec2 offset = (projected - u_pointer.xy) * vec2(aspect, 1.0);
      float distance = length(offset);
      if (distance > 0.0001 && distance < u_pointerRadius) {
        float falloff = pow(1.0 - distance / u_pointerRadius, 2.0);
        projected += offset / distance / vec2(aspect, 1.0) * falloff * u_pointer.z;
        gl_Position.xy = projected * depth;
      }
    }
    float fade = pow(min(1.0, min(progress, 1.0 - progress) / 0.15), 2.0);
    float pulse = 0.9 + 0.1 * sin(u_time * 0.18 + a_motion.w);
    v_alpha = 0.15 * pulse * fade;
    if (u_dots > 0.5) {
      float flicker = pow(max(0.0, sin(u_time * (0.15 + fract(a_motion.w) * 4.5) + a_motion.z)), 2.5);
      float brightness = 0.04 + 0.96 * pow(fract(sin(a_motion.z * 37.0) * 43758.5), 1.5);
      float light = brightness * 4.2 * (0.08 + 0.92 * flicker) * 1.25;
      float mapped = (light * (2.51 * light + 0.03)) / (light * (2.43 * light + 0.59) + 0.14);
      v_alpha = min(mapped, 1.0) * 0.9;
    }
    gl_PointSize = clamp(u_resolution.y * focal * 0.01 / max(depth, 0.1), 0.5, 4.0);
  }
`;
const fragmentShader = `
  precision mediump float;
  varying float v_alpha;
  uniform vec3 u_color;
  void main() { gl_FragColor = vec4(u_color, v_alpha); }
`;

export function createOrbitRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    antialias: true,
    alpha: false,
    depth: false,
  });
  if (!gl) return null;

  const palette = getComputedStyle(canvas);
  const rgb = (hex: string) => {
    const value = Number.parseInt(hex.trim().replace("#", ""), 16);
    return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255] as const;
  };
  const background = rgb(palette.getPropertyValue("--site-bg"));
  const foreground = rgb(palette.getPropertyValue("--site-orbit-color"));
  const lightBackground = background[0] + background[1] + background[2] > 1.5;

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) throw new Error("Unable to create orbit shader");
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      const message = gl!.getShaderInfoLog(shader);
      gl!.deleteShader(shader);
      throw new Error(message || "Unable to compile orbit shader");
    }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create orbit program");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Unable to link orbit program");
  }
  function upload(data: Float32Array) {
    const buffer = gl!.createBuffer();
    if (!buffer) throw new Error("Unable to create orbit buffer");
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
    return buffer;
  }
  const lineVertices = STRANDS * (SAMPLES - 1) * 2;
  const lineData = new Float32Array(lineVertices * 8);
  let offset = 0;
  for (let strand = 0; strand < STRANDS; strand++) {
    for (let sample = 0; sample < SAMPLES - 1; sample++) {
      writeVertex(lineData, offset, sample / (SAMPLES - 1), strand);
      writeVertex(lineData, offset + 8, (sample + 1) / (SAMPLES - 1), strand);
      offset += 16;
    }
  }
  const dotData = new Float32Array(DOTS * 8);
  for (let index = 0; index < DOTS; index++) {
    const strand = Math.floor(random(index + 1729) * STRANDS);
    const spread = random(index + 3911);
    const progress =
      random(index + 5179) < 0.5 ? 0.2 + spread * 0.4 : 0.05 + spread * 0.9;
    writeVertex(dotData, index * 8, progress, strand);
    dotData[index * 8 + 6] = random(index + 9013) * TAU;
  }
  const lines = upload(lineData);
  const dots = upload(dotData);
  const profileLocation = gl.getAttribLocation(program, "a_profile");
  const motionLocation = gl.getAttribLocation(program, "a_motion");
  const clockLocation = gl.getUniformLocation(program, "u_time");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const modeLocation = gl.getUniformLocation(program, "u_dots");
  const pointerLocation = gl.getUniformLocation(program, "u_pointer");
  const radiusLocation = gl.getUniformLocation(program, "u_pointerRadius");
  const colorLocation = gl.getUniformLocation(program, "u_color");
  function bind(buffer: WebGLBuffer) {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.enableVertexAttribArray(profileLocation);
    gl!.vertexAttribPointer(profileLocation, 4, gl!.FLOAT, false, 32, 0);
    gl!.enableVertexAttribArray(motionLocation);
    gl!.vertexAttribPointer(motionLocation, 4, gl!.FLOAT, false, 32, 16);
  }
  return {
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(time: number, pointer: Pointer) {
      if (gl.isContextLost()) return;
      gl.clearColor(...background, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, lightBackground ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
      gl.uniform3f(colorLocation, ...foreground);
      gl.uniform1f(clockLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform3f(pointerLocation, pointer.x, pointer.y, pointer.strength);
      gl.uniform1f(radiusLocation, 120 / Math.max(canvas.clientHeight, 1));
      gl.uniform1f(modeLocation, 0);
      bind(lines);
      gl.drawArrays(gl.LINES, 0, lineVertices);
      gl.uniform1f(modeLocation, 1);
      bind(dots);
      gl.drawArrays(gl.POINTS, 0, DOTS);
    },
    dispose() {
      gl.deleteBuffer(lines);
      gl.deleteBuffer(dots);
      gl.deleteProgram(program);
    },
  };
}
