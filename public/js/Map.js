import Mob from "./Mob.js"

let canvas;
let health_progress;
let health_bar;
let level_of_player;
let engine;
let scene;
let dimPlan = 8000;
let inputStates = {};
let mobs = [];

let life_by_level = [500, 550, 600, 650,700, 750, 800, 850, 1000]; 
let level_xp = [50, 100, 125, 175, 250, 325, 425, 550, 750, 1000];

window.onload = map;

/*function create_Player_UI(){
    var div_progress = document.createElement("div");
    var div_bar = document.createElement("div");
    div_progress.id = "health_progress";
    div_bar.id = "health_bar";
    */

function map(){

    canvas = document.querySelector("#renderCanvas");
    
    
    create_Player_UI();
    health_progress = document.querySelector("#health_progress");
    health_bar = document.querySelector("#health_bar");


    level_of_player = document.querySelector("#player_level");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    
    // Créons une sphère 
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Remontons le sur l'axe y de la moitié de sa hauteur
    //sphere.position.y = 1;

    let cameraset  = false ;

    scene.toRender = () => {

        let player = scene.getMeshByName("Jolleen");
        let crabe = scene.getMeshByName("crabeM");
        let cactus = scene.getMeshByName("cactusM");
        let chicken = scene.getMeshByName("chickenM");
        let bat = scene.getMeshByName("batM");
        let monster = scene.getMeshByName("monsterM");
        let tree = scene.getMeshByName("treeM");
        let demon = scene.getMeshByName("demonM");
        mobs.push(crabe,cactus, chicken,bat,monster,tree,demon)

        if (player && crabe && cactus && chicken && bat && monster && tree && demon){
            if (!cameraset){
                let followCamera = createFollowCamera(scene, player);
                scene.activeCamera = followCamera;
                cameraset = true;
            }
            update_health_bar(health_bar, player);
           
            player.move();
            checkCollisions(player, mobs);
        
            player.changeLevel();
            //crabe.Mob.attackPlayer(player);
            player.die();
            console.log("xp : " + player.getXp() + " lvl : " + player.getLevel());
            console.log("health : " + player.getHealth());

            crabe.Mob.dead(player);
            player.attackMob(crabe, 10);
            //update_level(level_of_player, player);

            //console.log(crabe.Mob.getLevel());
            //console.log(player.getHealth());

        }

        scene.render();
    };
    scene.assetManager.load();

};

function createScene(){

    let scene = new BABYLON.Scene(engine);
    scene.assetManager = configureAssetManager(scene);

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

   BABYLON.ParticleHelper.CreateAsync("smoke", scene).then((set) => {
       set.systems.forEach((s) => {
           s.disposeOnStop = true;
           s.minScaleY = 100;
           s.maxScaleY = 100;
           s.minScaleX = 100;
           s.maxScaleX = 100;
           s.minScaleZ = 100;
           s.maxScaleZ = 100;
       });
       set.start();
       set.systems[0].worldOffset = new BABYLON.Vector3(3650,305,3160);
   });

    createLights(scene);
    createMobs(scene);
    
    createPlayer(scene);
    loadSounds(scene);

    return scene;  
}

function configureAssetManager(scene) {
    let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        engine.loadingUIBackgroundColor = "steelblue";
        console.log('We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.');
    };

    assetsManager.onFinish = function(tasks) {

        engine.runRenderLoop(function() {
            scene.toRender();
        });
    };
    return assetsManager;
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
    var assetsManager = scene.assetManager;

    const groundOptions = { width:dimplan, height:dimplan, subdivisions:500, minHeight:-100, maxHeight:250};

    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm","images/hmap20.png",groundOptions, scene);

    var textureTask = assetsManager.addTextureTask("image task", "textures/test/lambert1_Base_Color.png");
    var textureTask2 = assetsManager.addTextureTask("image task2", "textures/test/heightmap_lambert1_Glossiness.png");
    var textureTask3 = assetsManager.addTextureTask("image task3", "textures/test/heightmap_lambert1_normal.png");
    var textureTask4 = assetsManager.addTextureTask("image task4", "textures/test/lambert1_roughness.jpg");
    var textureTask5 = assetsManager.addTextureTask("image task5", "textures/test/heightmap_lambert1_Specular.png");

    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    
    textureTask.onSuccess = function(task) {groundMaterial.diffuseTexture = task.texture;}
    textureTask2.onSuccess = function(task) {groundMaterial.emissiveTexture = task.texture;}
    textureTask3.onSuccess = function(task) {groundMaterial.bumpTexture = task.texture;}
    textureTask4.onSuccess = function(task) {groundMaterial.roughnessTexture = task.texture;}
    textureTask5.onSuccess = function(task) {groundMaterial.specularTexture = task.texture;}
    
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    return ground;
}

