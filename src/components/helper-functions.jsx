const React = require( 'react' );
const reactReplace = require('react-string-replace');
const moment = require('moment');
const request = require('request');
const slackdown = require('slackdown');

export function updateStorage(data) {
  chrome.storage.local.set( data );
  console.log('storage updated', data);
}

export function hashUserList(userList) {
  const usersById = {};
  console.log('hash');
  for (let i = 0; i < userList.length; i++)
    usersById[userList[i].id] = userList[i];
  return usersById;
}

export const formatMessages = (newList, usersById, existingList) =>
  newList.map( (msg) => (
      {
        text: htmlFormat(slackdown.parse(msg.text)),
        date: moment.unix(msg.ts).format('MMMM Do YYYY'),
        userName: msg.user ? usersById[msg.user].name : null,
        profile: msg.user ? usersById[msg.user].profile : null,
      }
    )
  );


export function htmlFormat(html) {
 const htmlObj = {__html: html};
 return ( <div dangerouslySetInnerHTML={ htmlObj }></div> );
}

function createMedia (match, ts) {
  let ret = null;
  if (match.match(/vimeo|youtube|youtu\.be/g))
    ret =  <iframe key={ts} className="slackFrame" src={match.replace("watch?v=", "/embed/").replace("m.youtube", "youtube")} />;
  else if (match.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret =  <img key={ts} className="slackPic" src={match} />;
  else
    ret = <a href={match} key={ts}>{match}</a>;
  return ret;
}

export function httpDo(url, callback) {
  const options = {
    url :  url,
    json : true
  };
  request(options, (err, res, body) => callback(err, body));
}

export function buildUrl(token, method, arg, text, as_user) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  as_user = (as_user) ? ('&as_user=true') : '';
  const query = 'https://slack.com/api/' + method + "?token=" + token + arg + text + as_user + '&pretty=1';
  return encodeURI(query);
}

export function getToken(token_info, code, callback) {
  httpDo(atob(token_info) + code, function (err, res) {
    console.log('token', atob(token_info) + code);
    if(err || !res.ok) console.log('oauth access failed', res.error || err);
    //send user token to callback function
    callback(res.access_token);
  });
}

export function teamSelector() {
  chrome.storage.local.clear();
  window.location.href = "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client";
}


// function replaceTextElements(text, ts, usersByID) {
//   const self = this;
//   const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
//   text = text.replace(/@.........\|/g , '')
//   .replace(/@........./g, match => usersByID[match.substring(1,10)].name)
//   .replace(/<.+>/g, match => match.replace(/<|>/g, ""))
//   .replace(/@([A-Z]|\d){8}/g, match => match.replace("@", ""));
//   // console.log('text', [text]);
//   // text = reactReplace(text,  url, (match, i) => createMedia(match, ts));
//   return htmlFormat(text);
//  }
