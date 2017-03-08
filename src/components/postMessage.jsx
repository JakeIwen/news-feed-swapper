const React = require('react');
const request = require('request');


var PostMessage = React.createClass( {
  getInitialState: function(){
    return { postText: '' };
  },
  postToSlack: function () {
    console.log('post props', this.props);
    const self = this;
    console.log('post txt, chanid', this.state.postText, self.props.viewId);
    var postUrl = buildUrl(self.props.token, 'chat.postMessage', self.props.viewId, self.state.postText);
    // console.log('url', url);
    httpDo(postUrl, function (err, res) {
      if(err) console.log('post fail', err);
      console.log('post res', res);
      self.setState( { postText: '' } );
    });
  },
  handleChange: function(event) {
    this.setState({postText: event.target.value});
  },
  render: function() {
    return (
      <form onSubmit={this.postToSlack}>
        <textarea
          type="text"
          className="postMessage"
          value={this.state.postText}
          placeholder="Post to Slack..."
          onChange={this.handleChange} />
        <input type="submit"/>
      </form>
    );
  }
} );


function httpDo(url, callback) {
  const options = {
    url :  url,
    json : true
  };
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}
function buildUrl (token, method, arg, text) {
  arg = (arg) ? ('&channel=' + arg) : '';
  text = (text) ? ('&text=' + text) : '';
  var query = 'https://slack.com/api/';
  query += method + "?token=" + token + arg + text + '&pretty=1';
  // + '1&scope=' + method.split('.')[0] + ":read";
  return encodeURI(query);
}

module.exports = PostMessage;
