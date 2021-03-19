window.onload = init;
let canvas;

function init(){
    canvas = document.querySelector("#renderCanvas");

    var moteur = new BABYLON.Engine(canvas,true);
    var scene = new BABYLON.Scene(moteur);
}
