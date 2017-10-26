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
var locationData, 
    locationDataIndex = 0, 
    mySound, 
    locationPosition = { x: 100, y: 200 },
    locationRotation = [0, 0, 0]

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
  mySound.setVolume(0.18);
  mySound.play();
  
  // By default, it does not .connect() (to the computer speakers)
  //mic.start();
  analyzer = new p5.FFT();
  analyzer.setInput(mySound);
  amplitude.setInput(mySound);
}

function draw() {
  background(255, 0.09);

  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 200);
  var spectrum = analyzer.analyze();
  var waveform = analyzer.waveform();

  // because we don't need the entire spectrum (1024) we will truncate it
  spectrum.length = 512;
  fill(127);
  stroke(0);
  
  translate(width/2, height/2);
    
  for (i = 0; i < spectrum.length; i++) {
    // evenly distribute specturm in a circle
    rotate(TWO_PI/spectrum.length);
    
    // Set color Value
    colorMode(HSB);
    noStroke();
    var c = color(map(i, 0, spectrum.length, 0, 360), 100, 100);
    fill(c);

    // Circlular Lines 1
    push();
    stroke(c);
    strokeWeight(1);
    line( size + 50, 0,  size + spectrum[i] + 50, 0);
    //ellipse( 50, 0, map(spectrum[i], 0, 255, 0, 500) + 50, 0);
    pop();

    // Circles are plotted on line caps from center outward
    push();
    // Circle 2
    ellipse(map(spectrum[i], 0, 255, 0, 255) + 100, 0, 5, 5);
    pop();
  }
   
  for (i = 0; i< waveform.length; i++){
    // evenly distribute waveform values in a circle
    rotate(TWO_PI/waveform.length);
    
    // Set color Ranges
    noStroke();
    fill(0);

    push();
    //blendMode(MULTIPLY);
    ellipse(map(waveform[i], -1, 1, 0, 100) + 150, 0, 2, 2);
    pop();
  }
  
  push()
  //blendMode(SCREEN)
  // invert color
  //c.levels[0] = abs(255 - c.levels[0]);
  //c.levels[1] = abs(255 - c.levels[1]);
  //c.levels[2] = abs(255 - c.levels[2]);
  // console.log(c);
  fill(0, 0.75);
  ellipse(locationPosition.x, locationPosition.y, 50, 50);
  if (locationDataIndex < locationData.data.length) {
    switch(locationData.data[locationDataIndex].sensor_name) {
      case "LGE Linear Acceleration Sensor":
        locationPosition.x -= locationData.data[locationDataIndex].value[0] * 20;
        locationPosition.y -= locationData.data[locationDataIndex].value[1] * 20;
        break;
      case "LGE Magnetometer":
        locationRotation = abs(locationRotation[0]) - locationData.data[locationDataIndex].value[0];
        rotate(locationRotation[0]);
        break;
      case "LG Motion Accel":
        break;
    }
  }
  locationDataIndex++;
  blendMode(BLEND)
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 32) {
    saveFrames("commute-visualization-", "jpg", 1, 25);
  }
}