import fetch from 'isomorphic-fetch';
import { store } from './store';
import { hashList, buildUrl, formatMessages } from './action-helpers';


const setToken = token => ({
  type: 'SET_TOKEN',
  token,
});

const setChannelId = channelId => ({
  type: 'SET_CHANNEL_ID',
  channelId,
});

const setUsersById = (userList, botList) => ({
  type: 'SET_USERS_BY_ID',
  usersById: hashList([...userList, ...botList]),
});

const requestRtm = () => ({ type: 'REQUEST_RTM' });

const receiveRtm = rtm => ({
  type: 'RECEIVE_RTM',
  rtm,
  receivedAt: Date.now(),
});

const requestMessages = () => ({
  type: 'REQUEST_MESSAGES',
});

const receiveMessages = messages => ({
  type: 'RECEIVE_MESSAGES',
  messages,
  receivedAt: Date.now(),
});

export const wsConnect = (url, userId) => ({
  type: 'WS_CONNECT',
  url,
  userId
});

export const wsConnecting = () => ({ type: 'WS_CONNECTING' });
export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });

export const addMessage = newMessage => ({
  type: 'ADD_MESSAGE',
  newMessage: formatMessages([newMessage])[0],
});

export const postMessage = (channel, text) => ({
  type: 'POST_CHAT_MESSAGE',
  channel,
  text,
});

export const postInit = () => ( {type: 'POST_MESSAGE_INIT'} );

export const postComplete = () => ( {type: 'POST_MESSAGE_COMPLETE'} );

export const fetchMessages = (apiMethod, channelId) => dispatch => {
  const token = store.getState().token;
  console.log('API METHOD, token', apiMethod, token);
  dispatch(setChannelId(channelId));
  dispatch(requestMessages());
  return fetch( buildUrl(token, apiMethod, channelId) )
    .then(
      res => res.json(),
      error => console.log('An error occured.', error)
    )
    .then(mssages => dispatch(receiveMessages(formatMessages(mssages.messages)))
    );
};

export const fetchRtm = token => dispatch => {
  dispatch(setToken(token));
  dispatch(requestRtm());
  return fetch( buildUrl(token, "rtm.start") )
    .then(
      res => res.json(),
      error => console.log('An error occured.', error)
    )
    .then(rtm => {
      console.log('rtm', rtm);
      dispatch(receiveRtm(rtm));
      dispatch(wsConnect(rtm.url, rtm.self.id));
      dispatch(setUsersById(rtm.users, rtm.bots));
      return dispatch(fetchMessages("channels.history", rtm.channels[0].id));
    });
};
