const React = require( 'react' );
const Select = require('react-select');
const moment = require('moment');
const request = require('request');
const Tooltip = require('rc-tooltip');
const async = require('async');
const reactReplace = require('react-string-replace');
const QuoteDisplay = require( './quote-display.tsx' ).default;
const browser = require( 'browser-specific' );


// Include main chrome manifest
require( '!file?name=manifest.json!../../browsers/chrome/manifest.json' );

// Chrome requires extension icons
require( 'file?name=icon16.jpg!../../assets/icon16.jpg' );
require( 'file?name=icon48.jpg!../../assets/icon48.jpg' );
require( 'file?name=icon128.jpg!../../assets/icon128.jpg' );

// import thunk from 'redux-thunk';
// import { Store as ReduxStore, createStore as createReduxStore, applyMiddleware } from 'redux';
// import rootReducer, { IState } from '../store/reducer';

import { connect } from 'react-redux';
// import { SlackFeed } from './get-slack'
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass({
  getInitialState: function() {
    return( {
      chanGet: false,
      mainGet: false
    } );
  },
  componentDidMount: function() {
		const self = this;

     chrome.storage.local.get( null, function( data ) {
       self.setState( { storage: data } );
       console.log('STORAGE LOCAL DATA:', data);
     });

    var urls = [
      buildUrl('team.info'),
      buildUrl('channels.list'),
      buildUrl('users.list')
    ];
    async.map(urls, httpDo, function (err, res){
      if (err) return console.log(err);
      // console.log('res asy', res);
      if (res[1].channels.map(chans => chans.id).includes(self.state.storage.lastChan)) { self.newChan(self.state.storage.lastChan);
        console.log('true', res[1].channels.map(chans => chans.id));
      } else {
        self.newChan(res[1].channels[0].id);
      }

      self.setState({
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members,
        mainGet: true
      });
    });
	},
	newChan: function (chanId) {
    var self = this;
    console.log('new channel', chanId);
    var url = buildUrl('channels.history', chanId);
    httpDo(url, function (err, res){
      if (err) return console.log(err);
      console.log('res data', res);
      self.setState({
        messageList: res.messages,
        chanGet: true,
        chanId: chanId
      });
    });
    self.saveChan({lastChan: chanId});
	},
  saveChan: function(channelInfo) {
    var self = this;
    console.log('saving channel to chrome BEFORE ', self.state.storage, channelInfo);
    console.log('saving channel to chromeCOMVINED', Object.assign(self.state.storage, channelInfo));

    self.setState( {
      storage: Object.assign(self.state.storage, channelInfo)
    } );
    console.log('saving channel to chrome', self.state.storage);
    chrome.storage.local.set(self.state.storage);
  },
	render: function() {
    var feed = null;
      if (this.state.chanGet && this.state.mainGet) {
        console.log('teaminfo', this.state.teamInfo);
        feed =
          <section>
            <ChannelInfo teamInfo={this.state.teamInfo} chanList={this.state.chanList} chanId={this.state.chanId} onChange={this.newChan}/>
            <PostMessage chanId={this.state.chanId}/>
            <MessageList userList={this.state.userList} messageList={this.state.messageList}/>
          </section>;
      }
    return ( <div>{feed}</div> );
  }
});

var SlackLogo = React.createClass({
	render: function() {
		return (
			<div className='logo'>
				<img src='https://lh3.googleusercontent.com/CzlsZP3xUHeX3HAGdZ2rL9mK6_C-6T1-YWeBeM8nB3ilmfPSBHCFx4-UbQr8MnQms3d9=w300' height='40' />
				<span>SlackFeed</span>
			</div>
		);
	}
});

var ChannelInfo = React.createClass( {
	getInitialState: function(){
		return { chanSelect: [] };
	},
	componentDidMount: function() {
		const self = this;
		var chanSelect = [];
		for (var i = 0; i < this.props.chanList.length; i++) {
			chanSelect.push( {
				value: this.props.chanList[i].id,
				label: this.props.chanList[i].name
			} );
		}
		this.setState({
			chanSelect: chanSelect,
			selectedChan: self.props.chanId
		});
	},
	newChan: function (e) {
		console.log('changed to', e);
		if (typeof this.props.onChange === 'function' && e) {
			this.props.onChange(e.value);
      this.setState({
        selectedChan: e.value
      });
		}
	},
	render: function() {
		return (
			<div className="chanInfo">
        <SlackLogo />
        <div className="teamChan">
          <div className="slackTeam">
            <h2>{'Team: ' + this.props.teamInfo.name}</h2>
          </div>
          <div className="chanSelect">
    				<h2 className="channel">{'Channel: '}</h2>
  					<Select
  					  options={this.state.chanSelect}
  					  value={this.state.selectedChan}
  					  onChange={this.newChan} />
          </div>
        </div>
			</div>
		);
	}
});
var PostMessage = React.createClass( {
  getInitialState: function(){
    return { postText: '' };
  },
  postToSlack: function () {
    var self = this;
    console.log('post txt, chanid', this.state.postText, self.props.chanId);
    var url = buildUrl('chat.postMessage', self.props.chanId, self.state.postText);
    // console.log('url', url);
    httpDo(url, function (err, res) {
      if(err) console.log('post fail', err);
      console.log('post res', res);
      self.setState( { postText: '' } );
      //append to array to show post
    });
  },
  handleChange(event) {
    console.log('handli');
    this.setState({postText: event.target.value});
  },
  render: function() {
    return (
      <form onSubmit={this.postToSlack}>
        <textarea
          type="text"
          className="postMessage"
          onChange={this.handleChange}
          value={this.state.postText}
          placeholder="Post to Slack..."/>
        <input type="submit"/>
      </form>
    );
  }
} );

