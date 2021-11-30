import { StateManager } from "./StateManager.js";
import { updateControls } from "./interface.js";
import { bindEvents } from "./events.js";
import { get } from "./HTTP.js";

window.photos = [];

window.STATE = new StateManager({
    val: 'val',
})

STATE.deserialize();

document.addEventListener( 'DOMContentLoaded', async function () {
    
    window.$something = $('#something');

    $something.chosen({ multiple: true, width: 608 }).trigger('chosen:updated');

    bindEvents();
    updateControls();

})
