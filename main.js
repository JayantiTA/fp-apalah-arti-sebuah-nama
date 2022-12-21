import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as CTRL from './assets/js/control.js';
import * as AN from './assets/js/animation.js';
import * as OM from './assets/js/object_maker.js';


let camera, cameraLookAt, scene, renderer, controls, mesh;
let allready = 0, objNames = [], keyboard = {}, animatedObjects = [];
let keycb={
    87: CTRL.moveCamUp,
    83: CTRL.moveCamDown,
    65: CTRL.moveCamLeft,
    68: CTRL.moveCamRight,
    81: CTRL.moveCamFront,
    69: CTRL.moveCamBack, 
};
// animation coba coba
let carAnimation = new AN.Animate([[5, 0, 0, 'position'], [10, 0, 10, 'position'], [0, 0, 0, 'position']], 0.05, 0.05); // harus posisi only


let manager = new THREE.LoadingManager();
init();
manager.onLoad = function ( ) {
  console.log( 'Loading complete!');
  waitReady();

  animate();
};

function init() {
  console.log('init');

  // const container = document.createElement('div');
  // document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
  camera.position.set(0, 1, 4);
  cameraLookAt = new THREE.Vector3(0, 0, 0);
  camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfe3dd );
  let near = 0.01;
  let far = 20;
  scene.fog = new THREE.Fog(0xbfe3dd, near, far);


  const geometry = new THREE.PlaneGeometry( 7, 5 );
  const material = new THREE.MeshBasicMaterial( {color: 0xB2A290, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.set(1.57, 0, 0);
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;
  scene.add( plane );

  const geometry2 = new THREE.BoxGeometry( 2.62, 0.05, 0.7 );
  const material2 = new THREE.MeshBasicMaterial( {color: 0xC7C3C1, side: THREE.DoubleSide} );
  const plane2 = new THREE.Mesh( geometry2, material2 );
  plane2.position.set(0.6, 0, -0.06);
  scene.add( plane2 );

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const color = 0xFFFFFF;
  const intensity = 0.8;
  let dirLight = new THREE.DirectionalLight( color, intensity );
  dirLight.position.set( 0, 10, 10 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 0.2;
  dirLight.shadow.camera.bottom = - 0.2;
  dirLight.shadow.camera.left = - 0.2;
  dirLight.shadow.camera.right = 0.2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 2;
  dirLight.shadow.mapSize.set( 1024, 1024 );
  dirLight.target.position.set(0, 0, 0);
  scene.add( dirLight );
  scene.add(dirLight.target);

  scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

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
    console.log(fbx)
    fbx.position.set(translation[0], translation[1], translation[2]);
    fbx.scale.set(scale[0], scale[1], scale[2]);    
    fbx.rotation.set(rotation[0], rotation[1], rotation[2]);
    fbx.castShadow = true;
    fbx.receiveShadow = true;
    fbx.name = name;
    scene.add(fbx);
  }

  // Instantiate an fbx loader
  const fbxLoader = new FBXLoader(manager);

  // Instantiate a gltf loader
  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.load('models/buildings/GedungTC.gltf',
    function (gltf) {
      objNames.push('GedungTC');
      handle_load_gltf(gltf, -1, [2, 0, 0], [0, 0, 0], [0.007, 0.007, 0.007], mesh, 'GedungTC')
    },
  );

  gltfLoader.load('models/buildings/KantinTC.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [2.3, -0.05, -0.4], [0, 0, 0], [0.007, 0.007, 0.007], mesh)
    },
  );

  gltfLoader.load('models/buildings/ParkiranMobilDosen.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [2, 0, -0.1], [0, 0, 0], [0.007, 0.007, 0.007], mesh)
    },
  );

  gltfLoader.load('models/buildings/Stage.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0.6, 0, -2.1], [0, 0, 0], [1, 1, 1], mesh)
    },
  );

  gltfLoader.load('models/buildings/Musala.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [1.7, 0.3, -2], [0, 2.8, 0], [0.5, 0.5, 0.5], mesh)
    },
  );

  gltfLoader.load('models/buildings/PlazaPakSupeno.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0.9, 0, -0.5], [0, -1.57, 0], [0.006, 0.006, 0.006], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0.7, 0.06, 0.6], [0, 1.57, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [1.5, 0.06, 0.6], [0, 1.57, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.3, 0.06, 0.6], [0, 1.57, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [2.2, 0.06, 0], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [2.2, 0.06, -0.7], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [2.2, 0.06, -1.5], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.9, 0.06, 0], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.9, 0.06, -0.7], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );

  gltfLoader.load('models/properties/picnic_table.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.9, 0.06, -1.5], [0, 0, 0], [0.05, 0.05, 0.05], mesh)
    },
  );


  gltfLoader.load('models/properties/fountain.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.4, 0.14, 1.2], [0, 0, 0], [0.2, 0.2, 0.2], mesh)
    },
  );

  gltfLoader.load('models/properties/PapanTCgerbang.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-3.1, 0, 1.3], [0, 0.3, 0], [0.007, 0.007, 0.007], mesh)
    },
  );

  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.8, 0, -2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.5, 0, -2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.2, 0, -2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.8, 0, -2.2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.5, 0, -2.2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.2, 0, -2.2], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );

  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [1.7, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [1.4, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [1.1, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.5, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-0.2, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0.1, 0, -0.67], [0, 0, 0], [0.014, 0.014, 0.014], mesh)
    },
  );

  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, 0.1], [0, 0, 0], [0.005, 0.005, 0.005], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.2], [0, 0, 0], [0.005, 0.005, 0.005], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.5], [0, 0, 0], [0.005, 0.005, 0.005], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.8], [0, 0, 0], [0.005, 0.005, 0.005], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      objNames.push('garden');
      handle_load_gltf(gltf, -1, [-2.35, 0, -1.1], [0, 0, 0], [0.005, 0.005, 0.005], mesh, 'garden')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [-0.8, 0, -2], [0, 0, 0], [0.15, 0.15, 0.15], mesh, 'small_tree')
    },
  );


  // atap with texture
  let atap1 = OM.makeAtap(new THREE.Vector3(-1,1,0), Math.PI/2, new THREE.Vector3(8/24, 8/24, 8/24));
  scene.add(atap1);
  let atap2 = OM.makeAtap(new THREE.Vector3(-0.77,1,1.55), Math.PI/2, new THREE.Vector3(8/24, 8/24, 8/24));
  atap2.rotateY(Math.PI/2);
  scene.add(atap2);
  let atap3 = OM.makeAtap(new THREE.Vector3(3.02,1.01,0), Math.PI/2, new THREE.Vector3(8/24, 8/24, 8/24));
  scene.add(atap3);

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [-3, 0, 0], [0, 1.57, 0], [0.15, 0.15, 0.15], mesh, 'small_tree')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [-3, 0, -0.9], [0, 1.57, 0], [0.15, 0.15, 0.15], mesh, 'small_tree')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [-3, 0, 0.9], [0, 1.57, 0], [0.15, 0.15, 0.15], mesh, 'small_tree')
    },
  );

  gltfLoader.load('models/vehicles/vespa.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [3.1, 0.06, 0], [0, 1.57, 0], [0.02, 0.02, 0.02], mesh)
    },
  );

  gltfLoader.load('models/vehicles/vespa.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [3.1, 0.06, 0.2], [0, 1.57, 0], [0.02, 0.02, 0.02], mesh)
    },
  );

  gltfLoader.load('models/vehicles/vespa.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [3.1, 0.06, 0.4], [0, 1.57, 0], [0.02, 0.02, 0.02], mesh)
    },
  );

  fbxLoader.load('models/vehicles/honda/source/motodraft.fbx',
    function (object) {
      handle_load_fbx(object, [3.1, 0.06, -0.2], [0, -3.14, 0], [0.001, 0.001, 0.001])
    },
  );

  fbxLoader.load('models/vehicles/car.fbx',
    function (object) {
      handle_load_fbx(object, [-1.65, 0.03, 0], [0, 0, 0], [0.0007, 0.0007, 0.0007])
    },
  );

  gltfLoader.load('models/vehicles/honda_civic.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-1.65, 0, -0.4], [0, 1.9, 0], [0.02, 0.02, 0.02], mesh)
    },
  );

  gltfLoader.load('models/vehicles/toyota.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-1.72, 0, -0.8], [0, 1.57, 0], [0.08, 0.08, 0.08], mesh)
    },
  );

  fbxLoader.load('models/vehicles/car.fbx',
    function (object) {
      handle_load_fbx(object, [0.45, 0.04, 1.5], [0, 1.57, 0], [0.0007, 0.0007, 0.0007])
    },
  );

  gltfLoader.load('models/vehicles/honda_civic.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0, 0, 1.5], [0, -2.8, 0], [0.02, 0.02, 0.02], mesh)
    },
  );

  gltfLoader.load('models/properties/Pager.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [3, 0, -1.3], [0, 0, 0], [0.009, 0.009, 0.009], mesh)
    },
  );

  gltfLoader.load('models/properties/Pager.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [0.2, 0, -2.8], [0, 1.57, 0], [0.008, 0.008, 0.008], mesh)
    },
  );

  const geometry3 = new THREE.CircleGeometry( 0.05, 32 );
  const material3 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  const circle = new THREE.Mesh( geometry3, material3 );
  circle.position.set(-0.55, 0.65, 1.3);
  circle.rotation.set(0, -0.77, 0);
  circle.name = "third_floor";
  scene.add( circle );
  animatedObjects.push(circle);

  const circle2 = new THREE.Mesh( geometry3, material3 );
  circle2.position.set(-0.55, 0.4, 1.3);
  circle2.rotation.set(0, -0.77, 0);
  circle2.name = "second_floor";
  scene.add( circle2 );
  animatedObjects.push(circle2);

  const circle3 = new THREE.Mesh( geometry3, material3 );
  circle3.position.set(-0.55, 0.15, 1.3);
  circle3.rotation.set(0, -0.77, 0);
  circle3.name = "first_floor";
  scene.add( circle3 );
  animatedObjects.push(circle3);

  const circle4 = new THREE.Mesh( geometry3, material3 );
  circle4.position.set(-2, 0.6, -1.7);
  circle4.name = "canteen";
  scene.add( circle4 );
  animatedObjects.push(circle4);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const close = new THREE.Mesh( geometry3, material3 );
  close.position.set(0.6, 1.05, 1.3);
  close.rotation.set(0, -0.65, 0);
  close.visible = false;
  close.name = "close";
  scene.add(close);
  animatedObjects.push(close);

  const close2 = new THREE.Mesh( geometry3, material3 );
  close2.position.set(-2, 0.95, -1.7);
  close2.visible = false;
  close2.name = "close2";
  scene.add(close2);
  animatedObjects.push(close2);

  const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.01);
  const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xbd8661 } );
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-0.25, 0.5, 1.46);
  cube.rotation.set(0, -0.6, 0);
  cube.visible = false;
  scene.add(cube);

  const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube2.position.set(-2, 0.7, -1.7);
  cube2.visible = false;
  scene.add(cube2);

  let font = undefined;
  const text_first_floor = ["Lantai 1:", "Ruang Kelas Mahasiswa", "Plaza Supeno", "Musola", "PIKTI"];
  const text_second_floor = ["Lantai 2:", "Ruang Dosen", "Ruang TU", "Aula Handayani"];
  const text_third_floor = ["Lantai 3:", "Ruang Lab", "Sekre HMTC"];
  const text_canteen = ["Menu:", "Ayam Geprek", "Nasi Goreng", "Mie Ayam", "Soto Ayam", "Sego Njamoer", "Minuman"];
  const textVisible = [];

  function loadFont(text, position, rotation) {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (res) {
      font = res;
      createText(text, position, rotation);
    });
  }

  function createText(textArray, position, rotation) {
    let intialY = position[1];
    textVisible.splice(0, textVisible.length);
    textArray.forEach((txt) => {
      const textGeometry = new TextGeometry(txt, {
        font: font,
        size: 0.02,
        height: 0.001,
        bevelThickness: 0.01,
        bevelSize: 0.001,
        bevelEnabled: true,
      });
      textGeometry.computeBoundingBox();
      const textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );

      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(position[0], intialY, position[2]);
      text.rotation.set(rotation[0], rotation[1], rotation[2]);
      intialY -= 0.05;
      text.castShadow = true;
      textVisible.push(text);
      scene.add(text);
    });
  }

  function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function onMouseClick( event ) {
    // calculate objects intersecting the picking ray
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects(scene.children);
  
    for ( let i = 0; i < intersects.length; i++ ) {
      if (intersects[i].object.name == 'first_floor') {
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        intersects[i].object.material.color.set( 0xff0000 );
        window.location.hash = "first_floor";
        camera.position.set(-1, 0.9, 3);
        camera.lookAt(0, 0.9);
        close.visible = true;
        cube.visible = true;
        loadFont(text_first_floor, [-0.39, 0.6, 1.37], [0, -0.6, 0]);
      }
      if (intersects[i].object.name == 'second_floor') {
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        intersects[i].object.material.color.set( 0x00ff00 );
        window.location.hash = "second_floor";
        camera.position.set(-1, 0.9, 3);
        camera.lookAt(0, 0.9);
        close.visible = true;
        cube.visible = true;
        loadFont(text_second_floor, [-0.39, 0.6, 1.37], [0, -0.6, 0]);
      }
      if (intersects[i].object.name == 'third_floor') {
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        intersects[i].object.material.color.set( 0x0000ff );
        window.location.hash = "third_floor";
        camera.position.set(-1, 0.9, 3);
        camera.lookAt(0, 0.9);
        close.visible = true;
        cube.visible = true;
        loadFont(text_third_floor, [-0.39, 0.6, 1.37], [0, -0.6, 0]);
      }
      if (intersects[i].object.name == 'canteen') {
        cube.visible = false;
        close.visible = false;
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        intersects[i].object.material.color.set( 0x00ffff );
        window.location.hash = "canteen";
        close2.visible = true;
        cube2.visible = true;
        circle4.visible = false;
        loadFont(text_canteen, [-2.1, 0.85, -1.68], [0, 0, 0]);
      }
      if (intersects[i].object.name == 'close') {
        intersects[i].object.material.color.set( 0xffff00 );
        cube.visible = false;
        close.visible = false;
        window.location.hash = "";
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        camera.position.set(0, 1, 4);
        camera.lookAt(cameraLookAt);
      }
      if (intersects[i].object.name == 'close2') {
        intersects[i].object.material.color.set( 0xffff00 );
        cube2.visible = false;
        close2.visible = false;
        circle4.visible = true;
        window.location.hash = "";
        textVisible.forEach((txt) => {
          txt.visible = false;
        });
        camera.position.set(0, 1, 4);
        camera.lookAt(cameraLookAt);
      }
    }
  }
  
  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'click', onMouseClick, false );

  let canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({ canvas: canvas});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  // container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.maxDistance = 10;
  controls.update();

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  let fogtoggler = document.getElementById('fogtoggler');
  fogtoggler.addEventListener('click', toggleFog);

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
  // console.log(event.keyCode);
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
  // console.log(event.keyCode);
}

function toggleFog(){
  // chck if toggle is active
  let toggle = document.getElementById('fogtoggler');
  if (toggle.checked) {
    scene.fog = new THREE.Fog(0xbfe3dd, 0.01, 20);
  }else{
    scene.fog = null;
  }
}

function waitReady(){
  // renderer.outputEncoding = THREE.sRGBEncoding;  
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

  // carAnimation.do_wp(scene.getObjectByName('car1'));
  // CTRL.handleUserInput(keycb, keyboard, camera, 0.1, keyboard[16], cameraLookAt, controls);
  controls.update(0.001);
  requestAnimationFrame(animate);
  animatedObjects.forEach((obj) => {
    if(!obj['original_y']){
      obj['original_y'] = obj.position.y;
    }
    let adjustment = Math.sin(time / 1000 * Math.PI)*0.02;

    obj.position.y = adjustment + obj['original_y'];
  })
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene, camera);

}