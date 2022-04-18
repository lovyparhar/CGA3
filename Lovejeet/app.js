// ASSIGNMENT 3 IMPLEMENTATION
import * as THREE from 'three';
import { PLYLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/PLYLoader.js';

// Fetching the phong shaders
let phongVertexShader = await fetch('./phongVertexShader.glsl').then(response => response.text());
let phongFragmentShader = await fetch('./phongFragmentShader.glsl').then(response => response.text());

// Fetching the gouraud shaders
let gouraudVertexShader = await fetch('./gouraudVertexShader.glsl').then(response => response.text());
let gouraudFragmentShader = await fetch('./gouraudFragmentShader.glsl').then(response => response.text());


// Setting up the renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Setting up the camera
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set( 2, 2, 2);
camera.lookAt( 0, 0, 0 );


// Creating the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x2b2b2b );





// ALL GLOBAL VARIABLES HERE

// Making and saving state.models and materials

const BASIC = 0;
const ILLUMINATOR_MODE = 1;

let state = {
    models : [],
    config : [],
    phongMaterial : [],
    gouraudMaterial : [],
    currentMaterial : [],
    selected : -1,
    mode : BASIC
}







// TEAPOT
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

// Phong Material
let teapotConfig = {
    lightPos : new THREE.Vector3(2, 2, 2),
    cameraPos : new THREE.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z,
    ),

    diffuseColor : new THREE.Vector4(0.3,0.4,0.9,1.0),
    kDiffuse : 1.0,

    ambientColor : new THREE.Vector4(0.3,0.4,0.9,1.0),
    kAmbient : 0.2,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.7,
    alpha : 100,

    a : 0.0,
    b : 0.0,
    c : 0.135
}

let teapotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        u_lightPos: {value: teapotConfig.lightPos},
        u_lightTarget: {value: teapotConfig.lightTarget},
        u_cameraPos: {value: teapotConfig.cameraPos},
        u_diffuseColor: {value: teapotConfig.diffuseColor},
        u_kDiffuse: {value: teapotConfig.kDiffuse},
        u_ambientColor: {value: teapotConfig.ambientColor},
        u_kAmbient: {value: teapotConfig.kAmbient},
        u_specularColor: {value: teapotConfig.specularColor},
        u_kSpecular: {value: teapotConfig.kSpecular},
        u_alpha: {value: teapotConfig.alpha},
        u_a : {value: teapotConfig.a},
        u_b : {value: teapotConfig.b},
        u_c : {value: teapotConfig.c}
    },
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
});

teapotMaterial.side = THREE.DoubleSide;
state.config.push(teapotConfig);
state.phongMaterial.push(teapotMaterial);

// Goraud Material
teapotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        u_lightPos: {value: teapotConfig.lightPos},
        u_lightTarget: {value: teapotConfig.lightTarget},
        u_cameraPos: {value: teapotConfig.cameraPos},
        u_diffuseColor: {value: teapotConfig.diffuseColor},
        u_kDiffuse: {value: teapotConfig.kDiffuse},
        u_ambientColor: {value: teapotConfig.ambientColor},
        u_kAmbient: {value: teapotConfig.kAmbient},
        u_specularColor: {value: teapotConfig.specularColor},
        u_kSpecular: {value: teapotConfig.kSpecular},
        u_alpha: {value: teapotConfig.alpha},
        u_a : {value: teapotConfig.a},
        u_b : {value: teapotConfig.b},
        u_c : {value: teapotConfig.c}
    },
	vertexShader: gouraudVertexShader,
	fragmentShader: gouraudFragmentShader
} );

teapotMaterial.side = THREE.DoubleSide;
state.gouraudMaterial.push(teapotMaterial);

// Default is gouraud
const teapotMesh = new THREE.Mesh( teapotGeometry, teapotMaterial );

teapotMesh.position.y = 0;
teapotMesh.position.z = 0;
teapotMesh.rotation.x = - Math.PI / 2;
teapotMesh.scale.multiplyScalar(0.2);

scene.add(teapotMesh);
state.models.push(teapotMesh);
state.currentMaterial.push(0);





// SPHERE
// Geometry of the sphere
let sphereGeometry = new THREE.SphereGeometry(0.2,40, 40);

