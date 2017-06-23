const React = require( 'react' );


const TeamSite = props => {
	return (
    <div>
      <button onClick={ teamSelector.bind(null, props.authURL) }>
        New Team
      </button>
      <a href={"https://www." + props.teamName + ".slack.com"}>
        Visit on Slack Website
      </a>
  	</div>
  );
};

const teamSelector = (authURL) => {
  chrome.storage.local.clear();
  window.location.href = authURL;
};

module.exports = TeamSite;
