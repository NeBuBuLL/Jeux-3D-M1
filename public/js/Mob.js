export default class Mob {
    constructor(mobMeshes,name,level,speed,attack,defense,health, scene) {
        this.mobMeshes = mobMeshes;
        this.name = name;
        this.level = level;
        this.speed = speed;
        this.attack= attack;
        this.defense = defense;
        this.health = health;
        this.scene = scene;
        mobMeshes.Mob = this;
    }

    getLevel(){
        return this.level;
    }
    getDefense(){
        return this.defense;
    }
    attackPlayer(playerMesh){
        playerMesh.takeDamage(this.attack - 0,25 * playerMesh.getDefense());
    }

    takeDamage(damage){
        if (this.health > 0){
            this.health -= damage;
        }
    }
    giveXp(playerMesh){
        //ne gagne plus d'xp si le joueur est plus haut niveau d'au moins 3 level
        let diff_level = playerMesh.getLevel() - this.level;
        if (diff_level < 3){
            playerMesh.addXp(10 * (this.level - diff_level));
        }
        else if (diff_level >= 3){
            playerMesh.addXp(0);
        }
    }

    dead(playerMesh){
        if (this.health <= 0){
            this.giveXp(playerMesh);
        }
    }
    
    //pas sure qu'elle sert cette fonction
    calculateBoundingBoxParameters() {
        // Compute BoundingBoxInfo for the Mob, for this we visit all children meshes
        let childrenMeshes = this.mobMeshes.getChildren();
        let bbInfo = this.totalBoundingInfo(this.mobMeshes);
        return bbInfo;
    }

    
    totalBoundingInfo(meshes){
        //ce console.log c'esr l'endroit exact où on peut trouver les boundinginfo qu'il faut
        //console.log(this.mobMeshes._children[0]._children[0].getBoundingInfo())
        var boundingInfo = meshes[0]._children[0]._children[0].getBoundingInfo();
        meshes[0]._children[0]._children[0].showBoundingBox = true;
        var min = boundingInfo.minimum.add(meshes[0].position);
        var max = boundingInfo.maximum.add(meshes[0].position);
        for(var i=1; i<meshes.length; i++){
            boundingInfo = meshes[i]._children[0]._children[0].getBoundingInfo();
            min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
            max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
        }
        return new BABYLON.BoundingInfo(min, max);
    }
    
    createBoundingBox() {
        let bounder = new BABYLON.Mesh.CreateBox("bounder", 1, this.scene);
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

        bounder.isVisible = true;

        return bounder;
    }
}