const React = require('react');
const Select = require('react-select');
const SlackLogo = require('./slack-logo');

var ChatInfo = React.createClass( {
	getInitialState: function(){
		return { chatSelect: [] };
	},
	componentDidMount: function() {
		const self = this;
    console.log('teaminfochat', this.props.teamInfo);
		var chatSelect = [];
		for (var i = 0; i < this.props.chatList.length; i++) {
			chatSelect.push( {
				value: this.props.chatList[i].id,
				label: this.props.chatList[i].name
			} );
		}
		this.setState({
			chatSelect: chatSelect,
			selectedChan: self.props.chatId
		});
	},
	newChan: function (e) {
		console.log('chatged to', e);
		if (typeof this.props.onChange === 'function' && e) {
			this.props.onChange(e.value);
      this.setState({
        selectedChan: e.value
      });
		}
	},
	render: function() {
		return (
			<div className="chatInfo">
        <SlackLogo />
        <div className="teamChan">
          <div className="slackTeam">
            <h2>{'Team: ' + this.props.teamInfo.name}</h2>
          </div>
          <div className="chatSelect">
    				<h2 className="chat">{'Chat: '}</h2>
  					<Select
  					  options={this.state.chatSelect}
  					  value={this.state.selectedChan}
  					  onChange={this.newChan} />
          </div>
        </div>
			</div>
		);
	}
});

module.exports = ChatInfo;
