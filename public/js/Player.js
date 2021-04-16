Player = function(game, canvas){
    // La scène du jeu
    this.scene = game.scene;
    
    // Initialisation de la caméra
    this._initCamera(this.scene, canvas);
};

Player.prototype = {
    _initCamera: function(scene, canvas){
        // Création de la camera
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-200,50,50), scene);

        // On demande à la caméra de regarder au point zéro de la scène
        this.camera.setTarget(new BABYLON.Vector3(0,0,1000));

        // On affecte le mouvement de la caméra au canvas
        this.camera.attachControl(canvas, true);
    }
};