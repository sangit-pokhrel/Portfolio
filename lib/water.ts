/* GLSL for the hero "water / glass" effect.
 *  - sim: a classic 2D wave equation on a small height-field (ping-pong render targets)
 *  - final: the hero name, refracted by the ripples, with glassy highlights,
 *    a slight colour split, an idle wave and a shimmer sweeping across the letters
 */

export const fullscreenVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

export const simFragment = /* glsl */ `
  uniform sampler2D uPrev;   // r = height now, g = height last frame
  uniform vec2 uTexel;
  uniform vec3 uDrop;        // xy = position (uv), z = strength
  uniform float uRadius;
  uniform float uAspect;
  varying vec2 vUv;
  void main(){
    vec4 c = texture2D(uPrev, vUv);
    float sum = texture2D(uPrev, vUv + vec2(uTexel.x, 0.)).r
              + texture2D(uPrev, vUv - vec2(uTexel.x, 0.)).r
              + texture2D(uPrev, vUv + vec2(0., uTexel.y)).r
              + texture2D(uPrev, vUv - vec2(0., uTexel.y)).r;
    float h = sum * .5 - c.g;
    h *= .982;                                   // damping: waves fade out
    vec2 d = (vUv - uDrop.xy) * vec2(uAspect, 1.);
    h += uDrop.z * smoothstep(uRadius, 0., length(d));
    gl_FragColor = vec4(h, c.r, 0., 1.);
  }`;

export const waterFragment = /* glsl */ `
  uniform sampler2D uText;   // hero name drawn at rest position (canvas, top-left origin)
  uniform sampler2D uSim;
  uniform vec2 uRes;         // drawing-buffer size in px
  uniform vec2 uSimTexel;
  uniform vec4 uLine1;       // line rects in px (x, y, w, h), top-left origin
  uniform vec4 uLine2;
  uniform float uOff1;       // per-line intro offsets (px, +down)
  uniform float uOff2;
  uniform float uScroll;     // whole-name scroll offset (px, +down)
  uniform float uFade;
  uniform float uTime;
  uniform float uDpr;
  uniform vec3 uTint;        // shadow tint of the "glass"
  varying vec2 vUv;

  vec4 textAt(vec2 q){
    q.y -= uScroll;
    vec4 r = vec4(0.);
    vec2 a = q - vec2(0., uOff1);
    if (q.x > uLine1.x && q.x < uLine1.x + uLine1.z && q.y > uLine1.y && q.y < uLine1.y + uLine1.w)
      r = texture2D(uText, vec2(a.x / uRes.x, 1. - a.y / uRes.y));
    vec2 b = q - vec2(0., uOff2);
    if (q.x > uLine2.x && q.x < uLine2.x + uLine2.z && q.y > uLine2.y && q.y < uLine2.y + uLine2.w)
      r = max(r, texture2D(uText, vec2(b.x / uRes.x, 1. - b.y / uRes.y)));
    return r;
  }

  void main(){
    vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);   // px, top-left origin

    // ripple surface normal
    float hx = texture2D(uSim, vUv + vec2(uSimTexel.x, 0.)).r - texture2D(uSim, vUv - vec2(uSimTexel.x, 0.)).r;
    float hy = texture2D(uSim, vUv + vec2(0., uSimTexel.y)).r - texture2D(uSim, vUv - vec2(0., uSimTexel.y)).r;
    vec2 n = vec2(hx, -hy);

    // idle life in the letters: a slow wave
    q.x += sin(q.y * .012 / uDpr + uTime * 1.1) * 3. * uDpr;
    q.y += sin(q.x * .006 / uDpr + uTime * .8) * 2. * uDpr;

    // refraction + slight colour split, like looking through gel / water
    vec2 refr = n * 90. * uDpr;
    vec4 tc = textAt(q + refr);
    float rC = textAt(q + refr * 1.25).r;
    float bC = textAt(q + refr * .75).b;
    vec3 col = vec3(rC, tc.g, bC);
    float a = tc.a;

    // shimmer sweeping across the letters
    float band = 1. - abs(fract((q.x + q.y * .6) / (1600. * uDpr) - uTime * .07) * 2. - 1.);
    col = mix(col, vec3(1.), smoothstep(.82, 1., band) * .65 * a);

    // the glassy surface itself: highlights and soft tinted shadows on the ripples
    float slope = clamp(length(n) * 3., 0., 1.);
    float light = clamp(dot(n, normalize(vec2(-.6, .8))) * 9., -1., 1.);
    vec3 glass = light > 0. ? vec3(1.) : uTint;
    float ga = slope * abs(light) * (light > 0. ? .38 : .16);
    col = mix(col, glass, ga * (1. - a * .5));
    a = max(a, ga);

    a *= uFade;
    if (a < .003) discard;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }`;
