"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require('react');
var ReactDOM = require('react-dom');
const react_redux_1 = require("react-redux");
var NewsFeedSwapper = require('../components/index.jsx');
function isAlreadyInjected() {
    return document.querySelector('#nfe-container') != null;
}
exports.isAlreadyInjected = isAlreadyInjected;
function injectUI(streamContainer) {
    var nfeContainer = document.createElement("div");
    nfeContainer.id = "nfe-container";
    streamContainer.appendChild(nfeContainer);
    ReactDOM.render(React.createElement(react_redux_1.Provider, {
        children: React.createElement(NewsFeedSwapper, null)
    }), nfeContainer);
}
exports.default = injectUI;
