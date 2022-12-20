import * as THREE from "three";
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function makeAtap(position, angle, scale) {
    let kiri = new THREE.BoxGeometry( 7, 1, 0 );
    let kanan = new THREE.BoxGeometry( 7, 1 ,0);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/texture/atap2.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        color: '#7c5f63',
    });
    

    kanan = new THREE.Mesh(kanan, material);
    kanan.position.set(position.x, position.y, position.z);
    kanan.rotateY(Math.PI/2);
    kanan.translateY(-7/20);
    kanan.rotateX(Math.PI/3);
    kanan.translateZ(-63/192);
    kanan.translateX(0.875);

    kiri = new THREE.Mesh(kiri, material);
    kiri.position.set(position.x, position.y, position.z);
    kiri.rotateY(Math.PI/2);
    kiri.translateY(-1/4.75);
    kiri.rotateX(-Math.PI/3);
    kiri.translateZ(7/24);
    kiri.translateX(0.875);
    

    // geser semua ke kiri
    kiri.translateY(0.25);//ok
    kiri.translateZ(-0.25);
    
    kanan.translateY(-0.25);//ok
    kanan.translateZ(-1/6);

    // scale
    kiri.scale.set(scale.x, scale.y, scale.z);
    kanan.scale.set(scale.x, scale.y, scale.z);



    let atap = new THREE.Group();
    atap.add(kiri);
    atap.add(kanan);

    return atap;
}

export { makeAtap }