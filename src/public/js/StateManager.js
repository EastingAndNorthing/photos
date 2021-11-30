export class StateManager {

    constructor(baseState) {
        this.state = baseState || {};
    }

    get(key) {
        return this.state[key];
    }

    set(keyValuePair, andSerialize = true) {
        Object.assign(this.state, keyValuePair);

        if (andSerialize) this.serialize(this.state);
    }

    serialize(state) {
        Object.assign(this.state, state);
        window.localStorage.setItem('photosApp', JSON.stringify(this.state));
    }
    
    deserialize() {
        if (window.localStorage.getItem('photosApp')) {
            const state = JSON.parse(window.localStorage.getItem('STATE'));
            Object.assign(this.state, state);
        }
    }
}
