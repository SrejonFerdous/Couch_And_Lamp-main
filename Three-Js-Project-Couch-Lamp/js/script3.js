import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Assets
import blue from "../img/blackcouch.jpg";
import red from "../img/graycouch.jpg";
import brown from "../img/tealcouch.jpg";
import white from "../img/redcouch2.jpg";
import wall from "../img/wall10.jpg";
import floorr from "../img/wall9.jpg";
import L_head from "../img/lamp3.jpg";
import L_stand from "../img/base_m.jpg";
import messi from "../img/messi.jpg";
import srejon from "../img/srejon.jpeg";
import ceiling from "../img/ceiling2.jpg";

let click = 1;
const socket = { height: 8.5, speed: 0.01 };
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Scene / Camera / Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  85,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, socket.height, 33);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor("black");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Loader helpers
const texLoader = new THREE.TextureLoader();
function loadTex(url, repeat = [1, 1]) {
  const t = texLoader.load(url);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  return t;
}

// Track all custom materials so we can sync light position
const ALL_MATS = [];

// ======= Reusable custom shaders (non-animated) =======

// Generic textured Blinn-Phong (ambient + point light)
const lambertVert = `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWPos;
  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position,1.0);
    vWPos = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const lambertFrag = `
  uniform sampler2D uMap;
  uniform int uUseMap;
  uniform vec3 uColor;
  uniform vec3 uLightPos;
  uniform float uAmbient;
  uniform float uSpecular;
  uniform float uShininess;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWPos;

  void main(){
    vec3 base = uColor;
    if(uUseMap == 1){
      base *= texture2D(uMap, vUv).rgb;
    }
    vec3 N = normalize(vN);
    vec3 L = normalize(uLightPos - vWPos);
    float diff = max(dot(N, L), 0.0);

    vec3 V = normalize(cameraPosition - vWPos);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), uShininess) * uSpecular;

    vec3 col = base * (uAmbient + diff) + vec3(spec);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeLambert(mapTex, color = 0xffffff, opts = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: mapTex || null },
      uUseMap: { value: mapTex ? 1 : 0 },
      uColor: { value: new THREE.Color(color) },
      uLightPos: { value: new THREE.Vector3(15.5, 3, 2.7) },
      uAmbient: { value: opts.ambient ?? 0.35 },
      uSpecular: { value: opts.specular ?? 0.15 },
      uShininess: { value: opts.shininess ?? 24.0 },
    },
    vertexShader: lambertVert,
    fragmentShader: lambertFrag,
  });
  ALL_MATS.push(mat);
  return mat;
}

// Art (mostly unlit, slight ambient/diffuse)
const artVert = lambertVert;
const artFrag = `
  uniform sampler2D uMap;
  uniform vec3 uLightPos;
  uniform float uAmbient;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWPos;
  void main(){
    vec3 base = texture2D(uMap, vUv).rgb;
    vec3 N = normalize(vN);
    vec3 L = normalize(uLightPos - vWPos);
    float diff = max(dot(N, L), 0.0) * 0.2;
    vec3 col = base * (uAmbient + diff);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeArt(mapTex) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: mapTex },
      uLightPos: { value: new THREE.Vector3(15.5, 3, 2.7) },
      uAmbient: { value: 0.35 },
    },
    vertexShader: artVert,
    fragmentShader: artFrag,
  });
  ALL_MATS.push(mat);
  return mat;
}

// Glass (Fresnel-ish tint, transparent)
const glassVert = lambertVert;
const glassFrag = `
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWPos;
  void main(){
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float alpha = clamp(uOpacity + 0.25*fres, 0.0, 1.0);
    gl_FragColor = vec4(uTint, alpha);
  }
