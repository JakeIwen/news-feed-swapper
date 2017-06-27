"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require('react');
var ReactDOM = require('react-dom');
const handle_error_1 = require("./handle-error");
const react_redux_1 = require("react-redux");
const store_1 = require("../store");
var NewsFeedSwapper = require('../components/index.jsx');
const storePromise = store_1.createStore();
function isAlreadyInjected() {
    return document.querySelector('#nfe-container') != null;
}
exports.isAlreadyInjected = isAlreadyInjected;
function injectUI(streamContainer) {
    var nfeContainer = document.createElement("div");
    nfeContainer.id = "nfe-container";
    streamContainer.appendChild(nfeContainer);
    storePromise.then((store) => {
        ReactDOM.render(React.createElement(react_redux_1.Provider, {
            store: store,
            children: React.createElement(NewsFeedSwapper, null)
        }), nfeContainer);
    }).catch(handle_error_1.default);
}
exports.default = injectUI;
