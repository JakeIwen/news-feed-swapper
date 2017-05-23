const React = require( 'react' );
const async = require('async');
const MessageList = require('./message-list');
const PostMessage = require('./postMessage');
const ChannelInfo = require('./channel-info');
const token_info = require('../info');

const client_id = "148278991843.147671805249";
const authURL = "https://slack.com/oauth/authorize?scope=chat:write:user+im:read+im:history+channels:history+team:read+users:read+channels:read&client_id=148278991843.147671805249";
import 'react-select/dist/react-select.css';
import { buildUrl, httpDo, hashUserList, formatMessages, updateStorage, getToken} from './helper-functions';


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
        getToken(token_info, accessCode, self.querySlackAPI);
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
      if(err || !res[0].ok) console.log('post fail', res[0].error || err);
      // get/reload channel
      console.log('async res', res);
      self.newChan(self.state.view || (res[0].ok && res[1].channels[0].id)) ;
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
	render: function() {
    const st = this.state;
    var newTeam = <button onClick={this.newTeam}>New Team</button>;
    var teamName = "";
    var slackSite = <a href={"https://www" + teamName + ".slack.com"}> Visit on Slack Website</a>;
    if (st.chanGet && st.mainGet && st.token && st.userList && st.messageList) {
      teamName = st.teamInfo.name + ".";
      return (
        <section>
          {newTeam} {slackSite}
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
            {newTeam} {slackSite}
        </div> );
    }
  }
});

module.exports = SlackFeed;
