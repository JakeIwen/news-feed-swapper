var React = require('react');
var ReactDOM = require('react-dom');

import { Provider } from 'react-redux';
var NewsFeedSwapper = require('../components/index.jsx');

export function isAlreadyInjected() {
	return document.querySelector( '#nfe-container' ) != null;
}

export default function injectUI( streamContainer: Element ) {
	var nfeContainer = document.createElement("div");
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);

	ReactDOM.render(
		React.createElement( Provider, {
			children: React.createElement( NewsFeedSwapper, null )
		} ),
		nfeContainer
	);
}
