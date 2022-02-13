import './keyboard/';
import './settings';
import './sizing';
import {showVictory} from './victory'
//import './devtool';
import {onVictory} from './wordDisplay';
import {allowChanges} from './settings';


onVictory(
  ()=>{
    showVictory();
    allowChanges();
  }
)