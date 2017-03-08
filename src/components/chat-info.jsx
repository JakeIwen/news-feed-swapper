const React = require('react');
const Select = require('react-select');
const SlackLogo = require('./slack-logo');

var ChannelInfo = React.createClass( {
	getInitialState: function(){
		return { chanSelect: [] };
	},
	componentDidMount: function() {
		const self = this;
    console.log('teaminfochan', this.props.teamInfo);
		console.log('imList', this.props.imList);
		var chanSelect = [];
		for (var i = 0; i < this.props.imList.length; i++) {
			chanSelect.push( {
				label: this.props.usersById[this.props.imList[i].user].name,
				value: this.props.imList[i].id
			} );
		}
		console.log('chanSelect,', chanSelect);
		this.setState({
			chanSelect: chanSelect,
			selectedChan: self.props.chanId
		});
	},
	newChan: function (e) {
		console.log('changed to', e);
		if (typeof this.props.onChange === 'function' && e) {
			this.props.onChange(e.value);
      this.setState({
        selectedChan: e.value
      });
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
  					  value={this.state.selectedChan}
  					  onChange={this.newChan} />
          </div>
        </div>
			</div>
		);
	}
});

module.exports = ChannelInfo;
