const React = require('react');
const request = require('request');


var PostMessage = React.createClass( {
  getInitialState: function(){
    return { postText: '' };
  },
  postToSlack: function () {
    const self = this;
    console.log('post txt, chanid', this.state.postText, self.props.chanId);
    var url = buildUrl(self.props.token, 'chat.postMessage', self.props.chanId, self.state.postText);
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
