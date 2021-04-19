import Mob from "./Mob.js"

let canvas;
let engine;
let scene;
let dimPlan = 8000;
let inputStates = {};

window.onload = map;

function map(){
    // Appel des variables nécéssaires
    //this.game = game;
    canvas = document.querySelector("#renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    
    // Créons une sphère 
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Remontons le sur l'axe y de la moitié de sa hauteur
    //sphere.position.y = 1;
    let cameraset  = false ;

    engine.runRenderLoop(() => {


        let player = scene.getMeshByName("Jolleen");
        if (player){
            if (!cameraset){
                let followCamera = createFollowCamera(scene, player);
                scene.activeCamera = followCamera;
                cameraset = true;
            }
            player.move();
        } 

        let crabe = scene.getMeshByName("crabeM");
        try{
            crabe._children[0]._children[0].showBoundingBox = true
            //console.log(crabe.Mob.vitesse);
        } catch(error){}

        scene.render();
    });

};

function createScene(){

    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene, dimPlan);
    
    let camera = createCamera(scene);
   

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:9000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/Skybox/skybox2", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    var waterMesh = BABYLON.Mesh.CreateGround("sea", dimPlan*2, dimPlan*2, 32, scene, false);
    waterMesh.diffuseColor = new BABYLON.Color3(0,0,0);
    var water = new BABYLON.WaterMaterial("water", scene, BABYLON.Vector2(dimPlan*2,dimPlan*2));

    water.bumpTexture = new BABYLON.Texture("textures/water_bump.png", scene);
    water.windForce = -2;
    water.waterColor = new BABYLON.Color3(0,0.5,0.5);
    water.windDirection = new BABYLON.Vector2(1, 1);
    water.waveHeight = 1.7;
    water.bumpHeight = 0.8;
    water.waveLength = 1.8;
    waterMesh.material = water;
    waterMesh.position.y = -95;
    water.addToRenderList(skybox);
    water.addToRenderList(ground);;

   
    createLights(scene);
    createMobs(scene);
    
    createPlayer(scene);

    return scene;  
}

function createCamera(scene){
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    return camera;
}

function createLights(scene){
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), scene);
    light.specular = new BABYLON.Color3(0,0,0);
}


