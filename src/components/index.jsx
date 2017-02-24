var React = require( 'react' );
var $ = require( 'jquery' );

var QuoteDisplay = require( './quote-display.tsx' ).default,
	InfoPanel = require( './info-panel.jsx' );

import { IState } from '../store/reducer';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

var MessageItem = React.createClass({
  render: function() {
    return (
      <div>
        <p>{timeConverter(this.props.ts)}</p>
        <p>{this.props.user}</p>
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
		var request = buildQuery('channels.history', '&channel=C0PK0SZDW');
    console.log(request);
    //get list of 100 messages from a slack channel
 		$.getJSON(request, function(data) {
 			console.log('data', data);
 			this.setState({
 				msgData: data.messages.sort(dynamicSort("ts"))
 			});
 		}.bind(this));

 		function buildQuery (method, arg) {
 			arg = arg || '';
 			console.log('arg', arg);
 			var token = '?token=xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
 			var query = 'https://slack.com/api/';
 			query += method + token + arg + '&pretty=1';
 			return encodeURI(query);
 		}
  },
  render: function () {
    var messages = this.state.msgData.map(function (item, index) {
      return (
        <MessageItem
          key={index}
          ts={item.ts}
          user={item.user}
          text={item.text}
        />
      );
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
				<div>
					<MessageList />
					<QuoteDisplay />
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
