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
import L_head from "../img/lamp3.jpg";
import L_stand from "../img/base_m.jpg";
import messi from "../img/messi.jpg";
import srejon from "../img/srejon.jpeg";
import ceiling from "../img/ceiling2.jpg"; // add this
// import sadMp3 from "../music/ambiance.mp3";
// click = 1;: This Global variable is used to track how many times the user has clicked. It controls which texture is applied to the couch. //

var click = 1;

//var stream = "https://cdn.rawgit.com/ellenprobst/web-audio-api-with-Threejs/57582104/lib/TheWarOnDrugs.m4a";
//var stream = "G:/Three Js Project/src/music/sad.mp3";

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

// Basic camera
const camera = new THREE.PerspectiveCamera(
  85, // angle
  sizes.width / sizes.height, // aspect ratio
  0.1, // near appear smaller
  1000 // far
);

//camera.position.set(0, socket.height, 33);: Sets the camera's initial position. It's placed at (x=0, y=8.5, z=33) which gives a view of the entire scene from a certain height.//
camera.position.set(0, socket.height, 33);

// Texture looder //

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load('https://thumbs.dreamstime.com/z/brick-wall-lights-old-stage-31525641.jpg');

// An audio stream is loaded and played in the background using the AudioLoader and AudioListener features of Three.js.
// const stream = sadMp3;
// ---- Background music ----
// const listener = new THREE.AudioListener();
// camera.add(listener); // attach listener to the camera

// const sound = new THREE.Audio(listener);
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load(stream, (buffer) => {
//   sound.setBuffer(buffer);
//   sound.setLoop(true);
//   sound.setVolume(0.5);
// });

// // Start on first user click (needed due to autoplay policies)
// window.addEventListener(
//   "click",
//   () => {
//     if (!sound.isPlaying) sound.play();
//   },
//   { once: true }
// );

/**
  The couch is created as a group of 3D objects using THREE.Mesh, each representing parts of the couch (like the seat, back, arms). The textureLoader is used to apply the blue couch texture initially.
 */
// Couch container
const couch = new THREE.Group();
scene.add(couch);

//Body//
//Body1//
var body1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10.38, 15),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body1.position.x = -12;
body1.position.y = 9.55;
body1.position.z = -18.18;
body1.rotation.y = Math.PI / 2;
couch.add(body1);

//Body2//

var body2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10.38, 15),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body2.position.x = 3;
body2.position.y = 9.55;
body2.position.z = -18.18;
body2.rotation.y = Math.PI / 2;
couch.add(body2);

// body3

var body3 = new THREE.Mesh(
  new THREE.BoxGeometry(12.18, 4.32, 15),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body3.position.x = -12;
body3.position.y = 2.25;
body3.position.z = -12.5;
body3.rotation.y = Math.PI / 2;
couch.add(body3);

// body4

var body4 = new THREE.Mesh(
  new THREE.BoxGeometry(12.18, 4.32, 15),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body4.position.x = 3;
body4.position.y = 2.25;
body4.position.z = -12.5;
body4.rotation.y = Math.PI / 2;
couch.add(body4);

// body 5

var body5 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 7.38, 12.1),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body5.position.x = 11;
body5.position.y = 3.8;
body5.position.z = -12.5;

couch.add(body5);

// body 6

var body6 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 7.38, 12.1),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(blue),
  })
);
body6.position.x = -20;
body6.position.y = 3.8;
body6.position.z = -12.5;

couch.add(body6);

// // ----- Wall picture (behind the couch) -----
// const artTexture = textureLoader.load(artImg, (t) => {
//   // make it crisp & correctly colored
//   if (t.minFilter) t.minFilter = THREE.LinearMipmapLinearFilter;
//   if (t.magFilter) t.magFilter = THREE.LinearFilter;
//   if ("anisotropy" in t)
//     t.anisotropy = renderer.capabilities.getMaxAnisotropy();
//   // three r150+: use colorSpace; older three: use encoding
//   if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace;
//   else t.encoding = THREE.sRGBEncoding;
// });

// // Choose size (in scene units). Adjust to taste.
// const ART_W = 30;
// const ART_H = 18;

// // Picture panel (unlit so it looks like the actual image)
// const artMaterial = new THREE.MeshBasicMaterial({
//   map: artTexture,
//   toneMapped: false, // keep colors true-to-file
// });
// const artPlane = new THREE.Mesh(
//   new THREE.PlaneGeometry(ART_W, ART_H),
//   artMaterial
// );

