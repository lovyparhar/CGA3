/*
// Drawing a basic cube
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();
*/

/*
// Drawing line
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, material );

scene.add( line );
function animate() {
	requestAnimationFrame( animate );
    camera.position.set(camera.position.x+0.1, 0, 100);
	renderer.render( scene, camera );
}
animate();
*/

// ply loader
import * as THREE from 'three';
import { PLYLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/PLYLoader.js';


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
const loader = new PLYLoader();

let teapotMesh;
let isLoaded = new Promise(function(resolve, reject) {
    loader.load( './teapot.ply', function ( geometry ) {
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial( { color: 0x0055ff, flatShading: false } );
        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.rotation.x = - Math.PI / 2;
        mesh.scale.multiplyScalar(0.2);

        mesh.castShadow = true;
        teapotMesh = mesh;
        resolve("Teapot mesh set");
    });
});

// After this point in code, the code can safely assume that the teapotMesh variable is set
let res = await isLoaded;
scene.add(teapotMesh);

// Adding the plane beneath the objects
let planeGeometry = new THREE.PlaneGeometry(40,40);
let planeMaterial = new THREE.MeshStandardMaterial( { color: 0x325453, flatShading: true } );
planeMaterial.side = THREE.DoubleSide
let planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
planeMesh.rotation.x += Math.PI/2;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// Adding a shpere
let sphereGeometry = new THREE.SphereGeometry(0.2,40, 40);
let sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x33eeff, flatShading: true } );
sphereMaterial.side = THREE.DoubleSide
let sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereMesh.position.y += 0.2;
sphereMesh.position.x += 1;
sphereMesh.position.z += 0.5;
sphereMesh.castShadow = true;
scene.add(sphereMesh);

// -------------------------------------------------------

function animate() {
    // teapotMesh.rotation.x += 0.01;
    // teapotMesh.rotation.y += 0.01;
    // teapotMesh.rotation.z += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();