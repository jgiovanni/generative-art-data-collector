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
var input, i;  
var analyzer;
var SoundData = [];
var currentLocation;
var recording = null;
var amplitude;
var locationData, locationDataIndex = 0, mySound, position;

function preload() {
  soundFormats('mp3');
  //mySound = loadSound('data/sample.mp3');
  mySound = loadSound('data/subway.mp3');
  locationData = loadJSON('data/data.json')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //background(0)
  rectMode(RADIUS)
  
  // Create an Audio input
  //mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  // start the Audio Input.
  mySound.setVolume(0.1);
  mySound.play();
  
  // By default, it does not .connect() (to the computer speakers)
  //mic.start();
  analyzer = new p5.FFT();
  analyzer.setInput(mySound);
  amplitude.setInput(mySound);
  
  
  position = { x: 100, y: 200 };
  //locationDataIndex = 0
  //setInterval(function() {
  //  push();
  //  translate(-width/2, -height/2);
  //  fill(0);
  //  ellipse(position.x, position.y, 10, 10);
  //  if (locationDataIndex < locationData.data.length) {
  //    if (locationData.data[locationDataIndex].sensor_name === "LGE Linear Acceleration Sensor") {
  //      position.x -= locationData.data[locationDataIndex].value[0] * 10;
  //      position.y -= locationData.data[locationDataIndex].value[1] * 10;
  //    }
  //  }
  //  locationDataIndex++;
  //  pop();
  //}, 100);
  
}

function draw() {
  background(255, 0.1);

  // Get the overall volume (between 0 and 1.0)
  //var vol = mic.getLevel();
  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 200);
  var spectrum = analyzer.analyze();
  var waveform = analyzer.waveform();

  // because we don't need the entire spectrum (1024) we will truncate it
  spectrum.length = 512;
  fill(127);
  stroke(0);

  // Draw an ellipse with height based on volume
  //var h = map(vol, 0, 1, height, 0);  
  
  translate(width/2, height/2);
    
  for (i = 0; i < spectrum.length; i++) {
    rotate(TWO_PI/spectrum.length);
    
    // Set color Ranges
    colorMode(HSB);
    noStroke();
    var c = color(map(i, 0, spectrum.length, 0, 360), 100, 100);
    fill(c);
    
    push();
   
    pop();
    // Circlular Lines 3
    push();
    
    //rotate(PI);
    //fill(255,0.4);
    stroke(c);
    strokeWeight(1);
    line( size + 50, 0,  size + spectrum[i] + 50, 0);
    //ellipse( 50, 0, map(spectrum[i], 0, 255, 0, 500) + 50, 0);
    pop();

    //blendMode(SCREEN);
    // Points are plotted on circles from center outward
    push();
    //rotate(-PI/2);
    // Circle 1
    //stroke(0);
    ellipse(map(spectrum[i], 0, 255, 0, 255) + 100, 0, 5, 5);
    pop();
    //blendMode(MULTIPLY);
    // Cicle 2
    push();
    noStroke();
    fill(c);
   
    //ellipse(map(spectrum[i], 0, 255, 0, 255) + 150, 0, 5, 5);
    pop();
          
    //vertex(i, map(spectrum[i], 0, 255, height, 0) );
    // console.log(size);
  }
  
  //push();
  //rotate(frameCount/80)
  //// Hex Mask
  //var hexSize = size + 75;
  //fill(255);
  //noStroke();
  //beginShape();
  //vertex(hexSize * cos(0), hexSize * sin(0));
  //for (var side = 0; side < 7; side++) {
  //  vertex(hexSize * cos(side * 2 * PI / 6), hexSize * sin(side * 2 * PI / 6));
  //}
  //endShape();
  //pop();
   
  for (i = 0; i< waveform.length; i++){
    rotate(TWO_PI/waveform.length);
  // Set color Ranges
    colorMode(HSB);
    noStroke();
    var c = color(map(i, 0, waveform.length, 0, 360), 100, 100);
    fill(0);

    push();
    //blendMode(MULTIPLY);
    ellipse(map(waveform[i], -1, 1, 0, 100) + 150, 0, 2, 2);
    pop();
  }
  
  fill(0);
  ellipse(position.x, position.y, 10, 10);
  if (locationDataIndex < locationData.data.length) {
    if (locationData.data[locationDataIndex].sensor_name === "LGE Linear Acceleration Sensor") {
      position.x -= locationData.data[locationDataIndex].value[0] * 10;
      position.y -= locationData.data[locationDataIndex].value[1] * 10;
    }
  }
  locationDataIndex++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 32) {
    saveFrames("commute-visualization-", "jpg", 1, 25);
  }
}