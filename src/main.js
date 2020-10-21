// d3 for selections
let main = d3.select("main");
let scrolly = main.select("#scrolly");
//  let figure = scrolly.select("figure");
let article = scrolly.select("article");
let step = article.selectAll(".step");

let button = document.getElementById("form-button");
let nombre = document.getElementById("nombre");
let nacio = document.getElementById("nacio");
let murio = document.getElementById("murio");

let partsOn = false;
let coreoOn = false;
let formOn = false;
let jamOn = false;
let altarOn = false;
let transOn = false;

let jam01On;
let jam02On;
let jam03On;


if ( nombre.value && nacio.value && murio.value ) {
  button.disabled = false;
  console.log(nombre.value, nacio.value, murio.value)
} 

// initialize the scrollama
let scroller = scrollama();

// generic window resize listener event
function handleResize() {
  let stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

//  let figureHeight = window.innerHeight / 2;
//  let figureMarginTop = (window.innerHeight - figureHeight) / 2;
//  figure
//    .style("height", figureHeight + "px")
//    .style("top", figureMarginTop + "px");

  scroller.resize();
}

 // scrollama event handlers
 function handleStepEnter(response) {
   console.log(response);
   // response = { element, direction, index }

   if (response.index > 0 && !coreoOn) {
    coreoOn = true;
    partsOn = true;
   } else if (response.index > 3 && coreoOn) {
    coreoOn = false;
    partsOn = false;
    formOn = true;
    console.log(formOn);
   } 

  // if (response.index === 5 || response.index === 6 || response.index === 7 ) {
  //     coreoOn = false;
  //     partsOn = true;
  //     jamOn = true;
  //     console.log("jamOn")
  // }

  if (response.index === 5 ) {
    coreoOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam01On = true;
    console.log("jam01On")
  }
  if (response.index === 6 ) {
    coreoOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam01On = false;
    jam02On = true;
    console.log("jam02On")
  }
  if (response.index === 7 ) {
    coreoOn = false;
    partsOn = true;
    jamOn = true;
    console.log("jamOn")
    jam02On = false;
    jam03On = true;
    console.log("jam03On")
  }


  if (response.index > 7 ) {
      jamOn = false;
      jam03 = false;

      transOn = true;
      partsOn = true;
      console.log("transOn")
  }

  if (response.index > 8 ) {
      altarOn = true;
      partsOn = true;
      console.log("petalsOn")
  }

  if (response.direction == "down") {
    // add color to current step
    step.classed("is-active", function (d, i) {
      return i === response.index;
    });
  }

   // update graphic based on step
  //  figure.select("p").text(response.index + 1);
  //  figure.select("p").text(textos[response.index]);
 }

 function setupStickyfill() {
   d3.selectAll(".sticky").each(function() {
     Stickyfill.add(this);
   });
 }

 function init() {
   setupStickyfill();
   handleResize();

   scroller
     .setup({
       step: "#scrolly article .step",
       offset: 0.65,
       debug: false
     })
     .onStepEnter(handleStepEnter);

   // setup resize event
   window.addEventListener("resize", handleResize);
 }

 // run script
 init();
