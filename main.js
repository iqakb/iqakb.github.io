import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const color3 = new THREE.Color(0xffc000);
scene.background = color3;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );

const loader = new GLTFLoader();
loader.load( 's9_mini_drone.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );


// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
// scene.add( cube );

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);


scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );





camera.position.z = 5;
controls.update();




function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

    controls.update();
	renderer.render( scene, camera );
}

animate();