// // Optional wooden frame
// const frameDepth = 0.8;
// const frame = new THREE.Mesh(
//   new THREE.BoxGeometry(ART_W + 1, ART_H + 1, frameDepth),
//   new THREE.MeshStandardMaterial({
//     color: 0x3a2f1b,
//     metalness: 0.2,
//     roughness: 0.6,
//   })
// );

// // Position: your room is Box(170,40,70) centered at (0,19,0), so the back wall is near z = -35.
// // Your couch centers around x ≈ -4 to -5 and y ≈ 9–10 seat / ~18 back.
// // Place the frame nearly flush with the wall, and the art slightly in front of the frame.
// const centerX = -4.5; // center over couch (tweak if needed)
// const centerY = 18; // eye-level (tweak if needed)
// const wallZ = -35; // back wall plane (approx)

// // Put the frame a hair off the wall; put the art a bit in front of the frame
// frame.position.set(centerX, centerY, wallZ + 0.3);
// artPlane.position.set(centerX, centerY, wallZ + 0.7);

// // If you ever see flicker, polygonOffset can help when things are near-coplanar
// artPlane.material.polygonOffset = true;
// artPlane.material.polygonOffsetFactor = 1;
// artPlane.material.polygonOffsetUnits = 1;

// // Group them and add to scene
// const wallArt = new THREE.Group();
// wallArt.add(frame);
// wallArt.add(artPlane);
// scene.add(wallArt);

/**
  A lamp is added with a head (a cylinder) and a stand (a box). Like the couch, textures are applied to make it look realistic. It’s also given a PointLight source, which illuminates the room.
 */
// Lamp container
const lamp = new THREE.Group();
scene.add(lamp);

// Head //

const head = new THREE.Mesh(
  new THREE.CylinderGeometry(7.44, 4.5, 8.06),
  new THREE.MeshPhongMaterial({
    //transparent: true,

    map: new THREE.TextureLoader().load(L_head),
  })
);

head.position.x = 22;
head.position.y = 17.8;
head.position.z = -12.5;
head.rotation.x = Math.PI;
lamp.add(head);

// Stand //

const stand = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 15.25),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(L_stand),
  })
);
stand.position.x = 22;
stand.position.y = 8.8;
stand.position.z = -12.5;
stand.rotation.x = Math.PI / 2;
lamp.add(stand);

// Basement //

const base = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(L_stand),
  })
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

// Put coffee set well in front of the couch
const coffeeZ = 8.5; // try 8.5–12; front wall is at ~+35
const stemHeight = 3.6; // was 1.6 — a bit taller now
const topThickness = 0.6; // tabletop thickness
// Round rug
const rug = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64), // slightly smaller so it never touches the couch
  new THREE.MeshStandardMaterial({
    color: 0xcfe2f3,
    roughness: 0.9,
    metalness: 0,
  })
);
rug.rotation.x = -Math.PI / 2;
rug.position.set(-4.5, 0.02, coffeeZ);
rug.receiveShadow = true;
scene.add(rug);

// Coffee table (stem sits on floor, top sits on stem)
const tableStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.9, stemHeight, 24),
  new THREE.MeshStandardMaterial({
    color: 0x7a6f63,
    roughness: 0.7,
    metalness: 0.2,
  })
);
tableStem.position.set(-4.5, stemHeight / 2, coffeeZ); // center at half-height so bottom touches floor
tableStem.castShadow = true;

const tableTop = new THREE.Mesh(
  new THREE.CylinderGeometry(8, 8, topThickness, 48),
  new THREE.MeshStandardMaterial({
    color: 0xd9d3c7,
    roughness: 0.4,
    metalness: 0.1,
  })
);
tableTop.position.set(-4.5, stemHeight + topThickness / 2, coffeeZ); // 1.6 (stem) + 0.3 (half top)
tableTop.castShadow = true;

scene.add(tableTop, tableStem);

// Replace the omnidirectional point light with a spotlight feel
// const lampSpot = new THREE.SpotLight(0xfff2cc, 35, 50, Math.PI / 5, 0.35, 2);
// color, intensity, distance, angle, penumbra, decay
// lampSpot.castShadow = true;
// lampSpot.shadow.mapSize.set(1024, 1024);

// Position at the lampshade and aim to floor near the couch
// lampSpot.position.set(22, 17.5, -12.5);
// lampSpot.target.position.set(-4.5, 0.6, -12.5);
// scene.add(lampSpot, lampSpot.target);

// Subtle glow from the shade
// head.material.emissive = new THREE.Color(0xfff2cc);
// head.material.emissiveIntensity = 0.25;

