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


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
camera.position.set( 2, 2, 2);
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf1f1f1 );

const loader = new PLYLoader();
loader.load( './teapot.ply', function ( geometry ) {

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
    const mesh = new THREE.Mesh( geometry, material );

    mesh.position.y = - 0.2;
    mesh.position.z = 0.3;
    mesh.rotation.x = - Math.PI / 2;
    mesh.scale.multiplyScalar(0.2);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    console.log(mesh);
    console.log(mesh.scale)
    scene.add( mesh );
} );

console.log(scene);

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();