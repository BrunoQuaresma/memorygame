/** Audios are downloaded from https://mixkit.co/free-sound-effects/game/ */

export const playAudio = (audioFilename: string) => {
  const audio = new Audio(audioFilename);
  audio.play();
};

export const playFlipAudio = () => {
  playAudio("/audios/flip.mp3");
};

export const playMatchAudio = () => {
  playAudio("/audios/match.mp3");
};

export const playEndAudio = () => {
  playAudio("/audios/end.mp3");
};

export const preloadAudios = () => {
  new Audio("/audios/flip.mp3");
  new Audio("/audios/match.mp3");
  new Audio("/audios/end.mp3");
};
