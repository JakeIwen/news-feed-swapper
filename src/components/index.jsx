var React = require( 'react' );
var $ = require( 'jquery' );
var Tooltip = require('rc-tooltip');
import 'rc-tooltip/assets/bootstrap_white.css';
// var Tooltip = require('../../slack-isolate/react-tooltip.min.js');


var QuoteDisplay = require( './quote-display.tsx' ).default,
	InfoPanel = require( './info-panel.jsx' );

import { IState } from '../store/reducer';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';
// import Tooltip from '../../slack-isolate/react-tooltip.min.js';



const styles = {
  display: 'inline-block',
  // lineHeight: '40px',
  // height: '40px',
  // width: '80px',
  textAlign: 'center',
  // background: '#f6f6f6',
	textDecoration: 'underline',
  marginLeft: '1em',
  marginBottom: '.1em',
  // borderRadius: '6px',
};

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

var MessageItem = React.createClass({
  render: function() {
		var text =  <div>
								  <img src={this.props.profile.image_192} /><br />
								  <span>{this.props.profile.real_name}</span><br />
								  <span>{this.props.profile.email}</span>
								</div>;
			console.log('text', text);
			console.log('imgsrc', this.props.profile.image_192);
    return (
      <div>
        <p>{timeConverter(this.props.ts)}</p>
					<Tooltip
						placement="right"
						overlay={text}
						arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
					>
						<a href="#" style={styles}>{this.props.user}</a>
					</Tooltip>
        <p>{this.props.text}</p>
      </div>
    )
  }
});

var MessageList = React.createClass({
  getInitialState: function(){
    //so .map doesnt throw error initially
    return {
      msgData: [{}]
    }
  },
  componentDidMount: function() {
    const self = this;
    //get list of 100 messages from a slack channel
    var req = buildQuery('users.list');
    var usersById = {};
    $.getJSON(req, function(userList) {
      // console.log('userList', userList.members);
      //create hash key
      for (var i = 0; i < userList.members.length; i++) {
        usersById[userList.members[i].id] = userList.members[i];
      }
    }).then(function() {
      req = buildQuery('channels.history', '&channel=C0PK0SZDW');
      //get message list
      $.getJSON(req, function(data) {
        //append user info to each message
        for (var i = 0; i < data.messages.length; i++) {
          data.messages[i].userData = usersById[data.messages[i].user];
        }
        // console.log('messages', data.messages);
        self.setState({
          msgData: data.messages.sort(dynamicSort("-ts"))
        });
      }.bind(this));
    });

 		function buildQuery (method, arg) {
 			arg = arg || '';
 			var token = '?token=xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
 			var query = 'https://slack.com/api/';
 			query += method + token + arg + '&pretty=1';
 			return encodeURI(query);
 		}
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

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
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