/**
 Lights
*/
//AmbientLight provides overall light to the scene. //
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.4);
scene.add(ambientLight);

// PointLight simulates the lamp's light and casts shadows. //
const lampLight = new THREE.PointLight(0xffffff);
lampLight.castShadow = true;
lampLight.shadow.mapSize.width = 512;
lampLight.shadow.mapSize.height = 512;
lampLight.shadow.camera.far = 7.5;

lampLight.position.set(15.5, 3, 2.7);
lamp.add(lampLight);

// RectAreaLightUniformsLib.init();

// // Rectangular area light simulating a bright window on +X wall
// const windowLight = new THREE.RectAreaLight(0xffffff, 15, 30, 18); // color, intensity, width, height
// windowLight.position.set(85 - 0.2, 20, -12.5); // slightly off the wall to avoid z-fighting
// windowLight.lookAt(0, 18, -12.5);
// scene.add(windowLight);

// // Optional visible "window" panel (bright emissive plane)
// const windowPanel = new THREE.Mesh(
//   new THREE.PlaneGeometry(30, 18),
//   new THREE.MeshBasicMaterial({ color: 0xffffff })
// );
// windowPanel.position.copy(windowLight.position);
// windowPanel.lookAt(windowLight.target.position);
// windowPanel.position.x -= 0.05; // tuck into wall
// windowPanel.renderOrder = -1;
// scene.add(windowPanel);

// Optional helper
// const windowHelper = new RectAreaLightHelper(windowLight);
// windowLight.add(windowHelper);

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

// Create a room Geometry //

// const geometry = new THREE.BoxGeometry(170, 40, 70);

// const material = new THREE.MeshStandardMaterial({
//   map: new THREE.TextureLoader().load(wall),
// });

// material.side = THREE.BackSide;
// const room = new THREE.Mesh(geometry, material);
// room.position.y = 19;
// room.receiveShadow = true;
// scene.add(room);

// Create a room with different materials per face
const roomGeo = new THREE.BoxGeometry(170, 40, 70);

// Load & tune textures
const wallTex = new THREE.TextureLoader().load(wall);
const ceilTex = new THREE.TextureLoader().load(ceiling);

// (optional) make textures tile nicely
wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
wallTex.repeat.set(3, 1); // tweak
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping;
ceilTex.repeat.set(2, 2); // tweak

// Box face order: +X, -X, +Y, -Y, +Z, -Z
const roomMats = [
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // right wall
  new THREE.MeshStandardMaterial({ map: wallTex, side: THREE.BackSide }), // left wall
  new THREE.MeshStandardMaterial({ map: ceilTex, side: THREE.BackSide }), // ceiling (+Y)
  // We already have a separate floor mesh, so make the bottom face invisible:
  new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
  }),
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

// ---------- Framed Messi picture on the back wall ----------
// function addFramedArt(url, opts = {}) {
//   const {
//     centerX = -44.5, // horizontally centered over your couch; tweak if needed
//     centerY = 18, // eye height
//     wallZ = -35, // back wall plane for your Box(170,40,70) room
//     maxHeight = 20, // picture height in scene units
//   } = opts;

//   const loader = new THREE.TextureLoader();
//   loader.load(url, (tex) => {
//     // Make the image crisp & color-accurate
//     if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
//     else tex.encoding = THREE.sRGBEncoding;
//     tex.minFilter = THREE.LinearMipmapLinearFilter;
//     tex.magFilter = THREE.LinearFilter;
//     tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;

//     // Keep the correct aspect ratio
//     const aspect = tex.image.width / tex.image.height;
//     const artH = maxHeight;
//     const artW = artH * aspect;

//     // Picture (unlit so it looks like the real photo)
//     const artMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
//     const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
//     art.position.set(centerX, centerY, wallZ + 0.7);

//     // Prevent z-fighting
//     art.material.polygonOffset = true;
//     art.material.polygonOffsetFactor = 1;
//     art.material.polygonOffsetUnits = 1;

//     // Simple dark frame
//     const frameDepth = 0.6;
//     const frameThick = 1.0;
//     const frame = new THREE.Mesh(
//       new THREE.BoxGeometry(artW + frameThick, artH + frameThick, frameDepth),
//       new THREE.MeshStandardMaterial({
//         color: 0x2a2a2a,
//         metalness: 0.2,
//         roughness: 0.6,
//       })
//     );
//     frame.position.set(centerX, centerY, wallZ + 0.3);

