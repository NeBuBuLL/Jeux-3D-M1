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
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: dimPlan, height: dimPlan}, scene);
    var textureplane = new BABYLON.StandardMaterial("textureS",scene);
    textureplane.diffuseTexture = new BABYLON.Texture("assets/sable.jpg",scene);
    ground.material = textureplane;

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/Skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
};

window.addEventListener("resize", () => {
    engine.resize()
});
