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






// ---------- Adding objects to the scene ------------

// Adding teapot to the scene

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
    kAmbient : 0.1,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.7,
    alpha : 100
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
        u_alpha: {value: teapotConfig.alpha}
    },
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
} );

teapotMaterial.side = THREE.DoubleSide;



const teapotMesh = new THREE.Mesh( teapotGeometry, teapotMaterial );

teapotMesh.position.y = 0;
teapotMesh.position.z = 0;
teapotMesh.rotation.x = - Math.PI / 2;
teapotMesh.scale.multiplyScalar(0.2);

scene.add(teapotMesh);







// Adding a shpere
let sphereGeometry = new THREE.SphereGeometry(0.2,40, 40);

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
    kAmbient : 0.1,

    specularColor : new THREE.Vector4(1.0,1.0,1.0,1.0),
    kSpecular : 0.7,
    alpha : 100
}

// let sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x33eeff, flatShading: true } );

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
        u_alpha: {value: sphereConfig.alpha}
    },
	vertexShader: phongVertexShader,
	fragmentShader: phongFragmentShader
} );
sphereMaterial.side = THREE.DoubleSide


let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereMesh.position.y += 0.2;
sphereMesh.position.x += 1;
sphereMesh.position.z += 0.5;
scene.add(sphereMesh);












const indToObjectName = ["Teapot, Ball"];

// -------------------------------------------------------

function animate() {
    // teapotMesh.rotation.x += 0.01;
    // teapotMesh.rotation.y += 0.01;
    // teapotMesh.rotation.z += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();