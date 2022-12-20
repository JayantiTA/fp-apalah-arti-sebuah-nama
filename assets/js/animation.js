import * as THREE from "three";

function calculateVel(current, target, speed){
    let diff = target - current;
    if (diff > speed) {
        return speed;
    }
    else if(diff < -speed){
        return -speed;
    }
    else{   
        return diff;
    }
}

function getBoundingBox(mesh) {
    var geometry = mesh.children[0].geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter( center );
    // mesh.localToWorld( center );
    // return center;
    return geometry.boundingBox;
}


function smoothTransform(the_mesh, target_pos, speed, attr_name) {
    let map_name = [
        'x', 'y', 'z'
    ];

    // loop tiap target pos x y z
    for(let i=0; i<3; i++) {
        let secondaryName = map_name[i];
        let speedFinal = calculateVel(the_mesh[attr_name][secondaryName], target_pos[i], speed);
        if(secondaryName == 'z'){
            speedFinal *= Math.abs(-Math.sin(Math.PI - the_mesh.rotation.y));
        }
        else if(secondaryName == 'x'){
            speedFinal *= Math.abs(Math.cos(the_mesh.rotation.y));
        }
        else{
            speedFinal = 0;
        }
        the_mesh[attr_name][secondaryName] += speedFinal;
    }
}

function rotateYBasedSelf(the_mesh, target_pos, speed){
    let bbox = getBoundingBox(the_mesh);
    let lx = bbox['max'].x - bbox['min'].x;
    let r = lx/2;

    let increment = calculateVel(the_mesh.rotation.y, target_pos[1], speed);

    the_mesh.rotation.y += increment;

    let fix_x = r - r * Math.cos(increment);
    let fix_z = -r * Math.sin(increment);

    the_mesh.translateZ(fix_z/2);
    the_mesh.translateX(fix_x/2);
}

// calculate distance in 3d
function distance3d(x1, y1, z1, x2, y2, z2){
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2) + Math.pow(z1-z2, 2));
}


class Animate{
    constructor(wp_list, speedPos, speedRot){
        this.id_wp = 0;
        this.wp_list = wp_list;
        this.speedRot = speedRot;
        this.speedPos = speedPos;
        this.increment = 0;
    }


    do_wp(the_mesh){
        let bbox = getBoundingBox(the_mesh);
        let lx = bbox['max'].x - bbox['min'].x;
        let r = lx/2;
        let ly = bbox['max'].y - bbox['min'].y;
        let lz = bbox['max'].z - bbox['min'].z;

        let target_pos = this.wp_list[this.id_wp];
        if(this.id_wp == -1){
            return;
        }
        // console.log('target_pos', target_pos, this.id_wp, this.wp_list);
        let speed = target_pos[3] == 'rotation' ? this.speedRot : this.speedPos;

        if(target_pos[3] == 'rotation'){
            rotateYBasedSelf(the_mesh, target_pos, speed);

        }else{
            smoothTransform(the_mesh, target_pos, speed, target_pos[3]);
        }
        
        if (distance3d(the_mesh[target_pos[3]].x, the_mesh[target_pos[3]].y, the_mesh[target_pos[3]].z, target_pos[0], target_pos[1], target_pos[2]) < 0.1){
            
            console.log('target reached', target_pos[3], target_pos[1] - the_mesh[target_pos[3]].y);
            this.id_wp += 1;
            console.log('id_wp', this.id_wp);
            if (this.id_wp >= this.wp_list.length) {
                this.id_wp = -1;
                return;
            }


            // kalau habis ngelakuin posisi atur rotasi for next thing
            if(target_pos[3] == 'position'){
                let new_target_pos = this.wp_list[this.id_wp];
                let target_angle = Math.atan2(the_mesh.position.z - new_target_pos[2], new_target_pos[0] - the_mesh.position.x);  
                this.wp_list.splice(this.id_wp, 0, [0, target_angle, 0, 'rotation']);

            }
        }
    }

}


export { Animate };