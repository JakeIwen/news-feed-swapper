"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const actions_1 = require("./actions");
function showQuotes(state = true, action) {
  switch (action.type) {
    case actions_1.default.TOGGLE_SHOW_QUOTES:
    return !state;
  }
  return state;
}
function builtinQuotesEnabled(state = true, action) {
  switch (action.type) {
    case actions_1.default.TOGGLE_BUILTIN_QUOTES:
    return !state;
  }
  return state;
}
function showInfoPanel(state = false, action) {
  switch (action.type) {
    case actions_1.default.SHOW_INFO_PANEL:
    return true;
    case actions_1.default.HIDE_INFO_PANEL:
    return false;
  }
  return state;
}
function featureIncrement(state = 0, action) {
  switch (action.type) {
    case actions_1.default.SHOW_INFO_PANEL:
    state = 1;
  }
  return state;
}
function isCurrentQuoteCustom(state = null, action) {
  switch (action.type) {
    case actions_1.default.SELECT_NEW_QUOTE:
    return action.isCustom;
    case actions_1.default.ADD_QUOTE:
    return true;
  }
  return state;
}
function currentQuoteID(state = null, action) {
  switch (action.type) {
    case actions_1.default.SELECT_NEW_QUOTE:
    return action.id;
    case actions_1.default.ADD_QUOTE:
    return action.id;
  }
  return state;
}
function hiddenBuiltinQuotes(state = [], action) {
  switch (action.type) {
    case actions_1.default.HIDE_QUOTE:
    if (action.id == null)
    return state;
    return state.concat([action.id]);
    case actions_1.default.RESET_HIDDEN_QUOTES:
    return [];
  }
  return state;
}
function customQuotes(state = [], action) {
  switch (action.type) {
    case actions_1.default.ADD_QUOTE:
    return state.concat([{
      id: action.id,
      text: action.text,
      source: action.source,
    }]);
    case actions_1.default.DELETE_QUOTE:
    if (action.id == null)
    return state;
    return state.filter(quote => quote.id !== action.id);
  }
  return state;
}
function usersByID(state = {}, action) {
  switch (action.type) {
    case actions_1.default.HASH_USER_LIST:
    for (var i = 0; i < action.userList.length; i++) {
      state[action.userList[i].id] = action.userList[i];
    }
  }
  return state;
}
exports.default = redux_1.combineReducers({
  showQuotes,
  builtinQuotesEnabled,
  showInfoPanel,
  featureIncrement,
  isCurrentQuoteCustom,
  currentQuoteID,
  hiddenBuiltinQuotes,
  customQuotes,
});
