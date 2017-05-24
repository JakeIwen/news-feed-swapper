const React = require( 'react' );
const reactReplace = require('react-string-replace');
const MessageItem = require('./message-item');
import Websocket from 'react-websocket';
import { formatMessages } from './helper-functions';

var MessageList = React.createClass( {
	getInitialState: function() {
    return( { messageList: this.props.messageList } );
  },
	handleWss: function(data) {
		const self = this;
		let result = JSON.parse(data);
		console.log('WSS DATA', result);
		if (result.type == "message" && result.channel == self.props.chanId) {
			var newMsg = formatMessages([result], self.props.usersById, self.state.messageList);
			self.setState( { messageList: newMsg.concat(self.state.messageList) } );
			console.log('new messagelist', self.state.messageList);
		}
	},
	render: function () {
    const self = this;
    var messages = self.state.messageList.map(function (item, index) {
      if (item.user) {
        return (
          <MessageItem
            className="messageItem"
            date={item.showDate && item.date}
            key={index}
            index={index}
            ts={item.ts}
            user={self.props.usersById[item.user].name}
            text={item.text}
            profile={self.props.usersById[item.user].profile}
          /> );
      } else {
        return ( <p key={index}>unknown element</p> );
      }
		});
		return (
			<div>
				<Websocket url={self.props.wssURL}
					onMessage={this.handleWss} />
				<div>{messages}</div>
			</div>
		);
	}
});

module.exports = MessageList;
