const React = require( 'react' );
const Tooltip = require('rc-tooltip');

import { htmlFormat } from './helper-functions';

const MessageItem = props => {
	const attachment = embed(props.attachments);
	const overlay = renderHoverPopup(props.profile);
	return (
		<div>
			<p className="date">{ props.date }</p>
			<Tooltip
				placement="right"
				overlay={ overlay }
				arrowContent={ <div className="rc-tooltip-arrow-inner"></div> }>
				<a href="#" className="user">{ props.user }:</a>
			</Tooltip>
			<br />
			{ props.text }
			{ attachment }
		</div>
	);
};

const embed = item => {
	if (item && item[0] && item[0].video_html) {
		return htmlFormat(item[0].video_html.replace('autoplay=1', 'autoplay=0'));
	}
};

const renderHoverPopup = profile => (
	<div>
		<img src={ profile.image_192 } /><br />
		<span>{ profile.real_name }</span><br />
		<span>{ profile.email }</span><br />
	</div>
);

module.exports = MessageItem;
