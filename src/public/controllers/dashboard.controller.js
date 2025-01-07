const storage = JSON.parse(localStorage.getItem("uuid") || null);
const userSettingsOption = document.getElementsByClassName(
  "user-settings-option"
);
const popup = document.querySelector(".user-settings");

(() => {
  if (storage !== null) {
    fetch("/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storage.access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        createUserSettings(data);
        createSubscriptionSettings(data);
      })
      .catch((error) => console.error(error));
  }
})();

Array.from(userSettingsOption).forEach(
  (option) =>
    (option.onclick = function () {
      Array.from(userSettingsOption).forEach((el) =>
        el.classList.remove("selected")
      );
      this.classList.toggle("selected");

      if (this.innerHTML === "Subscriptions") {
        document
          .getElementsByClassName("subscription")[0]
          .classList.toggle("hidden");
        document.getElementsByClassName("user")[0].classList.toggle("hidden");
      } else if (this.innerHTML === "User") {
        document
          .getElementsByClassName("subscription")[0]
          .classList.toggle("hidden");
        document.getElementsByClassName("user")[0].classList.toggle("hidden");
      }
    })
);

document.getElementsByClassName("close")[0].addEventListener("click", () => {
  popup.classList.add("hidden");
  setTimeout(() => popup.classList.add("none"), 100);
});

document.getElementsByClassName("users")[0].addEventListener("click", () => {
  if (storage === null) window.location.href = "/signin";
  else {
    popup.classList.remove("none");
    setTimeout(() => popup.classList.remove("hidden"), 100);
  }
});

const createUserSettings = (data) => {
  const user = document.getElementsByClassName("user")[0];

  const email = document.createElement("span");
  email.innerHTML = `Email: ${data.email}`;

  const logout = document.createElement("span");
  logout.innerHTML = "<p>Logout</p>";
  logout.classList.add("subscribe-btn");

  logout.addEventListener("click", () => {});

  const remove_account = document.createElement("span");
  remove_account.innerHTML = "<p>Delete account</p>";
  remove_account.classList.add("subscribe-btn");
  remove_account.classList.add("delete");

  remove_account.addEventListener("click", () => {});

  user.appendChild(remove_account);
  user.appendChild(logout);
};

const funcUser = (endpoint) => {};

const createSubscriptionSettings = (data) => {
  const subscriptions = document.getElementsByClassName("subscription")[0];

  if (data.subscribed) {
    const stats = document.createElement("span");
    stats.innerHTML = `Status: ${data.subscribed ? "active" : "inactive"}`;

    const start_time = document.createElement("span");
    const date = new Date(String(data.subscription_details.start_time));
    const formattedDate = date.toLocaleDateString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    start_time.innerHTML = `Subscribed Since: ${formattedDate}`;

    const next_payment = document.createElement("span");
    const next_date = new Date(
      String(data.subscription_details.billing_info.next_billing_time)
    );
    const formattedNextDate = next_date.toLocaleDateString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    next_payment.innerHTML = `Next payment: ${formattedNextDate}`;

    const button = document.createElement("span");
    button.innerHTML =
      "<p>Unsubscribe</p> <img src='/assets/icons/external_link.png'>";
    button.classList.add("subscribe-btn");

    button.addEventListener("click", () => {
      subscription("/subscribe/unsubscribe");
    });

    subscriptions.appendChild(stats);
    subscriptions.appendChild(start_time);
    subscriptions.appendChild(next_payment);
    subscriptions.appendChild(button);
  } else {
    const stats = document.createElement("span");
    stats.innerHTML = `Status: ${data.subscribed ? "active" : "inactive"}`;

    const message = document.createElement("span");
    message.innerHTML = data.subscription_details;

    const button = document.createElement("span");
    button.innerHTML =
      "<p>Subscribe</p> <img src='/assets/icons/external_link.png'>";
    button.classList.add("subscribe-btn");

    button.addEventListener("click", () => {
      subscription("/subscribe/create");
    });

    subscriptions.appendChild(stats);
    subscriptions.appendChild(message);
    subscriptions.appendChild(button);
  }
};

const subscription = (url) => {
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${storage.access_token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = data.approval_url;
    })
    .catch((error) => console.error(error));
};

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

const redirect = (game) => {
  window.location.href = `/${game}/play/?uuid=${storage.access_token}`;
  console.log(game);
}