// Phong material
let sphereConfig = {
    lightPos : new THREE.Vector3(2, 2, 2),
    cameraPos : new THREE.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z,
    ),

    diffuseColor : new THREE.Vector4(0.8,0.3,0.3,1.0),
    kDiffuse : 1.0,

    ambientColor : new THREE.Vector4(0.8,0.3,0.3,1.0),
    kAmbient : 0.2,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.7,
    alpha : 100,

    a : 0.0,
    b : 0.0,
    c : 0.135
}

let sphereMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        u_lightPos: {value: sphereConfig.lightPos},
        u_lightTarget: {value: sphereConfig.lightTarget},
        u_cameraPos: {value: sphereConfig.cameraPos},
        u_diffuseColor: {value: sphereConfig.diffuseColor},
        u_kDiffuse: {value: sphereConfig.kDiffuse},
        u_ambientColor: {value: sphereConfig.ambientColor},
        u_kAmbient: {value: sphereConfig.kAmbient},
        u_specularColor: {value: sphereConfig.specularColor},
        u_kSpecular: {value: sphereConfig.kSpecular},
        u_alpha: {value: sphereConfig.alpha},
        u_a : {value: sphereConfig.a},
        u_b : {value: sphereConfig.b},
        u_c : {value: sphereConfig.c}
    },
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
} );

sphereMaterial.side = THREE.DoubleSide
state.config.push(sphereConfig);
state.phongMaterial.push(sphereMaterial);

// Gouraud material
sphereMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        u_lightPos: {value: sphereConfig.lightPos},
        u_lightTarget: {value: sphereConfig.lightTarget},
        u_cameraPos: {value: sphereConfig.cameraPos},
        u_diffuseColor: {value: sphereConfig.diffuseColor},
        u_kDiffuse: {value: sphereConfig.kDiffuse},
        u_ambientColor: {value: sphereConfig.ambientColor},
        u_kAmbient: {value: sphereConfig.kAmbient},
        u_specularColor: {value: sphereConfig.specularColor},
        u_kSpecular: {value: sphereConfig.kSpecular},
        u_alpha: {value: sphereConfig.alpha},
        u_a : {value: sphereConfig.a},
        u_b : {value: sphereConfig.b},
        u_c : {value: sphereConfig.c}
    },
	vertexShader: gouraudVertexShader,
	fragmentShader: gouraudFragmentShader
} );

sphereMaterial.side = THREE.DoubleSide;
state.gouraudMaterial.push(sphereMaterial);

// Default is gouraud
let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereMesh.position.y += 0.2;
sphereMesh.position.x += 1;
sphereMesh.position.z += 0.5;
scene.add(sphereMesh);
state.models.push(sphereMesh);
state.currentMaterial.push(0);







function moveLight(dim, offs) {
    if(state.selected == -1) {
        alert("Please select an object first.")
    }
    else {
        state.config[state.selected].lightPos[dim] += offs;
        const toAff = [
            state.models[state.selected].material, 
            state.phongMaterial[state.selected],
            state.gouraudMaterial[state.selected]
        ];

        toAff.forEach(
            function(cv) {
                console.log(cv.uniforms.u_lightPos.value);
                cv.uniforms.u_lightPos.value.z = state.config[state.selected].lightPos.z;
            }
        )
    }
}


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
                    state.models[state.selected].material, 
                    state.phongMaterial[state.selected],
                    state.gouraudMaterial[state.selected]
                ];

                toAff.forEach(
                    function(cv) {
                        cv.uniforms.u_kAmbient.value = 0.0;

                        cv.uniforms.u_kDiffuse.value = 0.0;
    
                        cv.uniforms.u_kSpecular.value = 0.0;
                    }
                )
            }
            else {
                const toAff = [
                    state.models[state.selected].material, 
                    state.phongMaterial[state.selected],
                    state.gouraudMaterial[state.selected]
                ];

                toAff.forEach(
                    function(cv) {
                        cv.uniforms.u_kAmbient.value = state.config[state.selected].kAmbient;

                        cv.uniforms.u_kDiffuse.value = state.config[state.selected].kDiffuse;
    
                        cv.uniforms.u_kSpecular.value = state.config[state.selected].kSpecular;
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

    console.log(event.code);
    console.log(state.mode);
});






// ----------------------------------------------------

function animate() {
    // teapotMesh.rotation.x += 0.01;
    // teapotMesh.rotation.y += 0.01;
    // teapotMesh.rotation.z += 0.01;

    // camera.position.y += 0.001;
    // state.models[0].material.uniforms.u_cameraPos.value.y = camera.position.y;
    
    // console.log(camera.position);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();