const React = require( 'react' );
const reactReplace = require('react-string-replace');
const moment = require('moment');
const request = require('request');
const slackdown = require('slackdown');

const updateStorage = data => chrome.storage.local.set( data );

const hashUserList = userList => {
  const usersById = {};
  userList.forEach( (user) => ( usersById[user.id] = user ) );
  console.log('hashed user list:', usersById);
  return usersById;
};

const formatMessages = (newList, usersById) => {
  return newList.map( (msg) => (
      { text: replaceTextElements(msg.text, msg.ts, usersById ),
        date: moment.unix(msg.ts).format('MMMM Do YYYY'),
        userName: msg.user ? usersById[msg.user].name : null,
        profile: msg.user ? usersById[msg.user].profile : null }
    )
  );
};

const htmlFormat = html => {
 const htmlObj = {__html: html};
 return ( <div dangerouslySetInnerHTML={ htmlObj }></div> );
};

const httpDo = (url, callback) => {
  const options = {
    url :  url,
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

const getToken = (token_info, code, callback) => {
  httpDo(atob(token_info) + code, (err, res) => {
    if(err || !res.ok) return console.log('oauth access failed', res.error || err);
    //send user token to callback function
    callback(res.access_token);
  });
};

const teamSelector = () => {
  chrome.storage.local.clear();
  window.location.href = "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client";
};


const createMedia = (match, ts) => {
  let ret = null;
  if (match.match(/vimeo|youtube|youtu\.be/g))
    ret =  <iframe key={ts} className="slackFrame" src={match.replace("watch?v=", "/embed/").replace("m.youtube", "youtube")} />;
  else if (match.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret =  <img key={ts} className="slackPic" src={match} />;
  else
    ret = <a href={match} key={ts}>{match}</a>;
  return ret;
};

const replaceTextElements = (text, ts, usersById) => {
  const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  let foo = text.replace(/@.........\|/g , '');
  foo = foo.replace(/@........./g, match => usersById[match.substring(1,10)].name);
  foo = foo.replace(/<.+>/g, match => match.replace(/<|>/g, ""));
  foo = foo.replace(/@([A-Z]|\d){8}/g, match => match.replace("@", ""));
    console.log('foo4', foo);
  // console.log('text', [text]);
  return reactReplace(foo,  url, (match, i) => createMedia(match, ts) );
};

export { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, htmlFormat, getToken, teamSelector } ;
