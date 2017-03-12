const React = require( 'react' );
const reactReplace = require('react-string-replace');
const moment = require('moment');
const request = require('request');

export function updateStorage(data) {
  chrome.storage.local.set( data );
  console.log('storage updated', data);
}

export function hashUserList(userList) {
  var usersById = {};
  for (var i = 0; i < userList.length; i++)
    usersById[userList[i].id] = userList[i];
    console.log('usersById', usersById);
  return usersById;
}

export function formatMessages(list, usersByID) {
  var lastDate = null;
  for (var i = 0; i < list.length; i++) {
    list[i].text = replaceTextElements(list[i].text, list[i].ts, usersByID);
    list[i].date = moment.unix(list[i].ts).format('MMMM Do YYYY');
    if (list[i].date != lastDate) {
      list[i].showDate = true;
      lastDate = list[i].date;
    }
  }
  return list;
}
function replaceTextElements(text, ts, usersByID) {
  const self = this;
  const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  text = text.replace(/@.........\|/g , '')
  .replace(/@........./g, match => usersByID[match.substring(1,10)].name)
  .replace(/<.+>/g, match => match.replace(/<|>/g, ""))
  .replace(/@([A-Z]|\d){8}/g, match => match.replace("@", ""));
  // console.log('text', [text]);
  text = reactReplace(text,  url, (match, i) => createMedia(match, ts));
  return text;
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
export function buildUrl (token, method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var query = 'https://slack.com/api/';
  query += method + "?token=" + token + arg + text + '&pretty=1';
  return encodeURI(query);
}

export function getToken (token_info, code, callback) {
  httpDo(atob(token_info) + code, function (err, res) {
    if(err || !res.ok) console.log('oauth access failed', res.error || err);
    //send user token to callback function
    callback(res.access_token);
  });
}
