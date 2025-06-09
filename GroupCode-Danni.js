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

    pop(); // Restore previous drawing state
  },

  // Utility function to generate a random RGB color
  randomColor: function () {
    return color(random(255), random(255), random(255));
  }
};