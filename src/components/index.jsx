import React from  'react' ;
import SlackFeed from './slack-feed';

const NewsFeedSwapper = React.createClass({
  render: function() {
		return (
			<div className="feedField">
				<SlackFeed />
			</div>
		);
	}
});

export default NewsFeedSwapper;
