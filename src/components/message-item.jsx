const React = require( 'react' );
const Tooltip = require('rc-tooltip');


var MessageItem = React.createClass( {
	render: function() {
		var text =
			<div>
				<img src={this.props.profile.image_192} /><br />
				<span>{this.props.profile.real_name}</span><br />
				<span>{this.props.profile.email}</span><br />
			</div>;
		return (
			<div>
				<p className="date">{this.props.date}</p>
				<Tooltip
					placement="right"
					overlay={text}
					arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
					<a href="#" className="user">{this.props.user}:</a>
				</Tooltip><br />
				<span>{this.props.text}</span>
				<br />
			</div>
		);
	}
} );

module.exports = MessageItem;
