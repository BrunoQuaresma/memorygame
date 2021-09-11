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
