# **Wheel of Fortune – Audio-Driven Animation**

**By: Danni**

## **🎮 How to Interact**

Here is the **user guide** for experiencing my individual audio-driven contribution to the group project:

1. **Click the “Play / Pause” button** at the bottom of the screen to start or stop the music playback.
2. Once the audio begins, **all visual wheels on the canvas will pulsate** — expanding and contracting — in real time based on the **bass frequency energy** of the sound.
3. The **two outermost rings** of each wheel will display **circular ripple distortions** generated using the waveform data, producing a visual echo of the music.
4. When the bass intensity is **above a certain threshold**, you’ll see **particles emitted** from the edges of the outer rings. These particles disperse and gradually fade away, adding a sense of motion and energy decay.

> 📝 Note: All interactions are passive except for clicking the play button — the animations respond automatically to the music. The canvas also resizes responsively with the browser window.
> 

---

## **✨ My Individual Animation Approach**

### **🔊 Animation Driver:Real-Time Audio**

My animation is fully driven by the music that plays in the background. I use the p5.sound library’s FFT (Fast Fourier Transform) capabilities to extract real-time audio data, which I use to control several visual elements:

---

### **🔁 1.Bass-Responsive Scaling**

Using fft.getEnergy("bass"), I extract the current **bass frequency energy** (typically 60–250 Hz). This value is mapped to a scaling range of 0.9 to 1.0 and applied to every decorative wheel to create a subtle **pulsing effect** that synchronizes with the rhythm.

```jsx
let energy = map(fft.getEnergy("bass"), 0, 255, 0.9, 1);
window.scaleOverride = energy;
```

The scale factor is passed into each wheel via:

```jsx
DecorateWheels.drawWheel(c, scaleFactor);
```

This makes all the wheels feel like they’re “breathing” with the beat.

---

### **🌊 2.Waveform-Driven Ripple Distortion**

I apply additional visual distortion to the **two outermost rings** of each wheel using the raw waveform data from fft.waveform(). This creates a **radial ripple effect** — like an audio echo — around each wheel, using beginShape() and vertex() to dynamically distort the circular outline based on the waveform’s amplitude at each angle.

```jsx
const waveOffset = waveform[waveIndex] * 25;
const r = waveR + waveOffset;
vertex(cos(angle) * r, sin(angle) * r);
```

---

### **💥 3.Conditional Particle Emission (Bass > 180)**

To make the visuals even more dynamic, I added a **particle system** that emits small colored particles from the outer layers of each wheel — but only when two conditions are met:

- Music is currently playing
- The bass energy exceeds a threshold (> 180)

Each particle fades out and moves outward with a randomized velocity, adding to the visual rhythm.

```jsx
if (sound.isPlaying() && fft.getEnergy("bass") > 180) {
  // emit particle
}
```

---

### **🎨 Summary of My Unique Approach**

- **Control Mechanism**: Audio → FFT (energy + waveform)
- **Affected Visuals**: Ring scaling, waveform ripple, particle system
- **Visual Signature**: Dynamic, beat-synced, immersive energy

Compared to my teammates, each of us approached the animation from a unique angle:

- **I** used **real-time audio input** to drive all of my animations. My visuals respond dynamically to bass energy and waveform data, resulting in synchronized scaling, circular ripple distortion, and rhythmic particle bursts.
- **Regina** took an **interactive approach**, designing animations that respond directly to **mouse input**, allowing the user to influence the visual outcome manually.
- **Yaqi** employed **Perlin noise** to create smooth, continuously shifting motion patterns that give the visuals an organic, flowing quality over time.

This diversity in approach allowed us to explore different generative animation strategies while maintaining a shared visual structure.

---

## **🧠 References & Inspirations**

My work was inspired by a blend of **course materials**, **daily music app experiences**, and **creative community examples**. Below are the three key references that informed my individual animation approach:

### **🎓 1. Course Tutorial – Week 12: Sound in p5.js**

The foundation of this project comes from **Week 12’s p5.js sound tutorial**, where we were introduced to:

- Using fft.getEnergy() to retrieve real-time audio energy (particularly in the bass range)
- Visualizing sound through fft.waveform()
- Building a playback interface that responds to browser autoplay restrictions

These lessons directly influenced my implementation of **bass-driven scaling**, **waveform ripples**, and **conditional audio-triggered behavior** in the animation.

---

### **🎧 2. Music Player UI – NetEase Cloud Music**

As someone who listens to music daily, I’ve always been drawn to the aesthetic of **NetEase Cloud Music’s player interface**. Its clean waveform visualizations and flowing rings inspired my idea to implement **circular ripple distortions** around the wheel’s outer layers.

![NetEase Music Player Screenshot](./readmeImages/Netease_waveform_example.png)

This inspiration guided me to convert raw waveform data into polar coordinates, allowing the ripple shape to move with the beat — just like modern music visualizers do.

---

### **🌀 3. Particle Design – “Other Side of the Black Hole” (OpenProcessing)**

I discovered this [audio visualizer sketch on OpenProcessing](https://openprocessing.org/sketch/1614870) by sudhanshu and was immediately inspired by its **vortex-style particle movement**.
![Audio Visualizer By sudhanshu](./readmeImages/audio%20visualizer_openprocessing.png)
In particular:

- The way particles emit from waveform outlines
- The radial distribution using p5.Vector.random2D()
- The fade-out and edge detection logic

I adapted these ideas to my own system: particles are only emitted when the bass energy is intense (above 180), and they slowly fade and disperse, creating a dynamic ambient rhythm.

```jsx
if (sound.isPlaying() && fft.getEnergy("bass") > 180) {
  // emit particle from outer ring
}
```

This added an expressive, high-energy visual response tied directly to the music’s intensity.

---

### **🃏 4. Visual Symbolism – “Wheel of Fortune” in Tarot**

Beyond technical and aesthetic inspirations, the **conceptual foundation** of my work draws from the **“Wheel of Fortune” card in Tarot symbolism**.

![Tarot-Wheel of Fortune](./readmeImages/RWS_Tarot_10_Wheel_of_Fortune.jpg)

- The wheel represents the **cyclical nature of fate** — a system constantly in motion, governed by forces beyond our control.
- I used **pulsing circles**, **waveform ripples**, and **bass-triggered particle emissions** to metaphorically express this idea: a rhythm of change that is unpredictable yet patterned.
- The visual elements of rotation and expansion serve as **symbolic echoes of chance, timing, and the unknown** — just like the card’s meaning.

This metaphor gave the animation an emotional and philosophical dimension, aligning the **form of the code with the feeling of fate**.

---

