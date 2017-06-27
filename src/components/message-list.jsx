const React = require( 'react' );
const MessageItem = require('./message-item');

const MessageList = props => {
	const messages = renderMessageList(props.messageList);
	return ( <div>{ messages }</div> );
};

const renderMessageList = messageList => (
  messageList.map( (message, index) => renderMessage(message, index) )
);

const renderMessage = (message, index) => (
	<MessageItem
		className="messageItem"
		date={message.date}
		key={index}
		user={message.userName || "unknown user"}
		text={message.text}
		profile={message.profile}
	/>
);

module.exports = MessageList;
