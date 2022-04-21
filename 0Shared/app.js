// IMPORTS
import * as THREE from 'three';
// import * as THREE from "https://unpkg.com/three@0.139.2/build/three.module.js";
import { PLYLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/PLYLoader.js';



// FETCHING THE SHADERS
// Fetching the phong shaders
let phongVertexShader = await fetch('./phongVertexShader.glsl').then(response => response.text());
let phongFragmentShader = await fetch('./phongFragmentShader.glsl').then(response => response.text());

// Fetching the gouraud shaders
let gouraudVertexShader = await fetch('./gouraudVertexShader.glsl').then(response => response.text());
let gouraudFragmentShader = await fetch('./gouraudFragmentShader.glsl').then(response => response.text());



// SETTING UP THE RENDERER
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



// SETTING UP THE CAMERA
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set( 0, 1.8, 3);
camera.lookAt( 0, 0, 0 );



// CREATING THE SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x2b2b2b );



// STATE VARIABLESs
const BASIC = 0;
const ILLUMINATOR_MODE = 1;
const TRANSFORMATION_MODE = 2;


let state = {
    models : [],
    config : [],
    phongMaterial : [],
    gouraudMaterial : [],
    currentMaterial : [],
    boundingBoxes : [],
    lightObjects : [],
    selected : -1,
    mode : BASIC
}


// ADDING MODELS AND LIGHTS TO THE SCENE

// Loading the teapot geometry from the file
const loader = new PLYLoader();
let teapotGeometry;
let isLoaded = new Promise(function(resolve, reject) {
    loader.load( './teapot.ply', function ( geometry ) {
        geometry.computeVertexNormals();
        teapotGeometry = geometry;
        resolve("Teapot geometry set");
    });
});

// After this point in code, the code can safely assume that the teapotGeometry variable is set
let res = await isLoaded;


// The lighting and material configurations for teapot
let teapotConfig = {
    lightPos : new THREE.Vector3(2, 2, 2),
    diffuseColor : new THREE.Vector4(0.3,0.4,0.9,1.0),
    kDiffuse : 0.4,

    ambientColor : new THREE.Vector4(0.3,0.4,0.9,1.0),
    kAmbient : 0.2,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.7,
    alpha : 100,

    a : 0.0,
    b : 0.0,
    c : 0.5
};

// The lighting and material configurations for sphere
let sphereConfig = {
    lightPos : new THREE.Vector3(0, 2, 2),
    diffuseColor : new THREE.Vector4(0.8,0.3,0.3,1.0),
    // diffuseColor : new THREE.Vector4(0,1,0,1.0),
    kDiffuse : 0.3,

    ambientColor : new THREE.Vector4(0.8,0.3,0.3,1.0),
    kAmbient : 0.2,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.3,
    alpha : 100,

    a : 0.0,
    b : 0.0,
    c : 4
};

// The phong material for teapot mesh
let teapotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        "pointLights" : {
            value : [
                {
                    u_lightPos: teapotConfig.lightPos,
                    u_lightTarget: teapotConfig.lightTarget,
                    u_diffuseColor: teapotConfig.diffuseColor,
                    u_specularColor: teapotConfig.specularColor,
                    u_a : teapotConfig.a,
                    u_b : teapotConfig.b,
                    u_c : teapotConfig.c
                },

                {
                    u_lightPos: sphereConfig.lightPos,
                    u_lightTarget: sphereConfig.lightTarget,
                    u_diffuseColor: sphereConfig.diffuseColor,
                    u_specularColor: sphereConfig.specularColor,
                    u_a : sphereConfig.a,
                    u_b : sphereConfig.b,
                    u_c : sphereConfig.c
                }
            ]
        },

        'u_cameraPos' : {value : new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        )},

        'u_kDiffuse' : {value: teapotConfig.kDiffuse},
        'u_kAmbient' : {value: teapotConfig.kAmbient},
        'u_kSpecular' : {value: teapotConfig.kSpecular},
        'u_alpha' : {value: teapotConfig.alpha},
        'u_ambientColor' : {value: teapotConfig.ambientColor}
    },
    
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
});

teapotMaterial.side = THREE.DoubleSide;
state.config.push(teapotConfig);
state.phongMaterial.push(teapotMaterial);

