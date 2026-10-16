/* GLSL for the hero portrait: depth-parallax "head turn" + halftone lens reveal. */

export const portraitVertex = /* glsl */ `
  uniform sampler2D uData;
  uniform vec4 uCrop;      // x0, y0, w, h of the subject inside the image (UV)
  uniform float uRelief;   // how far the face pushes forward
  varying vec2 vUv;        // UV inside the cropped subject
  void main(){
    vUv = uv;
    vec2 iuv = uCrop.xy + uv * uCrop.zw;
    float d = texture2D(uData, iuv).g;
    vec3 p = position + vec3(0., 0., d * uRelief);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }`;

export const portraitFragment = /* glsl */ `
  uniform sampler2D uColor;
  uniform sampler2D uData;
  uniform vec4 uCrop;
  uniform vec2 uLook;      // -1..1, where the head should look
  uniform float uParallax;
  uniform vec2 uLens;      // lens centre in px (drawing-buffer space, origin bottom-left)
  uniform float uLensR;    // lens radius in px (0 = hidden)
  uniform float uDot;      // halftone cell size in px
  uniform float uIntro;
  uniform vec3 uDark; uniform vec3 uAccent;
  varying vec2 vUv;

  vec2 toImage(vec2 uv){ return uCrop.xy + uv * uCrop.zw; }

  void main(){
    // Parallax: nearer (deeper) pixels shift further towards the cursor -> head turns.
    vec2 off = uLook * uParallax;
    float d = texture2D(uData, toImage(vUv)).g;
    for (int i = 0; i < 4; i++) d = texture2D(uData, toImage(vUv - off * d)).g;
    vec2 uv = toImage(vUv - off * d);

    float m = texture2D(uData, uv).r;
    vec3 col = texture2D(uColor, uv).rgb;

    // gentle light from the side the head turns to
    col *= 1. + (d - .45) * dot(uLook, vec2(.35, .2));

    // Lens: halftone "alter ego" inside a circle around the cursor
    vec2 frag = gl_FragCoord.xy;
    float lensD = length(frag - uLens);
    float inLens = 1. - smoothstep(uLensR - 1.5, uLensR + 1.5, lensD);
    if (uLensR > 0.5) {
      float l = dot(col, vec3(.299, .587, .114));
      vec2 cell = mod(frag, uDot) - uDot * .5;
      float r = (1. - l) * uDot * .72;
      float dotMask = 1. - smoothstep(r - .8, r + .8, length(cell));
      vec3 alter = mix(uAccent, uDark, dotMask);
      col = mix(col, alter, inLens);
      // thin ring
      float ring = smoothstep(2.5, 0., abs(lensD - uLensR));
      col = mix(col, uDark, ring * .9);
      m = max(m, ring * step(.02, m));
    }

    // intro: wipe up from the bottom
    float reveal = smoothstep(vUv.y - .08, vUv.y, uIntro * 1.1);
    float a = m * reveal;
    if (a < .01) discard;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }`;
