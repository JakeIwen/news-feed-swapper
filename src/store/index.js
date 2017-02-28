"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser = require('browser-specific');
const redux_1 = require("redux");
const redux_thunk_1 = require("redux-thunk");
const reducer_1 = require("./reducer");
const actions_1 = require("./actions");
function saveSettings(state) {
    const data = {
        showQuotes: state.showQuotes,
        builtinQuotesEnabled: state.builtinQuotesEnabled,
        featureIncrement: state.featureIncrement,
        hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
        customQuotes: state.customQuotes,
    };
    browser.saveSettings(data);
}
function createStore() {
    return new Promise((resolve) => {
        browser.loadSettings((initialState) => {
            const store = redux_1.createStore(reducer_1.default, initialState, redux_1.applyMiddleware(redux_thunk_1.default));
            store.dispatch(actions_1.selectNewQuote());
            store.subscribe(() => {
                saveSettings(store.getState());
            });
            resolve(store);
        });
    });
}
exports.createStore = createStore;