// The goraud Material for teapot mesh
teapotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        "pointLights" : {
            value : [
                {
                    u_lightPos: teapotConfig.lightPos,
                    u_lightTarget: teapotConfig.lightTarget,
                    u_diffuseColor: teapotConfig.diffuseColor,
                    u_specularColor: teapotConfig.specularColor,
                    u_a : teapotConfig.a,
                    u_b : teapotConfig.b,
                    u_c : teapotConfig.c
                },

                {
                    u_lightPos: sphereConfig.lightPos,
                    u_lightTarget: sphereConfig.lightTarget,
                    u_diffuseColor: sphereConfig.diffuseColor,
                    u_specularColor: sphereConfig.specularColor,
                    u_a : sphereConfig.a,
                    u_b : sphereConfig.b,
                    u_c : sphereConfig.c
                }
            ]
        },

        'u_cameraPos' : {value : new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        )},

        'u_kDiffuse' : {value: teapotConfig.kDiffuse},
        'u_kAmbient' : {value: teapotConfig.kAmbient},
        'u_kSpecular' : {value: teapotConfig.kSpecular},
        'u_alpha' : {value: teapotConfig.alpha},
        'u_ambientColor' : {value: teapotConfig.ambientColor}
    },

	vertexShader: gouraudVertexShader,
	fragmentShader: gouraudFragmentShader
} );

teapotMaterial.side = THREE.DoubleSide;
state.gouraudMaterial.push(teapotMaterial);

// Default is gouraud
const teapotMesh = new THREE.Mesh( teapotGeometry, teapotMaterial );

teapotMesh.position.x = -0.2;
teapotMesh.rotation.x = - Math.PI / 2;
teapotMesh.rotation.z = - Math.PI / 6;
teapotMesh.scale.multiplyScalar(0.2);

scene.add(teapotMesh);
state.models.push(teapotMesh);
state.currentMaterial.push(0);

// Bouding box for teapot
let teapotBox = new THREE.Box3().setFromObject(teapotMesh);
var szvec = new THREE.Vector3();
teapotBox.getSize(szvec);
szvec.x *= 0.25;
szvec.y *= 0.25;
szvec.z *= 0.25;
state.boundingBoxes.push(teapotBox.expandByVector(szvec));

// Debugging point for light
let teapotLightGeometry = new THREE.SphereGeometry(0.02, 40, 40);
let teapotLightMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
let teapotLightMesh = new THREE.Mesh( teapotLightGeometry, teapotLightMaterial );
teapotLightMesh.position.x = state.config[0].lightPos.x;
teapotLightMesh.position.y = state.config[0].lightPos.y;
teapotLightMesh.position.z = state.config[0].lightPos.z;
scene.add(teapotLightMesh);
state.lightObjects.push(teapotLightMesh);









// SPHERE
// Geometry of the sphere
let sphereGeometry = new THREE.SphereGeometry(0.2, 40, 40);

// Phong material for sphere
let sphereMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        "pointLights" : {
            value : [
                {
                    u_lightPos: teapotConfig.lightPos,
                    u_lightTarget: teapotConfig.lightTarget,
                    u_diffuseColor: teapotConfig.diffuseColor,
                    u_specularColor: teapotConfig.specularColor,
                    u_a : teapotConfig.a,
                    u_b : teapotConfig.b,
                    u_c : teapotConfig.c
                },

                {
                    u_lightPos: sphereConfig.lightPos,
                    u_lightTarget: sphereConfig.lightTarget,
                    u_diffuseColor: sphereConfig.diffuseColor,
                    u_specularColor: sphereConfig.specularColor,
                    u_a : sphereConfig.a,
                    u_b : sphereConfig.b,
                    u_c : sphereConfig.c
                }
            ]
        },

        'u_cameraPos' : {value : new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        )},

        'u_kDiffuse' : {value : sphereConfig.kDiffuse},
        'u_kAmbient' : {value : sphereConfig.kAmbient},
        'u_kSpecular' : {value : sphereConfig.kSpecular},
        'u_alpha' : {value : sphereConfig.alpha},
        'u_ambientColor' : {value: sphereConfig.ambientColor}
    },
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
} );

sphereMaterial.side = THREE.DoubleSide
state.config.push(sphereConfig);
state.phongMaterial.push(sphereMaterial);

