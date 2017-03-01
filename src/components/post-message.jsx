const React = require('react');

var PostMessage = React.createClass( {
  getInitialState: function(){
    return { postText: '' };
  },
  postToSlack: function () {
    const self = this;
    console.log('post txt, chanid', this.state.postText, self.props.chanId);
    var url = buildUrl('chat.postMessage', self.props.chanId, self.state.postText);
    // console.log('url', url);
    httpDo(url, function (err, res) {
      if(err) console.log('post fail', err);
      console.log('post res', res);
      self.setState( { postText: '' } );
      //append to array to show post
    });
  },
  handleChange(event) {
    console.log('handli');
    this.setState({postText: event.target.value});
  },
  render: function() {
    return (
      <form onSubmit={this.postToSlack}>
        <textarea
          type="text"
          className="postMessage"
          onChange={this.handleChange}
          value={this.state.postText}
          placeholder="Post to Slack..."/>
        <input type="submit"/>
      </form>
    );
  }
} );

module.exports = PostMessage;
