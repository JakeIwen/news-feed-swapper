const React = require('react');
const async = require('async');
const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const token_info = require('../info');

const client_id = "148278991843.147671805249";
const authURL = "https://slack.com/oauth/authorize?client_id=" + client_id + "&scope=client";
import Websocket from 'react-websocket';
import 'react-select/dist/react-select.css';
import { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, getToken } from './helper-functions';

class SlackFeed extends React.Component {
  constructor() {
    super();

    this.state =  {
      view: false,
      viewId: "",
      chanGet: false,
      mainGet: false,
      usersById: {},
      token: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.newChan = this.newChan.bind(this);
    this.querySlackAPI = this.querySlackAPI.bind(this);
    this.handleWss = this.handleWss.bind(this);

  }

  componentDidMount() {
    chrome.storage.local.get(null, (localData) => {
      localData.mainGet = false;
      localData.chanGet = false;
      this.setState(localData);
      console.log('STORAGE LOCAL DATA:', localData);
      const accessCode = window.location.href.match(/(\d{12}\.){2}.*(?=&)/g);
      if (this.state.token)
        this.querySlackAPI(this.state.token);
      else if (accessCode)
        getToken(token_info, accessCode, this.querySlackAPI);
    } );
  }

  handleWss(data) {
		const result = JSON.parse(data);
		console.log('WSS DATA', result);
		if (result.type == "message" && result.channel == this.state.viewId) {
			const newMsg = formatMessages([result], this.state.usersById, this.state.messageList);
			this.setState( { messageList: newMsg.concat(this.state.messageList) } );
			console.log('new messagelist', this.state.messageList);
		}
	}

  querySlackAPI(token) {
    this.setState( { token: token } );
    httpDo(buildUrl(token, "rtm.start"), (err, res) => {
      console.log('res', res);
      if(err || !res.ok) {
        console.log('error', res.error || err);
        chrome.storage.local.clear();
      } else {
        this.newChan(this.state.view || (res.ok && res.channels[0].id)) ;
        this.setState( {
          teamInfo: res.team,
          chanList: res.channels,
          userList: res.users,
          imList: res.ims,
          usersById: hashUserList(res.users),
          wssURL: res.url,
          mainGet: true
        } );
        updateStorage(this.state);
      }
    });
	}

	newChan(e) {
    if (!e.value) {
      e = {
        value: e,
        apiMethod: "channels.history"
      };
    }
    const url = buildUrl(this.state.token, e.apiMethod , e.value);
    httpDo(url, (err, res) => {
      if (err) return console.log(err);
      console.log('new messages res', res);
      this.setState( {
        messageList: formatMessages(res.messages, this.state.usersById),
        chanGet: true,
        view: e,
        viewId: e.value
      } );
      updateStorage(this.state);
    });
	}

  newTeam() {
      chrome.storage.local.clear();
      window.location.href = authURL;
  }

  slackSite() {
    return (
      <a href={"https://www." + this.state.teamInfo.name + ".slack.com"}>
        Visit on Slack Website
      </a>
    );
  }
	render() {
    const st = this.state;
    const newTeam = <button onClick={ this.newTeam }>New Team</button>;
    const signIn =
    <a href= {authURL }>
      <img src="https://api.slack.com/img/sign_in_with_slack.png" />
    </a>;
    if (st.chanGet && st.mainGet && st.token) {
      return (
        <section>
          {newTeam} { this.slackSite() }
          <ChannelInfo
            teamInfo={ st.teamInfo }
            chanList={ st.chanList }
            imList={ st.imList }
            viewId={ st.view.value}
            usersById={ st.usersById }
            onChange={ this.newChan } />
          <PostMessage
            token={ st.token }
            viewId={ st.view.value } />
          <MessageList
            messageList={ st.messageList } />
          <Websocket url={ st.wssURL }
  					onMessage={ this.handleWss } />
        </section> );
    } else {
      return( <section>{ signIn }</section> );
    }
  }
}

module.exports = SlackFeed;
