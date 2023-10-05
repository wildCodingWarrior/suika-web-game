import { useRef, useEffect } from "react";

function useSound(soundFile, numberOfInstances = 5, volume = 1.0) {
  const soundRefs = useRef([]);

  useEffect(() => {
    for (let i = 0; i < numberOfInstances; i++) {
      const sound = new Audio(soundFile);
      sound.volume = volume;
      soundRefs.current.push(sound);
    }
  }, [soundFile, numberOfInstances, volume]);

  function playSound() {
    const sound = soundRefs.current.pop();
    if (sound) {
      sound.play();
      sound.addEventListener("ended", () => {
        soundRefs.current.push(sound);
      });
    }
  }

  return playSound;
}

export default useSound;