function createGround(scene, dimplan) {
    const groundOptions = { width:dimplan, height:dimplan, subdivisions:500, minHeight:-100, maxHeight:250, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm","images/hmap14.png",groundOptions, scene);
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 
    
    function onGroundCreated() {

        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/test/lambert1_Base_Color.png");
        groundMaterial.emissiveTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_Glossiness.png");
        
        groundMaterial.bumpTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_normal.png");
        
        groundMaterial.roughnessTexture = new BABYLON.Texture("textures/test/lambert1_roughness.jpg");
        groundMaterial.specularTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_Specular.png");
        
        ground.material = groundMaterial;
        ground.checkCollisions = true;

    }
    return ground;
}
let zMovement = 5;
function createPlayer(scene){
    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "Jolleen.babylon", scene, function (meshes, particleSystems, skeletons)  {  
        let player = meshes[0];
        let playerMaterial = new BABYLON.StandardMaterial("playerTexture", scene);
        playerMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/Jolleen_Diffuse.png");
        playerMaterial.emissiveTexture = new BABYLON.Texture("models/Persos/Jolleen_Glossiness.png");
        playerMaterial.bumpTexture = new BABYLON.Texture("models/Persos/Jolleen_Normal.png");
        playerMaterial.specularTexture = new BABYLON.Texture("models/Persos/Jolleen_Specular.png");

        player.scaling = new BABYLON.Vector3(1, 1, 1);
        player.death = false;
        player.walk = false;
        player.name = "Jolleen";
        player.position.x = 1000 + Math.random()*1000;
        player.position.z = 1000 + Math.random()*1000;
        player.position.y = 10;
        player.material = playerMaterial;

        player.frontVector = new BABYLON.Vector3(0, 0, -1);
        player.speed = 2;

    
        let idleAnim = scene.beginWeightedAnimation(skeletons[0], 73, 195,1.0 ,true, 1);
        let walkAnim = scene.beginWeightedAnimation(skeletons[0], 251, 291,0.0, true, 1);
        let runAnim= scene.beginWeightedAnimation(skeletons[0], 211, 226,0.0, true, 1);
        let deathAnim= scene.beginWeightedAnimation(skeletons[0], 0, 63, 0.0,false, 0.35);
        

        
    player.changeState = (state) => {
        if (state == "idle"){
            idleAnim.weight = 1.0;
            walkAnim.weight = 0.0;
            runAnim.weight = 0.0;
        } else if (state == "walk"){
            idleAnim.weight = 0.0;
            walkAnim.weight = 1.0;
            runAnim.weight = 0.0;
        }
        else if (state == "run"){
            idleAnim.weight = 0.0;
            walkAnim.weight = 0.0;
            runAnim.weight = 1.0;
        }
        else if (state == "death"){
            idleAnim.weight = 0.0;
            walkAnim.weight = 0.0;
            runAnim.weight = 0.0;
            deathAnim.weight = 1.0;
        }
    }
    player.move= () =>{
        let yMovement = 0;
        if(!player.death){
            if (player.position.y > 2) {
                zMovement = 0;
                yMovement = -2;
            } 
            if(inputStates.up) {
                if (inputStates.shift){
                    player.speed = 8;
                    player.changeState("run");
                }else{
                    player.speed = 2;
                    player.changeState("walk");
                }
                player.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
            }    
            if(inputStates.down) {
                player.speed = 1;
                player.moveWithCollisions(player.frontVector.multiplyByFloats(-player.speed, -player.speed, -player.speed));
                player.changeState("walk");
                player.walk = true;
            }    
            if(inputStates.left) {
                player.rotation.y -= 0.02;
                player.frontVector = new BABYLON.Vector3(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
            }    
            if(inputStates.right) {
                player.rotation.y += 0.02;
                player.frontVector = new BABYLON.Vector3(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
            }
            if (!inputStates.up && !inputStates.down)
                player.changeState("idle");
                player.walk = false;

            if (inputStates.o){
                player.death = true;
                player.changeState("death");
            }
            
        }
        }});
}

function createMobs(scene){   
    let x = 1000 + Math.random()*1000;
    let y = 10;
    let z = 1000 + Math.random()*1000;
        
    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "crabe.glb", scene, function (meshes) {  
        let crabeM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/crabe_Texture.png");
        crabeM.scaling = new BABYLON.Vector3(20, 20, 20); 
        crabeM.name ="crabeM";
        crabeM.position.x = 1000 + Math.random()*1000;
        crabeM.position.z = 1000 + Math.random()*1000;
        crabeM.position.y = 5;
        crabeM.material = mobMaterial;

        let crabe = new Mob(crabeM,"crabe",2,3,20,5,250);
    });
   
    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "bat.glb", scene, function (meshes) {  
        let batM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/bat_Texture.png");
        batM.scaling = new BABYLON.Vector3(20, 20, 20); 
        batM.name ="batM";
        batM.position.x = 1000 + Math.random()*1000;
        batM.position.z = 1000 + Math.random()*1000;
        batM.position.y = 5;
        batM.material = mobMaterial;

        let bat = new Mob(batM,"bat",2,3,20,5,250);
    });
    
    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "cactus.glb", scene, function (meshes) {  
        let cactusM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/cactus_Texture.png");
        cactusM.scaling = new BABYLON.Vector3(20, 20, 20); 
        cactusM.name ="cactusM";
        cactusM.position.x = 1000 + Math.random()*1000;
        cactusM.position.z = 1000 + Math.random()*1000;
        cactusM.position.y = 5;
        cactusM.material = mobMaterial;

        let cactus = new Mob(cactusM,"cactus",2,3,20,5,250);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "chicken.glb", scene, function (meshes) {  
        let chickenM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/chicken_Texture.png");
        chickenM.scaling = new BABYLON.Vector3(20, 20, 20); 
        chickenM.name ="chickenM";
        chickenM.position.x = 1000 + Math.random()*1000;
        chickenM.position.z = 1000 + Math.random()*1000;
        chickenM.position.y = 5;
        chickenM.material = mobMaterial;

        let chicken = new Mob(chickenM,"chicken",2,3,20,5,250);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "demon.glb", scene, function (meshes) {  
        let demonM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/demon_Texture.png");
        demonM.scaling = new BABYLON.Vector3(20, 20, 20); 
        demonM.name ="demonM";
        demonM.position.x = 1000 + Math.random()*1000;
        demonM.position.z = 1000 + Math.random()*1000;
        demonM.position.y = 5;
        demonM.material = mobMaterial;

        let demon = new Mob(demonM,"demon",2,3,20,5,250);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "monster.glb", scene, function (meshes) {  
        let monsterM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/monster_Texture.png");
        monsterM.scaling = new BABYLON.Vector3(20, 20, 20); 
        monsterM.name ="monsterM";
        monsterM.position.x = 1000 + Math.random()*1000;
        monsterM.position.z = 1000 + Math.random()*1000;
        monsterM.position.y = 5;
        monsterM.material = mobMaterial;

        let monster = new Mob(monsterM,"monster",2,3,20,5,250);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "tree.glb", scene, function (meshes) {  
        let treeM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/tree_Texture.png");
        treeM.scaling =new BABYLON.Vector3(20, 20, 20); 
        treeM.name ="treeM";
        treeM.position.x = 1000 + Math.random()*1000;
        treeM.position.z = 1000 + Math.random()*1000;
        treeM.position.y = 5;
        treeM.material = mobMaterial;

        let tree = new Mob(treeM,"tree",2,3,20,5,250);
    });
}



function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("FollowCamera", target.position, scene, target);

    camera.radius = 500; // how far from the object to follow
	camera.heightOffset = 200; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}



window.addEventListener("resize", () => {
    engine.resize()
});

inputStates.left = false;
inputStates.right = false;
inputStates.up = false;
inputStates.down = false;
inputStates.space = false;
inputStates.shift = false;
inputStates.o = false;

//add the listener to the main, window object, and update the states
window.addEventListener('keydown', (event) => {
    if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
        inputStates.left = true;
    } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
        inputStates.up = true;
    } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
        inputStates.right = true;
    } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
        inputStates.down = true;
    } else if (event.key === " ") {
        inputStates.space = true;
    } else if (event.key === "Shift") {
        inputStates.shift = true;
    } else if (event.key === "o") {
        inputStates.o = true;
    }
}, false);

//if the key will be released, change the states object 
window.addEventListener('keyup', (event) => {
    if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
        inputStates.left = false;
    } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
        inputStates.up = false;
    } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
        inputStates.right = false;
    } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
        inputStates.down = false;
    } else if (event.key === " ") {
        inputStates.space = false;
    } else if (event.key === "Shift") {
        inputStates.shift = false;
    } else if (event.key === "o") {
        inputStates.o = false;
    }
}, false);
