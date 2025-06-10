// danni-g.js
// DecorateWheels is responsible for rendering each visual "wheel" using layered circles, dots, and a central core.
const DecorateWheels = {
  // Draws a decorative wheel based on provided circle data 'c' and an optional scaleFactor (default = 1)
  drawWheel: function(c, scaleFactor = 1) {
    const x = c.x;
    const y = c.y;
    const radius = c.radius * scaleFactor;  // Apply dynamic scaling if defined externally
    const cols = c.cols;                    // Array of colors for each ring layer
    const centerCol = c.centerCol;          // Color for the center circle

    push();
    translate(x, y); // Set (0,0) to the center of the current wheel
    noFill();        // No fill for rings, only stroke

    // === Decorative rings + radial dots ===
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const layerR = radius - i * (radius / circleSystem.LAYERS); // Calculate radius for this layer

      stroke(col);
      strokeWeight(2);
      ellipse(0, 0, layerR * 2); // Draw concentric ring

      // Draw dots around the ring's circumference
      const numPoints = 36 + i * 6; // Increase dot density with each layer
      for (let j = 0; j < numPoints; j++) {
        const ang = (TWO_PI / numPoints) * j;
        const px = cos(ang) * layerR;
        const py = sin(ang) * layerR;
        noStroke();
        fill(col);
        ellipse(px, py, radius * 0.05); // Draw small dot at calculated position
      }
    }

    // === Central circle ===
    stroke(centerCol);
    strokeWeight(radius * 0.05);
    ellipse(0, 0, radius * 0.5); // Draw central solid circle
    
    // === Add waveform ripple to two outer layers: outermost and second outer layer ===
    const waveform = fft.waveform();          // Get current audio waveform data
    const waveLayers = [0, 1];                // Indexes of the layers to apply ripple (outermost and second layer)
    const numPoints = 120;                    // Number of vertices used to draw each ripple shape

    for (let w = 0; w < waveLayers.length; w++) {
      const idx = waveLayers[w];             // Layer index to apply ripple
      if (idx < cols.length) {
        const waveR = radius - idx * (radius / circleSystem.LAYERS); // Base radius for this layer
        const waveColor = cols[idx];         // Use the same stroke color as the ring

        noFill();
        stroke(waveColor);
        strokeWeight(1.5);
        beginShape();

        // Generate ripple shape using waveform data
        for (let j = 0; j < numPoints; j++) {
          const angle = (TWO_PI / numPoints) * j;
          const waveIndex = floor(map(j, 0, numPoints, 0, waveform.length)); // Map to waveform array index
          const waveOffset = waveform[waveIndex] * 25;                       // Convert waveform value to offset
          const r = waveR + waveOffset;                                      // Final radius with ripple
          const px = cos(angle) * r;
          const py = sin(angle) * r;
          vertex(px, py); // Plot each point of the ripple shape
        }

        endShape(CLOSE); // Complete the ripple ring
      }
    }

    // === Emit particles from the two outermost layers ===
    const particleLayers = [0, 1]; // Indexes for outermost and second outer layer
      for (let k = 0; k < particleLayers.length; k++) {
        const idx = particleLayers[k];
        if (idx < cols.length) {
          const col = cols[idx]; // Get stroke color for this layer
          const layerR = radius - idx * (radius / circleSystem.LAYERS); // Radius for this layer

          // Choose a random direction around the circle
          const angle = random(TWO_PI);
          const px = cos(angle) * layerR;
          const py = sin(angle) * layerR;

          // Create a new particle object
          if (sound.isPlaying() && fft.getEnergy("bass") > 180) {
            const particle = {
              x: x + px,                        // Initial x-position on the ring
              y: y + py,                        // Initial y-position on the ring
              vx: cos(angle) * random(1, 2),    // Velocity in x-direction
              vy: sin(angle) * random(1, 2),    // Velocity in y-direction
              r: 4,                             // Radius of the particle
              alpha: 255,                       // Transparency for fading effect
              col: col                          // Color matching the ring
            };

            // Store particle in global array if exists, otherwise initialize it
            if (!window.particles) window.particles = [];
            window.particles.push(particle); // Add to particle system
          }
        }
      }

      pop(); // Restore previous drawing state
  },

  // Utility function to generate a random RGB color
  randomColor: function () {
    return color(random(255), random(255), random(255));
  }
};