export default class Mob {
    constructor(mobMeshes,nom,niveau,vitesse,attaque,defense,vie) {
        this.mobMeshes = mobMeshes;
        this.nom = nom;
        this.niveau = niveau;
        this.vitesse = vitesse;
        this.attaque = attaque;
        this.defense = defense;
        this.vie = vie;

        mobMeshes.Mob = this;

        //Plus de undefined ici ! Mais getboundinginfo de totalboundinginfo ne fonctionne pas
       /*if (Mob.boundingBoxParameters == undefined) {
            Mob.boundingBoxParameters = this.calculateBoundingBoxParameters();
        }

        this.bounder = this.createBoundingBox();
        this.bounder.mobMeshes = this.mobMeshes;*/
    }

    createMob(scene,chemin,fichier,name){
        BABYLON.SceneLoader.ImportMesh("", chemin, fichier, scene, function (meshes) {  
            let mob = meshes[0];
            let mobMaterial = new BABYLON.StandardMaterial("mobTexture", scene);
            mobMaterial.diffuseTexture = new BABYLON.Texture(chemin + name + "_Texture.png");
            mob.scaling = new BABYLON.Vector3(20, 20, 20); 
            mob.name = name;
            mob.position.x = 40 + Math.random()*20;
            mob.position.z = 50 + Math.random()*20;
            mob.position.y = 6;
            mob.material = mobMaterial;
        });
    }
    
    //attack()
    //defend()
    //move()
    
    //pas sure qu'elle sert cette fonction
    calculateBoundingBoxParameters() {
        // Compute BoundingBoxInfo for the Dude, for this we visit all children meshes
        let childrenMeshes = this.mobMeshes.getChildren();
        let bbInfo = this.totalBoundingInfo(childrenMeshes);
        return bbInfo;
    }

    
    totalBoundingInfo(meshes){
        //ce console.log c'esr l'endroit exact où on peut trouver les boundinginfo qu'il faut
        //console.log(this.mobMeshes._children[0]._children[0].getBoundingInfo())
        var boundingInfo = meshes[0].getBoundingInfo();
        var min = boundingInfo.minimum.add(meshes[0].position);
        var max = boundingInfo.maximum.add(meshes[0].position);
        for(var i=1; i<meshes.length; i++){
            boundingInfo = meshes[i].getBoundingInfo();
            min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
            max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
        }
        return new BABYLON.BoundingInfo(min, max);
    }
    
    //et celle la aussi car on a une bounding box entiere nous contrairement au Dude
    createBoundingBox() {
        let bounder = new BABYLON.Mesh.CreateBox("bounder" + (this.id).toString(), 1, this.scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", this.scene);
        bounderMaterial.alpha = .4;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;

        bounder.position = this.mobMeshes.position.clone();

        let bbInfo = Mob.boundingBoxParameters;

        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;

        // Not perfect, but kinda of works...
        // Looks like collisions are computed on a box that has half the size... ?
        bounder.scaling.x = (max._x - min._x) * this.scaling;
        bounder.scaling.y = (max._y - min._y) * this.scaling*2;
        bounder.scaling.z = (max._z - min._z) * this.scaling*3;

        //bounder.isVisible = false;

        return bounder;
    }
}