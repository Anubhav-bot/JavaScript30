const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
let canvasInterval;
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filterBtns = document.querySelectorAll('.filterBtn')
const greenScreenToggle = document.querySelector('.greenScreenToggle');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error("ERR: ", err);
    })
}

function paintToCanvas(effect = "noEffect", greenScr = false) {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0, 0, width, height);

    if (greenScr) pixels = greenScreen(pixels);

    switch (effect) {
      case 'redEffect':
        pixels = redEffect(pixels);
        break;
      case 'gayEffect':
        pixels = gayEffect(pixels);
        break;
      default:
        break;
    }
    ctx.globalAlpha = 0.8;

    ctx.putImageData(pixels, 0, 0);
  }, 16)
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');

  const link = document.createElement('a');
  link.href = data;
  link.target = "_blank"
  // link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src=${data} />`

  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function gayEffect(pixels) { //rbgSplit
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]
    pixels.data[i + 100] = pixels.data[i + 1]
    pixels.data[i - 150] = pixels.data[i + 2]
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {}

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  })

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', () => {
  canvasInterval = paintToCanvas()
});

filterBtns.forEach(filterBtn => {
  filterBtn.addEventListener('click', () => {
    clearInterval(canvasInterval);
    canvasInterval = paintToCanvas(`${filterBtn.name}`)
    greenScreenToggle.checked = false
  })
})

greenScreenToggle.addEventListener('click', (e) => {
  clearInterval(canvasInterval);
  canvasInterval = paintToCanvas("noFilter", greenScr = e.target.checked)
})
