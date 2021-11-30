export function updateControls() {
    STATE.deserialize();

    $something.val(STATE.get('coin_id'));
    $something.prop('checked', STATE.get('randomizeKlines'));
}
