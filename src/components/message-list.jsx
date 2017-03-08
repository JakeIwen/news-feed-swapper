const React = require( 'react' );
const moment = require('moment');
const reactReplace = require('react-string-replace');
const MessageItem = require('./message-item');

var MessageList = React.createClass( {
  getInitialState: function () {
    return { usersById: {} };
  },
  formatDates: function () {
    var dates = this.props.messageList.map(message => moment.unix(message.ts).format('MMMM Do YYYY'));
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
    console.log('msgList props', self.props);
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
    // if (ts == ("1488390170.000460" || "1488390217.000463")) {
    //   console.log('dupe ts', ts, text);
    // }
    const url = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    text = text.replace(/(@.........\|)/g , '')
    .replace(/<.+>/g, match =>
      match.replace(/<|>/g, ""))
    .replace(/@([A-Z]|\d){8}/g, match =>
      match.replace("@", ""));
    // console.log('text', [text]);
    text = reactReplace(text,  url, (match, i) => createMedia(match, ts));
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

function createMedia (match, ts) {
  // console.log('createmedia', match);
  var ret;
  if (match.match(/vimeo|youtube|youtu\.be/g))
    ret =  <iframe key={ts} className="slackFrame" src={match.replace("watch?v=", "/embed/")} />;
  else if (match.match(/\.jpg|\.png|\.gif|\.bmp|\.svg/g))
    ret =  <img key={ts} className="slackPic" src={match} />;
  else
    ret = <a href={match} key={ts}>{match}</a>;
  // console.log("media ret", ret);
  return ret;
}
module.exports = MessageList;
