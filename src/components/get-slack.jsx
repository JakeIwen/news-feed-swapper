var React = require( 'react' );
var $ = require( 'jquery' );
var Tooltip = require('rc-tooltip');
var TextSelect = require('react-textselect');
var moment = require('moment');
const async = require('async');
const request = require('request');


import { IState } from '../store/reducer';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

var SlackFeed = React.createClass({
  componentWillMount: function() {
		const self = this;
    var urls = [
      buildQuery('team.info'),
      buildQuery('channels.list'),
      buildQuery('users.list')
    ];

    async.map(urls, httpGet, function (err, res){
      if (err) return console.log(err);
      slackData = res;
      getChan(slackData[1].channels[0].id);
      self.setState({
        teamInfo: res[0].team,
        chanList: res[1].channels,
        userList: res[2].members
      });
    });
	},
	onTextSelectChange: function (value) {
		console.log('changed to', value);

	},
	render: function() {
    return (
      <section>
        <SlackLogo />
        <ChannelInfo teamInfo={this.state.teamInfo} chanList={this.state.chanList} />
        <MessageList userList={this.state.userList} messageList={this.state.messageList}/>
      </section>
    )
  }
})


function getChan(chanId) {
  url = buildQuery('channels.history', chanId);
  httpGet(url, function (err, res){
    if (err) return console.log(err);
    slackData.push(res);
    console.log('res data', res, slackData);
    self.setState({
      MessageList: res
    });
  });
}

function httpGet(url, callback) {
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
