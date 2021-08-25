const videoContainer = document.querySelector('.video__container');
const video = docuemnt.querySelector('video');

const playBtn = document.getElementById('playBtn');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const timeline = document.getElementById('timeline');
const volume = document.getElementById('volume');

const defaultVolume = '1';
let volumeValue;

const loadMeta = () => {
  duration.innerText = video.duration;
  currentTime.innerText = '00:00';
  volumeValue = video.volume;
};
video.addEventListener('loadedmetadata', loadMeta);

if (video.readyState === 4) {
  loadMeta();
}
// init
(async () => {})();
