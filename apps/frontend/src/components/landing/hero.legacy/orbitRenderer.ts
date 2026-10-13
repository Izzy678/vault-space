type Knot = readonly [number, number];
type Pointer = { x: number; y: number; strength: number };
type Entrance = { strands: number; dots: number; comets: number };

const STRANDS = 240;
const SAMPLES = 400;
const DOTS = 8000;
const COMETS = 10;
const TAIL_SAMPLES = 19;
const RIPPLES = 8;
const COLLISION_SAMPLES = 512;
const PROFILE_STEPS = 2048;
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

// Comets follow exactly the same profile as the strands.
const profile = new Float32Array((PROFILE_STEPS + 1) * 3);
for (let index = 0; index <= PROFILE_STEPS; index++) {
  const progress = index / PROFILE_STEPS;
  profile[index * 3] = radius(progress);
  profile[index * 3 + 1] = elevation(progress);
  profile[index * 3 + 2] = winding(progress) * 3 * TAU;
}

function writeProfile(data: Float32Array, offset: number, progress: number) {
  const sample = Math.max(0, Math.min(1, progress)) * PROFILE_STEPS;
  const index = Math.min(Math.floor(sample), PROFILE_STEPS - 1);
  const blend = sample - index;
  for (let axis = 0; axis < 3; axis++) {
    const value = profile[index * 3 + axis];
    data[offset + axis] = value + (profile[(index + 1) * 3 + axis] - value) * blend;
  }
  data[offset + 3] = progress;
}

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
  writeProfile(data, offset, progress);
  data[offset + 4] = (strand / STRANDS) * TAU;
  data[offset + 5] = 0.095 + random(strand + 1) * 0.01;
  data[offset + 6] = random(strand + 401) * TAU;
  data[offset + 7] = random(strand + 809) * TAU;
}

