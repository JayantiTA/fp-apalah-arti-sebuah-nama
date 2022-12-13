import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, controls, mesh;

init();
animate();


function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.x = 10;
  camera.position.y = 5;
  camera.position.z = 10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfe3dd );

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  function handle_load_gltf(gltf, child_idx, translation, rotation, scale, mesh) {
    console.log(gltf);
    if (child_idx != -1) {
      mesh = gltf.scene.children[child_idx];
    } else {
      mesh = gltf.scene;
    }
    mesh.scale.set(scale[0], scale[1], scale[2]);    
      mesh.scale.set(scale[0], scale[1], scale[2]);    
    mesh.scale.set(scale[0], scale[1], scale[2]);    
    mesh.position.set(translation[0], translation[1], translation[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  function handle_load_fbx(fbx, translation, rotation, scale) {
    fbx.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log(fbx)
    fbx.scale.set(scale[0], scale[1], scale[2]);    
    fbx.position.set(translation[0], translation[1], translation[2]);
    fbx.rotation.set(rotation[0], rotation[1], rotation[2]);
    fbx.castShadow = true;
    fbx.receiveShadow = true;
    scene.add(fbx);
  }

  // Instantiate an fbx loader
  const fbxLoader = new FBXLoader();
  fbxLoader.load('models/works.fbx',
    function (object) {
      handle_load_fbx(object, [0, 0, 0], [0, 0, 0], [0.01, 0.01, 0.01])
    }
  );

  // Instantiate a gltf loader
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0, 0, 0], [0, 0, 0], [1, 1, 1], mesh)
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [6, 0, 0], [0, 0, 0], [1, 1, 1], mesh)
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      handle_load_gltf(gltf, 0, [6, 0, 4], [0, 1, 0], [1, 1, 1], mesh)
    },
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.maxDistance = 20;
  controls.update();

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);

  // const delta = clock.getDelta();

  // Object.values(mixers).forEach(mixer => {
  //   mixer.update(delta);
  // });

  // checkDistance();

  // Object.keys(humanObjects).forEach(name => {
  //   // console.log(coordinates[name])
  //   if (coordinates[name] && coordinates[name].x.length > humanObjects[name].counter) {
  //     animations[name]['idle'].action.stop();
  //     animations[name]['walking'].action.play();
  //     moveHumanToTarget(name, coordinates[name].x[humanObjects[name].counter], coordinates[name].y[humanObjects[name].counter], 0.017);
  //   } else {
  //     animations[name]['walking'].action.stop();
  //     animations[name]['idle'].action.play();
  //   }
  // })

  // if (humanObjectFollowed) {
  //   setDiamondVisibility(true);
  //   focusCamera(humanObjectFollowed);
  // } else {
  //   setDiamondVisibility(false);
  // }
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene, camera);

}
