const React = require('react');
import { buildUrl, httpDo } from './helper-functions';

var PostMessage = React.createClass( {
  getInitialState: function(){
    return { postText: '' };
  },
  postToSlack: function () {
    const self = this;
    var postUrl = buildUrl(self.props.token, 'chat.postMessage', self.props.viewId, self.state.postText);
    // console.log('url', url);
    httpDo(postUrl, function (err, res) {
      if(err || !res.ok) console.log('post fail', res.error || err);
      console.log('post res', res.error);
      self.setState( { postText: '' } );
    });
  },
  handleChange: function(event) {
    this.setState({postText: event.target.value});
    if (event.key == "Enter")
      this.postToSlack();
  },
  render: function() {
    return (
      <form onSubmit={this.postToSlack}>
        <textarea
          type="text"
          className="postMessage"
          value={this.state.postText}
          placeholder="Post to Slack..."
          onChange={this.handleChange}
          onKeyPress={this.handleChange} />
        <input type="submit"/>
      </form>
    );
  }
} );

module.exports = PostMessage;
