const React = require('react');
const Select = require('react-select');
const SlackLogo = require('./slack-logo');

const ChannelInfo = props => {
	return (
		<div className="chanInfo">
			<SlackLogo />
			<div className="teamChan">
				<div className="slackTeam">
					<h2>{'Team: ' + props.teamName}</h2>
				</div>
				<div className="chanSelect">
					<h2 className="channel">{'Channel: '}</h2>
					<Select
						options={ selectView(props.chanList, null) }
						value={ props.viewId }
						onChange={ newView.bind(this, props.onChange) } />
				</div>
				<div className="chanSelect">
					<h2 className="channel">{'Direct Message: '}</h2>
					<Select
						options={ selectView(props.imList, props.usersById) }
						value={ props.viewId }
						onChange={ newView.bind(this, props.onChange) } />
				</div>
			</div>
		</div>
	);
};

const newView = (newChanFn, e) =>
( typeof newChanFn === 'function' && e && newChanFn(e.apiMethod, e.value) );

const selectView = (msgList, usersById) => (
	msgList.map( (msg) => (
		{ value: msg.id,
			label: (usersById) ? usersById[msg.user].name : msg.name,
			apiMethod: (usersById) ? "im.history" : "channels.history" }
	) )
);

module.exports = ChannelInfo;
