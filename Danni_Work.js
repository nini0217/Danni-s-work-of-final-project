let sound;
let fft;
let audioButton;

function preload() {
  sound = loadSound('assets/352072_2305278-lq.mp3');
}

function setup() {
  // 初始化 FFT
  fft = new p5.FFT(0.8, 64);
  sound.connect(fft);

  // 播放按钮
  audioButton = createButton('Play / Pause');
  audioButton.position(20, 20);
  audioButton.mousePressed(toggleAudio);

  loop(); // 保证 draw 持续运行
}

function draw() {
  // 获取低频能量，映射为缩放因子（你可以自己试试改范围）
  let energy = map(fft.getEnergy("bass"), 0, 255, 0.8, 1.4);
  window.scaleOverride = energy;
}

function toggleAudio() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}