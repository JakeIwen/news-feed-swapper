import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from '../store/store';

import NewsFeedSwapper from '../components/index.jsx';

export function isAlreadyInjected() {
	return document.querySelector( '#nfe-container' ) != null;
}

export default function injectUI( streamContainer ) {
	const nfeContainer = document.createElement("div");
	console.log('nfe conatiner made, NFS', NewsFeedSwapper);
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);
	ReactDOM.render(
		<Provider store={store}>
			<NewsFeedSwapper />
		</Provider>,
		nfeContainer
	);

}
