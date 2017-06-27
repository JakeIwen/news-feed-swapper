const React = require( 'react' );
const Tooltip = require('rc-tooltip');

const MessageItem = props => (
	<div>
		<p className="date">{ props.date }</p>
		{ renderTooltip(props.profile, props.user) }
		<br />
		{ props.text }
	</div>
);

const renderTooltip = (profile, user) => (
	profile ? (
		<Tooltip
			placement="right"
			overlay={ profile ? renderHoverPopup(profile) : <br />}
			arrowContent={ <div className="rc-tooltip-arrow-inner"></div> }>
			<a href="#" className="user">{ user }:</a>
		</Tooltip> ) : ( <span className="user">{ user }:</span> )
);

const renderHoverPopup = profile => (
	<div>
		<img src={ profile.image_192 } /><br />
		<span>{ profile.real_name }</span><br />
		<span>{ profile.email }</span><br />
	</div>
);

module.exports = MessageItem;
