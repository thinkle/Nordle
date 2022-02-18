import "./keyboard/";
import "./settings";
import "./sizing";
import { showVictory } from "./victory";
//import './devtool';
import { onFinish } from "./wordDisplay";
import { allowChanges } from "./settings";
import "./info/";
import "./preload";

onFinish((c, n) => {
  showVictory(c, n);
  allowChanges();
});
