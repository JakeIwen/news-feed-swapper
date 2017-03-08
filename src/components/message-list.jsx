const React = require( 'react' );
const reactReplace = require('react-string-replace');
const MessageItem = require('./message-item');

var MessageList = React.createClass( {
	render: function () {
    const self = this;
    var messages = self.props.messageList.map(function (item, index) {
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
        return ( <span key={index}>unknown element</span> );
      }
		});
		return (
				<div>{messages}</div>
		);
	}
});

module.exports = MessageList;
