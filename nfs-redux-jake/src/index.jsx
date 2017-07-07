const React = require( 'react' );
const SlackFeed = require("./slack-feed");

const NewsFeedSwapper = () =>
  ( <div className="feedField"><SlackFeed /></div> );

export default NewsFeedSwapper;
