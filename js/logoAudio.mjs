const sounds = [
  "./assets/audio/astur.mp3",
  "./assets/audio/auh-au-hu.mp3",
  "./assets/audio/auurrrrr.mp3",
  "./assets/audio/baurrr.mp3",
  "./assets/audio/boy.mp3"
];

let currentAudio = null;

function getRandomSound() {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function initLogoAudio() {
  const logo = document.querySelector(".logo");
  if (!logo) {
    console.warn("Logo not found");
    return;
  }

  logo.addEventListener("click", () => {

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(getRandomSound());
    currentAudio = audio;

    audio.volume = 1;

    audio.play().catch(err => {
      console.error("Audio failed:", err);
    });

    audio.onended = () => {
      currentAudio = null;
    };
  });
}