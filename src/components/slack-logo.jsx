// import logo from '../../assets/slack-logo.png'
import logo from '../../assets/slack-logo.png';

const React = require('react');

const SlackLogo = () => {
	return (
		<div className='logo'>
			<img src={ logo } alt='slack-logo' height='40' />
			<span>SlackFeed</span>
		</div>
	);
};

export default SlackLogo;
