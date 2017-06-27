const React = require('react');
import { buildUrl, httpDo } from './helper-functions';

const PostMessage = props => (
  <textarea
    className="postMessage"
    placeholder="Post to Slack..."
    onKeyPress={ (e) => handleChange(e, props.token, props.viewId) } />
);

const handleChange = (event, token, viewId) => {
  if (event.key == "Enter" && !event.shiftKey) {
    event.preventDefault();
    postToSlack(event.target.value, token, viewId);
    event.target.value = '';
  }
};

const postToSlack = (postText, token, viewId) => {
  const postUrl = buildUrl(token, 'chat.postMessage', viewId, postText, true);
  httpDo(postUrl, (err, res) => {
    if(err || !res.ok) return console.log('post fail', res.error || err);
  });
};

module.exports = PostMessage;
