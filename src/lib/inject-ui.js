const React = require('react');
const ReactDOM = require('react-dom');
const NewsFeedSwapper = require('../components/index.jsx');


export function isAlreadyInjected() {
	return document.querySelector( '#nfe-container' ) != null;
}

export default function injectUI( streamContainer ) {
	const nfeContainer = document.createElement("div");
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);
		ReactDOM.render(
			React.createElement( NewsFeedSwapper ),
			nfeContainer
		);
}
