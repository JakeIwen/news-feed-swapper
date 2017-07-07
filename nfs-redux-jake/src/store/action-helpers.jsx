import { store } from './store';

const React = require( 'react' );
const moment = require('moment');
const reactReplace = require('react-string-replace');

const hashList = userList => {
  const usersById = {};
  userList.forEach( (user) => ( usersById[user.id] = user ) );
  return usersById;
};

const buildUrl = (token, method, arg, text, as_user) => {
  let query = 'https://slack.com/api/' + method + "?token=" + token;
  query += (arg) ? ('&channel=' + arg) : '';
  query += (text) ? ('&text=' + text) : '';
  query += (as_user) ? ('&as_user=true') : '';
  query += '&pretty=1';
  return encodeURI(query);
};

const createMedia = (match, i) => {
  let ret = null;
  if (match.match(/vimeo|youtube|youtu\.be/g))
    ret =  <iframe key={i} className="slackFrame" src={match.replace("watch?v=", "/embed/").replace("m.youtube", "youtube")} />;
  else if (match.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret =  <img key={i} className="slackPic" src={match} />;
  else
    ret = <a href={match} key={i}>{match}</a>;
  return ret;
};

const replaceTextElements = (text, ts, usersById) => {
  const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  const ret = text.replace(/@.........\|/g , '')
    .replace("http:" , 'https:')
    .replace(/@........./g, match => usersById[match.substring(1,10)].name)
    .replace(/<.+>/g, match => match.replace(/<|>/g, ""))
    .replace(/@([A-Z]|\d){8}/g, match => match.replace("@", ""));
  return reactReplace(ret,  url, (match, i) => createMedia(match, i) );
};

const formatMessages = (newList, usersById=store.getState().usersById) =>
  newList.map( (msg, i, list) => (
     { text: replaceTextElements(msg.text, msg.ts, usersById),
      date: moment.unix(msg.ts).format('MMMM Do YYYY'),
      userName: msg.username || usersById[msg.user].name,
      profile: msg.user ? usersById[msg.user].profile : null }
    )
  );
