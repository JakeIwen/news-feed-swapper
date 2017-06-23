const React = require('react');
const async = require('async');
const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const TeamSite = require('./team-site');
const token_info = require('../info');

const authURL = "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client";
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
    this.handleResponse = this.handleResponse.bind(this);
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
      this.newChan("channels.history", res.channels[0].id) ;
      this.setState( {
        teamInfo: res.team,
        chanList: res.channels,
        imList: res.ims,
        usersById: hashUserList(res.users),
        wssURL: res.url,
        mainGet: true
      } );
      updateStorage(this.state);
    }
  }

	newChan(method, viewId) {
    const url = buildUrl(this.state.token, method, viewId);
    httpDo(url, (err, res) => {
      if (err) return console.log(err);
      console.log('newchan get', method, viewId);
      console.log('newchan res', res);
      this.setState( {
        messageList: formatMessages(res.messages, this.state.usersById),
        chanGet: true,
        viewId: viewId
      } );
      updateStorage(this.state);
    } );
	}

	render() {
    const st = this.state;
    const signIn =
    <a href= { authURL }>
      <img src="https://api.slack.com/img/sign_in_with_slack.png" />
    </a>;
    return (st.chanGet && st.mainGet && st.token) ?
      ( <section>
          <TeamSite teamName={ st.teamInfo.name } authURL={ authURL } />
          <ChannelInfo
            teamInfo={ st.teamInfo }
            chanList={ st.chanList }
            imList={ st.imList }
            viewId={ st.viewId}
            usersById={ st.usersById }
            onChange={ this.newChan } />
          <PostMessage
            token={ st.token }
            viewId={ st.viewId } />
          <MessageList
            messageList={ st.messageList } />
          <Websocket url={ st.wssURL }
  					onMessage={ this.handleWss } />
        </section> ) :
        ( <section>{ signIn }</section> );
  }
}

module.exports = SlackFeed;
