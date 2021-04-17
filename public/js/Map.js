import Crab from "./Crab.js"
import Bat from "./Bat.js"

Map = function(game){
    // Appel des variables nécéssaires
    this.game = game;
    var scene = game.scene;
    let dimPlan = 300;
    let navigationPlugin = new BABYLON.RecastJSPlugin();
   
    
    // Création de notre lumière principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), scene);
    light.specular = new BABYLON.Color3(0,0,0);
    
    //creation du ground et de sa texture
    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: dimPlan, height: dimPlan}, scene);


    /* 
    var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","images/Hawaii_Heightmap.png",500,500,250,0,10, scene);

    var textureplane = new BABYLON.StandardMaterial("textureS",scene);
    textureplane.diffuseTexture = new BABYLON.Texture("assets/sable.jpg",scene);
    ground.material = textureplane;
 */
    createGround(scene,dimPlan,navigationPlugin);
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:9000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/Skybox/skybox2", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

   // createMobs(scene);

};

function createGround(scene, dimplan, navigationPlugin) {
    const groundOptions = { width:dimplan, height:dimplan, subdivisions:100, minHeight:0, maxHeight:30, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm","images/hmap17.png",groundOptions, scene);
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 
    
    function onGroundCreated() {

        // ========== DEBUT NAVMESH =========
        var staticMesh = ground;
        var navmeshParameters = {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 20,
            walkableHeight: 20,
            walkableClimb: 2.8,
            walkableRadius: 18,
            maxEdgeLen: 12.,
            maxSimplificationError: 1.3,
            minRegionArea: 6,
            mergeRegionArea: 10,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            };

        navigationPlugin.createNavMesh([staticMesh], navmeshParameters);

        //debug navmesh (permet de voir la navmesh)
        var navmeshdebug = navigationPlugin.createDebugNavMesh(scene);
        navmeshdebug.position = new BABYLON.Vector3(0, 0.01, 0);
        
        var matdebug = new BABYLON.StandardMaterial('matdebug', scene);
        matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
        matdebug.alpha = 0.2;
        navmeshdebug.material = matdebug;

        // ========== FIN NAVMESH =========
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

function createMobs(scene){   
    
    let crabe = new Crab(2,"crabe",3,20,10,250);
    crabe.createMob(scene, "models/Persos/","crabe.glb", "crabe");
   
    let bat = new Bat(2,"bat",3,20,5,250);
    bat.createMob(scene,"models/Persos/","bat.glb","bat");
    
    let cactus = new Bat(2,"cactus",3,20,5,250);
    cactus.createMob(scene,"models/Persos/","cactus.glb","cactus");

    let chicken = new Bat(2,"chicken",3,20,5,250);
    chicken.createMob(scene,"models/Persos/","chicken.glb","chicken");

    let demon = new Bat(2,"demon",3,20,5,250);
    demon.createMob(scene,"models/Persos/","demon.glb","demon");

    let monster = new Bat(2,"monster",3,20,5,250);
    monster.createMob(scene,"models/Persos/","monster.glb","monster");

    let tree = new Bat(2,"tree",3,20,5,250);
    tree.createMob(scene,"models/Persos/","tree.glb","tree");
}