var MessageItem = React.createClass({
	render: function() {
		var text =
			<div>
				<img src={this.props.profile.image_192} /><br />
				<span>{this.props.profile.real_name}</span><br />
				<span>{this.props.profile.email}</span><br />
			</div>;
		return (
			<div>
				<p className="date">{this.props.date}</p>
				<Tooltip
					placement="right"
					overlay={text}
					arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
					<a href="#" className="user">{this.props.user}:</a>
				</Tooltip><br />
				<span>{this.props.text}</span>
				<br />
			</div>
		);
	}
});

var MessageList = React.createClass({
  getInitialState: function () {
    return { usersById: {} };
  },
  formatDates: function () {
    var dates = this.props.messageList.map(message => moment(Math.floor(message.ts)*1000).format('MMMM Do YYYY'));
    // console.log('datesfirst', dates);
    var lastDate = dates[0];
    for (var i = 1; i < dates.length; i++) {
      if (dates[i] != lastDate)
        lastDate = dates[i];
      else
        dates[i] = null;
    }
    console.log('dates', dates);
    return dates;
  },
	componentWillMount: function() {
		const self = this;
		var usersById = {};
		for (var i = 0; i < self.props.userList.length; i++)
			usersById[self.props.userList[i].id] = self.props.userList[i];
    for (var i = 0; i < self.props.messageList.length; i++)
      self.props.messageList[i].userData = usersById[self.props.messageList[i].user];
    self.setState( {
      usersById: usersById,
      dates: self.formatDates()
    } );
	},
  replaceTextElements: function(text) {
    var self = this;
    // text = reactReplace(text, /<@([A-Z]|\d)+>/g, function(match, i) {
    //   console.log('match2', match);
    //   return ( <span className="userTag">{self.state.usersById[match.replace(/<|>|@/g, '')].name}</span> );
    // });
    text = reactReplace(text, /<(https?:\/\/\S+>)/g, function(match, i) {
      // console.log('original text', text);
      match = match.replace(/<|>/g, '');
      if (match.match(/vimeo|youtube|youtu\.be/g))
        return ( <iframe className="slackFrame" src={match.replace("watch?v=", "v/")} /> );
      else if (match.match(/jpg|\.png|\.gif|\.bmp|\.svg/g))
        return ( <img className="slackPic" src={match} /> );
    });
    // console.log('after:', text);
    return text;
  },
	render: function () {
    var self = this;
		var messages = this.props.messageList.map(function (item, index) {
      if (item.user) {
        return (
          <MessageItem
            className="messageItem"
            date={self.state.dates[index]}
            key={index}
            ts={item.ts}
            user={self.state.usersById[item.user].name}
            text={self.replaceTextElements(item.text.replace(/(@.........\|)/g, ''))}
            profile={self.state.usersById[item.user].profile}
          />
        );
      } else {
        return (<span>unknown element</span>);
      }
		});
		return (
				<div>{messages}</div>
		);
	}
});

var NewsFeedEradicator = React.createClass({
  render: function() {
  	var quoteDisplay = null;
  	if ( this.props.quotesVisible === true ) {
  		quoteDisplay = (
  			<div className="feedField">
  				<SlackFeed />
  			</div>
  		);
  	}
  	let newFeatureLabel = null;
  	if ( this.props.newFeaturesAvailable ) {
  		newFeatureLabel = <span className="nfe-label nfe-new-features">New Features!</span>;
  		}
		return (
			<div>
				{ this.props.infoPanelVisible && <InfoPanel /> }
				{ quoteDisplay }
			</div>
		);
	}
});

const mapStateToProps = ( state ) => ( {
	infoPanelVisible: state.showInfoPanel,
	quotesVisible: state.showQuotes,
} );

const mapDispatchToProps = ( dispatch ) => ( {
	showInfoPanel: () => dispatch( showInfoPanel() )
} );

module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );

function httpDo(url, callback) {
  const options = {
    url :  url,
    json : true
  };
  request(options,
    function(err, res, body) {
      console.log('request', res);
      callback(err, body);
    }
  );
}
function buildUrl (method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var token = '?token=xoxp-146385117830-146586426951-147257225174-cd6c345ce9d4e152a2ce002e29d54b66';
  var query = 'https://slack.com/api/';
  query += method + token + arg + text + '&pretty=1';
  console.log('query', query);
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
