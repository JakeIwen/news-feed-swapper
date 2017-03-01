const React = require( 'react' );
const moment = require('moment');
const request = require('request');
const async = require('async');
const reactReplace = require('react-string-replace');

const MessageList = require('./message-list');
const PostMessage = require('./post-message');
const ChannelInfo = require('./channel-info');
// var token = require('../key2');
// token = '?token=' + token;

import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass( {
  getInitialState: function() {
    console.log('initila');
    console.log('browserURL', window.location);
    return( {
      chanId: "",
      chanGet: false,
      mainGet: false,
      token: false
    } );
  },
  componentDidMount: function() {
		const self = this;
    self.querySlackAPI();
    chrome.storage.local.get( null, function( data ) {
      data.mainGet = false;
      data.chanGet = false;
      self.setState( data );
      console.log('STORAGE LOCAL DATA:', data);
      if (self.state.token) { self.querySlackAPI(); }
    });
  },
  querySlackAPI: function () {
  const self = this;
    //render before slap API call completes if sufficient data was pulled from storage
    if (self.state.chanId != "") {
      console.log('preState switch');
      self.setState( {
        mainGet: true,
        chanGet: true
      } );
    }
    var urls = [
      buildUrl('team.info'),
      buildUrl('channels.list'),
      buildUrl('users.list')
    ];
    async.map(urls, httpDo, function (err, res) {
      if (err) return console.log(err);
      // get/reload channel
      self.newChan(res[1].channels[0].id);
      console.log('async res', res);
      self.setState( {
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members,
        mainGet: true
      } );
    });
	},
  updateStorage: function (data) {
    chrome.storage.local.set( data );
    console.log('storage updated', data);
  },
	newChan: function (chanId) {
    const self = this;
    var url = buildUrl('channels.history', chanId);
    httpDo(url, function (err, res) {
      if (err) return console.log(err);
      self.setState({
        messageList: res.messages,
        chanGet: true,
        chanId: chanId
      });
      self.updateStorage(self.state);
    });
	},
	render: function() {
    if(!this.state.token) {
      //slack sign-in button
      return (<a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=148278991843.147671805249"><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>)
    } else if (this.state.chanGet && this.state.mainGet) {
      return (
        <section>
          <ChannelInfo teamInfo={this.state.teamInfo} chanList={this.state.chanList} chanId={this.state.chanId} onChange={this.newChan}/>
          <PostMessage chanId={this.state.chanId}/>
          <MessageList userList={this.state.userList} messageList={this.state.messageList}/>
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

function createMedia (urls, ts) {
  console.log('createmedia', urls);
  var ret;
  if (urls.match(/vimeo|youtube|youtu\.be/g))
    ret = ( <iframe key={ts} className="slackFrame" src={urls.replace("watch?v=", "v/")} /> );
  else if (urls.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret = ( <img key={ts} className="slackPic" src={urls} /> );
  else
    ret = (<a href={urls} key={ts}>{urls}</a>);
  console.log("ret", ret);
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
function buildUrl (method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var query = 'https://slack.com/api/';
  query += method + this.state.token + arg + text + '&pretty=1';
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
