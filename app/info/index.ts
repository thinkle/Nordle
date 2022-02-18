import "./style.css";
import { button } from "./button";
import { toggleModal } from "./modal";
button.addEventListener("click", () => {
  toggleModal();
});