//     const group = new THREE.Group();
//     group.add(frame, art);
//     scene.add(group);
//   });
// }
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

    // Dark frame with clearcoat sheen
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

    // Ultra-thin glass pane (very low opacity so we don’t obscure the art)
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(artW * 0.995, artH * 0.995),
      new THREE.MeshPhysicalMaterial({
        transmission: 0.0, // no refraction
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

// ---------- Framed Srejon picture on the back wall ----------
// function addSrejonArt(url, opts = {}) {
//   const {
//     centerX = 54.5, // horizontally centered over your couch; tweak if needed
//     centerY = 18, // eye height
//     wallZ = -35, // back wall plane for your Box(170,40,70) room
//     maxHeight = 20, // picture height in scene units
//   } = opts;

//   const loader = new THREE.TextureLoader();
//   loader.load(url, (tex) => {
//     // Make the image crisp & color-accurate
//     if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
//     else tex.encoding = THREE.sRGBEncoding;
//     tex.minFilter = THREE.LinearMipmapLinearFilter;
//     tex.magFilter = THREE.LinearFilter;
//     tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;

//     // Keep the correct aspect ratio
//     const aspect = tex.image.width / tex.image.height;
//     const artH = maxHeight;
//     const artW = artH * aspect;

//     // Picture (unlit so it looks like the real photo)
//     const artMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
//     const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
//     art.position.set(centerX, centerY, wallZ + 0.7);

//     // Prevent z-fighting
//     art.material.polygonOffset = true;
//     art.material.polygonOffsetFactor = 1;
//     art.material.polygonOffsetUnits = 1;

//     // Simple dark frame
//     const frameDepth = 0.6;
//     const frameThick = 1.0;
//     const frame = new THREE.Mesh(
//       new THREE.BoxGeometry(artW + frameThick, artH + frameThick, frameDepth),
//       new THREE.MeshStandardMaterial({
//         color: 0x2a2a2a,
//         metalness: 0.2,
//         roughness: 0.6,
//       })
//     );
//     frame.position.set(centerX, centerY, wallZ + 0.3);

//     const group = new THREE.Group();
//     group.add(frame, art);
//     scene.add(group);
//   });
// }

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

// When the user clicks on the scene, the useClick function changes the texture of the couch. //

function useClick(event) {
  if (click <= 4) {
    click += 1;
  } else {
    click = 1;
  }

  //There are four possible textures (blue, red, brown, white), and they cycle through with each click. This is handled by updating the materials of the couch bodies (body1 to body6) based on the current click value.

  const textureLoader1 = new THREE.TextureLoader();

  switch (click) {
    case 1:
      var body1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      var body2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      var body3 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      var body4 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      var body5 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      var body6 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(blue),
        })
      );

      break;
    case 2:
      var body1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      var body2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      var body3 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      var body4 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      var body5 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      var body6 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(red),
        })
      );

      break;

    case 3:
      var body1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      var body2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      var body3 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      var body4 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      var body5 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      var body6 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(brown),
        })
      );

      break;

    case 4:
      var body1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      var body2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10.38, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      var body3 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      var body4 = new THREE.Mesh(
        new THREE.BoxGeometry(12.18, 4.32, 15),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      var body5 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      var body6 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 7.38, 12.1),
        new THREE.MeshBasicMaterial({
          map: textureLoader1.load(white),
        })
      );

      break;
  }

  body1.position.x = -12;
  body1.position.y = 9.55;
  body1.position.z = -18.18;
  body1.rotation.y = Math.PI / 2;
  couch.add(body1);

  body2.position.x = 3;
  body2.position.y = 9.55;
  body2.position.z = -18.18;
  body2.rotation.y = Math.PI / 2;
  couch.add(body2);

  body3.position.x = -12;
  body3.position.y = 2.25;
  body3.position.z = -12.5;
  body3.rotation.y = Math.PI / 2;
  couch.add(body3);

  body4.position.x = 3;
  body4.position.y = 2.25;
  body4.position.z = -12.5;
  body4.rotation.y = Math.PI / 2;
  couch.add(body4);

  body5.position.x = 11;
  body5.position.y = 3.8;
  body5.position.z = -12.5;
  couch.add(body5);

  body6.position.x = -20;
  body6.position.y = 3.8;
  body6.position.z = -12.5;

  couch.add(body6);
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
  //console.log(lampLightAngle);

  lampLight.position.z = Math.sin(lampLightAngle) / 4;
  lampLight.position.y = Math.sin(lampLightAngle * 3);

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
  console.log(tick1);
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