const vertexShader = `
  precision highp float;
  attribute vec4 a_profile;
  attribute vec4 a_motion;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform lowp float u_dots;
  uniform vec3 u_pointer;
  uniform float u_pointerRadius;
  uniform vec3 u_entrance;
  uniform float u_pixelRatio;
  uniform vec4 u_ripples[8];
  varying float v_alpha;
  vec2 displace(vec2 point, vec2 center, float radius, float strength, float aspect) {
    vec2 offset = point - center;
    float distance = length(offset * vec2(aspect, 1.0));
    float falloff = exp(-distance * distance / (2.0 * radius * radius));
    return offset / max(length(offset), 0.0001) * falloff * strength;
  }
  void main() {
    float progress = a_profile.w;
    float angle = a_profile.z + a_motion.x + u_time * a_motion.y;
    float r = a_profile.x * (1.0 + 0.008 * sin(progress * 25.0 + a_motion.z + u_time * 0.3));
    vec3 position = vec3(cos(angle) * r, a_profile.y, sin(angle) * r);
    float flash = 0.0;
    // Collisions send a tiny expanding wave through nearby strands. There is
    // no persistent repulsion around a moving comet.
    if (u_dots < 1.5) {
      vec3 displacement = vec3(0.0);
      for (int i = 0; i < 8; i++) {
        float age = u_time - u_ripples[i].w;
        if (age >= 0.0 && age < 0.8) {
          vec3 offset = position - u_ripples[i].xyz;
          float distance = length(offset);
          if (distance > 0.001 && distance < 3.0) {
            float band = abs(distance - age * 5.0);
            if (band < 1.2) {
              float amplitude = 0.012 * cos(band / 1.2 * 1.5707963)
                * exp(-age / 0.8) / max(distance, 0.3);
              displacement += offset / distance * amplitude;
            }
            if (u_dots > 0.5) {
              float nearby = pow(max(0.0, 1.0 - distance / 2.0), 2.0);
              // A damped spring lets nearby specks briefly scatter and settle.
              displacement += offset / distance * nearby * 0.055
                * sin(age * 5.45) * exp(-age * 4.5);
              flash += nearby * exp(-age * 8.0);
            }
          }
        }
      }
      position += displacement;
    }

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

    if (depth > 0.0) {
      vec2 projected = gl_Position.xy / depth;
      vec2 displacement = displace(projected, u_pointer.xy, u_pointerRadius, u_pointer.z, aspect);
      gl_Position.xy = (projected + displacement) * depth;
    }
    float fade = pow(min(1.0, min(progress, 1.0 - progress) / 0.15), 2.0);
    float pulse = 0.9 + 0.1 * sin(u_time * 0.18 + a_motion.w);
    v_alpha = 0.15 * pulse * fade;
    if (u_dots > 0.5 && u_dots < 1.5) {
      float flicker = pow(max(0.0, sin(u_time * (0.15 + fract(a_motion.w) * 4.5) + a_motion.z)), 2.5);
      float brightness = 0.04 + 0.96 * pow(fract(sin(a_motion.z * 37.0) * 43758.5), 1.5);
      float light = brightness * 4.2 * (0.08 + 0.92 * flicker) * 1.25;
      float mapped = (light * (2.51 * light + 0.03)) / (light * (2.43 * light + 0.59) + 0.14);
      v_alpha = min(mapped + flash * 0.6, 1.0) * 0.9 * fade * u_entrance.y;
    }
    gl_PointSize = clamp(u_resolution.y * focal * 0.01 / max(depth, 0.1), 0.5, 4.0);
    if (u_dots > 1.5) {
      v_alpha = a_motion.w * u_entrance.z;
      gl_PointSize = clamp(u_resolution.y * focal * 0.04 / max(depth, 0.1),
        2.0 * u_pixelRatio, 8.0 * u_pixelRatio);
    }
    // The feathered front draws from the lower rim up through the throat.
    if (u_dots < 0.5) {
      v_alpha *= smoothstep(progress, progress + 0.15, u_entrance.x * 1.15);
    }
  }
`;
const fragmentShader = `
  precision mediump float;
  varying float v_alpha;
  uniform vec3 u_color;
  uniform lowp float u_dots;
  void main() {
    float alpha = v_alpha;
    if (u_dots > 0.5 && u_dots < 2.5) {
      float distance = length(gl_PointCoord - vec2(0.5)) * 2.0;
      if (distance > 1.0) discard;
      if (u_dots > 1.5) {
        float halo = exp(-distance * distance * 7.0) * 0.12;
        float core = 1.0 - smoothstep(0.05, 0.3, distance);
        alpha *= halo + core;
      } else {
        alpha *= 1.0 - smoothstep(0.25, 1.0, distance);
      }
    }
    gl_FragColor = vec4(u_color, alpha);
  }
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
  function upload(data: Float32Array, dynamic = false) {
    const buffer = gl!.createBuffer();
    if (!buffer) throw new Error("Unable to create orbit buffer");
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, dynamic ? gl!.DYNAMIC_DRAW : gl!.STATIC_DRAW);
    return buffer;
  }
  const compact = canvas.clientWidth < 640;
  const strandCount = compact ? 144 : STRANDS;
  const dotCount = compact ? 2800 : DOTS;
  const lineVertices = strandCount * (SAMPLES - 1) * 2;
  const lineData = new Float32Array(lineVertices * 8);
  let offset = 0;
  for (let strand = 0; strand < strandCount; strand++) {
    const phase = (strand / strandCount) * STRANDS;
    for (let sample = 0; sample < SAMPLES - 1; sample++) {
      writeVertex(lineData, offset, sample / (SAMPLES - 1), phase);
      writeVertex(lineData, offset + 8, (sample + 1) / (SAMPLES - 1), phase);
      offset += 16;
    }
  }
  const dotData = new Float32Array(dotCount * 8);
  for (let index = 0; index < dotCount; index++) {
    const strand = Math.floor(random(index + 1729) * STRANDS);
    const spread = random(index + 3911);
    const progress =
      random(index + 5179) < 0.5 ? 0.2 + spread * 0.4 : 0.05 + spread * 0.9;
    writeVertex(dotData, index * 8, progress, strand);
    dotData[index * 8 + 7] = random(index + 9013) * TAU;
  }
  const cometCount = compact ? 6 : COMETS;
  const cometData = new Float32Array(cometCount * 8);
  const tailVertices = cometCount * (TAIL_SAMPLES - 1) * 2;
  const tailData = new Float32Array(tailVertices * 8);
  const rippleData = new Float32Array(RIPPLES * 4);
  for (let index = 0; index < RIPPLES; index++) rippleData[index * 4 + 3] = -100;
  const comets = Array.from({ length: cometCount }, (_, index) => ({
    strand: Math.floor(random(index + 1103) * STRANDS),
    progress: 0.03,
    speed: 0.09 * (0.7 + random(index + 2501) * 0.6),
    waiting: 0.4 + (index / cometCount) * 8,
    flying: false,
    lastHit: -100,
    trips: 0,
  }));
  const lines = upload(lineData);
  // Fine dots stay attached to their strands; only the comet streaks race along them.
  const dots = upload(dotData);
  const heads = upload(cometData, true);
  const tails = upload(tailData, true);
  const profileLocation = gl.getAttribLocation(program, "a_profile");
  const motionLocation = gl.getAttribLocation(program, "a_motion");
  const clockLocation = gl.getUniformLocation(program, "u_time");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const modeLocation = gl.getUniformLocation(program, "u_dots");
  const pointerLocation = gl.getUniformLocation(program, "u_pointer");
  const radiusLocation = gl.getUniformLocation(program, "u_pointerRadius");
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const entranceLocation = gl.getUniformLocation(program, "u_entrance");
  const pixelRatioLocation = gl.getUniformLocation(program, "u_pixelRatio");
  const ripplesLocation = gl.getUniformLocation(program, "u_ripples[0]");

  // A sparse sample of real dots is sufficient to locate collisions. All dots
  // and strands respond on the GPU, without uploading their geometry each frame.
  const collisionCount = Math.min(COLLISION_SAMPLES, dotCount);
  const collisionPositions = new Float32Array(collisionCount * 3);
  const collisionCooldown = new Float32Array(collisionCount);
  const headPosition = new Float32Array(3);
  let rippleIndex = 0;
  let particleTime: number | null = null;

  function worldPosition(
    data: Float32Array, offset: number, time: number,
    target: Float32Array, targetOffset: number,
  ) {
    const angle = data[offset + 2] + data[offset + 4] + time * data[offset + 5];
    const r = data[offset] * (1 + 0.008 * Math.sin(
      data[offset + 3] * 25 + data[offset + 6] + time * 0.3,
    ));
    target[targetOffset] = Math.cos(angle) * r;
    target[targetOffset + 1] = data[offset + 1];
    target[targetOffset + 2] = Math.sin(angle) * r;
  }

  function updateParticles(time: number, entrance: Entrance) {
    const delta = particleTime === null ? 0 : Math.min(time - particleTime, 0.1);
    particleTime = time;
    for (let index = 0; index < collisionCount; index++) {
      const dot = Math.floor((index / collisionCount) * dotCount);
      worldPosition(dotData, dot * 8, time, collisionPositions, index * 3);
    }
    for (let index = 0; index < cometCount; index++) {
      const comet = comets[index];
      if (!comet.flying && entrance.comets > 0.3) {
        comet.waiting -= delta;
        if (comet.waiting <= 0) {
          comet.flying = true;
          comet.progress = 0.03;
          comet.lastHit = -100;
        }
      }
      if (comet.flying) {
        const boost = 1 + 0.36 * Math.max(0, 1 - (time - comet.lastHit) / 0.4);
        comet.progress += delta * comet.speed * boost;
        if (comet.progress > 0.95) {
          comet.flying = false;
          comet.trips++;
          const seed = index + comet.trips * 17;
          comet.waiting = 8 * (0.6 + random(seed + 7523) * 0.8);
          comet.strand = Math.floor(random(seed + 1103) * STRANDS);
          comet.speed = 0.09 * (0.7 + random(seed + 2501) * 0.6);
        }
      }
      const envelope = comet.flying
        ? Math.max(0, Math.min(1, (comet.progress - 0.03) / 0.1, (0.95 - comet.progress) / 0.1))
        : 0;
      const offset = index * 8;
      writeVertex(cometData, offset, comet.progress, comet.strand);
      cometData[offset + 7] = envelope * 0.7;
      worldPosition(cometData, offset, time, headPosition, 0);

      if (comet.flying && time - comet.lastHit > 0.25) {
        let nearest = -1;
        let nearestDistance = 0.8 * 0.8;
        for (let dot = 0; dot < collisionCount; dot++) {
          if (time < collisionCooldown[dot]) continue;
          const x = collisionPositions[dot * 3] - headPosition[0];
          const y = collisionPositions[dot * 3 + 1] - headPosition[1];
          const z = collisionPositions[dot * 3 + 2] - headPosition[2];
          const distance = x * x + y * y + z * z;
          if (distance < nearestDistance) {
            nearest = dot;
            nearestDistance = distance;
          }
        }
        if (nearest >= 0) {
          for (let axis = 0; axis < 3; axis++) {
            rippleData[rippleIndex * 4 + axis] = collisionPositions[nearest * 3 + axis];
          }
          rippleData[rippleIndex * 4 + 3] = time;
          rippleIndex = (rippleIndex + 1) % RIPPLES;
          collisionCooldown[nearest] = time + 8;
          comet.lastHit = time;
        }
      }
      for (let segment = 0; segment < TAIL_SAMPLES - 1; segment++) {
        for (let end = 0; end < 2; end++) {
          const sample = segment + end;
          const tailOffset = (index * (TAIL_SAMPLES - 1) * 2 + segment * 2 + end) * 8;
          const progress = Math.max(0.005, comet.progress - sample * 0.005);
          writeVertex(tailData, tailOffset, progress, comet.strand);
          tailData[tailOffset + 7] = envelope * 0.55 * (1 - sample / TAIL_SAMPLES) ** 2;
        }
      }
    }
    gl!.bindBuffer(gl!.ARRAY_BUFFER, heads);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, cometData);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, tails);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, tailData);
  }
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
    draw(time: number, pointer: Pointer, entrance: Entrance) {
      if (gl.isContextLost()) return;
      gl.clearColor(...background, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, lightBackground ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
      gl.uniform3f(colorLocation, ...foreground);
      updateParticles(time, entrance);
      gl.uniform1f(clockLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform3f(pointerLocation, pointer.x, pointer.y, pointer.strength);
      gl.uniform1f(radiusLocation, 120 / Math.max(canvas.clientHeight, 1));
      gl.uniform3f(entranceLocation, entrance.strands, entrance.dots, entrance.comets);
      gl.uniform1f(pixelRatioLocation, canvas.height / Math.max(canvas.clientHeight, 1));
      gl.uniform4fv(ripplesLocation, rippleData);
      gl.uniform1f(modeLocation, 0);
      bind(lines);
      gl.drawArrays(gl.LINES, 0, lineVertices);
      gl.uniform1f(modeLocation, 1);
      bind(dots);
      gl.drawArrays(gl.POINTS, 0, dotCount);
      gl.uniform1f(modeLocation, 3);
      bind(tails);
      gl.drawArrays(gl.LINES, 0, tailVertices);
      gl.uniform1f(modeLocation, 2);
      bind(heads);
      gl.drawArrays(gl.POINTS, 0, cometCount);
    },
    dispose() {
      gl.deleteBuffer(lines);
      gl.deleteBuffer(dots);
      gl.deleteBuffer(heads);
      gl.deleteBuffer(tails);
      gl.deleteProgram(program);
    },
  };
}
