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

    isDead = () =>{
        return this.health <= 0;
    }
    getLevel(){
        return this.level;
    }
    getDefense(){
        return this.defense;
    }
    attackPlayer(playerMesh){
        playerMesh.takeDamage(this.attack - playerMesh.getDefense());
    }

    takeDamage(damage){
        if (!this.isDead()){
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
        if (this.isDead()){
            this.giveXp(playerMesh);
        }
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