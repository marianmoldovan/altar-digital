// P_2_3_3_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * draw tool. shows how to draw with dynamic elements.
 *
 * MOUSE
 * drag                : draw with text
 *
 * KEYS
 * del, backspace      : clear screen
 * arrow up            : angle distortion +
 * arrow down          : angle distortion -
 * s                   : save png
 */
'use strict';

var x = 0;
var y = 0;
var stepSize = 5.0;

// var font = 'Georgia';
var letters = '';
var fontSizeMin = 3;
var angleDistortion = 0.0;

var counter = 0;

let canvas;
let textInput;
let formButton;

let jam01;
let jam02;
let jam03;
let transicion;
let altar;

function setup() {
  // use full screen size
  canvas = createCanvas(800, 800).parent('poema-altar');

  // createCanvas(displayWidth, displayHeight);
  background(255,0);
  cursor(CROSS);

  x = mouseX;
  y = mouseY;

  // textFont(font);
  textFont('Cormorant Garamond');

  textAlign(LEFT);
  fill(255);

  textInput = select("#text-input");
  jam01 = select("#jam01");
  jam02 = select("#jam02");
  jam03 = select("#jam03");
  transicion = select("#transicion");
  altar = select("#altar");
  // console.log("text input:" + textInput);

  formButton = select("#form-button");
  formButton.mousePressed(replaceText);

  


}

function draw() {
  if (mouseIsPressed && mouseButton == LEFT) {
    var d = dist(x, y, mouseX, mouseY);
    textSize(fontSizeMin + d / 2);
    var newLetter = letters.charAt(counter);
    stepSize = textWidth(newLetter);

    if (d > stepSize) {
      var angle = atan2(mouseY - y, mouseX - x);

      push();
      translate(x, y);
      rotate(angle + random(angleDistortion));
      text(newLetter, 0, 0);
      pop();

      counter++;
      if (counter >= letters.length) counter = 0;

      x = x + cos(angle) * stepSize;
      y = y + sin(angle) * stepSize;
    }
  }
}

function mousePressed() {
  x = mouseX;
  y = mouseY;
}


function replaceText() {
  // console.log("holaaa form button");
  jam01.disabled = false;
  jam02.disabled = false;
  jam03.disabled = false;
  altar.disabled = false;
  jam01.removeClass("hide");
  jam02.removeClass("hide");
  jam03.removeClass("hide");
  transicion.removeClass("hide");
  altar.removeClass("hide");

  jam01.addClass("step");
  jam02.addClass("step");
  jam03.addClass("step");
  transicion.addClass("step");
  altar.addClass("step");
  letters = textInput.value();
  console.log(letters);
  return false;
}

// function keyReleased() {
//   if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
//   if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
// }

// function keyPressed() {
//   // angleDistortion ctrls arrowkeys up/down
//   if (keyCode == UP_ARROW) angleDistortion += 0.1;
//   if (keyCode == DOWN_ARROW) angleDistortion -= 0.1;
// }