// Gouraud material for sphere
sphereMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        "pointLights" : {
            value : [
                {
                    u_lightPos: teapotConfig.lightPos,
                    u_lightTarget: teapotConfig.lightTarget,
                    u_diffuseColor: teapotConfig.diffuseColor,
                    u_specularColor: teapotConfig.specularColor,
                    u_a : teapotConfig.a,
                    u_b : teapotConfig.b,
                    u_c : teapotConfig.c
                },

                {
                    u_lightPos: sphereConfig.lightPos,
                    u_lightTarget: sphereConfig.lightTarget,
                    u_diffuseColor: sphereConfig.diffuseColor,
                    u_specularColor: sphereConfig.specularColor,
                    u_a : sphereConfig.a,
                    u_b : sphereConfig.b,
                    u_c : sphereConfig.c
                }
            ]
        },

        'u_cameraPos' : {value : new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        )},

        'u_kDiffuse' : {value : sphereConfig.kDiffuse},
        'u_kAmbient' : {value : sphereConfig.kAmbient},
        'u_kSpecular' : {value : sphereConfig.kSpecular},
        'u_alpha' : {value : sphereConfig.alpha},
        'u_ambientColor' : {value: sphereConfig.ambientColor}
    },
	vertexShader: gouraudVertexShader,
	fragmentShader: gouraudFragmentShader
} );

sphereMaterial.side = THREE.DoubleSide;
state.gouraudMaterial.push(sphereMaterial);

// Default is gouraud
let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );

sphereMesh.position.y += 0.2;
sphereMesh.position.x += 0.5;
sphereMesh.position.z += 0.8;
scene.add(sphereMesh);
state.models.push(sphereMesh);
state.currentMaterial.push(0);

// Bounding box for sphere
let sphereBox = new THREE.Box3().setFromObject(sphereMesh);
var szvec = new THREE.Vector3();
sphereBox.getSize(szvec);
szvec.x *= 0.25;
szvec.y *= 0.25;
szvec.z *= 0.25;
state.boundingBoxes.push(sphereBox.expandByVector(szvec));

// Debugging points for light
let sphereLightGeometry = new THREE.SphereGeometry(0.02, 40, 40);
let sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
let sphereLightMesh = new THREE.Mesh( sphereLightGeometry, sphereLightMaterial );
sphereLightMesh.position.x = state.config[1].lightPos.x;
sphereLightMesh.position.y = state.config[1].lightPos.y;
sphereLightMesh.position.z = state.config[1].lightPos.z;
scene.add(sphereLightMesh);
state.lightObjects.push(sphereLightMesh);



// FUNCTIONS FOR MOVING LIGHTS
function updateLightPos(x, y, z) {
    if(state.selected == -1) {
        alert("Please select an object first.")
    }
    else {
        state.config[state.selected].lightPos.x = x;
        state.config[state.selected].lightPos.y = y;
        state.config[state.selected].lightPos.z = z;

        state.lightObjects[state.selected].position.x = state.config[state.selected].lightPos.x;
        state.lightObjects[state.selected].position.y = state.config[state.selected].lightPos.y;
        state.lightObjects[state.selected].position.z = state.config[state.selected].lightPos.z;

        const toAff = [
            state.models[0].material, 
            state.phongMaterial[0],
            state.gouraudMaterial[0],
            state.models[1].material, 
            state.phongMaterial[1],
            state.gouraudMaterial[1]
        ];

        toAff.forEach(
            function(cv) {
                (cv.uniforms.pointLights.value)[state.selected].u_lightPos.x = state.config[state.selected].lightPos.x;

                (cv.uniforms.pointLights.value)[state.selected].u_lightPos.y = state.config[state.selected].lightPos.y;

                (cv.uniforms.pointLights.value)[state.selected].u_lightPos.z = state.config[state.selected].lightPos.z;
            }
        )
    }
}

function checkLight(box, light){
    if(!box.containsPoint(light)){
        var center = new THREE.Vector3();
        box.getCenter(center);
        updateLightPos(center.x, center.y, center.z);
    }
}

