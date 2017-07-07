import { teamSelector } from './helper-functions';
const React = require( 'react' );

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

export default TeamSite;
