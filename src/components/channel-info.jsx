const React = require('react');
const Select = require('react-select');
const SlackLogo = require('./slack-logo');

var ChannelInfo = React.createClass( {
	getInitialState: function(){
		return { viewId: this.props.viewId };
	},
	componentDidMount: function() {
		const self = this;
    console.log('teaminfochan', this.props.teamInfo);
		console.log('imList', this.props.imList);
		var chanSelect = [];
		var imSelect = [];
		for (var i = 0; i < this.props.chanList.length; i++) {
			chanSelect.push( {
				value: this.props.chanList[i].id,
				label: this.props.chanList[i].name,
				apiMethod: "channels.history"
			} );
		}
		for (var i = 0; i < this.props.imList.length; i++) {
			imSelect.push( {
				label: this.props.usersById[this.props.imList[i].user].name,
				value: this.props.imList[i].id,
				apiMethod: "im.history"
			} );
		}
		this.setState({
			chanSelect: chanSelect,
			imSelect: imSelect,
			view: self.props.viewId
		});
	},
	newView: function (e) {
		console.log('changed to', e);
		if (typeof this.props.onChange === 'function' && e) {
			this.props.onChange(e.apiMethod, e.value);
      this.setState( { viewId: e.value} );
		}
	},
	render: function() {
		return (
			<div className="chanInfo">
        <SlackLogo />
        <div className="teamChan">
          <div className="slackTeam">
            <h2>{'Team: ' + this.props.teamInfo.name}</h2>
          </div>
          <div className="chanSelect">
    				<h2 className="channel">{'Channel: '}</h2>
  					<Select
  					  options={this.state.chanSelect}
  					  value={this.state.viewId}
  					  onChange={this.newView} />
          </div>
					<div className="chanSelect">
    				<h2 className="channel">{'Direct Message: '}</h2>
  					<Select
  					  options={this.state.imSelect}
  					  value={this.state.viewId}
  					  onChange={this.newView} />
          </div>
        </div>
			</div>
		);
	}
});

module.exports = ChannelInfo;
