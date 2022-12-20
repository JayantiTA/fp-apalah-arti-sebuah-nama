function moveCamUp(cam, speed, special, cameraLookAt, controls) {
    cam.translateY(speed);
    if(special){
        cameraLookAt.y+=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    // controls.target = cameraLookAt;
    // controls.target.translateY(speed);
    controls.target.y += speed;
}

function moveCamDown(cam, speed, special, cameraLookAt, controls) {
    cam.translateY(-speed);

    if(special){
        cameraLookAt.y-=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    // controls.target.translateY(-speed);
    controls.target.y += -speed;
    // console.log('cam pos2', cam.position);
}

function moveCamLeft(cam, speed, special, cameraLookAt, controls) {
    cam.translateX(-speed);

    if(special){
        cameraLookAt.x-=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    controls.target.x += -speed;
    // controls.target.translateX(-speed);
    // cam.lookAt(cameraLookAt);

    // console.log('cam pos3', cam.position);
}

function moveCamRight(cam, speed, special, cameraLookAt, controls) {
    cam.translateX(speed);

    if(special){
        cameraLookAt.x+=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    controls.target.x += speed;
    // controls.target.translateX(speed);
    // cam.lookAt(cameraLookAt);
    // console.log('cam pos4', cam.position);
}

function moveCamFront(cam, speed, special, cameraLookAt, controls) {
    cam.translateZ(speed);

    if(special){
        cameraLookAt.z+=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    // controls.target = cameraLookAt;
    // cam.lookAt(cameraLookAt);
    // console.log('cam pos4', cam.position);
}

function moveCamBack(cam, speed, special, cameraLookAt, controls) {
    cam.translateZ(-speed);

    if(special){
        cameraLookAt.z-=speed;
        // console.log('cameraLookAt', cameraLookAt);
    }

    // controls.target = cameraLookAt;
    // cam.lookAt(cameraLookAt);
    // console.log('cam pos4', cam.position);
}

function handleUserInput(keycb, keyboard_state, ... args){

    for (const [ascii_code, func] of Object.entries(keycb)) {
        
        if(keyboard_state[ascii_code]){
            let cam = args[0];
            let speed = args[1];
            let special = args[2];
            let cameraLookAt = args[3];
            let controls = args[4];
            func(cam, speed, special, cameraLookAt, controls);
        }
    }

}

export {moveCamUp, moveCamDown, moveCamLeft, moveCamRight, handleUserInput, moveCamFront, moveCamBack};