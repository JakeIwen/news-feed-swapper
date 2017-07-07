import React from 'react';
import ReactDOM from 'react-dom';
import SlackFeed from './components/slack-feed';
import './index.css';
import './eradicate.css';

// Add these imports - Step 1
import { Provider } from 'react-redux';
import { store } from './store/store';

// Wrap existing app in Provider - Step 2
ReactDOM.render(
  <Provider store={store}>
    <SlackFeed />
  </Provider>,
  document.getElementById('root')
);
