const React = require('react');
const NewsFeedSwapper = require('../components/index.jsx');
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../store/reducer.js';
import socketMiddleware from '../socketMiddleware';

// const storePromise = () =>
//   createStore(reducer, null, applyMiddleware(thunk, socketMiddleware));

const initialState =
{showQuotes: true,
builtinQuotesEnabled: true,
showInfoPanel: true,
featureIncrement: 0,
isCurrentQuoteCustom: false,
currentQuoteID: 1,
hiddenBuiltinQuotes: false,
customQuotes: null};

export function isAlreadyInjected() {
	return document.querySelector( '#nfe-container' ) != null;
}

export default function injectUI( streamContainer ) {
	const store = createStore(reducer, initialState, applyMiddleware(thunk, socketMiddleware));
	const nfeContainer = document.createElement("div");
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);
		render(
			<Provider store={store}>
				<NewsFeedSwapper />
			</Provider>,
			nfeContainer
		);

}
