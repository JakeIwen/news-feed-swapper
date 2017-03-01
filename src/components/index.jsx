const React = require( 'react' );
const moment = require('moment');
const request = require('request');
const async = require('async');
const reactReplace = require('react-string-replace');

const QuoteDisplay = require( './quote-display.tsx' ).default;
const MessageList = require('./message-list');
const PostMessage = require('./post-message');
const ChannelInfo = require('./channel-info');
var token = require('../key2');
token = '?token=' + token;

// Include main chrome manifest
require( '!file?name=manifest.json!../../browsers/chrome/manifest.json' );

// Chrome requires extension icons
require( 'file?name=icon16.jpg!../../assets/icon16.jpg' );
require( 'file?name=icon48.jpg!../../assets/icon48.jpg' );
require( 'file?name=icon128.jpg!../../assets/icon128.jpg' );

import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass( {
  getInitialState: function() {
    return( {
      chanId:"",
      chanGet: false,
      mainGet: false
    } );
  },
  componentDidMount: function() {
		const self = this;
    self.setState({
      chanId: ""
    });
    self.querySlackAPI();
    chrome.storage.local.get( null, function( data ) {
      console.log('data', data);
      self.setState( data );
      console.log('STORAGE LOCAL DATA:', data);
      self.querySlackAPI();
      if (self.state.chanInfo != "") {
        console.log('preState switch');
        self.setState( {
          mainGet: true,
          chanGet: true
        } );
      }
    });
  },
  querySlackAPI: function () {
    const self = this;
    var urls = [
      buildUrl('team.info'),
      buildUrl('channels.list'),
      buildUrl('users.list')
    ];
    async.map(urls, httpDo, function (err, res){
      if (err) return console.log(err);
      // make sure channel from stora
      // if (res[1].channels.map(chans => chans.id).includes(self.state.chanId)) { self.newChan(self.state.chanId);
      // } else {
        self.newChan(self.state.chanId || res[1].channels[0].id);
      // }
      console.log('async res', res);
      self.setState({
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members,
        mainGet: true
      });
    });
	},
  updateStorage: function (data) {
    data.chanId = false;
    data.chanGet = false;
    chrome.storage.local.set( data );
    console.log('storage updated', data);
  },
	newChan: function (chanId) {
    const self = this;
    var url = buildUrl('channels.history', chanId);
    httpDo(url, function (err, res){
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

function createMedia (urls, ts) {
  console.log('urls', urls);
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
      console.log('request', res);
      callback(err, body);
    }
  );
}
function buildUrl (method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var query = 'https://slack.com/api/';
  query += method + token + arg + text + '&pretty=1';
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

module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );
