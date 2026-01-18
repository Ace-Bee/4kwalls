
import * as THREE from 'three';





export const periodicNoiseGLSL =  `
  // Periodic noise function using sine and cosine waves
  float periodicNoise(vec3 p, float time) {
    // Create multiple frequency components for more complex movement
    // All time multipliers are integer values to ensure perfect 2π periodicity
    float noise = 0.0;
    
    // Primary wave - period = 2π
    noise += sin(p.x * 2.0 + time) * cos(p.z * 1.5 + time);
    
    // Secondary wave - period = π (time * 2)
    noise += sin(p.x * 3.2 + time * 2.0) * cos(p.z * 2.1 + time) * 0.6;
    
    // Tertiary wave - period = 2π/3 (time * 3)
    noise += sin(p.x * 1.7 + time) * cos(p.z * 2.8 + time * 3.0) * 0.4;
    
    // Cross-frequency interaction - period = π (time * 2)
    noise += sin(p.x * p.z * 0.5 + time * 2.0) * 0.3;
    
    return noise * 0.3; // Scale down the result
  }
`;






function getPlane(count: number, components: number, size: number = 512, scale: number = 1.0) {
    const length = count * components
    const data = new Float32Array(length)

    for (let i = 0; i < count; i++) {
        const i4 = i * components

        
        const x = (i % size) / (size - 1) 
        const z = Math.floor(i / size) / (size - 1) 

        
        data[i4 + 0] = (x - 0.5) * 2 * scale 
        data[i4 + 1] = 0 
        data[i4 + 2] = (z - 0.5) * 2 * scale 
        data[i4 + 3] = 1.0 
    }

    return data
}

export class SimulationMaterial extends THREE.ShaderMaterial {
    constructor(scale: number = 10.0) {
        const positionsTexture = new THREE.DataTexture(getPlane(512 * 512, 4, 512, scale), 512, 512, THREE.RGBAFormat, THREE.FloatType)
        positionsTexture.needsUpdate = true

        super({
            vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
            fragmentShader: `uniform sampler2D positions;
      uniform float uTime;
      uniform float uNoiseScale;
      uniform float uNoiseIntensity;
      uniform float uTimeScale;
      uniform float uLoopPeriod;
      varying vec2 vUv;

      ${periodicNoiseGLSL}

      void main() {
        // Get the original particle position
        vec3 originalPos = texture2D(positions, vUv).rgb;
        
        // Use continuous time that naturally loops through sine/cosine periodicity
        float continuousTime = uTime * uTimeScale * (6.28318530718 / uLoopPeriod);
        // float continuousTime = 0.0;
        
        // Scale position for noise input
        vec3 noiseInput = originalPos * uNoiseScale;
        
        // Generate periodic displacement for each axis using different phase offsets
        float displacementX = periodicNoise(noiseInput + vec3(0.0, 0.0, 0.0), continuousTime);
        float displacementY = periodicNoise(noiseInput + vec3(50.0, 0.0, 0.0), continuousTime + 2.094); // +120°
        float displacementZ = periodicNoise(noiseInput + vec3(0.0, 50.0, 0.0), continuousTime + 4.188); // +240°
        
        // Apply distortion to original position
        vec3 distortion = vec3(displacementX, displacementY, displacementZ) * uNoiseIntensity;
        vec3 finalPos = originalPos + distortion;
        
        gl_FragColor = vec4(finalPos, 1.0);
      }`,
            uniforms: {
                positions: { value: positionsTexture },
                uTime: { value: 0 },
                uNoiseScale: { value: 1.0 },
                uNoiseIntensity: { value: 0.5 },
                uTimeScale: { value: 1 },
                uLoopPeriod: { value: 24.0 }
            }
        })
    }
}





