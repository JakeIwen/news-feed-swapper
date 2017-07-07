import { connect } from 'react-redux';
import { postMessage } from '../store/actions';

const React = require('react');

export const PostMessage = props => (
  <textarea
    className="postMessage"
    placeholder="Post to Slack..."
    onKeyPress={ (e) => handleChange(e, props.channelId, props.postMessage) } />
);

const handleChange = (event,  channelId, postAction) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    postAction(channelId, event.target.value);
    event.target.value = '';
  }
};

const mapDispatchToProps = { postMessage };

export default connect(null, mapDispatchToProps)(PostMessage);
