/**
 * Audio-reactive sketch with visual scaling and particle effects.
 * Uses FFT to map bass energy to global visual scale and to trigger particles.
 */

// Declare global variables for audio, FFT, and UI
let sound;
let fft;
let audioButton;
let numBins = 64; // Number of frequency bins in FFT analysis
let smoothing = 0.8; // Smoothing factor for FFT (0 = no smoothing, 1 = lots of smoothing)

/**
 * Step 1: Load audio before setup begins.
 * We use preload() to ensure the file is fully available before anything starts.
 */
function preload() {
  sound = loadSound('assets/352072_2305278-lq.mp3'); // Replace with your own audio path
}

/**
 * Step 2: Setup the canvas, FFT analysis, and play/pause button.
 */
function setup() {
  // Set up canvas and generate base visuals (if defined externally)
  if (typeof CanvasManager !== 'undefined') {
    CanvasManager.setupCanvas();
  }
  if (typeof circleSystem !== 'undefined') {
    circleSystem.generateCircles();
  }

  /**
   * Initialize p5.FFT with smoothing and number of bins.
   * Connect the loaded sound to the FFT analyzer.
   */
  fft = new p5.FFT(smoothing, numBins);
  sound.connect(fft); // Connect sound to the FFT


  /**
   * Create a UI button to toggle playback.
   * Position the button near the bottom center of the canvas.
   */
  audioButton = createButton('Play / Pause');
  audioButton.position((width - audioButton.width) / 2, height - audioButton.height - 20);
  audioButton.mousePressed(toggleAudio);

  loop(); // Enable continuous draw loop (important when using audio)
}

/**
 * Step 3: Draw visuals each frame, based on FFT data and system state.
 */
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

  /**
   * Step 4: Particle rendering block.
   * Loops through particles, updates their position and alpha, and draws them.
   * Particles are removed once fully transparent.
   */
      // ==== Reference Acknowledgement ====
    // Certain techniques in this sketch were adapted from the work of sudhanshu :
    // https://openprocessing.org/sketch/1614870
    // Specifically:
    // - The radial particle system using p5.Vector.random2D() for directional spawn
    // - Combining waveform data with FFT.getEnergy() to drive radius-based wave distortion
    // - Color mapping using HSB mode for particle and shape layering
    // These techniques have been integrated into my group's visual structure
    // and further extended with original layout and animation logic.
    const particleLayers = [0, 1]; // Indexes for outermost and second outer layer
  if (window.particles) {
    for (let i = window.particles.length - 1; i >= 0; i--) {
      const p = window.particles[i];
      noStroke();
      fill(p.col.levels[0], p.col.levels[1], p.col.levels[2], p.alpha);
      ellipse(p.x, p.y, p.r);
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 4;
      if (p.alpha <= 0) window.particles.splice(i, 1);
    }
  }
}

/**
 * Step 5: Update canvas and UI layout when window is resized.
 */
function windowResized() {
  if (typeof CanvasManager !== 'undefined') {
    CanvasManager.resizeCanvas();
  }
  if (audioButton) {
    audioButton.position((width - audioButton.width) / 2, height - audioButton.height - 20);
  }
}

/**
 * Step 6: Toggle playback of audio when button is pressed.
 */
function toggleAudio() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}