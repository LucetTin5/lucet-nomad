const videoContainer = document.querySelector('.video__container');
const video = document.querySelector('video');
const videoControls = videoContainer.querySelector('.video__controls');

const playBtn = document.getElementById('playBtn');
const playBtnIcon = playBtn.querySelector('span');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const timeline = document.getElementById('timeline');
const volume = document.getElementById('volume');
const volumeBtn = document.getElementById('volumeBtn');
const volumeBtnIcon = volumeBtn.querySelector('span');
const fullscreenBtn = document.getElementById('screenSizeBtn');
const fullscreenBtnIcon = fullscreenBtn.querySelector('span');

let volumeValue;
let volumeKeyword = (value) => {
  return Number(value) > 0.5 ? 'up' : Number(value) > 0.0 ? 'down' : 'mute';
};

let focused = false;

let controlTimeout = null;
let mouseMovementTimeout = null;

let fullscreen = false;

const formatTime = (secs) => {
  const time = new Date(secs * 1000).toISOString().substr(11, 8);
  if (secs < 3600) {
    return time.slice(3);
  }
  return time;
};
const handleVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  volumeValue = value;
  video.volume = volumeValue;
  volumeBtnIcon.innerText = `volume_${volumeKeyword(volumeValue)}`;
};
const videoMute = (e) => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
    volume.value = volumeValue;
    volumeBtnIcon.innerText = `volume_${volumeKeyword(volumeValue)}`;
  } else {
    volumeValue = video.volume;
    video.muted = true;
    volume.value = '0';
    volumeBtnIcon.innerText = 'volume_off';
  }
};
const videoPlay = () => {
  if (!video.paused) {
    video.pause();
    playBtnIcon.innerText = 'play_circle';
  } else {
    video.play();
    playBtnIcon.innerText = 'pause_circle';
  }
};
const loadMeta = () => {
  duration.innerText = formatTime(video.duration);
  timeline.max = Math.floor(video.duration);
  currentTime.innerText = formatTime(video.currentTime);
  volumeValue = video.volume;
  volume.value = volumeValue;
};
const handleVideoTime = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
};
const removeShowing = () => videoControls.classList.remove('showing');
const closeControls = () => {
  controlTimeout = setTimeout(removeShowing, 3000);
};
const openControls = () => {
  if (controlTimeout) {
    clearTimeout(controlTimeout);
    controlTimeout = null;
  }
  if (mouseMovementTimeout) {
    clearTimeout(mouseMovementTimeout);
    mouseMovementTimeout = null;
  }
  videoControls.classList.add('showing');
  mouseMovementTimeout = setTimeout(removeShowing, 3000);
};
const handleFocused = (event) => {
  const { target } = event;
  if (videoContainer.contains(target)) {
    focused = true;
  }
  focused = false;
};
const handleKeyDown = (event) => {
  const { code } = event;
  if (focused) {
    switch (code) {
      case 'Space':
        videoPlay();
        break;
      case 'ArrowRight':
        video.currentTime += 1;
        timeline.value = video.currentTime;
        currentTime.innerText = formatTime(Math.floor(video.currentTime));
        break;
      case 'ArrowLeft':
        video.currentTime -= 1;
        timeline.value = video.currentTime;
        currentTime.innerText = formatTime(Math.floor(video.currentTime));
        break;
      case 'ArrowUp':
        if (video.volume < 0.9) video.volume += 0.1;
        else video.volume = 1.0;
        break;
      case 'ArrowDown':
        if (video.volume > 0.1) video.volume -= 0.1;
        else video.volume = 0.0;
        break;
      case 'Enter':
      case 'KeyF':
        if (!fullscreen) {
          videoContainer.requestFullscreen();
        }
        break;
      case 'KeyM':
        videoMute();
        break;
    }
  }
};
const fullscreenChecker = () => {
  if (document.fullscreenElement) {
    fullscreen = true;
  } else {
    fullscreen = false;
  }
  fullscreenBtnIcon.innerText = fullscreen ? 'fullscreen-exit' : 'fullscreen';
};
const handleScreenSize = () => {
  if (!fullscreen) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
const handleTimeUpdate = () => {
  timeline.value = video.currentTime;
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
};
const handleVolumeChange = () => {
  if (!video.muted) {
    volumeValue = video.volume;
    volume.value = volumeValue;
    volumeBtnIcon.innerText = `volume_${volumeKeyword(volumeValue)}`;
  }
};
const addVideoViews = () => {
  const vid = videoContainer.dataset.id;
  fetch(`/api/videos/${vid}/view`);
};
video.addEventListener('ended', addVideoViews);
video.addEventListener('volumechange', handleVolumeChange);
video.addEventListener('timeupdate', handleTimeUpdate);
fullscreenBtn.addEventListener('click', handleScreenSize);
document.addEventListener('fullscreenchange', fullscreenChecker);
document.addEventListener('keydown', handleKeyDown);
videoContainer.addEventListener('mousedown', handleFocused);
videoContainer.addEventListener('mousemove', openControls);
videoContainer.addEventListener('mouseleave', closeControls);
timeline.addEventListener('input', handleVideoTime);
video.addEventListener('loadedmetadata', loadMeta);
playBtn.addEventListener('click', videoPlay);
volume.addEventListener('input', handleVolumeRange);
volumeBtn.addEventListener('click', videoMute);

if (video.readyState === 4) {
  loadMeta();
}
