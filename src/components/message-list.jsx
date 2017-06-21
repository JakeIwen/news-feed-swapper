const React = require( 'react' );
const MessageItem = require('./message-item');
import { formatMessages } from './helper-functions';

const MessageList = props => {
	const messages = renderMessageList(props.messageList, props.usersById);
	return ( <div>{messages}</div> );
};

const renderMessageList = (messageList, usersById) => {
	return messageList.map( (message, index) => {
		const user = message.user ? usersById[message.user].name : null;
		const profile = message.user ? usersById[message.user].profile : null;
		return renderMessage(message, index, user, profile);
	} );
};

const renderMessage = (message, index, user, profile) => {
	return user ?
		<MessageItem
			className="messageItem"
			date={message.showDate && message.date}
			key={index}
			ts={message.ts}
			user={ user }
			text={message.text}
			profile={ profile }
			attachments={message.attachments}
		/> :
		<p key={index}>unknown element</p>;
};
//
// var MessageList = React.createClass( {
// 	render: function () {
//     const self = this;
//     var messages = self.props.messageList.map(function (item, index) {
//       if (item.user) {
//         return (
//           <MessageItem
//             className="messageItem"
//             date={item.showDate && item.date}
//             key={index}
//             ts={item.ts}
//             user={self.props.usersById[item.user].name}
//             text={item.text}
//             profile={self.props.usersById[item.user].profile}
// 						attachments={item.attachments}
//           /> );
//       } else {
//         return ( <p key={index}>unknown element</p> );
//       }
// 		});
// 		return ( <div>{messages}</div> );
// 	}
// });

module.exports = MessageList;
