var React = require( 'react' );
var $ = require( 'jquery' );
var Tooltip = require('rc-tooltip');
var TextSelect = require('react-textselect');
var moment = require('moment');
// import 'rc-tooltip/assets/bootstrap_white.css';


var QuoteDisplay = require( './quote-display.tsx' ).default,
InfoPanel = require( './info-panel.jsx' );

import { IState } from '../store/reducer';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

//TODO avoid having to scope variables as such
var dates = [];
var currentChan = '';

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
			chanInfo: {},
			teamInfo: {}
		}
	},
	componentWillMount: function() {
		const self = this;
		var req = buildQuery('team.info');
		$.getJSON(req, function(teamInfo) {
			console.log('teamInfo', teamInfo);
			self.setState({
				teamInfo: teamInfo
			});
		});
		req = buildQuery('channels.list');
		$.getJSON(req, function(chanList) {
			console.log('chanList, mapped', chanList, chanList.channels.map(chan => chan.name));
			currentChan = chanList.channels[2].id;
			self.setState({
				chanList: chanList.channels.map(chan => chan.name),
				selectedOption: this.chanList[2]
			});
		});
		// req = buildQuery('channels.info', '&channel=C0PK0SZDW');
		// $.getJSON(req, function(chanInfo) {
		// 	console.log('chanInfo', chanInfo);
		// 	self.setState({
		// 		chanInfo: chanInfo
		// 	});
		// })
	},
	onTextSelectChange: function (value) {
		console.log('changed to', value);

	},
	render: function() {
		//TODO: destroy this bad code and refacto
		if(this.state.teamInfo && this.state.teamInfo.team && this.state.chanInfo && this.state.chanInfo.channel) {
			return (
				<div className="chanInfo">
					<h1>{'Team: ' + this.state.teamInfo.team.name}</h1>
					<h2>{'Channel: '}
						<TextSelect
						  options={this.state.chanList.channels}
						  active={this.state.selectedOption}
						  onChange={this.onTextSelectChange} />
					</h2>
				</div>
			);
		} else {
			return (
				<div className="chanInfo">
					<h1>{'Team: '}</h1>
					<h2>{'Channel: '}</h2>
				</div>
			);
		}
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
		var text =  <div>
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
		getInitialState: function(){
			return {
				msgData: [{}]
			}
		},
		componentDidMount: function() {
			const self = this;
			//get list of 100 messages from a slack channel
			var req = buildQuery('team.info', currentChan);
			$.getJSON(req, function(teamInfo) {
				self.setState({
					teamInfo: teamInfo
				});
			});
			var req = buildQuery('users.list');
			var usersById = {};
			$.getJSON(req, function(userList) {
				// console.log('userList', userList.members);
				//create hash key

				for (var i = 0; i < userList.members.length; i++) {
					usersById[userList.members[i].id] = userList.members[i];
				}
			}).then(function() {
				req = buildQuery('channels.history', currentChan);
				//get message list
				$.getJSON(req, function(data) {
					//append user info to each message
					console.log('msgs', data);
					dates = [...new Set(data.messages.map(message => moment(Math.floor(message.ts*1000)).format('MMMM Do YYYY')))];
					console.log('dates', dates);
					for (var i = 0; i < data.messages.length; i++) {
						data.messages[i].userData = usersById[data.messages[i].user];
					}
					// console.log('messages', data.messages);
					self.setState({
						msgData: data.messages.sort(dynamicSort("-ts"))
					});
				}.bind(this));
			});


		},
		render: function () {
			var messages = this.state.msgData.map(function (item, index) {
				// console.log('item', item.userData);
				if(item.userData && item.userData.name) {
					return (
						<MessageItem
							key={index}
							ts={item.ts}
							user={item.userData.name}
							text={item.text}
							profile={item.userData.profile}
							/>
					);
				}
			});
			return (
				<section>
					{messages}
				</section>
			);
		}

	});

	var NewsFeedEradicator = React.createClass( {
		render: function() {
			var quoteDisplay = null;
			if ( this.props.quotesVisible === true ) {
				quoteDisplay = (
					<div className="feedField">
						<SlackLogo />
						<ChannelInfo />
						<MessageList />
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
						<a href="#"
							className="nfe-info-link"
							onClick={ this.props.showInfoPanel }>News Feed Eradicator { newFeatureLabel }</a>
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
			newFeaturesAvailable: areNewFeaturesAvailable( state ),
		} );

		const mapDispatchToProps = ( dispatch ) => ( {
			showInfoPanel: () => dispatch( showInfoPanel() )
		} );

		module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );
