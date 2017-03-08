const React = require( 'react' );
const SlackFeed = require("./slack-feed");

var NewsFeedSwapper = React.createClass({
  render: function() {
		return (
			<div className="feedField">
				<SlackFeed />
			</div>
		);
	}
});

module.exports = NewsFeedSwapper;
