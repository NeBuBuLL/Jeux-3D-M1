import Crab from "./Crab.js"
import Bat from "./Bat.js"

Map = function(game){
    // Appel des variables nécéssaires
    this.game = game;
    var scene = game.scene;
    let dimPlan = 500;

    // Création de notre lumière principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), scene);
    light.specular = new BABYLON.Color3(0,0,0);
    // Créons une sphère 
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Remontons le sur l'axe y de la moitié de sa hauteur
    sphere.position.y = 1;

    //creation du ground et de sa texture
    //var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: dimPlan, height: dimPlan}, scene);


    /* 
    var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","images/Hawaii_Heightmap.png",500,500,250,0,10, scene);

    var textureplane = new BABYLON.StandardMaterial("textureS",scene);
    textureplane.diffuseTexture = new BABYLON.Texture("assets/sable.jpg",scene);
    ground.material = textureplane;
 */
    createGround(scene);
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:9000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/Skybox/skybox2", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    createMobs(scene);

};

function createGround(scene) {
    const groundOptions = { width:8000, height:8000, subdivisions:500, minHeight:-100, maxHeight:250, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm","images/hmap14.png",groundOptions, scene);
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        //PBRMetallicRoughness
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("textures/test/lambert1_Base_Color.png");
        //groundMaterial.diffuseTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_Diffuse.png");
        groundMaterial.emissiveTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_Glossiness.png");
        
        groundMaterial.bumpTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_normal.png");
        
        groundMaterial.roughnessTexture = new BABYLON.Texture("textures/test/lambert1_roughness.jpg");
        groundMaterial.specularTexture = new BABYLON.Texture("textures/test/heightmap_lambert1_Specular.png");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createMobs(scene){   
    
    let crabe = new Crab(2,"crabe",3,20,10,250);
    crabe.createMob(scene, "models/Persos/","crabe.glb", "crabe");
   
    let bat = new Bat(2,"bat",3,20,5,250);
    bat.createMob(scene,"models/Persos/","bat.glb","bat");
    /*
    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "bat.glb", scene, function (meshes) {  
        let bat = meshes[0];
        bat.scaling = new BABYLON.Vector3(20, 20, 20); 
        bat.name = "bat";
        bat.position.x = 1040;
        bat.position.z =2000;
        //let crabeMob = new Mob(crabe,this.vitesse,this.attaque,this.defense,this.vie);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "chicken.glb", scene, function (meshes) {  
        let chicken = meshes[0];
        chicken.scaling = new BABYLON.Vector3(20, 20, 20); 
        chicken.name = "chicken";
        chicken.position.x = 1080;
        chicken.position.z =2000;
        //let crabeMob = new Mob(crabe,this.vitesse,this.attaque,this.defense,this.vie);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "demon.glb", scene, function (meshes) {  
        let demon = meshes[0];
        demon.scaling = new BABYLON.Vector3(20, 20, 20); 
        demon.name = "demon";
        demon.position.x = 1120;
        demon.position.z =2000;
        //let crabeMob = new Mob(crabe,this.vitesse,this.attaque,this.defense,this.vie);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "monster.glb", scene, function (meshes) {  
        let monster = meshes[0];
        monster.scaling = new BABYLON.Vector3(20, 20, 20); 
        monster.name = "monster";
        monster.position.x = 1160;
        monster.position.z =20,00;
        //let crabeMob = new Mob(crabe,this.vitesse,this.attaque,this.defense,this.vie);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/Persos/", "tree.glb", scene, function (meshes) {  
        let tree = meshes[0];
        tree.scaling = new BABYLON.Vector3(20, 20, 20); 
        tree.name = "tree";
        tree.position.x = 1200;
        tree.position.z =2000;
        //let crabeMob = new Mob(crabe,this.vitesse,this.attaque,this.defense,this.vie);
    });*/
}