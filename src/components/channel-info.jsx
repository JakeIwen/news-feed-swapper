const React = require('react');
const Select = require('react-select');
const SlackLogo = require('./slack-logo');

const ChannelInfo = props => {
	return (
		<div className="chanInfo">
			<SlackLogo />
			<div className="teamChan">
				<div className="slackTeam">
					<h2>{'Team: ' + props.teamInfo.name}</h2>
				</div>
				<div className="chanSelect">
					<h2 className="channel">{'Channel: '}</h2>
					<Select
						options={ chanSelect(props.chanList) }
						value={ props.viewId }
						onChange={ newView.bind(this, props.onChange) } />
				</div>
				<div className="chanSelect">
					<h2 className="channel">{'Direct Message: '}</h2>
					<Select
						options={ imSelect(props.imList, props.usersById) }
						value={ props.viewId }
						onChange={ newView.bind(this, props.onChange) } />
				</div>
			</div>
		</div>
	);
};

const newView = (newChanFunction, e) => {
	console.log('changed to EEEE', e );
	console.log('changed to PPPP',  newChanFunction);
	if (typeof newChanFunction === 'function' && e) {
		newChanFunction(e.apiMethod, e.value);
	}
};

const chanSelect = (channels) => {
	return channels.map( (obj) => {
		return {
			value: obj.id,
			label: obj.name,
			apiMethod: "channels.history"
		};
	} );
};

const imSelect = (ims, usersById) => {
	return ims.map( (obj) => {
		return {
			value: obj.id,
			label: usersById[obj.user].name,
			apiMethod: "im.history"
		};
	} );
};


//
// var ChannelInfo = React.createClass( {
// 	componentDidMount: function() {
// 		const self = this;
//     console.log('teaminfochan', this.props.teamInfo);
// 		console.log('imList', this.props.imList);
// 		var chanSelect = [];
// 		var imSelect =
//
// console.log('chanselect', chanSelect[0]);
//
// 		// for (var i = 0; i < this.props.chanList.length; i++) {
// 		// 	console.log('for loopingggg');
// 		// 	chanSelect.push( {
// 		// 		value: this.props.chanList[i].id,
// 		// 		label: this.props.chanList[i].name,
// 		// 		apiMethod: "channels.history"
// 		// 	} );
// 		// }
// 		for (var i = 0; i < this.props.imList.length; i++) {
// 			console.log('for loopingggg222', this.state);
// 			imSelect.push( {
// 				label: this.props.usersById[this.props.imList[i].user].name,
// 				value: this.props.imList[i].id,
// 				apiMethod: "im.history"
// 			} );
// 		}
// 		this.setState({
// 			chanSelect: chanSelect,
// 			imSelect: imSelect,
// 			view:this.props.viewId
// 		});
// 	},
// 	newView: function (e) {
// 		console.log('changed to TESST', e);
// 		// if (typeof this.props.onChange === 'function' && e) {
// 		// 	this.props.onChange(e.apiMethod, e.value);
//     //   this.setState( { viewId: e.value} );
// 		// }
// 	},
// });

module.exports = ChannelInfo;
