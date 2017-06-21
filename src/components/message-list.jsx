const React = require( 'react' );
const MessageItem = require('./message-item');

const MessageList = props => {
	const messages = renderMessageList(props.messageList);
	return ( <div>{messages}</div> );
};

const renderMessageList = messageList => {
	return messageList.map( (message, index) => renderMessage(message, index) );
};

const renderMessage = (message, index) => {
	return message.userName ?
		<MessageItem
			className="messageItem"
			date={message.showDate && message.date}
			key={index}
			ts={message.ts}
			user={message.userName}
			text={message.text}
			profile={message.profile}
			attachments={message.attachments}
		/> :
		<p key={index}>unknown element</p>;
};

module.exports = MessageList;
