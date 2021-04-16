export default class Mob {
    constructor(mobMeshes,nom,niveau,vitesse,attaque,defense,vie) {
        this.mobMeshes = mobMeshes;
        this.nom = nom;
        this.niveau = niveau;
        this.vitesse = vitesse;
        this.attaque = attaque;
        this.defense = defense;
        this.vie = vie;
    }

    createMob(scene,chemin,fichier,name){    
        BABYLON.SceneLoader.ImportMesh("", chemin, fichier, scene, function (meshes) {  
            let mob = meshes[0];
            let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
            mobMaterial.diffuseTexture = new BABYLON.Texture(chemin + name + "_Texture.png");
            mob.scaling = new BABYLON.Vector3(20, 20, 20); 
            mob.name = name;
            mob.position.x = 1000 + Math.random()*500;
            mob.position.z = 1500 + Math.random()*500;
            mob.material = mobMaterial;
        });
        let mob = scene.getMeshByName(name);
    }
    
    //attack()
    //defend()
    //move()
}