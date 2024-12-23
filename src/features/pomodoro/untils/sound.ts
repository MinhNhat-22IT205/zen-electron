export const playNotificationSound = () => {
  const audio = new Audio("../assets/short-alarm-clock-sound.mp3");
  audio.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
};
