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
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/Skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
};
function createGround(scene) {
    const groundOptions = { width:6000, height:6000, subdivisions:500, minHeight:-100, maxHeight:200, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm","images/hmap12.png",groundOptions, scene);
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);


        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/sable.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}
window.addEventListener("resize", () => {
    engine.resize()
});
