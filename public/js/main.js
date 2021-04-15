import World from './World.js';

window.addEventListener('DOMContentLoaded', () => {
  let world = new World('#renderCanvas');
  world._initScene();
  world.doRender();
  console.log("done");
});