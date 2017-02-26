var React = require( 'react' );
var Select = require('react-select');
var moment = require('moment');
var request = require('request');
var Tooltip = require('rc-tooltip');
var async = require('async');
var QuoteDisplay = require( './quote-display.tsx' ).default;

import { connect } from 'react-redux';
// import { SlackFeed } from './get-slack'
import 'react-select/dist/react-select.css';

//TODO avoid having to scope variables as such
var dates = [];

var SlackFeed = React.createClass({
  getInitialState: function() {
    return( {
      chanGetSuccess: false,
      mainGetSuccess: false
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
        mainGetSuccess: true
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
        chanGetSuccess: true
      });
    });
	},
	render: function() {
    console.log(this.state.chanGetSuccess, this.state.mainGetSuccess);

    var feed = null;
      if (this.state.chanGetSuccess && this.state.mainGetSuccess) {
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
  var token = '?token=xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
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
//for async - make a parent element that passes all necessary properties to child elements and makes all ajax calls

var ChannelInfo = React.createClass({
	getInitialState: function(){
		return {
			chanSelect: ''
		}
	},
	// componentWillReceiveProps: function(nextProps) {
	// 	console.log('willRecieve');
	// },
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
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(e.value);
		}
	},
	render: function() {
		//TODO: destroy this bad code and refacto
		return (
			<div className="chanInfo">
				<h1>{'Team: ' + this.props.teamInfo.name}</h1>
				<h2>{'Channel: '}</h2>
					<Select
						name='Select Channel'
					  options={this.state.chanSelect}
					  active={this.state.selectedChan}
					  onChange={this.newChan} />
			</div>
		);
	}
});


var MessageItem = React.createClass({
	render: function() {
		var thisDate = moment(Math.floor(this.props.ts * 1000)).format('MMMM Do YYYY');
		var idx = dates.indexOf(thisDate);
		//dont display the same date multiple times in a row
		//TODO look up React lookbehinds or something to avoid dates variable
		if (idx != -1) {
			dates.splice(idx, 1);
			thisDate = <p className="date">{thisDate}</p>;
		} else {
			thisDate = null;
		}
		var text =
			<div>
				<img src={this.props.profile.image_192} /><br />
				<span>{this.props.profile.real_name}</span><br />
				<span>{this.props.profile.email}</span><br />
			</div>;

			return (
				<div>
					{thisDate}
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
    return {
      usersById: {}
    }
  },
	componentWillMount: function() {
		const self = this;
		//get list of 100 messages from a slack channel
		var usersById = {};
		for (var i = 0; i < this.props.userList.length; i++) {
			usersById[this.props.userList[i].id] = this.props.userList[i];
		}
    self.setState( {
      usersById: usersById
    } );
		dates = [...new Set(this.props.messageList.map(message => moment(Math.floor(message.ts*1000)).format('MMMM Do YYYY')))];
		console.log('dates', dates);
		for (var i = 0; i < this.props.messageList.length; i++) {
			this.props.messageList[i].userData = usersById[this.props.messageList[i].user];
		}
	},
	render: function () {
    var self = this;
    console.log('state', this.state);
		var messages = this.props.messageList.map(function (item, index) {
			// console.log('item', item.userData);
				return (
					<MessageItem
						key={index}
						ts={item.ts}
						user={self.state.usersById[item.user].name}
						text={item.text}
						profile={self.state.usersById[item.user]}
						/>
				);
		});
		return (
				<div>{messages}</div>
		);
	}
});

	var NewsFeedEradicator = React.createClass( {
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
		} );

		function buildQuery (method, arg) {
			arg = (arg) ? ('&channel=' + arg) : '';
			var token = '?token=xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
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
		const mapStateToProps = ( state ) => ( {
			infoPanelVisible: state.showInfoPanel,
			quotesVisible: state.showQuotes,
			// newFeaturesAvailable: areNewFeaturesAvailable( state ),
		} );

		const mapDispatchToProps = ( dispatch ) => ( {
			showInfoPanel: () => dispatch( showInfoPanel() )
		} );

		module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );
