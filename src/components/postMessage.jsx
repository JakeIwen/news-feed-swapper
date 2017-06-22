const React = require('react');
import { buildUrl, httpDo } from './helper-functions';

class PostMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { postText: '' };
  }

  postToSlack() {
    const self = this;
    var postUrl = buildUrl(self.props.token, 'chat.postMessage', self.props.viewId, self.state.postText, true);
    console.log('posturl:', postUrl);
    httpDo(postUrl, function (err, res) {
      if(err || !res.ok) console.log('post fail', res.error || err);
      self.setState( { postText: '' } );
    });
  }

  handleChange(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      this.postToSlack();
    } else {
      this.setState({postText: event.target.value});
    }
  }

  render()  {
    return (
      <textarea
        type="text"
        className="postMessage"
        value={this.state.postText}
        placeholder="Post to Slack..."
        onChange={this.handleChange}
        onKeyPress={this.handleChange} />
    );
  }
}

module.exports = PostMessage;