function loadSounds(scene){
    var assetsManager = scene.assetManager;

    let binaryTask = assetsManager.addBinaryFileTask(
        "generique",
        "sons/naruto-1-instru.mp3"
    );
    binaryTask.onSuccess = function (task) {
        scene.assets.generique = new BABYLON.Sound(
            "generique",
            task.data,
            scene,
            null,
            {
            loop: true,
            autoplay: true,
            volume : 0.5,
            }
        );
    };
}

let zMovement = 5;
function createPlayer(scene){

    let meshTask = scene.assetManager.addMeshTask("Joleen task", "", "models/Persos/", "Jolleen.babylon");

    meshTask.onSuccess = function (task) {
        onJoleenImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }

    function onJoleenImported(meshes, particleSystems, skeletons) {
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
        player.position.y = 0;
        player.material = playerMaterial;
        
        //Player statistics
        player.health = 500;
        player.level = 1;
        player.xp = 0;
        player.attack = 25;
        player.defense = 15;
        player.speed = 2;
        player.frontVector = new BABYLON.Vector3(0, 0, -1);

        let idleAnim = scene.beginWeightedAnimation(skeletons[0], 73, 195,1.0 ,true, 1);
        let walkAnim = scene.beginWeightedAnimation(skeletons[0], 251, 291,0.0, true, 1);
        let runAnim= scene.beginWeightedAnimation(skeletons[0], 211, 226,0.0, true, 1);
        let deathAnim = scene.beginWeightedAnimation(skeletons[0], 0, 63, 0.0,false, 0.15);

        
        player.getposy = () =>{
            console.log(player.position.y);
        }
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

        player.setHealth = (health) =>{
            player.health = health;
        }
        player.setDefense = (defense) =>{
            player.defense = defense;
        }
        player.setAttack = (attack) =>{
            player.attack = attack;
        }
        player.isDead = () =>{
            return player.health <= 0;
        }
        player.getHealth = () =>{
            return player.health;
        }
        player.getDefense= () =>{
            return player.defense;
        }
        player.getAttack = () =>{
            return player.attack;
        }
        player.getLevel = () =>{
            return player.level;
        }
        player.getXp = () =>{
            return player.xp;
        }
        player.setXp = (xp) =>{
            player.xp = xp;
        }
        player.addXp = (xp) =>{
            player.xp +=xp; 
        }
        player.addLevel = () =>{
            player.level++;
        }

        player.drown = ()=>{
            if (player.position.y <= -88)
                player.takeDamage(life_by_level[player.level] / 25);
        }

        player.takeDamage = (damage) =>{
            if(player.health >0)  
                player.health -= damage;
            else 
                player.health = 0;
        }
        player.changeLevel = () =>{
            if (player.level < 10){
                if(player.xp >= level_xp[player.getLevel() - 1]){
                    player.addLevel();
                    player.setXp(0);
                    player.setHealth(life_by_level[player.getLevel() - 1]);
                    player.setDefense(player.defense + 0.075*player.defense);
                    player.setAttack(player.attack + 0.075*player.attack);
                }
            }
        }
        player.attackMob = (mobMesh)=> {
            mobMesh.Mob.takeDamage(player.attack - 0.25 * mobMesh.Mob.getDefense());
        }

        player.die = () => {
            player.drown();
            if (player.isDead()){
                player.death = true;
                player.changeState("death");
                player.setXp(0);
            }
        }
    

        player.move= () =>{
            let yMovement = 0;
            if(!player.death){
                followGround(player,20);
                followGround(bounderT,2);
                if (player.position.y > 2) {
                    zMovement = 0;
                    yMovement = -2;
                } 
                if(inputStates.up) {
                    if (inputStates.shift){
                        player.speed = 25;
                        player.changeState("run");
                    }else{
                        player.speed = 8;
                        player.changeState("walk");
                    }
                    player.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
                    bounderT.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
                }    
                if(inputStates.down) {
                    player.speed = 4;
                    player.moveWithCollisions(player.frontVector.multiplyByFloats(-player.speed, -player.speed, -player.speed));
                    bounderT.moveWithCollisions(player.frontVector.multiplyByFloats(-player.speed, -player.speed, -player.speed));
                    player.changeState("walk");
                    player.walk = true;
                }    
                if(inputStates.left) {
                    player.rotation.y -= 0.05;
                    bounderT.rotation.y -= 0.05;
                    player.frontVector = new BABYLON.Vector3(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
                }    
                if(inputStates.right) {
                    player.rotation.y += 0.05;
                    bounderT.rotation.y += 0.05;
                    player.frontVector = new BABYLON.Vector3(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
                }
                if (!inputStates.up && !inputStates.down)
                    player.changeState("idle");
                    player.walk = false;
            }
        
        }   
        let bounderT = new BABYLON.Mesh.CreateBox("bounder", 10, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", scene);
        bounderMaterial.alpha = 0.4;
        bounderT.material = bounderMaterial;
        
        bounderT.position = player.position.clone();

        let bbInfo = player.getBoundingInfo();

        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;
        
        bounderT.scaling.x = (max._x - min._x) * player.scaling.x*0.06;
        bounderT.scaling.y = (max._y - min._y) * player.scaling.y*0.12;
        bounderT.scaling.z = (max._z - min._z) * player.scaling.z*0.12;

        bounderT.isVisible = true;
        bounderT.position.y += (max._y - min._y) * player.scaling.y/3;
        bounderT.checkCollisions = true;

        player.bounder = bounderT
    };
        
}

function createMobs(scene){  

    let meshTaskCr = scene.assetManager.addMeshTask("Crabe task", "", "models/Persos/", "crabe.glb");
    let meshTaskB = scene.assetManager.addMeshTask("Bat task", "", "models/Persos/", "bat.glb");
    let meshTaskCa = scene.assetManager.addMeshTask("Cactus task", "", "models/Persos/", "cactus.glb");
    let meshTaskCh = scene.assetManager.addMeshTask("Chicken task", "", "models/Persos/", "chicken.glb");
    let meshTaskD = scene.assetManager.addMeshTask("Demon task", "", "models/Persos/", "demon.glb");
    let meshTaskM = scene.assetManager.addMeshTask("Monster task", "", "models/Persos/", "monster.glb");
    let meshTaskT = scene.assetManager.addMeshTask("Tree task", "", "models/Persos/", "tree.glb");


    meshTaskCr.onSuccess = function (task) {
        onCrabeImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskB.onSuccess = function (task) {
        onBatImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskCa.onSuccess = function (task) {
        onCactusImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskCh.onSuccess = function (task) {
        onChickenImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskD.onSuccess = function (task) {
        onDemonImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskM.onSuccess = function (task) {
        onMonsterImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }
    meshTaskT.onSuccess = function (task) {
        onTreeImported(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons);
    }

        
    function onCrabeImported(meshes, particleSystems, skeletons){  
        let crabeM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/crabe_Texture.png");
        crabeM.scaling = new BABYLON.Vector3(20, 20, 20); 
        crabeM.name ="crabeM";
        crabeM.position.x = 1000 + Math.random()*1000;
        crabeM.position.z = 1000 + Math.random()*1000;
        crabeM.material = mobMaterial;
        
        let crabe = new Mob(crabeM,"crabe",3,3,20,5,250,scene);
        createBox(crabeM);
        followGround(crabeM,2);
    };
   
    function onBatImported(meshes, particleSystems, skeletons) {  
        let batM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/bat_Texture.png");
        batM.scaling = new BABYLON.Vector3(20, 20, 20); 
        batM.name ="batM";
        batM.position.x = 1000 + Math.random()*1000;
        batM.position.z = 1000 + Math.random()*1000;
        batM.material = mobMaterial;

        let bat = new Mob(batM,"bat",2,3,20,5,250,scene);
        createBox(batM);
        followGround(batM,2);
    };
    
    function onCactusImported(meshes, particleSystems, skeletons) {  
        let cactusM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/cactus_Texture.png");
        cactusM.scaling = new BABYLON.Vector3(20, 20, 20); 
        cactusM.name ="cactusM";
        cactusM.position.x = 1000 + Math.random()*1000;
        cactusM.position.z = 1000 + Math.random()*1000;
        cactusM.material = mobMaterial;

        let cactus = new Mob(cactusM,"cactus",2,3,20,5,250,scene);
        createBox(cactusM);
        followGround(cactusM,2);
    };

    function onChickenImported(meshes, particleSystems, skeletons) {  
        let chickenM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/chicken_Texture.png");
        chickenM.scaling = new BABYLON.Vector3(20, 20, 20); 
        chickenM.name ="chickenM";
        chickenM.position.x = 1000 + Math.random()*1000;
        chickenM.position.z = 1000 + Math.random()*1000;
        chickenM.material = mobMaterial;

        let chicken = new Mob(chickenM,"chicken",2,3,20,5,250,scene);
        createBox(chickenM)
        followGround(chickenM,2);
    };

    function onDemonImported(meshes, particleSystems, skeletons) {  
        let demonM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/demon_Texture.png");
        demonM.scaling = new BABYLON.Vector3(20, 20, 20); 
        demonM.name ="demonM";
        demonM.position.x = 1000 + Math.random()*1000;
        demonM.position.z = 1000 + Math.random()*1000;
        demonM.material = mobMaterial;

        let demon = new Mob(demonM,"demon",2,3,20,5,250,scene);
        createBox(demonM);
        followGround(demonM,2);
    };

    function onMonsterImported(meshes, particleSystems, skeletons) {  
        let monsterM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/monster_Texture.png");
        monsterM.scaling = new BABYLON.Vector3(20, 20, 20); 
        monsterM.name ="monsterM";
        monsterM.position.x = 1000 + Math.random()*1000;
        monsterM.position.z = 1000 + Math.random()*1000;
        monsterM.material = mobMaterial;

        let monster = new Mob(monsterM,"monster",2,3,20,5,250,scene);
        createBox(monsterM);
        followGround(monsterM,2);
    };

    function onTreeImported(meshes, particleSystems, skeletons) {  
        let treeM = meshes[0];
        let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
        mobMaterial.diffuseTexture = new BABYLON.Texture("models/Persos/tree_Texture.png");
        treeM.scaling =new BABYLON.Vector3(20, 20, 20); 
        treeM.name ="treeM";
        treeM.position.x = 1000 + Math.random()*1000;
        treeM.position.z = 1000 + Math.random()*1000;
        treeM.material = mobMaterial;

        let tree = new Mob(treeM,"tree",2,3,20,5,250,scene);
        createBox(treeM);
        followGround(treeM,2);
    };
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("FollowCamera", target.position, scene, target);
    camera.radius = 500; // how far from the object to follow
	camera.heightOffset = 200; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 100; // speed limit

    return camera;
}

function followGround(meshes,s){
    // adjusts y position depending on ground height...

    // create a ray that starts above the player, and goes down vertically
    let origin = new BABYLON.Vector3(meshes.position.x, 1000, meshes.position.z);
    let direction = new BABYLON.Vector3(0, -1, 0);
    let ray = new BABYLON.Ray(origin, direction, 10000);

    // compute intersection point with the ground
    let pickInfo = scene.pickWithRay(ray, (mesh) => { return(mesh.name === "gdhm"); });

    let groundHeight = pickInfo.pickedPoint.y;
    meshes.position.y = groundHeight;

    let bbInfo = meshes.getBoundingInfo();
    //console.log(bbInfo)

    let max = bbInfo.boundingBox.maximum;
    let min = bbInfo.boundingBox.minimum;

    // Not perfect, but kinda of works...
    // Looks like collisions are computed on a box that has half the size... ?
    //bounder.scaling.y = (max._y - min._y) * this.scaling * 2;

    let lengthY = (max._y - min._y);
    meshes.position.y = groundHeight + lengthY * meshes.scaling.y/s

    return groundHeight;
}


function createBox(meshes){

    let bounder = new BABYLON.Mesh.CreateBox("bounder", 10, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", scene);
        bounderMaterial.alpha = 0.4;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;
        bounder.position = meshes.position.clone();

        let bbInfo = meshes._children[0]._children[0].getBoundingInfo();

        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;
        
        bounder.scaling.x = (max._x - min._x) * meshes.scaling.x*0.1;
        bounder.scaling.y = (max._y - min._y) * meshes.scaling.y*0.12;
        bounder.scaling.z = (max._z - min._z) * meshes.scaling.z*0.12;

        bounder.isVisible = true;
        bounder.position.y += (max._y - min._y) * meshes.scaling.y/3;
        meshes.bounder = bounder;

        return bounder;
}


function checkCollisions(meshes1, liste) {
    
    meshes1.bounder.actionManager = new BABYLON.ActionManager(scene);    

        var enemies_list = closure(liste);
        for (var a=0;a<enemies_list.length;a++){
            meshes1.bounder.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                { trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter:enemies_list[a].bounder
                }, 
                function(){ enemies_list[a].Mob.getLevel();}// On veut afficher dans la console le niveau du Mob avec lequel on fait la collision pour tester si ça marche
                                                            // plus tard, on utilisera la fonction 'mobMesh'.Mob.attackPlayer(meshes1);
            )
        )
    }
function closure(liste){
    var enemies = [];
    for (var i=0;i<liste.length;i++){
        enemies[i] = (function(a){
            return function(){
                return a;
            }
        })(liste[i]);
    }
    return enemies;
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


function create_Player_UI(){
    var div_progress = document.createElement("div");
    var div_bar = document.createElement("div");
    div_progress.id = "health_progress";
    div_bar.id = "health_bar";
     
    
    div_progress.style.position = "absolute";
    div_progress.style.top = "10px";
    div_progress.style.left = "10px";
    div_progress.style.width = "500px";
    div_progress.style.height = "30px";

    div_bar.style.backgroundColor= "#4CAF50";
    div_bar.style.height = "100%";
    div_bar.style.color=  "black";
    div_bar.style.fontWeight=  "bold";

    div_bar.style.textAlign=  "left"; /* To center it horizontally (if you want) */
    div_bar.style.lineHeight = "30px"; /* To center it vertically */

    div_progress.appendChild(div_bar);
    document.body.appendChild(div_progress);

}

function update_health_bar(health_bar, playerMesh){
    let max_life = life_by_level[playerMesh.getLevel()-1];
    let percent = playerMesh.getHealth() / max_life *100;
    if (percent <= 25 ){
        health_bar.style.backgroundColor= "red";
    }
    else if (percent <= 50 ){
        health_bar.style.backgroundColor= "orange";
    }
    else if (percent <= 75 ){
        health_bar.style.backgroundColor= "yellow";
    }
    health_bar.style.width = percent + "%";
    health_bar.innerHTML = playerMesh.getHealth();
}



/* function update_level(level, playerMesh){
    // <progress id="health" value="100" max="100"></progress>
    level.innerHTML = "Level : " + playerMesh.getLevel();
}
  */
