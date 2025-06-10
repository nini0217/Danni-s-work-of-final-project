let sound;
let fft;
let audioButton;
let numBins = 64; // Number of frequency bins in FFT analysis
let smoothing = 0.8; // Smoothing factor for FFT (0 = no smoothing, 1 = lots of smoothing)

// Load audio before sketch starts
function preload() {
  sound = loadSound('assets/352072_2305278-lq.mp3'); // Replace with your own audio path
}

function setup() {
  // Set up canvas and generate base visuals (if defined externally)
  if (typeof CanvasManager !== 'undefined') {
    CanvasManager.setupCanvas();
  }
  if (typeof circleSystem !== 'undefined') {
    circleSystem.generateCircles();
  }

  // Create FFT object for frequency analysis
  fft = new p5.FFT(smoothing, numBins);
  sound.connect(fft); // Connect sound to the FFT

  // Create a button to toggle play/pause
  audioButton = createButton('Play / Pause');
  audioButton.position((width - audioButton.width) / 2, height - audioButton.height - 20);
  audioButton.mousePressed(toggleAudio);

  loop(); // Enable continuous draw loop (important when using audio)
}

function draw() {
  // Clear canvas
  if (typeof CanvasManager !== 'undefined') {
    CanvasManager.clearBackground();
  }

  // Get full frequency spectrum and map bass energy to a scaling factor
  let spectrum = fft.analyze();
  let energy = map(fft.getEnergy("bass"), 0, 255, 0.9, 1); // Values between 0.9 and 1 for subtle pulsing

  console.log("Energy:", energy); // Debug: print energy values

  window.scaleOverride = energy; // Store global scale
  let scaleFactor = window.scaleOverride;

  // Draw all decorative wheels with scale applied
  if (typeof circleSystem !== 'undefined' && typeof DecorateWheels !== 'undefined') {
    for (let i = 0; i < circleSystem.circles.length; i++) {
      const c = circleSystem.circles[i];
      DecorateWheels.drawWheel(c, scaleFactor); // drawWheel must accept scaleFactor as second arg
    }
  }

  // Particle rendering block
  if (window.particles) {
    // Loop through particles in reverse to allow safe removal
    for (let i = window.particles.length - 1; i >= 0; i--) {
      const p = window.particles[i];

      // Set fill color with alpha transparency
      noStroke();
      fill(p.col.levels[0], p.col.levels[1], p.col.levels[2], p.alpha);

      // Draw particle as a small circle
      ellipse(p.x, p.y, p.r);

      // Update particle position based on velocity
      p.x += p.vx;
      p.y += p.vy;

      // Fade out particle over time
      p.alpha -= 4;

      // Remove particle if fully transparent
      if (p.alpha <= 0) window.particles.splice(i, 1);
    }
  }
}

// Reposition canvas and button when window is resized
function windowResized() {
  if (typeof CanvasManager !== 'undefined') {
    CanvasManager.resizeCanvas();
  }
  if (audioButton) {
    audioButton.position((width - audioButton.width) / 2, height - audioButton.height - 20);
  }
}

// Toggle audio playback
function toggleAudio() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}