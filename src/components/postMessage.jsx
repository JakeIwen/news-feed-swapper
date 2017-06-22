const React = require('react');
import { buildUrl, httpDo } from './helper-functions';

class PostMessage extends React.Component {
  constructor(props) {
    super();
    this.state = { postText: '' };
    this.handleChange = this.handleChange.bind(this);
    this.postToSlack = this.postToSlack.bind(this);
  }

  postToSlack() {
    const postUrl = buildUrl(this.props.token, 'chat.postMessage', this.props.viewId, this.state.postText, true);
    httpDo(postUrl, (err, res) => {
      if(err || !res.ok) console.log('post fail', res.error || err);
      this.setState( { postText: '' } );
    });
  }

  handleChange(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      this.postToSlack();
    } else {
      //is there a way to avoid setting the state every keystroke?
      this.setState({ postText: event.target.value });
    }
  }

  render()  {
    return (
      <textarea
        type="text"
        className="postMessage"
        value={ this.state.postText }
        placeholder="Post to Slack..."
        onChange={ this.handleChange }
        onKeyPress={ this.handleChange } />
    );
  }
}

module.exports = PostMessage;
