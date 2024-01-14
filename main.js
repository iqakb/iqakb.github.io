import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
import * as TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/21.0.0/tween.esm.js'

const gui = new GUI();


const scene = new THREE.Scene();
const color3 = new THREE.Color(0xffc000);
scene.background = color3;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 0.3;

document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );

const versor = new THREE.Quaternion();
const curquaternion = new THREE.Quaternion();

var model
const loader = new GLTFLoader();
loader.load( 's9_mini_drone.glb', function ( gltf ) {
    model = gltf.scene;
	scene.add( model );
    curquaternion.copy(model.quaternion);
    const cubeFolder = gui.addFolder('euler')
    let preset = {};

    const obj = {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        savePreset() {
            // save current values to an object
            preset = cubeFolder.save();
            loadButton.enable();
        },
        loadPreset() {
            cubeFolder.load( preset );
        }
    }

    cubeFolder.add( obj, 'x',0 ,Math.PI * 2);
    cubeFolder.add( obj, 'y',0,Math.PI * 2);
    cubeFolder.add( obj, 'z',0,Math.PI * 2);
    cubeFolder.add( obj, 'savePreset' ).onChange( () => {
        const euler = new THREE.Euler( preset.controllers.x, preset.controllers.y, preset.controllers.z, 'XYZ' );
        console.log(euler);
        versor.setFromEuler(euler);
        console.log(versor);
        curquaternion.multiplyQuaternions(versor,curquaternion);
        console.log("model");
        console.log(model.quaternion);
        console.log("curquaternion");
        console.log(curquaternion);

        const animate = (t) =>{
            TWEEN.update(t);
            window.requestAnimationFrame(animate);
        } ;
        animate();

        const tween = new TWEEN.Tween({x: 0}).to({x: 1}, 500).onUpdate((coords)=>{
            model.quaternion.slerp(curquaternion,coords.x);
        });
        tween.start();
        
    } );
    

    const loadButton = cubeFolder.add( obj, 'loadPreset' );
    loadButton.disable();


    
    const orientationFolder = gui.addFolder('orientation')
    orientationFolder.add(model.quaternion, 'w', -1, 1).listen().disable()
    orientationFolder.add(model.quaternion, 'x', -1, 1).listen().disable()
    orientationFolder.add(model.quaternion, 'y', -1, 1).listen().disable()
    orientationFolder.add(model.quaternion, 'z', -1, 1).listen().disable()
    cubeFolder.open()

}, undefined, function ( error ) {

	console.error( error );

} );



const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 100)
cameraFolder.open()



// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
// scene.add( cube );

const light = new THREE.DirectionalLight(0xffffff,1.0, 5.0,10.0);
light.position.set(100,100,100);
light.target.position.set(0,0,0);
light.castShadow = true;
light.shadow.bias = -0.01;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 1.0;
light.shadow.camera.far = 500;
light.shadow.camera.left = 200;
light.shadow.camera.right = -200;
light.shadow.camera.top = 200;
light.shadow.camera.bottom = -200;

scene.add(light);

const lighta = new THREE.AmbientLight(0x404040);
scene.add(lighta);

scene.fog = new THREE.Fog( 0xcccccc, 10, 30 );


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