`;
function makeGlass(tint = 0xffffff, opacity = 0.06) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTint: { value: new THREE.Color(tint) },
      uOpacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    vertexShader: glassVert,
    fragmentShader: glassFrag,
  });
  ALL_MATS.push(mat);
  return mat;
}

// ======= Lights =======
const ambientLight = new THREE.AmbientLight(0xffffff, 0.0); // shaders handle ambient
scene.add(ambientLight);

const lampGroup = new THREE.Group();
scene.add(lampGroup);

const lampLight = new THREE.PointLight(0xffffff, 1.0, 1000);
lampLight.position.set(15.5, 3, 2.7);
lampLight.castShadow = true;
lampGroup.add(lampLight);

// ======= ROOM (back to regular materials as before) =======
const wallTex = loadTex(wall, [3, 1]);
const ceilTex = loadTex(ceiling, [2, 2]);

const roomGeo = new THREE.BoxGeometry(170, 40, 70);
const roomMats = [
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // +X
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // -X
  new THREE.MeshStandardMaterial({ map: ceilTex, side: THREE.BackSide }), // +Y (ceiling)
  new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
  }), // -Y (hidden; separate floor)
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // +Z
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // -Z
];
const room = new THREE.Mesh(roomGeo, roomMats);
room.position.y = 19;
room.receiveShadow = true;
scene.add(room);

// Floor (regular material)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 200),
  new THREE.MeshStandardMaterial({
    map: loadTex(floorr),
    side: THREE.DoubleSide,
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// ======= Lamp geometry (custom shaders) =======
const head = new THREE.Mesh(
  new THREE.CylinderGeometry(7.44, 4.5, 8.06, 32),
  makeLambert(loadTex(L_head))
);
head.position.set(22, 17.8, -12.5);
head.rotation.x = Math.PI;
head.castShadow = true;
lampGroup.add(head);

const stand = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 15.25),
  makeLambert(loadTex(L_stand, [1, 2]))
);
stand.position.set(22, 8.8, -12.5);
stand.rotation.x = Math.PI / 2;
stand.castShadow = true;
lampGroup.add(stand);

const base = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  makeLambert(loadTex(L_stand))
);
base.position.set(22, 0.8, -12.5);
base.rotation.x = -Math.PI / 2;
base.receiveShadow = true;
lampGroup.add(base);

// ======= Coffee zone =======
const coffeeZ = 8.5;
const stemHeight = 3.6;
const topThickness = 0.6;

// Rug: **normal custom shader** (non-animated)
const rug = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64),
  makeLambert(loadTex(floorr, [2.5, 2.5]))
);
rug.rotation.x = -Math.PI / 2;
rug.position.set(-4.5, 0.02, coffeeZ);
rug.receiveShadow = true;
rug.castShadow = false; // optional
scene.add(rug);

const tableStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.9, stemHeight, 24),
  makeLambert(loadTex(L_stand, [1, 2]), 0xffffff, {
    specular: 0.25,
    shininess: 48,
  })
);
tableStem.position.set(-4.5, stemHeight / 2, coffeeZ);
tableStem.castShadow = true;
scene.add(tableStem);

const tableTop = new THREE.Mesh(
  new THREE.CylinderGeometry(8, 8, topThickness, 48),
  makeLambert(loadTex(wall, [1.5, 1.5]), 0xffffff, {
    specular: 0.18,
    shininess: 32,
  })
);
tableTop.position.set(-4.5, stemHeight + topThickness / 2, coffeeZ);
tableTop.castShadow = true;
scene.add(tableTop);

// ======= Couch (custom shader, texture-cycling) =======
const couch = new THREE.Group();
scene.add(couch);

const couchMat = makeLambert(loadTex(blue));
function setCouchTexture(url) {
  couchMat.uniforms.uMap.value = loadTex(url);
  couchMat.uniforms.uUseMap.value = 1;
}

const body1 = new THREE.Mesh(new THREE.BoxGeometry(1, 10.38, 15), couchMat);
body1.position.set(-12, 9.55, -18.18);
body1.rotation.y = Math.PI / 2;
body1.castShadow = true;
couch.add(body1);

const body2 = new THREE.Mesh(new THREE.BoxGeometry(1, 10.38, 15), couchMat);
body2.position.set(3, 9.55, -18.18);
body2.rotation.y = Math.PI / 2;
body2.castShadow = true;
couch.add(body2);

const body3 = new THREE.Mesh(new THREE.BoxGeometry(12.18, 4.32, 15), couchMat);
body3.position.set(-12, 2.25, -12.5);
body3.rotation.y = Math.PI / 2;
body3.castShadow = true;
couch.add(body3);

const body4 = new THREE.Mesh(new THREE.BoxGeometry(12.18, 4.32, 15), couchMat);
body4.position.set(3, 2.25, -12.5);
body4.rotation.y = Math.PI / 2;
body4.castShadow = true;
couch.add(body4);

const body5 = new THREE.Mesh(new THREE.BoxGeometry(1, 7.38, 12.1), couchMat);
body5.position.set(11, 3.8, -12.5);
body5.castShadow = true;
couch.add(body5);

const body6 = new THREE.Mesh(new THREE.BoxGeometry(1, 7.38, 12.1), couchMat);
body6.position.set(-20, 3.8, -12.5);
body6.castShadow = true;
couch.add(body6);

// ======= Framed art (custom art + glass) =======
function addFramedArt(url, opts = {}) {
  const { centerX = -44.5, centerY = 18, wallZ = -35, maxHeight = 20 } = opts;

  const tex = loadTex(url);
  const group = new THREE.Group();

  // temp aspect; update on load
  let aspect = 1.0;

  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(maxHeight * aspect, maxHeight),
    makeArt(tex)
  );
  const frameDepth = 0.6,
    frameThick = 1.2;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      maxHeight * aspect + frameThick,
      maxHeight + frameThick,
      frameDepth
    ),
    makeLambert(loadTex(L_stand), 0xffffff, { specular: 0.2, shininess: 32 })
  );
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(maxHeight * aspect * 0.995, maxHeight * 0.995),
    makeGlass(0xffffff, 0.06)
  );

  art.position.set(centerX, centerY, wallZ + 0.7);
  frame.position.set(centerX, centerY, wallZ + 0.3);
  glass.position.set(centerX, centerY, wallZ + 0.71);

  frame.castShadow = true;

  group.add(frame, art, glass);
  scene.add(group);

  texLoader.load(url, (loaded) => {
    const img = loaded.image;
    const a = img.width / img.height;
    art.geometry.dispose();
    art.geometry = new THREE.PlaneGeometry(maxHeight * a, maxHeight);
    frame.geometry.dispose();
    frame.geometry = new THREE.BoxGeometry(
      maxHeight * a + frameThick,
      maxHeight + frameThick,
      frameDepth
    );
    glass.geometry.dispose();
    glass.geometry = new THREE.PlaneGeometry(
      maxHeight * a * 0.995,
      maxHeight * 0.995
    );
    art.position.set(centerX, centerY, wallZ + 0.7);
    frame.position.set(centerX, centerY, wallZ + 0.3);
    glass.position.set(centerX, centerY, wallZ + 0.71);
  });
}
addFramedArt(messi);
addFramedArt(srejon, { centerX: 54.5 });

// ======= Controls =======
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.update();

// ======= Interaction =======
function useClick() {
  click = (click % 4) + 1;
  if (click === 1) setCouchTexture(blue);
  if (click === 2) setCouchTexture(red);
  if (click === 3) setCouchTexture(brown);
  if (click === 4) setCouchTexture(white);
}
window.addEventListener("click", useClick);

const clock = new THREE.Clock();
function onDocumentKeyDown(event) {
  const keycode = event.keyCode;
  const keyangle = clock.getElapsedTime() * 0.1;
  switch (keycode) {
    case 37:
      camera.position.x +=
        Math.sin(camera.rotation.y - Math.PI / 2) * socket.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y - Math.PI / 2) * socket.speed;
      break;
    case 38:
      camera.position.x -= Math.sin(camera.rotation.y) * socket.speed;
      camera.position.z -= -Math.cos(camera.rotation.y) * socket.speed;
      break;
    case 39:
      camera.position.x +=
        Math.sin(camera.rotation.y + Math.PI / 2) * socket.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y + Math.PI / 2) * socket.speed;
      break;
    case 40:
      camera.position.x += Math.sin(camera.rotation.y) * socket.speed;
      camera.position.z += -Math.cos(camera.rotation.y) * socket.speed;
      break;
    case 81: // 'q'
      camera.rotation.y = 4 * Math.sin(keyangle);
      break;
  }
}
document.addEventListener("keydown", onDocumentKeyDown, false);

// keep custom shaders' light position in sync
function updateLightUniforms() {
  const lp = new THREE.Vector3();
  lampLight.getWorldPosition(lp);
  for (const m of ALL_MATS) {
    if (m.uniforms && m.uniforms.uLightPos) m.uniforms.uLightPos.value.copy(lp);
  }
}

// ======= Loop =======
function tick() {
  const t = clock.getElapsedTime();

  // animate lamp slightly (optional)
  lampLight.position.z = 2.7 + Math.sin(t * 0.25) / 4.0;
  lampLight.position.y = 3 + Math.sin(t * 0.75);

  updateLightUniforms();
  orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

// ======= Resize =======
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
