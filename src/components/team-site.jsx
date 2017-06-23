const React = require( 'react' );
import { teamSelector } from './helper-functions';

const TeamSite = props => {
	return (
    <div>
      <button onClick={ teamSelector }>
        New Team
      </button>
      <a href={"https://www." + props.teamName + ".slack.com"}>
        Visit on Slack Website
      </a>
  	</div>
  );
};

module.exports = TeamSite;
