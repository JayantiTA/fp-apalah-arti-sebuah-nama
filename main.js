import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as AN from './assets/js/animation.js';


let camera, scene, renderer, controls, mesh;
let allready = 0, objNames = [];

// animation
let carAnimation = new AN.Animate([[5, 0, 0, 'position'], [10, 0, 10, 'position'], [0, 0, 0, 'position']], 0.05, 0.05); // harus posisi only
var manager = new THREE.LoadingManager();

init();
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
  waitReady();
  animate();
};


function init() {
  console.log('init');

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

  function handle_load_gltf(gltf, child_idx, translation, rotation, scale, mesh, name) {
    // console.log(gltf);
    if (child_idx != -1) {
      mesh = gltf.scene.children[child_idx];
    } else {
      mesh = gltf.scene;
    }
    mesh.scale.set(scale[0], scale[1], scale[2]);    
    mesh.position.set(translation[0], translation[1], translation[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;
    scene.add(mesh);

  }

  function handle_load_fbx(fbx, translation, rotation, scale, name) {
    fbx.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // console.log(fbx)
    fbx.scale.set(scale[0], scale[1], scale[2]);    
    fbx.position.set(translation[0], translation[1], translation[2]);
    fbx.rotation.set(rotation[0], rotation[1], rotation[2]);
    fbx.castShadow = true;
    fbx.receiveShadow = true;
    
    fbx.name = name;

    scene.add(fbx);
  }

  // Instantiate an fbx loader
  const fbxLoader = new FBXLoader(manager);
  fbxLoader.load('models/works.fbx',
    function (object) {
      objNames.push('car1');
      handle_load_fbx(object, [0, 0, 0], [0, 0, 0], [0.01, 0.01, 0.01], 'car1');
    }
  );

  // Instantiate a gltf loader
  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree1');
      handle_load_gltf(gltf, -1, [0, 0, 0], [0, 0, 0], [1, 1, 1], mesh, 'small_tree1')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree2');
      handle_load_gltf(gltf, -1, [6, 0, 0], [0, 0, 0], [1, 1, 1], mesh, 'small_tree2')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree3');
      handle_load_gltf(gltf, 0, [6, 0, 4], [0, 1, 0], [1, 1, 1], mesh, 'small_tree3')
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

function waitReady(){
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene, camera);

  allready = -1;
  for (let i = 0; i < objNames.length; i++) {
    if (scene.getObjectByName(objNames[i])) {
      allready++;
      console.log('ready');
    }else{
      console.log('not ready');
    }
  }

  if (allready == objNames.length -1 && allready != -1) {
    console.log('allready');
    return;
  }else{
    requestAnimationFrame(waitReady);
  }
}


function animate(time) {

  carAnimation.do_wp(scene.getObjectByName('car1'));

  requestAnimationFrame(animate);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene, camera);

}