import * as THREE from "three";

//import orbitcontrol for mouse-controlled camera movements
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
// import GUI from "lil-gui";

// Four texture images (blue, red, brown, white) are imported, which will be applied to the couch. //
import blue from "../img/blackcouch.jpg";
import red from "../img/graycouch.jpg";
import brown from "../img/tealcouch.jpg";
import white from "../img/redcouch2.jpg";
import wall from "../img/wall10.jpg";
import floorr from "../img/wall9.jpg";
import mat from "../img/rug.jpg";
import glass from "../img/table.jpg";
import L_head from "../img/lamp3.jpg";
import L_stand from "../img/base_m.jpg";
import messi from "../img/messi.jpg";
import srejon from "../img/srejon.jpeg";
import ceiling from "../img/ceiling2.jpg"; // add this
// import sadMp3 from "../music/ambiance.mp3";

// click = 1;: This Global variable is used to track how many times the user has clicked. It controls which texture is applied to the couch. //
var click = 1;

// This constructor set the camera height and movement speed //
var socket = {
  height: 8.5,
  speed: 0.01,
};

// Getting our window size //
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// A scene is created to hold all 3D objects
const scene = new THREE.Scene();

/**
 A camera is set up with a perspective view, meaning objects appear smaller as they get further away, like in real life. The camera is positioned to view the scene from a certain height and distance.
*/
const camera = new THREE.PerspectiveCamera(
  85,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, socket.height, 33);

// Texture looder //
const textureLoader = new THREE.TextureLoader();

