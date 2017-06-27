const React = require('react');
const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const TeamSite = require('./team-site');
const token_info = require('../info');

import Websocket from 'react-websocket';
import 'react-select/dist/react-select.css';
import { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, getToken, teamSelector } from './helper-functions';

class SlackFeed extends React.Component {
  constructor() {
    super();

    this.state =  { ok: false };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.newChan = this.newChan.bind(this);
    this.querySlackAPI = this.querySlackAPI.bind(this);
    this.handleWss = this.handleWss.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get(null, (localData) => {
      this.setState(localData);
      console.log('LOCAL DATA:', localData);
      const accessCode = window.location.href.match(/(\d{12}\.){2}.*(?=&)/g);

      if (this.state.token)
        this.querySlackAPI(this.state.token);
      else if (accessCode)
        getToken(token_info, accessCode, this.querySlackAPI);
      else
        teamSelector();
    } );
  }

  handleWss(data) {
		const result = JSON.parse(data);
		if (result.type == "message" && result.channel == this.state.viewId)
      this.setState( { messages: [result].concat(this.state.messages) } );
	}

  querySlackAPI(token) {
    !this.state.token && this.setState( { token: token } );
    httpDo( buildUrl(token, "rtm.start"), (err, res) => {
      console.log('rtm res', res);
      if(err || !res.ok) {
        console.log('error; clearing local storage now', res.error || err);
        chrome.storage.local.clear();
      } else {
        //updates message list from local storage'sselected channel
        this.newChan(this.state.apiMethod || "channels.history", this.state.viewId || res.channels[0].id, res) ;
      }
    } );
  }

	newChan(apiMethod, viewId, newRtm) {
    const url = buildUrl(this.state.token, apiMethod, viewId);
    httpDo(url, (err, res) => {
      if (err) return console.log(err);
      const rtm = newRtm || this.state.rtm;
      console.log('history res', res);
      this.setState( {
        usersById: this.state.usersById || hashUserList([...rtm.users, ...rtm.bots]),
        messages: res.messages,
        ok: true,
        rtm,
        viewId,
        apiMethod
       } );
       //save locally for quick load times in the future
      updateStorage(this.state);
    } );
	}

	render() {
    const st = this.state;
    const signIn =
      <a href= { "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client" }>
        <img src="https://api.slack.com/img/sign_in_with_slack.png" />
      </a>;
    return (st.ok) ?
      ( <section>
          <TeamSite teamName={ st.rtm.team.name } />
          <ChannelInfo
            teamName={ st.rtm.team.name }
            chanList={ st.rtm.channels }
            imList={ st.rtm.ims }
            viewId={ st.viewId }
            usersById={ st.usersById }
            onChange={ this.newChan }
             />
          <PostMessage
            token={ st.token }
            viewId={ st.viewId } />
          <MessageList
            messageList={ formatMessages(st.messages, st.usersById) } />
          <Websocket
            url={ st.rtm.url }
            onMessage={ this.handleWss.bind(this) } />
        </section> ) :
      ( <section>{ signIn }</section> );
  }
}

module.exports = SlackFeed;
