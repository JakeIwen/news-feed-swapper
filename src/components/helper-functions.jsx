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
  var usersById = {};
  for (var i = 0; i < userList.length; i++)
    usersById[userList[i].id] = userList[i];
  return usersById;
}

export function formatMessages(newList, usersById, existingList) {
  var lastDate = (newList.length == 1) ? existingList[0].date : null;
  for (var i = 0; i < newList.length; i++) {
    newList[i].text = htmlFormat(slackdown.parse(newList[i].text));
    newList[i].date = moment.unix(newList[i].ts).format('MMMM Do YYYY');
    newList[i].userName = newList[i].user ? usersById[newList[i].user].name : null;
    newList[i].profile = newList[i].user ? usersById[newList[i].user].profile : null;
    if (newList[i].date != lastDate) {
      newList[i].showDate = true;
      lastDate = newList[i].date;
    }
  }
  return newList;
}
function replaceTextElements(text, ts, usersByID) {
  const self = this;
  const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  text = text.replace(/@.........\|/g , '')
  .replace(/@........./g, match => usersByID[match.substring(1,10)].name)
  .replace(/<.+>/g, match => match.replace(/<|>/g, ""))
  .replace(/@([A-Z]|\d){8}/g, match => match.replace("@", ""));
  // console.log('text', [text]);
  // text = reactReplace(text,  url, (match, i) => createMedia(match, ts));
  return htmlFormat(text);
 }

export function htmlFormat(html) {
 const htmlObj = {__html: html};
 return ( <div dangerouslySetInnerHTML={htmlObj}></div> );
}

function createMedia (match, ts) {
  var ret;
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
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}
export function buildUrl(token, method, arg, text, as_user) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  as_user = (as_user) ? ('&as_user=true') : '';
  var query = 'https://slack.com/api/';
  query += method + "?token=" + token + arg + text + as_user + '&pretty=1';
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
