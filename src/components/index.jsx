const React = require( 'react' );
const Select = require('react-select');
const moment = require('moment');
const request = require('request');
const Tooltip = require('rc-tooltip');
const async = require('async');
const reactReplace = require('react-string-replace')
const QuoteDisplay = require( './quote-display.tsx' ).default;

import { connect } from 'react-redux';
// import { SlackFeed } from './get-slack'
import 'react-select/dist/react-select.css';

var SlackFeed = React.createClass({
  getInitialState: function() {
    return( {
      chanGet: false,
      mainGet: false,
    } );
  },
  componentDidMount: function() {
		const self = this;
    var urls = [
      buildQuery('team.info'),
      buildQuery('channels.list'),
      buildQuery('users.list')
    ];
    async.map(urls, httpGet, function (err, res){
      if (err) return console.log(err);
      console.log('res asy', res);
      self.newChan(res[1].channels[0].id);
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
    var url = buildQuery('channels.history', chanId);
    httpGet(url, function (err, res){
      if (err) return console.log(err);
      console.log('res data', res);
      self.setState({
        messageList: res.messages,
        chanGet: true
      });
    });
	},
	render: function() {
    var feed = null;
      if (this.state.chanGet && this.state.mainGet) {
        console.log('teaminfo', this.state.teamInfo);
        feed =
          <section>
            <SlackLogo />
            <ChannelInfo teamInfo={this.state.teamInfo} chanList={this.state.chanList} onChange={this.newChan}/>
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
		)
	}
});

var ChannelInfo = React.createClass({
	getInitialState: function(){
		return { chanSelect: [] }
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
			selectedChan: self.props.chanList[0].id
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
				<h1>{'Team: ' + this.props.teamInfo.name}</h1>
				<h2>{'Channel: '}</h2>
					<Select
					  options={this.state.chanSelect}
					  value={this.state.selectedChan}
					  onChange={this.newChan} />
			</div>
		);
	}
});

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
    return { usersById: {} }
  },
  formatDates: function () {
    var dates = this.props.messageList.map(message => moment(Math.floor(message.ts*1000)).format('MMMM Do YYYY'));
    console.log('datesfirst', dates);
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
      console.log('original text', text);
      match = match.replace(/<|>/g, '');
      if (match.match(/vimeo|youtube|youtu\.be/g))
        return ( <iframe className="slackFrame" src={match.replace("watch?v=", "v/")} /> )
      else if (match.match(/jpg|\.png|\.gif|\.bmp|\.svg/g))
        return ( <img className="slackPic" src={match} /> )
    });
    console.log('after:', text);
    return text;
  },
	render: function () {
    //TODO find way to not use widely scoped dates var
    var self = this;
    console.log('state', this.state);
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
        return (<span>unknown element</span>)
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
	// newFeaturesAvailable: areNewFeaturesAvailable( state ),
} );

const mapDispatchToProps = ( dispatch ) => ( {
	showInfoPanel: () => dispatch( showInfoPanel() )
} );

module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );

function httpGet(url, callback) {
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
function buildQuery (method, arg) {
  arg = (arg) ? ('&channel=' + arg) : '';
  var token = '?token=xoxp-146385117830-146586426951-147257225174-cd6c345ce9d4e152a2ce002e29d54b66';
  var query = 'https://slack.com/api/';
  query += method + token + arg + '&pretty=1';
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
  }
}
