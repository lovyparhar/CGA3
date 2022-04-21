// ASSIGNMENT 3 IMPLEMENTATION
import * as THREE from 'three';
import { PLYLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/PLYLoader.js';

// Fetching the shaders
let vertexShader = await fetch('./phongVertexShader.glsl').then(response => response.text());
let fragmentShader = await fetch('./phongFragmentShader.glsl').then(response => response.text());


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
camera.position.set( 2, 1, 2);
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa1a1a1 );


// Adding light to the scene
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(2, 2, 2);
light.castShadow = true;
scene.add(light);







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

let lightPos = new THREE.Vector3(2, 2, 2);
let lightTarget = new THREE. Vector3(0,0,0);
let cameraPos = new THREE.Vector3(
    camera.position.x,
    camera.position.y,
    camera.position.z,
);

let diffuseColor = new THREE.Vector4(0.3,0.4,0.9,1.0);
let kDiffuse = 1.0;

let ambientColor = new THREE.Vector4(0.3,0.4,0.9,1.0);
let kAmbient = 0.1;

let specularColor = new THREE.Vector4(1.0,1.0,1.0,1.0);
let kSpecular = 0.7;
let alpha = 100;

let teapotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        u_lightPos: {value: lightPos},
        u_lightTarget: {value: lightTarget},
        u_cameraPos: {value: cameraPos},
        u_diffuseColor: {value: diffuseColor},
        u_kDiffuse: {value: kDiffuse},
        u_ambientColor: {value: ambientColor},
        u_kAmbient: {value: kAmbient},
        u_specularColor: {value: specularColor},
        u_kSpecular: {value: kSpecular},
        u_alpha: {value: alpha}
    },
	vertexShader: vertexShader,
	fragmentShader: fragmentShader
} );


// teapotMaterial = new THREE.MeshPhongMaterial( { color: 0x0055ff, flatShading: false } );
// teapotMaterial.side = THREE.DoubleSide;


const teapotMesh = new THREE.Mesh( teapotGeometry, teapotMaterial );

teapotMesh.position.y = 0;
teapotMesh.position.z = 0;
teapotMesh.rotation.x = - Math.PI / 2;
teapotMesh.scale.multiplyScalar(0.2);

teapotMesh.castShadow = true;
scene.add(teapotMesh);


// Adding the plane beneath the objects
// let planeGeometry = new THREE.PlaneGeometry(40,40);
// let planeMaterial = new THREE.MeshStandardMaterial( { color: 0x325453, flatShading: true } );
// planeMaterial.side = THREE.DoubleSide;
// let planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
// planeMesh.rotation.x += Math.PI/2;
// planeMesh.receiveShadow = true;
// scene.add(planeMesh);




// Adding a shpere
// let sphereGeometry = new THREE.SphereGeometry(0.2,40, 40);
// let sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x33eeff, flatShading: true } );
// sphereMaterial.side = THREE.DoubleSide
// let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
// sphereMesh.position.y += 0.2;
// sphereMesh.position.x += 1;
// sphereMesh.position.z += 0.5;
// sphereMesh.castShadow = true;
// scene.add(sphereMesh);

// -------------------------------------------------------

const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3(0, 0, 1), Math.PI / 100 );

function animate() {
    // teapotMesh.rotation.x += 0.01;
    // teapotMesh.rotation.y += 0.01;
    // teapotMesh.rotation.z += 0.01;

    // var mat= new THREE.Matrix4();
    // mat.makeRotationFromEuler(new THREE.Euler().setFromQuaternion(q));

    // in case this doesnt work - old code saved in assignment 2 folder
    if(teapotMesh){
        teapotMesh.quaternion.premultiply(quaternion);
        teapotMesh.updateMatrix();
    }
	requestAnimationFrame(animate);
	renderer.render( scene, camera );
}
animate();
// console.log(teapotMesh.isObject3D);
// if(teapotMesh){
//     teapotMesh.quaternion.copy(quaternion);
//     teapotMesh.updateMatrix();
// }
// requestAnimationFrame(animate);
// renderer.render( scene, camera );