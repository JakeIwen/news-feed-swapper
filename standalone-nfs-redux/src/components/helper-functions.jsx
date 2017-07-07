const React = require( 'react' );
const request = require('request');

// const updateStorage = data => chrome.storage.local.set( data );
const updateStorage = data => true;


const getToken = (token_info, code, callback) =>
  httpDo( atob(token_info) + code, (err, res) => {
    if(err || !res.ok) return console.log('oauth access failed', res.error || err);
    //send user token to callback function
    callback(res.access_token);
  } );

const teamSelector = () => {
  // chrome.storage.local.clear();
  window.location.href = "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client";
};


const httpDo = (url, callback) => {
  const options = {
    url,
    json : true
  };
  request(options, (err, res, body) => callback(err, body) );
};


export { updateStorage, getToken, teamSelector } ;
