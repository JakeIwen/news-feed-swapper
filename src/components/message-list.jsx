const React = require( 'react' );
const moment = require('moment');
const reactReplace = require('react-string-replace');
const MessageItem = require('./message-item');

var MessageList = React.createClass( {
  getInitialState: function () {
    return { usersById: {} };
  },
  formatDates: function () {
    var dates = this.props.messageList.map(message => moment(Math.floor(message.ts)*1000).format('MMMM Do YYYY'));
    // console.log('datesfirst', dates);
    var lastDate = dates[0];
    for (var i = 1; i < dates.length; i++) {
      if (dates[i] != lastDate)
        lastDate = dates[i];
      else
        dates[i] = null;
    }
    console.log('dates', dates);
    return dates;
  },
	componentWillMount: function() {
		const self = this;
		var usersById = {};
    //create hash
		for (var i = 0; i < self.props.userList.length; i++)
			usersById[self.props.userList[i].id] = self.props.userList[i];
    for (var i = 0; i < self.props.messageList.length; i++)
      self.props.messageList[i].userData = usersById[self.props.messageList[i].user];
    self.setState( {
      usersById: usersById,
      dates: self.formatDates()
    } );
	},
  replaceTextElements: function(text, ts) {
    const self = this;
    const url =  /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;
  
    text = text.replace(/(@.........\|)/g, '')
    .replace(/<.+>/g, match =>
      match.replace(/<|>/g, ""))
    .replace(/@([A-Z]|\d){8}/g, match =>
      console.log(match.replace("@", "").substring(0, match.length - 1)));
    // console.log('usres', self.state.usersById);
    // console.log('text', [text]);
    // text = reactReplace(text, url, match => createMedia(match, ts));
    // console.log('text2', [text]);

    return text;
    },
	render: function () {
    const self = this;
		var messages = this.props.messageList.map(function (item, index) {
      if (item.user) {
        return (
          <MessageItem
            className="messageItem"
            date={self.state.dates[index]}
            key={index}
            index={index}
            ts={item.ts}
            user={self.state.usersById[item.user].name}
            text={self.replaceTextElements(item.text, item.ts)}
            profile={self.state.usersById[item.user].profile}
          />
        );
      } else {
        return (<span key={index}>unknown element</span>);
      }
		});
		return (
				<div>{messages}</div>
		);
	}
});

module.exports = MessageList;