function moveLight(dim, offs) {
    if(state.selected == -1) {
        alert("Please select an object first.")
    }
    else {
        let orx =  state.config[state.selected].lightPos.x;
        let ory =  state.config[state.selected].lightPos.y;
        let orz =  state.config[state.selected].lightPos.z;
        if(dim == 'x') {
            let pt = new THREE.Vector3(orx+offs, ory, orz);
            if(state.boundingBoxes[state.selected].containsPoint(pt)) {
                updateLightPos(orx+offs, ory, orz);
            };
        }
        else if(dim == 'y') {
            let pt = new THREE.Vector3(orx, ory+offs, orz);
            if(state.boundingBoxes[state.selected].containsPoint(pt)) {
                updateLightPos(orx, ory+offs, orz);
            }
        }
        else if(dim == 'z') {
            let pt = new THREE.Vector3(orx, ory, orz+offs);
            if(state.boundingBoxes[state.selected].containsPoint(pt)) {
                updateLightPos(orx, ory, orz+offs);
            }
        }
    }
}

// Setting up initial position of lights
state.selected = 0;
updateLightPos(state.boundingBoxes[0].min.x+0.4, state.boundingBoxes[0].max.y-0.2, state.boundingBoxes[0].max.z-0.2);
state.selected = 1;
updateLightPos(state.boundingBoxes[1].max.x-0.1, state.boundingBoxes[1].max.y-0.1, state.boundingBoxes[1].max.z-0.1);
state.selected = -1;

// var quaternion = new THREE.Quaternion();
// quaternion.setFromAxisAngle( new THREE.Vector3(0, 1, 0), Math.PI / 100 );

function getVector(x, y, r){
    return new THREE.Vector3(x, y, Math.sqrt(r*r - x*x - y*y));
}

function getQuat(v1, v2){
    // const quaternion = new THREE.Quaternion();
    // quaternion.setFromAxisAngle( new THREE.Vector3(v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]), Math.PI);

    // return quaternion

    var angle = v2.angleTo(v1);
    var n = v1.cross(v2);

    const quaternion = new THREE.Quaternion();
    // console.log("angle: ", (angle*180) / Math.PI, n.normalize());
    // console.log(n.normalize().multiplyScalar(Math.sin(angle/2)), Math.cos(angle/2));
    quaternion.setFromAxisAngle( n.normalize(), angle/3);
    // quaternion.setFromAxisAngle(n, Math.sqrt(v1.lengthSq() + v2.lengthSq()) + v1.dot(v2))

    return quaternion
}



// animate();
// if(teapotMesh){
//     teapotMesh.quaternion.premultiply(quaternion);
//     teapotMesh.updateMatrix();
// }
// renderer.render( scene, camera );




