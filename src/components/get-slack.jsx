var React = require( 'react' );
var $ = require( 'jquery' );
var Tooltip = require('rc-tooltip');
var TextSelect = require('react-textselect');
var moment = require('moment');

import { IState } from '../store/reducer';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

var SlackFeed = React.createClass({

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

  }


})
