import fsUrl from "../fullscreen.svg";

let fsButton: HTMLButtonElement = document.querySelector("#fs");
let img = document.createElement("img");
img.src = fsUrl;
fsButton.appendChild(img);
img.style.width = "1em";
img.style.height = "1em";
fsButton.style.marginLeft = "auto";

if (
  [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ].includes(navigator.platform)
) {
  fsButton.remove();
}

let b = document.querySelector("body");
let fsMode = false;
fsButton.addEventListener("click", function () {
  if (!fsMode) {
    let el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      /* Safari */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      /* IE11 */
      el.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  }
  fsMode = !fsMode;
});

function updateSize() {
  b.style.setProperty(
    "--height",
    `${document.documentElement.clientHeight || window.innerHeight}px`
  );
  b.style.setProperty(
    "--width",
    `${document.documentElement.clientWidth || window.innerWidth}px`
  );
}

window.addEventListener(
  "orientationchange",
  function () {
    // Announce the new orientation number
    updateSize();
  },
  false
);
window.addEventListener("resize", function () {
  updateSize();
});

document.addEventListener("focusout", function (e) {
  updateSize();
});

updateSize();
