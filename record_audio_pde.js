/**
 * @name Mic Input
 * @description <p>Get audio input from your computer's microphone.
 * Make noise to float the ellipse.</p>
 * <p>Note: p5.AudioIn contains its own p5.Amplitude object,
 * so you can call getLevel on p5.AudioIn without
 * creating a p5.Amplitude.</p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em></p>
 */
var input;  
var analyzer;
var SoundData = [];
var currentLocation;
var recording = null;
var amplitude;
var mySound;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //background(0)
  rectMode(RADIUS)
  
  // Create an Audio input
  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
  analyzer = new p5.FFT();
  analyzer.setInput(mic);
  amplitude.setInput(mic);
}

function draw() {
  background(255, 0.09);

  // Get the overall volume (between 0 and 1.0)
  var vol = mic.getLevel();
  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 200);
  var spectrum = analyzer.analyze();
  //var spectrumMax = 128;
  // because we don't need the entire spectrum (1024) we will truncate it
  spectrum.length = 256;
  fill(127);
  stroke(0);

  // Draw an ellipse with height based on volume
  var h = map(vol, 0, 1, height, 0);  
  
  translate(width/2, height/2)
  for (i = 0; i < spectrum.length; i) {
    rotate(TWO_PI/spectrum.length);
    
    // Set color Ranges
    colorMode(HSB);
    noStroke();
    var c = color(map(i, 0, spectrum.length, 30, 255), 255, 100);
    fill(c);
    
    // Circle 3
    push();
    rotate(PI);
    //fill(255,0.4);
    stroke(c);
    strokeWeight(2);
    //line( 50, 0, map(spectrum[i], 0, spectrum.length, 0, 500) + 50, 0);
    //ellipse( 50, 0, map(spectrum[i], 0, spectrum.length, 0, 500) + 50, 0);
    pop();

    //blendMode(SCREEN);
    // Points are plotted on circles from center outward
    push();
    //rotate(-PI/2);
    // Circle 1
    //stroke(0);
    ellipse(map(spectrum[i], 0, spectrum.length, 0, 255) + 100, 0, 5, 5);
    pop();
    //blendMode(MULTIPLY);
    // Cicle 2
    push();
    //rotate(PI);
    noStroke();
    fill(c);
   
    ellipse(map(spectrum[i], 0, spectrum.length, 0, 255) + 150, 0, 5, 5);
    pop();
          
    //vertex(i, map(spectrum[i], 0, 255, height, 0) );
    // console.log(size);
  }
}