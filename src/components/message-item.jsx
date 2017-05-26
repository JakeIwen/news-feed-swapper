const React = require( 'react' );
const Tooltip = require('rc-tooltip');
import { htmlFormat } from './helper-functions';


var MessageItem = React.createClass( {
	embed: function(item) {
		if (item && item[0]) {
			console.log('item[0]', item[0]);
			if (item[0].video_html) {
				return htmlFormat(item[0].video_html.replace('autoplay=1', 'autoplay=0'));
		}}
	},
	render: function() {
		const self = this;
		console.log('attachment', this.props.attachments);
		var tooltip =
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
					overlay={tooltip}
					arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
					<a href="#" className="user">{this.props.user}:</a>
				</Tooltip><br />
				{self.props.text}
				{self.embed(self.props.attachments)}
			</div>
		);
	}
} );

module.exports = MessageItem;
