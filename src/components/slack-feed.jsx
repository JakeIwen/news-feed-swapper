const React = require('react');
const async = require('async');
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

    this.state =  {
      viewId: false,
      usersById: {},
      token: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.newChan = this.newChan.bind(this);
    this.querySlackAPI = this.querySlackAPI.bind(this);
    this.handleWss = this.handleWss.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get(null, (localData) => {
      this.setState(localData);
      console.log('STORAGE LOCAL DATA:', localData);
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
    console.log('WSS', result);

		if (result.type == "message" && result.channel == this.state.viewId) {
      this.setState( { messageList: newMsg.concat(this.state.messageList) } );
			const newMsg = formatMessages([result], this.state.usersById, this.state.messageList);
		}
	}

  querySlackAPI(token) {
    this.setState( { token: token } );
    httpDo(buildUrl(token, "rtm.start"), (err, res) => this.handleResponse(err, res));
	}

  handleResponse(err, res) {
    console.log('res', res);
    if(err || !res.ok) {
      console.log('error', res.error || err);
      chrome.storage.local.clear();
    } else {
      //TODO currently defaults to main channel instead of persisting in storage
      this.newChan("channels.history", res.channels[0].id, res) ;
    }
  }

	newChan(method, viewId, newRtm) {
    const url = buildUrl(this.state.token, method, viewId);
    httpDo(url, (err, res) => {
      if (err) return console.log(err);
      console.log('newchan get', method, viewId, newRtm);
      console.log('newchan res', res);
      let rtm = newRtm || this.state.rtm;
      this.setState( {
        history: res,
        rtm: rtm,
        viewId: viewId,
        usersById: hashUserList(rtm.users)
       } );
      updateStorage(this.state);
    } );
	}

	render() {
    const st = this.state;
    const signIn =
    <a href= { "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client" }>
      <img src="https://api.slack.com/img/sign_in_with_slack.png" />
    </a>;
    return (st.rtm && st.rtm.ok && st.history && st.history.ok && st.token && st.viewId && st.usersById) ?
      ( <section>
          <TeamSite teamName={ st.rtm.team.name } />
          <ChannelInfo
            teamInfo={ st.rtm.team }
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
            messageList={ formatMessages(st.history.messages, st.usersById) } />
        </section> ) :
        ( <section>{ signIn }</section> );
  }
}

//

module.exports = SlackFeed;
