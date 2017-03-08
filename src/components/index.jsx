const React = require( 'react' );
const moment = require('moment');
const request = require('request');
const async = require('async');
const reactReplace = require('react-string-replace');

const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');

const client_secret = require('../secret');
const client_id = "148278991843.147671805249";
const authURL = "https://slack.com/oauth/authorize?scope=chat:write:user+im:read+im:history+channels:history+team:read+users:read+channels:read&client_id=148278991843.147671805249";
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass( {
  getInitialState: function() {
    return( {
      view: false,
      viewId: "",
      chanGet: false,
      mainGet: false,
      usersById: {},
      token: false
    } );
  },
  componentDidMount: function() {
		const self = this;
    chrome.storage.local.get( null, function( data ) {
      data.mainGet = false;
      data.chanGet = false;
      self.setState( data );
      console.log('STORAGE LOCAL DATA:', data);
      var accessCode = window.location.href.match(/(\d{12}\.){2}.{10}/g);
      if (self.state.token)
        self.querySlackAPI(self.state.token);
      else if (accessCode)
        getToken(client_id, client_secret, accessCode, self.querySlackAPI);
    } );
  },
  querySlackAPI: function (token) {
    const self = this;
    const queryURLs = [
      buildUrl(token, 'team.info'),
      buildUrl(token, 'channels.list'),
      buildUrl(token, 'users.list'),
      buildUrl(token, 'im.list')
    ];
    console.log("querySlackAPI token", self.state.token);
    self.setState( { token: token } );
    async.map(queryURLs, httpDo, function (err, res) {
      if (err) return console.log(err);
      // get/reload channel
      console.log('async res', res);
      self.newChan(self.state.view || res[1].channels[0].id) ;
      self.setState( {
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members,
        imList: res[3].ims,
        usersById: hashUserList(res[2].members),
        mainGet: true
      } );
      updateStorage(self.state);
    });
	},
	newChan: function (e) {
    const self = this;
    if (!e.value) {
      e = {
        value: e,
        apiMethod: "channels.history"
      };
    }
    console.log("e", e);
    var url = buildUrl(self.state.token, e.apiMethod , e.value);
    console.log("url", url);
    httpDo(url, function (err, res) {
      if (err) return console.log(err);
      console.log('new messages res', res);
      self.setState({
        messageList: formatDates(res.messages),
        chanGet: true,
        view: e,
        viewId: e.value
      });
      updateStorage(self.state);
    });
	},
  newTeam: function () {
      chrome.storage.local.clear();
      console.log('newteam');
      window.location.href = authURL;
  },
	render: function() {
    var st = this.state;
    var newTeam = <button onClick={this.newTeam}>New Team</button>;
    if (st.chanGet && st.mainGet && st.token && st.userList && st.messageList) {
    return (
      <section>
        {newTeam}
        <ChannelInfo
          teamInfo={st.teamInfo}
          chanList={st.chanList}
          imList={st.imList}
          viewId={st.view.value}
          usersById={st.usersById}
          onChange={this.newChan} />
        <PostMessage
          token={st.token}
          viewId={st.view.value} />
        <MessageList
          usersById={st.usersById}
          userList={st.userList}
          messageList={st.messageList} />
      </section> );
    } else {
      return(
        <div>
          <a href={authURL}>
            <img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
          {newTeam}
        </div> );
    }
  }
});


var NewsFeedSwapper = React.createClass({
  render: function() {
		return (
			<div className="feedField">
				<SlackFeed />
			</div>
		);
	}
});

function updateStorage(data) {
  chrome.storage.local.set( data );
  console.log('storage updated', data);
}



function hashUserList(userList) {
  var usersById = {};
  for (var i = 0; i < userList.length; i++)
    usersById[userList[i].id] = userList[i];
    console.log('usersById', usersById);
  return usersById;
}

function formatDates(list) {
  var lastDate = null;
  for (var i = 0; i < list.length; i++) {
    list[i].text = replaceTextElements(list[i].text, list[i].ts);
    list[i].date = moment.unix(list[i].ts).format('MMMM Do YYYY');
    if (list[i].date != lastDate) {
      list[i].showDate = true;
      lastDate = list[i].date;
    }
  }
  return list;
}
function replaceTextElements(text, ts) {
  const self = this;
  const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  text = text.replace(/(@.........\|)/g , '')
  .replace(/<.+>/g, match =>
    match.replace(/<|>/g, ""))
  .replace(/@([A-Z]|\d){8}/g, match =>
    match.replace("@", ""));
  // console.log('text', [text]);
  text = reactReplace(text,  url, (match, i) => createMedia(match, ts));
  return text;
}

function createMedia (match, ts) {
  // console.log('createmedia', match);
  var ret;
  if (match.match(/vimeo|youtube|youtu\.be/g))
    ret =  <iframe key={ts} className="slackFrame" src={match.replace("watch?v=", "/embed/")} />;
  else if (match.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret =  <img key={ts} className="slackPic" src={match} />;
  else
    ret = <a href={match} key={ts}>{match}</a>;
  // console.log("media ret", ret);
  return ret;
}

function httpDo(url, callback) {
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
function buildUrl (token, method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var query = 'https://slack.com/api/';
  query += method + "?token=" + token + arg + text + '&pretty=1';
  return encodeURI(query);
}

function getToken (client_id, client_secret, code, callback) {
  var oauth = "https://slack.com/api/oauth.access?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + code + "&pretty=1";
  console.log('oauth', oauth);
  httpDo(oauth, function (err, res) {
    if (err) return console.log('oauth query error', err);
    console.log('oauth res', res);
    callback(res.access_token);
  });
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

module.exports = NewsFeedSwapper;
