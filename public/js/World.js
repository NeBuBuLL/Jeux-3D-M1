export default class World{
    constructor( canvasId ) {
        this.canvas = document.querySelector(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = {};
        this.camera = {};
        this.light = {};
        this.map = {};
        this.loaded = false;
      }
  
      _initScene(){
          this.scene = new BABYLON.Scene(this.engine);
          this.scene.clearColor = new BABYLON.Color3(0,0,0);
          
          this.camera = new BABYLON.ArcRotateCamera("camera",0,0,10, new BABYLON.Vector3(0, 0, 0), this.scene);
          this.camera.setTarget(new BABYLON.Vector3.Zero());
          this.camera.attachControl(this.canvas,true);
      }
  
      doRender() {
          // Permet au jeu de tourner
          this.engine.runRenderLoop( () => {
              this.scene.render();
          });
  
          // Ajuste la vue 3D si la fenetre est agrandi ou diminué
          window.addEventListener("resize", () =>{
              this.engine.resize();
          });
      }
}