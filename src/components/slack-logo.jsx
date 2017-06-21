const React = require('react');

const SlackLogo = () => {
	const slackImg = 'https://lh3.googleusercontent.com/CzlsZP3xUHeX3HAGdZ2rL9mK6_C-6T1-YWeBeM8nB3ilmfPSBHCFx4-UbQr8MnQms3d9=w300';

	return (
		<div className='logo'>
			<img src={ slackImg } height='40' />
			<span>SlackFeed</span>
		</div>
	);
};

module.exports = SlackLogo;
