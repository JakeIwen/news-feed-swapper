const React = require('react');

import logo from '../../assets/slack-logo.png';


const SlackLogo = () => {
	return (
		<div className='logo'>
			<img src={ logo } height='40' />
			<span>SlackFeed</span>
		</div>
	);
};

module.exports = SlackLogo;
