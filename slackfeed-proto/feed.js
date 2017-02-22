/*
Combining components together

The most fundamental and useful part of React is that
you can create any number of components and nest them
just like you would any HTML tag. You pass down data
to your components from parent components in a one-way
data flow.

Note: If you use something like Flux/Reflux you have a bit
power when it comes to data storage and event handling.
Using a Flux-like framework with React is very helpful.
*/




var MessageList = React.createClass({
  getInitialState: function(){
    //so .map doesnt throw error initially
    return {
      msgData: [{}]
    }
  },
  componentDidMount: function() {
    var self = this;
    var token = 'xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
    var query = 'https://slack.com/api/';
    query += 'channels.history';
    query += '?token=' + token;
    query += '&channel=C0PK0SZDW&pretty=1';
    var request = encodeURI(query);
    //get list of 100 messages from a slack channel
    $.ajax({
      url: request,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('success', data )
        this.setState({msgData: data.messages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  
  render: function () {
    var self = this;
    var messages = this.state.msgData.map(function (index) {
      return (
        <div>
          <p>{index.user}: </p>
          <p>{index.text}</p>
        </div>
      );
    });

    return (
      <div>
        {messages}
      </div>
    );
  }
});

ReactDOM.render(<MessageList />, document.getElementById('root'));
