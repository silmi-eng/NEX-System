// Gamepads
const gamepadStats = document.getElementById("status");

window.addEventListener("gamepadconnected", (event) => {
  gamepadStats.src = "/assets/icons/connected-controller.png";
});

window.addEventListener("gamepaddisconnected", () => {
  gamepadStats.src = "/assets/icons/not-connected-controller.png";
});

const gamepadsConnected = () => {
  const gamepads = navigator.getGamepads();
  if (gamepads && gamepads[0]) {
    gamepadStats.src = "/assets/icons/connected-controller.png";
  } else {
    gamepadStats.src = "/assets/icons/not-connected-controller.png";
  }
};

setInterval(gamepadsConnected, 500);

// Account redirect
document.getElementById("redirect").addEventListener("click", () => {
  const storage = JSON.parse(localStorage.getItem("uuid") || null);

  if (storage !== null) window.location.href = `/user`;
  else window.location.href = "/signin";
});

// Open Game
const redirectGame = (game) => {
    const storage = JSON.parse(localStorage.getItem("uuid") || null);

    if (storage !== null) {
        window.location.href = `/${game}/${storage.access_token}/play`
    }
    else {
        console.log("error");
    }
}