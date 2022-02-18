import { nInput } from "../settings";

export function setupPlusOne(div, closeButton) {
  let button = div.querySelector(".plusOne");
  button.addEventListener("click", function () {
    nInput.valueAsNumber += 1;
    var evt = document.createEvent("HTMLEvents");
    var event = new Event("change");
    // Dispatch it.
    nInput.dispatchEvent(event);
    closeButton.click();
  });
}
