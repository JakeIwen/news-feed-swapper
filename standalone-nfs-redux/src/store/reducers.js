import { combineReducers } from 'redux';

export const token = (state = '', action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      console.log("REDUCER: token", state, action);
      return action.token;
    default:
      return state;
  }
};

export const rtm = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_RTM':
      return {};
    case 'RECEIVE_RTM':
      console.log("REDUCER: rtm", state, action);
      return action.rtm;
    default:
      return state;
  }
};

export const messages = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST_MESSAGES':
      return [];
    case 'RECEIVE_MESSAGES':
      console.log("REDUCER: messages", state, action);
      return action.messages;
    case 'ADD_MESSAGE':
      return [action.newMessage].concat(state);
    default:
      return state;
  }
};

export const channelId = (state = '', action) => {
  switch (action.type) {
    case 'SET_CHANNEL_ID':
      console.log("REDUCER: channelId", state, action);
      return action.channelId;
    default:
      return state;
  }
};

export const usersById = (state = [], action) => {
  switch (action.type) {
    case 'SET_USERS_BY_ID':
      console.log("REDUCER: usersById", state, action);
      return action.usersById;
    default:
      return state;
  }
};

export const wsStatus = (state = "disconnected", action) => {
  switch (action.type) {
    case 'WS_CONNECT':
      return "initiating";
    case 'WS_CONNECTING':
      return "connecting";
    case 'WS_CONNECTED':
      return "connected";
    case 'WS_DISCONNECTED':
      return "disconnected";
    default:
      return state;
  }
};

export const postMessage = (state = '', action) => {
  switch (action.type) {
    case 'POST_MESSAGE_INIT':
      return "posting";
    case 'POST_MESSAGE_COMPLETE':
      return "complete";
    default:
      return state;
  }
};

export const reducers = combineReducers({
  rtm,
  messages,
  channelId,
  usersById,
  wsStatus,
  token,
  postMessage,
});
