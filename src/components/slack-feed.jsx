const React = require('react');
const async = require('async');
const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const token_info = require('../info');

const client_id = "148278991843.147671805249";
const authURL = "https://slack.com/oauth/authorize?" +
  "client_id=" + client_id +
  "&scope=client";
  // "+chat:write:user";
import Websocket from 'react-websocket';
import 'react-select/dist/react-select.css';
import { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, getToken } from './helper-functions';

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
      var accessCode = window.location.href.match(/(\d{12}\.){2}.*(?=&)/g);
      if (self.state.token)
        self.querySlackAPI(self.state.token);
      else if (accessCode)
        getToken(token_info, accessCode, self.querySlackAPI);
    } );
  },
  handleWss: function(data) {
		const self = this;
		let result = JSON.parse(data);
		console.log('WSS DATA', result);
		if (result.type == "message" && result.channel == self.state.viewId) {
			var newMsg = formatMessages([result], self.state.usersById, self.state.messageList);
			self.setState( { messageList: newMsg.concat(self.state.messageList) } );
			console.log('new messagelist', self.state.messageList);
		}
	},
  querySlackAPI: function (token) {
    const self = this;
    self.setState( { token: token } );
    httpDo(buildUrl(token, "rtm.start"), function (err, res) {
      console.log('res', res);
      if(err || !res.ok) {
        console.log('error', res.error || err);
        chrome.storage.local.clear();
      } else {
        self.newChan(self.state.view || (res.ok && res.channels[0].id)) ;
        self.setState( {
          teamInfo: res.team,
          chanList: res.channels,
          userList: res.users,
          imList: res.ims,
          usersById: hashUserList(res.users),
          wssURL: res.url,
          mainGet: true
        } );
        updateStorage(self.state);
    }
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
    var url = buildUrl(self.state.token, e.apiMethod , e.value);
    httpDo(url, function (err, res) {
      if (err) return console.log(err);
      console.log('new messages res', res);
      self.setState( {
        messageList: formatMessages(res.messages, self.state.usersById),
        chanGet: true,
        view: e,
        viewId: e.value
      } );
      updateStorage(self.state);
    });
	},
  newTeam: function () {
      chrome.storage.local.clear();
      console.log('newteam');
      window.location.href = authURL;
  },
  slackSite: function () {
    return (
      <a href={"https://www." + this.state.teamInfo.name + ".slack.com"}>
        Visit on Slack Website
      </a>
    );
  },
	render: function() {
    const st = this.state;
    var newTeam = <button onClick={this.newTeam}>New Team</button>;
    var signIn =
    <a href={authURL}>
      <img src="https://api.slack.com/img/sign_in_with_slack.png" />
    </a>;
    console.log('st', st);
    if (st.chanGet && st.mainGet && st.token) {
      return (
        <section>
          {newTeam} {this.slackSite()}
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
            messageList={st.messageList} />
          <Websocket url={st.wssURL}
  					onMessage={this.handleWss} />
        </section> );
    } else {
      return( <section>{signIn}</section> );
    }
  }
});

module.exports = SlackFeed;