export class DofPointsMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            vertexShader:  `
      uniform sampler2D positions;
      uniform sampler2D initialPositions;
      uniform float uTime;
      uniform float uFocus;
      uniform float uFov;
      uniform float uBlur;
      uniform float uPointSize;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec3 initialPos = texture2D(initialPositions, position.xy).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = abs(uFocus - -mvPosition.z);
        vPosY = pos.y;
        vWorldPosition = pos;
        vInitialPosition = initialPos;
        gl_PointSize = max(vDistance * uBlur * uPointSize, 3.0);
      }`,
            fragmentShader:  `
      uniform float uOpacity;
      uniform float uRevealFactor;
      uniform float uRevealProgress;
      uniform float uTime;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      uniform float uTransition;

      ${periodicNoiseGLSL}

      // Sparkle noise function for subtle brightness variations
      float sparkleNoise(vec3 seed, float time) {
        // Use initial position as seed for consistent per-particle variation
        float hash = sin(seed.x * 127.1 + seed.y * 311.7 + seed.z * 74.7) * 43758.5453;
        hash = fract(hash);
        
        // Slow time variation (time / 10) for gentle sparkle effect
        float slowTime = time * 1.0;
        
        // Create sparkle pattern using multiple sine waves with the hash as phase offset
        float sparkle = 0.0;
        sparkle += sin(slowTime + hash * 6.28318) * 0.5;
        sparkle += sin(slowTime * 1.7 + hash * 12.56636) * 0.3;
        sparkle += sin(slowTime * 0.8 + hash * 18.84954) * 0.2;
        
        // Create a different noise pattern to reduce sparkle frequency
        // Using different hash for uncorrelated pattern
        float hash2 = sin(seed.x * 113.5 + seed.y * 271.9 + seed.z * 97.3) * 37849.3241;
        hash2 = fract(hash2);
        
        // Static spatial mask to create sparse sparkles (no time dependency)
        float sparkleMask = sin(hash2 * 6.28318) * 0.7;
        sparkleMask += sin(hash2 * 12.56636) * 0.3;
        
        // Only allow sparkles when mask is positive (reduces frequency by ~70%)
        if (sparkleMask < 0.3) {
          sparkle *= 0.05; // Heavily dampen sparkle when mask is low
        }
        
        // Map sparkle to brightness with smooth exponential emphasis on high peaks only
        float normalizedSparkle = (sparkle + 1.0) * 0.5; // Convert [-1,1] to [0,1]
        
        // Create smooth curve: linear for low values, exponential for high values
        // Using pow(x, n) where n > 1 creates a curve that's nearly linear at low end, exponential at high end
        float smoothCurve = pow(normalizedSparkle, 4.0); // High exponent = dramatic high-end emphasis
        
        // Blend between linear (for low values) and exponential (for high values)
        float blendFactor = normalizedSparkle * normalizedSparkle; // Smooth transition weight
        float finalBrightness = mix(normalizedSparkle, smoothCurve, blendFactor);
        
        // Map to brightness range [0.7, 2.0] - conservative range with exponential peaks
        return 0.7 + finalBrightness * 1.3;
      }

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }

      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;

        // Define triangle vertices (equilateral triangle)
        vec2 p0 = vec2(0.0, -0.8);     // top tip (flipped Y)
        vec2 p1 = vec2(-0.7, 0.4);     // bottom left (flipped Y)
        vec2 p2 = vec2(0.7, 0.4);      // bottom right (flipped Y)
        
        float sdf = sdCircle(cxy, 0.5);
        
        if (sdf > 0.0) discard;

        // Calculate distance from center for reveal effect
        float distanceFromCenter = length(vWorldPosition.xz);
        
        // Add noise to the reveal threshold for organic edge
        float noiseValue = periodicNoise(vInitialPosition * 4.0, 0.0);
        float revealThreshold = uRevealFactor + noiseValue * 0.3;
        
        // Create reveal mask based on distance from center (inverted for proper reveal)
        float revealMask = 1.0 - smoothstep(revealThreshold - 0.2, revealThreshold + 0.1, distanceFromCenter);
        
        // Calculate sparkle brightness multiplier
        float sparkleBrightness = sparkleNoise(vInitialPosition, uTime);
        
        float alpha = (1.04 - clamp(vDistance, 0.0, 1.0)) * clamp(smoothstep(-0.5, 0.25, vPosY), 0.0, 1.0) * uOpacity * revealMask * uRevealProgress * sparkleBrightness;

        gl_FragColor = vec4(vec3(1.0), mix(alpha, sparkleBrightness - 1.1, uTransition));
      }`,
            uniforms: {
                positions: { value: null },
                initialPositions: { value: null },
                uTime: { value: 0 },
                uFocus: { value: 5.1 },
                uFov: { value: 50 },
                uBlur: { value: 30 },
                uTransition: { value: 0.0 },
                uPointSize: { value: 2.0 },
                uOpacity: { value: 1.0 },
                uRevealFactor: { value: 0.0 },
                uRevealProgress: { value: 0.0 }
            },
            transparent: true,
            
            depthWrite: false
        })
    }
}





export const VignetteShader = {
    uniforms: {
        tDiffuse: { value: null }, 
        darkness: { value: 1.0 }, 
        offset: { value: 1.0 }, 
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // Calculate distance from center
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = dot(uv, uv);
      
      // Create vignette effect
      float vignette = 1.0 - smoothstep(offset, offset + darkness, dist);
      
      gl_FragColor = vec4(texel.rgb * vignette, texel.a);
    }
  `
};
