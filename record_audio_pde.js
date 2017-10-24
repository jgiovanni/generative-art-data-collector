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

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
  analyzer = new p5.FFT();
  analyzer.setInput(mic);
  
  // Start Geolocation Watch
  var watchID = navigator.geolocation.watchPosition(function(position) {
    currentLocation = position;
  }, function() {}, { enableHighAccuracy: true, });
  
  button = createButton('Start Recording');
  button.position(windowWidth/2, windowHeight*.9);
  button.mousePressed(toggleRec);
}

function draw() {
  background(200);

  // Get the overall volume (between 0 and 1.0)
  var vol = mic.getLevel();
  var spectrum = analyzer.analyze();
  // because we don't need the entire spectrum (1024) we will truncate it
  spectrum.length = 256;
  fill(127);
  stroke(0);

  // Draw an ellipse with height based on volume
  var h = map(vol, 0, 1, height, 0);
  ellipse(width/2, h - 25, 50, 50);
  
  beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) );
   }
  
  // Now we want to save this data to a json file
  // We can do the by saving the data to localstorage 
  // then export the json when pressing a key
  if (recording) {
    SoundData.push({ volume: vol, spectrum: spectrum, timestamp: new Date().toISOString(), geolocation: currentLocation })
    console.log(SoundData);
  }
}

function toggleRec() {
  if (recording === null) {
    recording = true;
    button.html("Stop Recording")
  } else {
    if (recording) {
      recording = false;
      saveJSON(SoundData, "atelier-data");
    } else {
      button.html("Start Recording")
      recording = true;
      //navigator.geolocation.clearWatch(watchID);
    }
  }
}