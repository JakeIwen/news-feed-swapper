// const handleWss = (state, action) => {
//   switch (action.type) {
//     case 'ADD_NEW_MESSAGE':
//       return Object.assign(
//         {},
//         state,
//         messages:
//       )
//   }
// }




// socket.on('reconnect_url', (url) => socket.open(url));

// import { createStore, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import reducer from './reducer'
// import socketMiddleware from './socketMiddleware'
//
// export default function configureStore(initialState) {
//   return createStore(reducer, initialState,
//       applyMiddleware(thunk, socketMiddleware)
//   )
// }
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes[ActionTypes["HIDE_INFO_PANEL"] = 'HIDE_INFO_PANEL'] = "HIDE_INFO_PANEL";
    ActionTypes[ActionTypes["SHOW_INFO_PANEL"] = 'SHOW_INFO_PANEL'] = "SHOW_INFO_PANEL";
    ActionTypes[ActionTypes["TOGGLE_SHOW_QUOTES"] = 'TOGGLE_SHOW_QUOTES'] = "TOGGLE_SHOW_QUOTES";
    ActionTypes[ActionTypes["TOGGLE_BUILTIN_QUOTES"] = 'TOGGLE_BUILTIN_QUOTES'] = "TOGGLE_BUILTIN_QUOTES";
    ActionTypes[ActionTypes["SELECT_NEW_QUOTE"] = 'SELECT_NEW_QUOTE'] = "SELECT_NEW_QUOTE";
    ActionTypes[ActionTypes["HIDE_QUOTE"] = 'HIDE_QUOTE'] = "HIDE_QUOTE";
    ActionTypes[ActionTypes["DELETE_QUOTE"] = 'DELETE_QUOTE'] = "DELETE_QUOTE";
    ActionTypes[ActionTypes["ADD_QUOTE"] = 'ADD_QUOTE'] = "ADD_QUOTE";
    ActionTypes[ActionTypes["RESET_HIDDEN_QUOTES"] = 'RESET_HIDDEN_QUOTES'] = "RESET_HIDDEN_QUOTES";
    ActionTypes[ActionTypes["HASH_USER_LIST"] = 'HASH_USER_LIST'] = "HASH_USER_LIST";
})(ActionTypes || (ActionTypes = {}));
exports.default = ActionTypes;
function generateID() {
    let key = '';
    while (key.length < 16) {
        key += Math.random().toString(16).substr(2);
    }
    return key.substr(0, 16);
}
function hideInfoPanel() {
    return {
        type: ActionTypes.HIDE_INFO_PANEL
    };
}
exports.hideInfoPanel = hideInfoPanel;
function showInfoPanel() {
    return {
        type: ActionTypes.SHOW_INFO_PANEL
    };
}
exports.showInfoPanel = showInfoPanel;
function toggleShowQuotes() {
    return {
        type: ActionTypes.TOGGLE_SHOW_QUOTES
    };
}
exports.toggleShowQuotes = toggleShowQuotes;
function toggleBuiltinQuotes() {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.TOGGLE_BUILTIN_QUOTES
        });
        dispatch(selectNewQuote());
    };
}
exports.toggleBuiltinQuotes = toggleBuiltinQuotes;
function addQuote(text, source) {
    const id = generateID();
    return {
        type: ActionTypes.ADD_QUOTE,
        id,
        text,
        source,
    };
}
exports.addQuote = addQuote;
function resetHiddenQuotes() {
    return {
        type: ActionTypes.RESET_HIDDEN_QUOTES,
    };
}
exports.resetHiddenQuotes = resetHiddenQuotes;
function removeCurrentQuote() {
    return (dispatch, getState) => {
        const state = getState();
        if (state.isCurrentQuoteCustom) {
            dispatch({
                type: ActionTypes.DELETE_QUOTE,
                id: state.currentQuoteID,
            });
        }
        else {
            dispatch({
                type: ActionTypes.HIDE_QUOTE,
                id: state.currentQuoteID,
            });
        }
        dispatch(selectNewQuote());
    };
}
exports.removeCurrentQuote = removeCurrentQuote;
function hashUserList() {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({
            type: ActionTypes.HASH_USER_LIST,
            userList: state.userList,
        });
    };
    var usersById = {};
    console.log('usersById', usersById);
    return {
        type: ActionTypes.HASH_USER_LIST
    };
}
exports.hashUserList = hashUserList;
function selectNewQuote() {
    return (dispatch, getState) => {
        const state = getState();
        const builtinQuotes = [];
        const customQuotes = state.customQuotes;
        const allQuotes = builtinQuotes.concat(customQuotes);
        if (allQuotes.length < 1) {
            return dispatch({
                type: ActionTypes.SELECT_NEW_QUOTE,
                isCustom: false,
                id: null,
            });
        }
        const quoteIndex = Math.floor(Math.random() * allQuotes.length);
        dispatch({
            type: ActionTypes.SELECT_NEW_QUOTE,
            isCustom: (quoteIndex >= builtinQuotes.length),
            id: allQuotes[quoteIndex].id,
        });
    };
}
exports.selectNewQuote = selectNewQuote;
