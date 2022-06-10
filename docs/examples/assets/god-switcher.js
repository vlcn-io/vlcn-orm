const gods = [
  "aphrodite",
  "zeus",
  "ares",
  "artemis",
  "dionysus",
  "hades",
  "hermes",
  "hephaestus",
  "poseidon",
];
const body = document.querySelector("body");
const godHead = document.querySelector(".god-head");
let lastIdx = null;

function switchGod() {
  let idx = Math.floor(Math.random() * gods.length);
  if (idx === lastIdx) {
    idx = (idx + 1) % gods.length;
  }
  body.classList = gods[idx];
  godHead.classList = "god-head god-head-" + gods[idx];
  lastIdx = idx;
}

switchGod();
