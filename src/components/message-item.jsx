const React = require( 'react' );
const Tooltip = require('rc-tooltip');

var MessageItem = React.createClass( {
	embed: function(item) {
		if (item) {
			console.log('item', item);

		if (item[0]) {
			console.log('item[0]', item[0]);

		if (item[0].video_html) {
			console.log('item[0].video_html', item[0].video_html);

			return {__html: item[0].video_html};
		}}}
	},
	render: function() {
		const self = this;
		console.log('attachment', this.props.attachments);
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
			<span>{self.props.text}</span>
			<div
				dangerouslySetInnerHTML={self.embed(self.props.attachments)}></div>
			</div>
		);
	}
} );

module.exports = MessageItem;