// -------------------- Custom Shader (for couch + lamp) --------------------
const VERT = `
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  // assuming no non-uniform scale:
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const FRAG = `
precision mediump float;
uniform sampler2D uMap;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
uniform float uEmissiveStrength;
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vec4 tex = texture2D(uMap, vUv);

  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(uLightPos - vWorldPos);
  float ndotl = max(dot(N, L), 0.0);

  float dist = length(uLightPos - vWorldPos);
  float attenuation = 1.0 / (1.0 + 0.09*dist + 0.032*dist*dist);

  vec3 ambient = uAmbientColor * uAmbientIntensity;
  vec3 diffuse = uLightColor * (uLightIntensity * ndotl * attenuation);
  vec3 emissive = tex.rgb * uEmissiveStrength;

  vec3 color = tex.rgb * (ambient + diffuse) + emissive;
  gl_FragColor = vec4(color, tex.a);
}
`;

// keep a list so we can update light uniforms each frame
const shaderMats = [];

function tuneTexture(t) {
  if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace;
  else t.encoding = THREE.sRGBEncoding;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}
// function tuneTexture(t, { color = true } = {}) {
//   if ("colorSpace" in t) {
//     t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
//   } else {
//     t.encoding = color ? THREE.sRGBEncoding : THREE.LinearEncoding;
//   }
//   t.minFilter = THREE.LinearMipmapLinearFilter;
//   t.magFilter = THREE.LinearFilter;
//   return t;
// }

function makeShaderMat(tex, emissiveStrength = 1.0) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uMap: { value: tex },
      uLightPos: { value: new THREE.Vector3(0, 0, 0) },
      uLightColor: { value: new THREE.Color(1, 1, 1) },
      uLightIntensity: { value: 1.0 },
      uAmbientColor: { value: new THREE.Color(0.73, 0.84, 1.0) },
      uAmbientIntensity: { value: 0.4 },
      uEmissiveStrength: { value: emissiveStrength },
    },
  });
  shaderMats.push(mat);
  return mat;
}
// -------------------------------------------------------------------------

/**
  The couch is created as a group of 3D objects using THREE.Mesh, each representing parts of the couch (like the seat, back, arms). The textureLoader is used to apply the blue couch texture initially.
 */
// Couch container
const couch = new THREE.Group();
scene.add(couch);

// ---------- Preload couch textures (for efficient switching) ----------
const couchTex = {
  1: tuneTexture(textureLoader.load(blue)),
  2: tuneTexture(textureLoader.load(red)),
  3: tuneTexture(textureLoader.load(brown)),
  4: tuneTexture(textureLoader.load(white)),
};
// ---------------------------------------------------------------------

//Body//
//Body1//
var body1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10.38, 15),
  makeShaderMat(couchTex[1])
);
body1.position.x = -12;
body1.position.y = 9.55;
body1.position.z = -18.18;
body1.rotation.y = Math.PI / 2;
couch.add(body1);

//Body2//
var body2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10.38, 15),
  makeShaderMat(couchTex[1])
);
body2.position.x = 3;
body2.position.y = 9.55;
body2.position.z = -18.18;
body2.rotation.y = Math.PI / 2;
couch.add(body2);

// body3
var body3 = new THREE.Mesh(
  new THREE.BoxGeometry(12.18, 4.32, 15),
  makeShaderMat(couchTex[1])
);
body3.position.x = -12;
body3.position.y = 2.25;
body3.position.z = -12.5;
body3.rotation.y = Math.PI / 2;
couch.add(body3);

// body4
var body4 = new THREE.Mesh(
  new THREE.BoxGeometry(12.18, 4.32, 15),
  makeShaderMat(couchTex[1])
);
body4.position.x = 3;
body4.position.y = 2.25;
body4.position.z = -12.5;
body4.rotation.y = Math.PI / 2;
couch.add(body4);

// body 5
var body5 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 7.38, 12.1),
  makeShaderMat(couchTex[1])
);
body5.position.x = 11;
body5.position.y = 3.8;
body5.position.z = -12.5;
couch.add(body5);

// body 6
var body6 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 7.38, 12.1),
  makeShaderMat(couchTex[1])
);
body6.position.x = -20;
body6.position.y = 3.8;
body6.position.z = -12.5;
couch.add(body6);

// keep references to couch materials for fast switching
const couchMats = [
  body1.material,
  body2.material,
  body3.material,
  body4.material,
  body5.material,
  body6.material,
];

/**
  A lamp is added with a head (a cylinder) and a stand (a box). Like the couch, textures are applied to make it look realistic. It’s also given a PointLight source, which illuminates the room.
 */
const lamp = new THREE.Group();
scene.add(lamp);

// Head //
const head = new THREE.Mesh(
  new THREE.CylinderGeometry(7.44, 4.5, 8.06),
  makeShaderMat(tuneTexture(new THREE.TextureLoader().load(L_head)), 0.15) // slight glow
);
head.position.x = 22;
head.position.y = 17.8;
head.position.z = -12.5;
head.rotation.x = Math.PI;
lamp.add(head);

// Stand //
const stand = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 15.25),
  makeShaderMat(tuneTexture(new THREE.TextureLoader().load(L_stand)))
);
stand.position.x = 22;
stand.position.y = 8.8;
stand.position.z = -12.5;
stand.rotation.x = Math.PI / 2;
lamp.add(stand);

// Basement //
const base = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  makeShaderMat(tuneTexture(new THREE.TextureLoader().load(L_stand)))
);
base.position.x = 22;
base.position.y = 0.8;
base.position.z = -12.5;
base.rotation.x -= Math.PI / 2;
lamp.add(base);

// Floor //
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 200),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(floorr),
    wireframe: false,
    side: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -0.5 * Math.PI;
floor.position.y = 0;
scene.add(floor);

// ---------- Rug & Coffee Table now use textured materials with normal maps ----------
const rugTex = tuneTexture(new THREE.TextureLoader().load(mat));
rugTex.wrapS = rugTex.wrapT = THREE.RepeatWrapping;
rugTex.repeat.set(2, 2);

const woodTex = tuneTexture(new THREE.TextureLoader().load(glass));
woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
woodTex.repeat.set(2, 2);

// Put coffee set well in front of the couch
const coffeeZ = 8.5; // try 8.5–12; front wall is at ~+35
const stemHeight = 3.6; // was 1.6 — a bit taller now
const topThickness = 0.6; // tabletop thickness

// Round rug (textured + normal)
const rug = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64),
  new THREE.MeshStandardMaterial({
    map: rugTex,
    normalMap: rugTex, // using same texture as a lightweight normal map
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughness: 0.9,
    metalness: 0,
  })
);
rug.rotation.x = -Math.PI / 2;
rug.position.set(-4.5, 0.02, coffeeZ);
rug.receiveShadow = true;
scene.add(rug);

// Coffee table (wood texture + normal)
const tableStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.9, stemHeight, 24),
  new THREE.MeshStandardMaterial({
    map: woodTex,
    normalMap: woodTex,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughness: 0.7,
    metalness: 0.2,
  })
);
tableStem.position.set(-4.5, stemHeight / 2, coffeeZ);
tableStem.castShadow = true;

const tableTop = new THREE.Mesh(
  new THREE.CylinderGeometry(8, 8, topThickness, 48),
  new THREE.MeshStandardMaterial({
    map: woodTex,
    normalMap: woodTex,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughness: 0.4,
    metalness: 0.1,
  })
);
tableTop.position.set(-4.5, stemHeight + topThickness / 2, coffeeZ);
tableTop.castShadow = true;

scene.add(tableTop, tableStem);
// -------------------------------------------------------------------------------

/**
 Lights
*/
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.8);
scene.add(ambientLight);

const lampLight = new THREE.PointLight(0xffffff);
lampLight.castShadow = true;
lampLight.shadow.mapSize.width = 512;
lampLight.shadow.mapSize.height = 512;
lampLight.shadow.camera.far = 7.5;
lampLight.position.set(15.5, 3, 2.7);
lamp.add(lampLight);

//renderer //
renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("black");
document.body.appendChild(renderer.domElement);

// Tone mapping & correct color space
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.1;
// if ("outputColorSpace" in renderer)
//   renderer.outputColorSpace = THREE.SRGBColorSpace;
// else renderer.outputEncoding = THREE.sRGBEncoding;

// Camera add to screen //
scene.add(camera);

// Create a room with different materials per face
const roomGeo = new THREE.BoxGeometry(170, 40, 70);

// Load & tune textures
const wallTex = new THREE.TextureLoader().load(wall);
const ceilTex = new THREE.TextureLoader().load(ceiling);

// (optional) make textures tile nicely
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
wallTex.repeat.set(3, 1);
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping;
ceilTex.repeat.set(2, 2);

// Box face order: +X, -X, +Y, -Y, +Z, -Z
const roomMats = [
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // right wall
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // left wall
  new THREE.MeshStandardMaterial({ map: ceilTex, side: THREE.BackSide }), // ceiling (+Y)
  new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
  }), // floor face invisible
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // front wall
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // back wall
];

const room = new THREE.Mesh(roomGeo, roomMats);
room.position.y = 19;
room.receiveShadow = true;
scene.add(room);

// Let objects cast/receive shadows
couch.traverse((o) => {
  if (o.isMesh) o.castShadow = true;
});
lamp.traverse((o) => {
  if (o.isMesh) o.castShadow = true;
});
room.castShadow = false; // box walls usually don't cast
room.receiveShadow = true;
floor.receiveShadow = true;

// ---------- Framed art helpers (unchanged visual result) ----------
function addFramedArt(url, opts = {}) {
  const { centerX = -44.5, centerY = 18, wallZ = -35, maxHeight = 20 } = opts;

  const loader = new THREE.TextureLoader();
  loader.load(url, (tex) => {
    if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
    else tex.encoding = THREE.sRGBEncoding;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;

    const aspect = tex.image.width / tex.image.height;
    const artH = maxHeight;
    const artW = artH * aspect;

    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(artW, artH),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    art.position.set(centerX, centerY, wallZ + 0.7);
    art.material.polygonOffset = true;
    art.material.polygonOffsetFactor = 1;
    art.material.polygonOffsetUnits = 1;

    const frameDepth = 0.6,
      frameThick = 1.2;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(artW + frameThick, artH + frameThick, frameDepth),
      new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        metalness: 0.3,
        roughness: 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    frame.position.set(centerX, centerY, wallZ + 0.3);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(artW * 0.995, artH * 0.995),
      new THREE.MeshPhysicalMaterial({
        transmission: 0.0,
        transparent: true,
        opacity: 0.06,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
    );
    glass.position.set(centerX, centerY, wallZ + 0.71);

    const group = new THREE.Group();
    group.add(frame, art, glass);
    scene.add(group);
  });
}
addFramedArt(messi);

function addSrejonArt(url, opts = {}) {
  const { centerX = 54.5, centerY = 18, wallZ = -35, maxHeight = 20 } = opts;

  const loader = new THREE.TextureLoader();
  loader.load(url, (tex) => {
    if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
    else tex.encoding = THREE.sRGBEncoding;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;

    const aspect = tex.image.width / tex.image.height;
    const artH = maxHeight;
    const artW = artH * aspect;

    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(artW, artH),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    art.position.set(centerX, centerY, wallZ + 0.7);
    art.material.polygonOffset = true;
    art.material.polygonOffsetFactor = 1;
    art.material.polygonOffsetUnits = 1;

    const frameDepth = 0.6,
      frameThick = 1.2;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(artW + frameThick, artH + frameThick, frameDepth),
      new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        metalness: 0.3,
        roughness: 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    frame.position.set(centerX, centerY, wallZ + 0.3);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(artW * 0.995, artH * 0.995),
      new THREE.MeshPhysicalMaterial({
        transmission: 0.0,
        transparent: true,
        opacity: 0.06,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
    );
    glass.position.set(centerX, centerY, wallZ + 0.71);

    const group = new THREE.Group();
    group.add(frame, art, glass);
    scene.add(group);
  });
}
addSrejonArt(srejon);

// Move the camera around object using MOUSE movment //
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.update();

// Efficient texture switching on click (no re-meshing)
function useClick(event) {
  click = click < 4 ? click + 1 : 1;
  const targetTex = couchTex[click];
  for (const m of couchMats) {
    m.uniforms.uMap.value = targetTex;
  }
}
window.addEventListener("click", useClick);

//Tracking the pc current time//
const clock = new THREE.Clock();

//creat a arrow function//
const tick1 = () => {
  // Here getElapsedTime() is Keeps track of the total time that the clock has been running.//
  const elapsedTime = clock.getElapsedTime();
  const lampLightAngle = elapsedTime * 0.25;
  const keyangle = elapsedTime * 0.1;

  lampLight.position.z = Math.sin(lampLightAngle) / 4;
  lampLight.position.y = Math.sin(lampLightAngle * 3);

  // --- update shader uniforms from actual scene lights each frame ---
  const lp = new THREE.Vector3();
  lampLight.getWorldPosition(lp);
  for (const m of shaderMats) {
    m.uniforms.uLightPos.value.copy(lp);
    m.uniforms.uLightColor.value.copy(lampLight.color);
    m.uniforms.uLightIntensity.value = lampLight.intensity;
    m.uniforms.uAmbientColor.value.copy(ambientLight.color);
    m.uniforms.uAmbientIntensity.value = ambientLight.intensity;
  }
  // ------------------------------------------------------------------

  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keycode = event.keyCode;
    switch (keycode) {
      case 37: //left
        camera.position.x +=
          Math.sin(camera.rotation.y - Math.PI / 2) * socket.speed;
        camera.position.z +=
          -Math.cos(camera.rotation.y - Math.PI / 2) * socket.speed;
        break;
      case 38: //up
        camera.position.x -= Math.sin(camera.rotation.y) * socket.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * socket.speed;
        break;
      case 39: //right
        camera.position.x +=
          Math.sin(camera.rotation.y + Math.PI / 2) * socket.speed;
        camera.position.z +=
          -Math.cos(camera.rotation.y + Math.PI / 2) * socket.speed;
        break;
      case 40: //down
        camera.position.x += Math.sin(camera.rotation.y) * socket.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * socket.speed;
        break;
      case 81: // turn(q)
        camera.rotation.y = 4 * Math.sin(keyangle);
        break;
    }
  }

  // Call tick1 again on the next frame
  window.requestAnimationFrame(tick1);

  //Add camera & scene to renderer
  renderer.render(scene, camera);
  // console.log(tick1);
};

tick1(); // call the tick1 function //

//Create a  Responsible canvas//
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.render(scene, camera);
});
