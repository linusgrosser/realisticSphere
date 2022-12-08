import * as THREE from './build/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { FlakesTexture } from './js/FlakesTexture.js';
import { RGBELoader } from './js/RGBELoader.js';

//Creating Variables
let scene, camera, renderer, controls, pointlight;

//Function that fires at the start of app
function init() {
    //Create Scene
    scene = new THREE.Scene();

    //Create Renderer (alpha = is background invivible)
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    //Set size of renderer and add to HTML
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //Config Renderer
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    //Create Camera with FOV, Aspect, and Clippings
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    //Set pos of Camera
    camera.position.set(0, 0, 500);

    //Create Controls for Orbit
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    //Gives the Objects a feel of weight, makes dragging smooth
    controls.enableDamping = true;

    //Create Light, setting Position and adding to Scene
    pointlight = new THREE.PointLight(0xffffff, 1);
    pointlight.position.set(200, 200, 200);
    scene.add(pointlight);

    //Creating Map Loader
    let envmaploader = new THREE.PMREMGenerator(renderer);

    //Load HDR File and then create Sphere
    new RGBELoader().setPath('textures/').load('cayley_interior_4k.hdr', function (hdrmap) {

        //Load EnvMap
        let envmap = envmaploader.fromCubemap(hdrmap);
        //Create Texture and Wrap it around the Object
        let texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        //The higher the value the better the quality
        texture.repeat.x = 20;
        texture.repeat.y = 20;

        //Configurations for the Material
        const sphereMaterial = {
            clearcoat: 1.0,
            cleacoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: 0x8418ca,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.15, 0.15),
            envMap: envmap.texture
        };

        //Creating Sphere Object
        let sphereGeo = new THREE.SphereGeometry(100, 64, 64);
        let sphereMat = new THREE.MeshPhysicalMaterial(sphereMaterial);
        let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphereMesh);

        //Call animation Function
        animate();

    });
}

//Animate the Objects
function animate() {
    //Update the Controls that roate the object
    controls.update();
    //Update renderer
    renderer.render(scene, camera);
    //Call function again
    requestAnimationFrame(animate);
}

//Start Init Function
init();