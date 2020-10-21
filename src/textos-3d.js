let inputTexto = "muchas gracias por todo";
let inputNacio = "";
let inputMurio = "";
let canvas;
let angle = 0;
let textTexture;


function setup() {
  noCanvas();  
  // smooth();
  canvas = createCanvas(800, 800, WEBGL).parent('poema-altar');
  // canvas = createCanvas(500, 800, WEBGL).parent('poema-altar');

  background(0,0);

  textTexture = createGraphics(800,800);
  textTexture.fill(255);
  textTexture.textAlign(CENTER);
  textTexture.textSize(40);
  textTexture.text(inputTexto, 400, 400);

}

function draw() {
  clear();
  // fill(255);
  noStroke();
  // rectMode(CENTER);


  // pointLight(255, 200, 100, mouseX-200, mouseY-200)
  let dx = mouseX - width/2;
  let dy = mouseY - height/2;
  let v = createVector(dx, dy, 0);
  v.normalize();
  directionalLight(255,200,0, v);

  //se puede mezclar con otras luces, que interactuan entre sí
  // ambientLight(255,255,0);

  // textAlign(CENTER, CENTER);
  // textSize(32);
  // textFont('Cormorant Garamond');
  // normalMaterial();
  // basicMaterial(200, 200, 0);
  ambientMaterial(255, 150, 0);
  // translate(mouseX - width/2,  mouseY - height/2) 
  rotateX(angle)
  rotateY(angle)
  rotateZ(angle)
  // rect(0,0,150,150);
  texture(textTexture);
  plane(400);
  // torus(100, 30);
  // text(inputTexto, width/2, height - height/5);
  angle+=0.05;
}