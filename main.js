import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CTRL from './assets/js/control.js';
import * as AN from './assets/js/animation.js';


let camera, cameraLookAt, scene, renderer, controls, mesh;
let allready = 0, objNames = [], keyboard = {};
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
  animate();
};

function init() {
  console.log('init');

  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(10, 5, 1000);
  cameraLookAt = new THREE.Vector3(0, 0, 0);
  camera.lookAt(cameraLookAt);

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfe3dd );

  const geometry = new THREE.PlaneGeometry( 7, 5 );
  const material = new THREE.MeshBasicMaterial( {color: 0xB2A290, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.set(1.57, 0, 0);
  plane.position.set(0, 0, 0);
  scene.add( plane );

  const geometry2 = new THREE.BoxGeometry( 2.62, 0.05, 0.7 );
  const material2 = new THREE.MeshBasicMaterial( {color: 0xC7C3C1, side: THREE.DoubleSide} );
  const plane2 = new THREE.Mesh( geometry2, material2 );
  plane2.position.set(0.6, 0, -0.06);
  scene.add( plane2 );

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
    console.log(fbx)
    for (let i = 0; i < 20; i++) {
      fbx.position.set(translation[0] + (i+1) * 0.2, translation[1], translation[2]);
      fbx.scale.set(scale[0], scale[1], scale[2]);    
      fbx.rotation.set(rotation[0], rotation[1], rotation[2]);
      fbx.castShadow = true;
      fbx.receiveShadow = true;
      fbx.name = name;
      scene.add(fbx);
      console.log(fbx)
      console.log(scene)
      
    }
  }

  // Instantiate an fbx loader
  const fbxLoader = new FBXLoader(manager);
  // handle_load_fences(10, [-2.5, 0, 2.2], [0.2, 0, 0]);
  fbxLoader.load('models/properties/wall/models/wall.fbx',
    function (object) {
      objNames.push('car1');
      handle_load_fbx(object, [-2.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02], 'car1')  ;
    }
  );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-2.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-2.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-1.9, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-1.7, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-1.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-1.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-1.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-0.9, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-0.7, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-0.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-0.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [-0.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [0.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [0.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [0.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [0.7, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [0.9, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [1.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [1.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [1.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [1.7, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [1.9, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [2.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [2.3, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [2.5, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [2.7, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [2.9, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );
  // fbxLoader.load('models/properties/wall/models/wall.fbx',
  //   function (object) {
  //     handle_load_fbx(object, [3.1, 0, 2.2], [0, 0, 0], [0.02, 0.02, 0.02])
  //   }
  // );

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

  gltfLoader.load('models/properties/stone_fence.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [10, 0, 0], [0, 1, 0], [0.5, 0.5, 0.5], mesh)
    },
  );

  gltfLoader.load('models/properties/fountain.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.6, 0.08, 1.2], [0, 0, 0], [0.1, 0.1, 0.1], mesh)
    },
  );

  // gltfLoader.load('models/trees/simple_tree.glb',
  //   function (gltf) {
  //     handle_load_gltf(gltf, -1, [-2.6, 0.08, 1.2], [0, 0, 0], [0.1, 0.1, 0.1], mesh)
  //   },
  // );

  gltfLoader.load('models/properties/PapanTCgerbang.gltf',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-3.1, 0, 1.2], [0, 0.3, 0], [0.007, 0.007, 0.007], mesh)
    },
  );

  gltfLoader.load('models/trees/simple_tree.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-1.7, 0.16, 0], [0, 1.57, 0], [0.2, 0.2, 0.2], mesh)
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
      handle_load_gltf(gltf, -1, [-2.35, 0, 0.1], [0, 0, 0], [0.01, 0.01, 0.01], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.2], [0, 0, 0], [0.01, 0.01, 0.01], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.5], [0, 0, 0], [0.01, 0.01, 0.01], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      handle_load_gltf(gltf, -1, [-2.35, 0, -0.8], [0, 0, 0], [0.01, 0.01, 0.01], mesh)
    },
  );
  gltfLoader.load('models/properties/garden.glb',
    function (gltf) {
      objNames.push('garden');
      handle_load_gltf(gltf, -1, [-2.35, 0, -1.1], [0, 0, 0], [0.01, 0.01, 0.01], mesh, 'garden')
    },
  );

  gltfLoader.load('models/trees/small_trees.glb',
    function (gltf) {
      objNames.push('small_tree');
      handle_load_gltf(gltf, -1, [-0.8, 0, -2], [0, 0, 0], [0.15, 0.15, 0.15], mesh, 'small_tree')
    },
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.maxDistance = 5;
  controls.update();

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

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

function animate(time) {

  // carAnimation.do_wp(scene.getObjectByName('car1'));
  // CTRL.handleUserInput(keycb, keyboard, camera, 0.1, keyboard[16], cameraLookAt, controls);
  // controls.update();

  requestAnimationFrame(animate);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.render(scene, camera);

}