// THE KEYPRESS EVENTS
document.addEventListener('keydown', function(event) {
    if(event.code == 'KeyS') {
        if(state.selected == -1) {
            alert("Please select an object first.")
        }
        else {
            state.currentMaterial[state.selected] = (state.currentMaterial[state.selected] + 1)%2;
            if(state.currentMaterial[state.selected] == 1) {
                state.models[state.selected].material = state.phongMaterial[state.selected];
            }
            else if(state.currentMaterial[state.selected] == 0) {
                state.models[state.selected].material = state.gouraudMaterial[state.selected];
            }
        }
    }
    else if(event.code == 'Digit3') {
        state.selected = 0;
    }
    else if(event.code == 'Digit4') {
        state.selected = 1;
    }
    else if(event.code == 'Digit5') {
        state.selected = -1;
    }
    else if(event.code == 'KeyP') {
        console.log(state);
    }
    else if(event.code == 'KeyL') {
        
        if(state.mode == ILLUMINATOR_MODE) {
            state.mode = BASIC;
        }
        else {
            state.mode = ILLUMINATOR_MODE;
        }
    } 
    else if((event.code == 'Digit0' || event.code == 'Digit1') && state.mode == ILLUMINATOR_MODE) {
        if(state.selected == -1) {
            alert("Please select an object first.")
        }
        else {
            if(event.code == 'Digit0') {

                const toAff = [
                    state.models[0].material, 
                    state.phongMaterial[0],
                    state.gouraudMaterial[0],
                    state.models[1].material, 
                    state.phongMaterial[1],
                    state.gouraudMaterial[1]
                ];

                toAff.forEach(
                    function(cv) {
                        // (cv.uniforms.pointLights.value)[state.selected].u_kAmbient = 0.0;

                        // (cv.uniforms.pointLights.value)[state.selected].u_kDiffuse = 0.0;
                        (cv.uniforms.pointLights.value)[state.selected].u_diffuseColor = new THREE.Vector4(0.0, 0.0, 0.0, 0.0);

                        // (cv.uniforms.pointLights.value)[state.selected].u_kSpecular = 0.0;
                        (cv.uniforms.pointLights.value)[state.selected].u_specularColor = new THREE.Vector4(0.0, 0.0, 0.0, 0.0);
                        
                    }
                )
            }
            else {
                const toAff = [
                    state.models[0].material, 
                    state.phongMaterial[0],
                    state.gouraudMaterial[0],
                    state.models[1].material, 
                    state.phongMaterial[1],
                    state.gouraudMaterial[1]
                ];

                toAff.forEach(
                    function(cv) {
                        // (cv.uniforms.pointLights.value)[state.selected].u_kAmbient = state.config[state.selected].kAmbient;

                        // (cv.uniforms.pointLights.value)[state.selected].u_kDiffuse = state.config[state.selected].kDiffuse;
                        (cv.uniforms.pointLights.value)[state.selected].u_diffuseColor = state.config[state.selected].diffuseColor;
    
                        // (cv.uniforms.pointLights.value)[state.selected].u_kSpecular = state.config[state.selected].kSpecular;
                        (cv.uniforms.pointLights.value)[state.selected].u_specularColor = state.config[state.selected].specularColor;
                    }
                )
            }
        }
    } 

    else if(event.code == 'KeyU' && state.mode == ILLUMINATOR_MODE) {
        moveLight('y', +0.02);
    }
    else if(event.code == 'KeyD' && state.mode == ILLUMINATOR_MODE) {
        moveLight('y', -0.02);
    }
    else if(event.code == 'ArrowUp' && state.mode == ILLUMINATOR_MODE) {
        moveLight('z', -0.02);
    }
    else if(event.code == 'ArrowDown' && state.mode == ILLUMINATOR_MODE) {
        moveLight('z', +0.02);
    }
    else if(event.code == 'ArrowLeft' && state.mode == ILLUMINATOR_MODE) {
        moveLight('x', -0.02);
    }
    else if(event.code == 'ArrowRight' && state.mode == ILLUMINATOR_MODE) {
        moveLight('x', +0.02);
    }

    else if(event.code == 'KeyM') {
        
        if(state.mode == TRANSFORMATION_MODE) {
            state.mode = BASIC;
        }
        else {
            state.mode = TRANSFORMATION_MODE;
        }
    }
    else if(event.code == 'KeyU' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.y += 0.01;            
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            // state.config[state.selected].lightPos.x = x;
            // state.config[state.selected].lightPos.y = y;
            // state.config[state.selected].lightPos.z = z;
            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'KeyD' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.y -= 0.01;
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'ArrowUp' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.z -= 0.01;
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'ArrowDown' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.z += 0.01;
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'ArrowLeft' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.x -= 0.01;
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'ArrowRight' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            state.models[state.selected].position.x += 0.01;
            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'Equal' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            var center = new THREE.Vector3();
            // state.boundingBoxes[state.selected].getCenter(center);

            // state.models[state.selected].position.x -= center.x;
            // state.models[state.selected].position.y -= center.y;
            // state.models[state.selected].position.z -= center.z;


            state.models[state.selected].scale.multiplyScalar(1.02);

            // state.models[state.selected].position.x += center.x;
            // state.models[state.selected].position.y += center.y;
            // state.models[state.selected].position.z += center.z;

            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    else if(event.code == 'Minus' && state.mode == TRANSFORMATION_MODE) {
        if(state.selected == -1){
            alert("Please select an object first.")
        }
        else{
            // var center = new THREE.Vector3();
            // state.boundingBoxes[state.selected].getCenter(center);

            // state.models[state.selected].position.x -= center.x;
            // state.models[state.selected].position.y -= center.y;
            // state.models[state.selected].position.z -= center.z;


            state.models[state.selected].scale.multiplyScalar(0.98);

            // state.models[state.selected].position.x += center.x;
            // state.models[state.selected].position.y += center.y;
            // state.models[state.selected].position.z += center.z;

            let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
            var szvec = new THREE.Vector3();
            stateBox.getSize(szvec);
            szvec.x *= 0.25;
            szvec.y *= 0.25;
            szvec.z *= 0.25;
            state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

            checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
        }
    }
    // avantika's to do
    // check if light is in the bounding box. if it is, update the position of the light
    // dont let object go outside the canvas
    // if no object is selected, and we still drag then we get too many alerts.
    var moveObject = false;
    var prevVector = new THREE.Vector3(0, 0, 0);
    function handleMouseDown(e) {
        if(state.mode == TRANSFORMATION_MODE) {
            var mousePos = getMousePosition(e);
            prevVector = getVector(mousePos[0], mousePos[1], Math.sqrt(2));
            moveObject = true;
            // console.log("send help");
        }
        
    }
    
    function handleMouseUp(e) {
        var mousePos = getMousePosition(e);
        moveObject = false;
        //if your flag is true, then move the object to here and reset flag
    }
    function handleMouseMove(e) {
        // var mousePos = getMousePosition(e);

        if(state.mode == TRANSFORMATION_MODE){
            var mousePos = getMousePosition(e);
            // console.log()
            var current = getVector(mousePos[0], mousePos[1], Math.sqrt(2));

            // if(state.selected == -1){
            //     alert("Please select an object")
            // }
            // else 
            if(moveObject){
                if(state.selected == -1){
                    alert("Please select an object first.")
                }
                else{
                    var center = new THREE.Vector3();
                    // console.log(state.boundingBoxes[state.selected].isBox3);
                    // var center = 
                    state.boundingBoxes[state.selected].getCenter(center);
                    // console.log(state.boundingBoxes[state.selected].getCenter());
                    // teapotMesh.rotation.x += 0.01;
                    // teapotMesh.rotation.y += 0.01;
                    // teapotMesh.rotation.z += 0.01;    
                    // teapotMesh.position.x += 0.001;
                    // console.log(mousePos);
                    // console.log(prevVector, current);
                    // console.log(getQuat(prevVector, current));

                    state.models[state.selected].position.x -= center.x;
                    state.models[state.selected].position.y -= center.y;
                    state.models[state.selected].position.z -= center.z;
                    state.models[state.selected].quaternion.premultiply(getQuat(prevVector, current));
                    state.models[state.selected].updateMatrix();
                    prevVector = current;
                    renderer.render( scene, camera );

                    state.models[state.selected].position.x += center.x;
                    state.models[state.selected].position.y += center.y;
                    state.models[state.selected].position.z += center.z;
                    let stateBox = new THREE.Box3().setFromObject(state.models[state.selected]);
                    var szvec = new THREE.Vector3();
                    stateBox.getSize(szvec);
                    szvec.x *= 0.25;
                    szvec.y *= 0.25;
                    szvec.z *= 0.25;
                    state.boundingBoxes[state.selected] = stateBox.expandByVector(szvec);

                    checkLight(state.boundingBoxes[state.selected], state.config[state.selected].lightPos);
                    // state.boundingBoxes =v
            }
            }

            // requestAnimationFrame(animate);
            
            
        }
        //Handle if you need smooth drag experience
    }
    function getMousePosition(e) {
       // var boundary = canvas.getBoundingClientRect();
        // (e.clientX, e.clientY)  => Mouse coordinates wrt whole browser
        //  (boundary.left, boundary.top) => Canvas starting coordinate
        // console.log( e.clientX, window.innerWidth, e.clientY, window.innerHeight);
        return [( e.clientX / window.innerWidth ) * 2 - 1, -( e.clientY / window.innerHeight ) * 2 + 1];
    }
    
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);

    console.log(event.code);
    console.log(state.mode);
});

function onWindowResize() {

    const height = window.innerHeight;
    const width = window.innerWidth;
    
    renderer.setSize(width, height);
}



// When window resizes, call your function!
// Maybe change param to false.. Not sure what you want.


// ----------------------------------------------------

function animate() {
    // teapotMesh.rotation.x += 0.01;
    // teapotMesh.rotation.y += 0.01;
    // teapotMesh.rotation.z += 0.01;    
    // teapotMesh.position.x += 0.001;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

window.onresize = () => onWindowResize(true);
animate();