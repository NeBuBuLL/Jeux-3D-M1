window.onload = init;
let canvas;
let dimPlan = 10;

function init(){
    canvas = document.querySelector("#renderCanvas");

    var moteur = new BABYLON.Engine(canvas,true);
    var scene = new BABYLON.Scene(moteur);

    //l'emplacement de la lumière est (2,20,0) et porte sur la scene
    var light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(1, 1, 1),scene);
    //Permet de régler l'intensité de la lumière (matte)
    light.specular = new BABYLON.Color3(0,0,0);

    //camera rotative temporaire avec comme target : new BABYLON.Vector3(0, 0, 0)
    var camera = new BABYLON.ArcRotateCamera("camera",0,0,10, new BABYLON.Vector3(0, 0, 0), scene);
    //definie ou la camera va regarder au départ
    camera.setTarget(new BABYLON.Vector3.Zero());
    //camera.noRotationConstraint = true;  
    camera.attachControl(canvas,true);

    //creation du ground et de sa texture
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: dimPlan-0.1, height: dimPlan}, scene);
    var textureplane = new BABYLON.StandardMaterial("textureS",scene);
    textureplane.diffuseTexture = new BABYLON.Texture("assets/sol.jpg",scene);
    ground.material = textureplane;


    //Permet de lancer la scene et je penses que dedans faudra lancer nos fonctions etc.. et que c'est ça qu'on avait pas bien fait
    moteur.runRenderLoop(() => {scene.render();});
}
