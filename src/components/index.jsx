const React = require( 'react' );
const moment = require('moment');
const request = require('request');
const async = require('async');
const reactReplace = require('react-string-replace');

const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const ChatInfo = require('./chat-info');

const client_secret = require('../secret');
const client_id = "148278991843.147671805249";
var oauth;

import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass( {
  getInitialState: function() {
    console.log('initila');
    return( {
      chanId: "",
      msgGet: false,
      mainGet: false,
      token: false
    } );
  },
  componentDidMount: function() {
		const self = this;

    chrome.storage.local.get( null, function( data ) {
      data.mainGet = false;
      data.msgGet = false;
      self.setState( data );
      console.log('STORAGE LOCAL DATA:', data);
      if (self.state.token) { self.querySlackAPI(self.state.token); }
      else if (window.location.search.substring(6, 42).length > 34) { getToken(); }
    } );

    function getToken () {
      oauth = "https://slack.com/api/oauth.access?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + window.location.search.substring(6, 42) + "&pretty=1";
      console.log('oauth', oauth);
      httpDo(oauth, function (err, res) {
        if (err) return console.log('oauth query error', err);
        console.log('oauth res', res);
        self.querySlackAPI(res.access_token);
      });
    }

  },
  resetStore: function () {
    chrome.storage.local.clear();
    this.state = null;
    console.log(this.state);
  },
  querySlackAPI: function (token) {
    const self = this;
    console.log("querySlackAPI toekn", self.state.token);
    //render before slap API call completes if sufficient data was pulled from storage
    if (self.state.token) {
      console.log('preState switch');
      self.setState( {
        mainGet: true,
        msgGet: true
      } );
    } else {
      self.setState( {
        token: token
      } );
    }
    var urls = [
      buildUrl(token, 'team.info'),
      buildUrl(token, 'channels.list'),
      buildUrl(token, 'users.list'),
      buildUrl(token, 'groups.list')
    ];
    async.map(urls, httpDo, function (err, res) {
      if (err) return console.log(err);
      // get/reload channel
      console.log('async res', res);
      self.newChan(self.state.chanId || res[1].channels[0].id);
      self.setState( {
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members,
        chatList: res[3].groups,
        mainGet: true
      } );
      self.updateStorage(self.state);
    });
	},
  updateStorage: function (data) {
    chrome.storage.local.set( data );
    console.log('storage updated', data);
  },
  newChan: function (chanId) {
    const self = this;
    var url = buildUrl(self.state.token, 'channels.history', chanId);
    httpDo(url, function (err, res) {
      if (err) return console.log(err);
      self.setState({
        messageList: res.messages,
        msgGet: true,
        chanId: chanId
      });
      self.updateStorage(self.state);
    });
	},
  newChat: function (chatId) {
    const self = this;
    var url = buildUrl(self.state.token, 'groups.history', chatId);
    httpDo(url, function (err, res) {
      if (err) return console.log(err);
      self.setState({
        messageList: res.messages,
        msgGet: true,
        chanId: chanId
      });
      self.updateStorage(self.state);
    });
	},
	render: function() {
    const self = this;
    var newTeam = <button onClick={this.resetStore}>New Team</button>;
    var channel = <ChannelInfo teamInfo={this.state.teamInfo} chanList={this.state.chanList} chanId={this.state.chanId} onChange={this.newChan} />;
    var chat = <ChatInfo teamInfo={this.state.teamInfo} chanList={this.state.chatList} chatId={this.state.chatId} onChange={this.newChat}/>;

    if(!this.state.token) {
      return(
        <div>
          <a href="https://slack.com/oauth/authorize?scope=chat:write:user+channels:history+team:read+users:read+channels:read&client_id=148278991843.147671805249">
            <img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>
          {newTeam}
        </div> );
    } else if (this.state.msgGet && this.state.mainGet) {
      return (
        <section>
          {newTeam}
          {channnel}//maker ternary
          <PostMessage token={this.state.token} chanId={this.state.chanId} />
          <MessageList userList={this.state.userList} messageList={this.state.messageList} />
        </section> );
    } else {
      return null;
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
  // + '1&scope=' + method.split('.')[0] + ":read";
  return encodeURI(query);
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
