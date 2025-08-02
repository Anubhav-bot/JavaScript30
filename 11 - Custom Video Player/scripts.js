const player = document.querySelector('.player');
const viewer = document.querySelector('.viewer');

const progressBar = document.querySelector('.progress__filled');
progressBar.style.flexBasis = 0 + '%';
const sliders = document.querySelectorAll('.player__slider');
const progress = document.querySelector('.progress')

const buttons = document.querySelectorAll('.player__button')

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

function buttonClick(e) {
    let {skip} = e.target.dataset;
    if (!skip) {
        if(viewer.paused) {
            viewer.play();
        } else {
            viewer.pause();
        }
        return;
    }

    skip = +skip;
    console.log(viewer)

    let newTime = clamp((viewer.currentTime + skip), 0, viewer.duration);

    viewer.currentTime = newTime
}

function handleProgress(e) {
    let ct = e.target.currentTime;
    let mt = e.target.duration;
    let percentage = (ct / mt) * 100;
    progressBar.style.flexBasis = percentage + '%';
}

function scrub(e) {
    let x = e.offsetX
    let width = progress.offsetWidth
    let duration = viewer.duration
    let val = (x / width ) * duration

    viewer.currentTime = val;
}

function handleSlider(e, val) {
    let name = e.target.name;
    if(name == 'volume') {
        viewer.volume = val;
    } else {
        viewer.playbackRate = val;
    }
}

buttons.forEach((button) => {
    button.addEventListener('click', buttonClick);
    if(button.classList.contains('toggle')) {
        viewer.addEventListener('play', (e) => button.innerText = 'Playing');
        viewer.addEventListener('pause', (e) => button.innerText = 'Paused');
    }
})

sliders.forEach(slider => {
    slider.addEventListener('change', (e) => handleSlider(e, slider.value))
    slider.addEventListener('mousemove', (e) => handleSlider(e, slider.value))
})

viewer.addEventListener('timeupdate', handleProgress)
viewer.addEventListener('click', (e) => e.target.paused ? e.target.play() : e.target.pause())

let mousedown = false
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))
progress.addEventListener('click', scrub)

progress.addEventListener('mousedown', () => mousedown = true)
progress.addEventListener('mouseup', () => mousedown = false)
progress.addEventListener('mouseout', () => mousedown = false)
