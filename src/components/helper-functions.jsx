const React = require( 'react' );
const reactReplace = require('react-string-replace');
const moment = require('moment');
const request = require('request');

const updateStorage = data => chrome.storage.local.set( data );

const hashUserList = userList => {
  const usersById = {};
  userList.forEach( (user) => ( usersById[user.id] = user ) );
  console.log('hashed user list:', usersById);
  return usersById;
};

const formatMessages = (newList, usersById) =>
  newList.map( (msg, i, list) => (
       { text: replaceTextElements(msg.text, msg.ts, usersById),
        date: moment.unix(msg.ts).format('MMMM Do YYYY'),
        userName: msg.username || usersById[msg.user].name,
        profile: msg.user ? usersById[msg.user].profile : null }
    )
  );

const httpDo = (url, callback) => {
  const options = {
    url,
    json : true
  };
  request(options, (err, res, body) => callback(err, body) );
};

const buildUrl = (token, method, arg, text, as_user) => {
  let query = 'https://slack.com/api/' + method + "?token=" + token;
  query += (arg) ? ('&channel=' + arg) : '';
  query += (text) ? ('&text=' + text) : '';
  query += (as_user) ? ('&as_user=true') : '';
  query += '&pretty=1';
  return encodeURI(query);
};

const getToken = (token_info, code, callback) =>
  httpDo( atob(token_info) + code, (err, res) => {
    if(err || !res.ok) return console.log('oauth access failed', res.error || err);
    //send user token to callback function
    callback(res.access_token);
  } );

const teamSelector = () => {
  chrome.storage.local.clear();
  window.location.href = "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client";
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

export { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, getToken, teamSelector } ;
